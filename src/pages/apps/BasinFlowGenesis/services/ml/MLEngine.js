import * as tf from '@tensorflow/tfjs';

/**
 * Core Machine Learning Engine
 * Handles TFJS initialization and common model operations.
 */
export class MLEngine {
    static isInitialized = false;

    static async init() {
        if (this.isInitialized) return;
        try {
            await tf.ready();
            this.isInitialized = true;
            console.log('MLEngine: TensorFlow.js initialized backend:', tf.getBackend());
        } catch (err) {
            console.error('MLEngine: Failed to initialize TFJS', err);
        }
    }

    static async createLinearRegressionModel(inputShape = [1]) {
        const model = tf.sequential();
        model.add(tf.layers.dense({ units: 1, inputShape: inputShape }));
        model.compile({ loss: 'meanSquaredError', optimizer: 'sgd' });
        return model;
    }

    static async createSimpleNN(inputShape, outputShape) {
        const model = tf.sequential();
        model.add(tf.layers.dense({ units: 16, activation: 'relu', inputShape: [inputShape] }));
        model.add(tf.layers.dense({ units: 8, activation: 'relu' }));
        model.add(tf.layers.dense({ units: outputShape, activation: 'linear' }));
        
        model.compile({
            optimizer: tf.train.adam(0.01),
            loss: 'meanSquaredError',
            metrics: ['mse']
        });
        return model;
    }

    static tensorFromData(data) {
        return tf.tensor(data);
    }
}