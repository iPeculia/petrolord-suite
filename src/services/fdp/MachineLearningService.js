/**
 * Machine Learning Service
 * Simulates training, validation and prediction of ML models for FDP data.
 */

export class MachineLearningService {
    static async trainModel(data, modelType, parameters) {
        console.log(`Training ${modelType} model with ${data.length} records...`);
        
        // Simulate training latency
        await new Promise(resolve => setTimeout(resolve, 2000));

        // Mock model artifact
        const model = {
            id: `model-${Date.now()}`,
            type: modelType,
            parameters,
            trainedAt: new Date().toISOString(),
            accuracy: 0.85 + Math.random() * 0.1,
            status: 'Ready'
        };

        return model;
    }

    static async validateModel(model, testData) {
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        return {
            r2: 0.88,
            rmse: 12.5,
            mae: 8.4,
            validationStatus: 'Passed'
        };
    }

    static async predict(model, inputData) {
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock predictions based on input
        return inputData.map(item => ({
            ...item,
            prediction: item.value ? item.value * (1 + (Math.random() * 0.2 - 0.1)) : Math.random() * 100,
            confidenceUpper: 0,
            confidenceLower: 0
        }));
    }

    static getAvailableModels() {
        return [
            { id: 'lr', name: 'Linear Regression', type: 'Regression', description: 'Simple linear relationships.' },
            { id: 'rf', name: 'Random Forest', type: 'Regression/Classification', description: 'Ensemble learning method.' },
            { id: 'gbm', name: 'Gradient Boosting', type: 'Regression/Classification', description: 'High performance boosting.' },
            { id: 'svm', name: 'Support Vector Machine', type: 'Classification', description: 'Effective in high dimensional spaces.' },
            { id: 'kmeans', name: 'K-Means Clustering', type: 'Clustering', description: 'Unsupervised grouping.' },
            { id: 'prophet', name: 'Prophet (Time Series)', type: 'TimeSeries', description: 'Forecasting procedure.' }
        ];
    }
}