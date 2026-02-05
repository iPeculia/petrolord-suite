import * as tf from '@tensorflow/tfjs';
import { MLEngine } from './MLEngine';

/**
 * Predicts optimal calibration parameters (like Heat Flow) 
 * based on misfit between measured and modeled data.
 */
export class CalibrationPredictor {
    
    constructor() {
        this.model = null;
        MLEngine.init();
    }

    /**
     * Train on simulated data points.
     * @param {Array} X_train - Features: [depth_mismatch, ro_mismatch, temp_mismatch]
     * @param {Array} y_train - Labels: [heat_flow_adjustment]
     */
    async train(X_train, y_train) {
        if (!X_train.length || !y_train.length) return;

        this.model = await MLEngine.createSimpleNN(3, 1);
        
        const xs = tf.tensor2d(X_train, [X_train.length, 3]);
        const ys = tf.tensor2d(y_train, [y_train.length, 1]);

        await this.model.fit(xs, ys, {
            epochs: 50,
            shuffle: true,
            callbacks: {
                onEpochEnd: (epoch, logs) => {
                    // console.log(`Epoch ${epoch}: loss = ${logs.loss}`);
                }
            }
        });

        xs.dispose();
        ys.dispose();
        return { trained: true };
    }

    async predict(mismatchData) {
        if (!this.model) throw new Error("Model not trained");
        
        // mismatchData: [depth_delta, ro_delta, temp_delta]
        const input = tf.tensor2d([mismatchData], [1, 3]);
        const prediction = this.model.predict(input);
        const result = prediction.dataSync()[0];
        
        input.dispose();
        prediction.dispose();
        
        return result; // Expected Heat Flow Adjustment
    }
    
    /**
     * Quick heuristic prediction if no model trained
     */
    static simpleHeuristic(roMisfit, tempMisfit) {
        // Positive misfit means measured > model -> model is too cold -> increase HF
        // Rough sensitivity: +10mW/m2 ~= +0.2% Ro at depth, +20C at depth (very rough)
        const hf_adj_ro = roMisfit * 30; 
        const hf_adj_temp = tempMisfit * 0.5;
        
        // Weighted average
        return (hf_adj_ro * 0.6 + hf_adj_temp * 0.4);
    }
}