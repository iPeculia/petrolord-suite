const nextFrame = async () => new Promise(r => requestAnimationFrame(r));
const median = a => {
    const b = [...a].sort((x, y) => x - y);
    const m = b.length >> 1;
    return b.length % 2 ? b[m] : (b[m - 1] + b[m]) / 2;
};

export const processImageWithOpenCv = async (imageElement, roiRect, settings, job, onProgress) => {
    if (!imageElement || !imageElement.naturalWidth) {
        throw new Error('Load an image first');
    }
    const W = imageElement.naturalWidth, H = imageElement.naturalHeight;

    const R0 = roiRect ? roiRect : { x1: 0, y1: 0, x2: W, y2: H };
    const R = {
        x1: Math.max(0, Math.min(W - 1, Math.floor(R0.x1))),
        y1: Math.max(0, Math.min(H - 1, Math.floor(R0.y1))),
        x2: Math.max(0, Math.min(W, Math.ceil(R0.x2))),
        y2: Math.max(0, Math.min(H, Math.ceil(R0.y2)))
    };
    const rw = Math.max(0, R.x2 - R.x1), rh = Math.max(0, R.y2 - R.y1);
    if (rw < 3 || rh < 3) {
        throw new Error('ROI too small or invalid. Drag a larger ROI and retry.');
    }

    onProgress(1, 'Preparing…');

    let srcFull = null, roi = null, hsv = null, mask = null;
    try {
        srcFull = window.cv.imread(imageElement);
        roi = srcFull.roi(new window.cv.Rect(R.x1, R.y1, rw, rh));
        window.cv.cvtColor(roi, roi, window.cv.COLOR_RGBA2RGB);
        hsv = new window.cv.Mat();
        window.cv.cvtColor(roi, hsv, window.cv.COLOR_RGB2HSV);

        if (hsv.type() !== window.cv.CV_8UC3) {
            throw new Error(`Unexpected HSV type: ${hsv.type()} (expected CV_8UC3)`);
        }

        const cx = (hsv.cols / 2) | 0, cy = (hsv.rows / 2) | 0;
        const w = Math.max(1, Math.min(7, Math.min(hsv.cols, hsv.rows) >> 4));
        const Hs = [], Ss = [], Vs = [];
        for (let dy = -w; dy <= w; dy++) {
            const yy = Math.min(hsv.rows - 1, Math.max(0, cy + dy));
            for (let dx = -w; dx <= w; dx++) {
                const xx = Math.min(hsv.cols - 1, Math.max(0, cx + dx));
                const p = hsv.ucharPtr(yy, xx);
                Hs.push(p[0]); Ss.push(p[1]); Vs.push(p[2]);
            }
        }
        const f = Math.max(0.5, Math.min(3.0, settings.TOL || 1.0));
        const Hm = median(Hs), Sm = median(Ss), Vm = median(Vs);

        const lowerScalar = new window.cv.Scalar(
            Math.max(0, (Hm - 12 * f) | 0),
            Math.max(20, (Sm - 60 * f) | 0),
            Math.max(20, (Vm - 80 * f) | 0),
            0
        );
        const upperScalar = new window.cv.Scalar(
            Math.min(179, (Hm + 12 * f) | 0),
            255, 255, 255
        );

        mask = new window.cv.Mat();
        window.cv.inRange(hsv, lowerScalar, upperScalar, mask);
        window.cv.medianBlur(mask, mask, 5);

        if (mask.rows < 1 || mask.cols < 1) {
            throw new Error('Mask creation failed. Try a different tolerance or ROI.');
        }

        const pts = [], rows = mask.rows, cols = mask.cols, chunk = 200;
        for (let y = 0; y < rows; y++) {
            if (job.current.cancelled) return null;
            let bx = -1, bv = 0;
            for (let x = 0; x < cols; x++) {
                const v = mask.ucharPtr(y, x)[0];
                if (v > bv) { bv = v; bx = x; }
            }
            if (bv > 0) pts.push([bx + R.x1, y + R.y1]);
            if ((y % chunk) === 0) {
                onProgress(1 + 98 * (y / rows), `Digitizing… ${Math.round(100 * y / rows)}%`);
                await nextFrame();
            }
        }
        if (!pts.length) {
            throw new Error('No curve detected. Adjust tolerance or ROI, or pick a different line color.');
        }

        const win = 9, n = pts.length;
        for (let i = 0; i < n; i++) {
            if (!pts[i]) continue;
            const a = Math.max(0, i - (win >> 1)), b = Math.min(n - 1, i + (win >> 1));
            const xs = pts.slice(a, b + 1).filter(Boolean).map(p => p[0]).sort((u, v) => u - v);
            if (xs.length > 0) {
                const md = xs[xs.length >> 1];
                if (Math.abs(pts[i][0] - md) > 25) pts[i] = null;
            }
        }
        const cleaned = pts.filter(Boolean);
        const target = 1200, keepStep = Math.max(1, Math.ceil(cleaned.length / target));
        return cleaned.filter((_, i) => i % keepStep === 0);

    } finally {
        try { 
          [mask, hsv, roi, srcFull].forEach(m => m && !m.isDeleted() && m.delete());
        } catch (e) { console.error("Error cleaning up OpenCV mats:", e); }
    }
};

export const dp = (P, e) => {
  if (!P || P.length < 3 || e <= 0) return P ? P.slice() : [];
  const s = v => v * v;
  function d(p, a, b) {
    const [x, y] = p, [x1, y1] = a, [x2, y2] = b, dx = x2 - x1, dy = y2 - y1;
    if (!dx && !dy) return s(x - x1) + s(y - y1);
    const t = ((x - x1) * dx + (y - y1) * dy) / (dx * dx + dy * dy);
    const tx = x1 + Math.max(0, Math.min(1, t)) * dx, ty = y1 + Math.max(0, Math.min(1, t)) * dy;
    return s(x - tx) + s(y - ty)
  }
  const out = [];
  (function f(i, j) {
    let k = -1, m = 0;
    for (let t = i + 1; t < j; t++) {
      const q = d(P[t], P[i], P[j]);
      if (q > m) { m = q; k = t }
    }
    if (m > e * e && k !== -1) { f(i, k); f(k, j) } else { out.push(P[i], P[j]) }
  })(0, P.length - 1);
  const u = [out[0]];
  for (let i = 1; i < out.length; i++) {
    const a = u[u.length - 1], b = out[i];
    if (a[0] !== b[0] || a[1] !== b[1]) u.push(b)
  } return u
};