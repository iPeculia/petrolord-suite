import * as d3 from 'd3';

// --- DSP Helpers ---

// Simple Ricker Wavelet
export const generateRickerWavelet = (frequency, lengthMs = 100, dtMs = 2) => {
    const t = d3.range(-lengthMs / 2, lengthMs / 2, dtMs);
    const f = frequency;
    // Ricker: (1 - 2*pi^2*f^2*t^2) * exp(-pi^2*f^2*t^2)
    return t.map(timeMs => {
        const timeSec = timeMs / 1000;
        const pift = Math.PI * f * timeSec;
        const val = (1 - 2 * pift * pift) * Math.exp(-pift * pift);
        return { time: timeMs, value: val };
    });
};

// Reflection Coefficients
export const calculateReflectivity = (vp, rho) => {
    const rc = [];
    for (let i = 0; i < vp.length - 1; i++) {
        const z1 = vp[i] * rho[i];
        const z2 = vp[i+1] * rho[i+1];
        const val = (z1 + z2) === 0 ? 0 : (z2 - z1) / (z2 + z1);
        rc.push(val);
    }
    return rc;
};

// Convolution
export const convolve = (reflectivity, wavelet) => {
    const outputLength = reflectivity.length + wavelet.length - 1;
    const result = new Float32Array(outputLength).fill(0);
    const halfWave = Math.floor(wavelet.length / 2);
    
    for (let i = 0; i < reflectivity.length; i++) {
        if (reflectivity[i] === 0) continue;
        for (let j = 0; j < wavelet.length; j++) {
            result[i + j] += reflectivity[i] * wavelet[j];
        }
    }
    return result.slice(halfWave, halfWave + reflectivity.length);
};

// --- Attribute Calculations ---

export const calculateRMSAmplitude = (traces, windowSize = 10) => {
    if (!traces || traces.length === 0) return [];
    const nSamples = traces[0].length;
    const output = traces.map(trace => {
        const newTrace = new Float32Array(nSamples);
        for (let i = 0; i < nSamples; i++) {
            let sumSq = 0;
            let count = 0;
            for (let w = -windowSize; w <= windowSize; w++) {
                const idx = i + w;
                if (idx >= 0 && idx < nSamples) {
                    sumSq += trace[idx] * trace[idx];
                    count++;
                }
            }
            newTrace[i] = Math.sqrt(sumSq / count);
        }
        return newTrace;
    });
    return output;
};

export const calculateEnvelope = (traces) => {
    // Approximation of instantaneous amplitude (Envelope)
    // True envelope = sqrt(f^2 + H(f)^2) where H is Hilbert transform
    // For JS performance without FFT lib, we can approximate or implement a simple discrete Hilbert
    // Here we use a simplified smoothing rectifier which is often visually "close enough" for web demos
    if (!traces || traces.length === 0) return [];
    return traces.map(trace => {
        const env = new Float32Array(trace.length);
        // Simple peak hold / smoothing
        let hold = 0;
        const decay = 0.95;
        for(let i=0; i<trace.length; i++) {
            const abs = Math.abs(trace[i]);
            if(abs > hold) hold = abs;
            else hold *= decay;
            env[i] = hold;
        }
        // Reverse pass to smooth backsides
        hold = 0;
        for(let i=trace.length-1; i>=0; i--) {
            const abs = Math.abs(trace[i]);
            if(abs > hold) hold = abs;
            else hold *= decay;
            if(hold > env[i]) env[i] = hold;
        }
        return env;
    });
};

export const calculateInstantaneousFrequency = (traces) => {
    // Placeholder for Inst Freq: d/dt (arctan(H(t)/f(t)))
    // Simulating "frequency-like" attribute based on zero-crossings density
    if (!traces || traces.length === 0) return [];
    return traces.map(trace => {
        const freq = new Float32Array(trace.length);
        for(let i=1; i<trace.length-1; i++) {
            // Detect slope change or zero crossing density in local window
            // Very rough approximation for visualization
            const slope1 = trace[i] - trace[i-1];
            const slope2 = trace[i+1] - trace[i];
            // High frequency = rapid slope changes
            freq[i] = Math.abs(slope2 - slope1); 
        }
        return freq;
    });
};

// --- Statistics ---

export const calculateAmplitudeStats = (traceData, startIdx, endIdx) => {
    if (!traceData || startIdx >= endIdx) return { rms: 0, max: 0, min: 0, avg: 0 };
    
    const window = traceData.slice(Math.max(0, startIdx), Math.min(traceData.length, endIdx));
    if (window.length === 0) return { rms: 0, max: 0, min: 0, avg: 0 };

    let sumSq = 0;
    let max = -Infinity;
    let min = Infinity;
    let sum = 0;

    for (let v of window) {
        sumSq += v * v;
        sum += v;
        if (v > max) max = v;
        if (v < min) min = v;
    }

    return {
        rms: Math.sqrt(sumSq / window.length),
        avg: sum / window.length,
        max,
        min
    };
};

export const calculateSpectrum = (signal, sampleRateMs) => {
    if (!signal || signal.length === 0) return [];
    const n = signal.length;
    const spectrum = [];
    const maxFreq = 1000 / (2 * sampleRateMs); 
    const numBins = Math.min(n / 2, 100);
    const freqStep = maxFreq / numBins;

    for (let k = 0; k < numBins; k++) {
        let real = 0;
        let imag = 0;
        const omega = (2 * Math.PI * k) / n;
        
        // Windowed DFT
        const limit = Math.min(n, 200); // Optimization limit
        for (let t = 0; t < limit; t++) {
            const angle = omega * t;
            real += signal[t] * Math.cos(angle);
            imag -= signal[t] * Math.sin(angle);
        }
        const magnitude = Math.sqrt(real * real + imag * imag);
        spectrum.push({ frequency: k * freqStep, magnitude });
    }
    return spectrum;
};