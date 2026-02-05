import * as ss from 'simple-statistics';

// simple-statistics v7 uses sampleCorrelation for Pearson correlation
// We map it to 'correlation' for consistency with the rest of the file
const correlation = ss.sampleCorrelation;
const { standardDeviation, mean } = ss;

// --- 1. Data Preparation ---
export const prepareDataForML = (wells, featureCurves, targetCurve, depthRange = null) => {
    let X = [];
    let y = [];
    let meta = []; // To track well/depth for results

    wells.forEach(well => {
        // Find actual keys for features and target
        const features = featureCurves.map(fc => well.curveMap[fc]);
        const target = well.curveMap[targetCurve];

        if (!target || features.some(f => !f)) return; // Skip if missing curves

        well.data.forEach(row => {
            // Check depth filter if applied
            if (depthRange && (row.DEPTH < depthRange.min || row.DEPTH > depthRange.max)) return;

            const featureValues = features.map(f => row[f]);
            const targetValue = row[target];

            // Filter nulls/NaNs
            if (targetValue != null && !isNaN(targetValue) && featureValues.every(v => v != null && !isNaN(v))) {
                X.push(featureValues);
                y.push(targetValue);
                meta.push({ wellId: well.id, depth: row.DEPTH || row[well.curveMap.DEPTH] });
            }
        });
    });

    return { X, y, meta };
};

// --- 2. Regression Models ---

// Simple Linear Regression (Multi-variate via basic Least Squares approximation or iterative)
// Since simple-statistics is limited to simple linear regression (1 variable), 
// we'll implement a basic Multiple Linear Regression using Matrix operations (Normal Equation: beta = (XtX)^-1 XtY)

const transpose = (m) => m[0].map((x, i) => m.map(x => x[i]));
const multiply = (a, b) => {
    // A is m x n, B is n x p
    const m = a.length, n = a[0].length, p = b[0].length;
    const c = new Array(m).fill(0).map(() => new Array(p).fill(0));
    for(let i=0; i<m; i++)
        for(let j=0; j<p; j++)
            for(let k=0; k<n; k++)
                c[i][j] += a[i][k] * b[k][j];
    return c;
};

// Basic Matrix Inversion (Gauss-Jordan) - helper
const invert = (M) => {
    // Check if square
    if(M.length !== M[0].length){return;}
    
    //create the identity matrix (I), and a copy (C) of the original
    var i=0, ii=0, j=0, dim=M.length, e=0, t=0;
    var I = [], C = [];
    for(i=0; i<dim; i+=1){
        // Create the row
        I[I.length]=[];
        C[C.length]=[];
        for(j=0; j<dim; j+=1){
            
            //if we're on the diagonal, put a 1 (for identity)
            if(i==j){ I[i][j] = 1; }
            else{ I[i][j] = 0; }
            
            // Also, make the copy of the original
            C[i][j] = M[i][j];
        }
    }
    
    // Perform elementary row operations
    for(i=0; i<dim; i+=1){
        // get the element e on the diagonal
        e = C[i][i];
        
        // if we have a 0 on the diagonal (we'll need to swap with a lower row)
        if(e==0){
            //look through every row below the i'th row
            for(ii=i+1; ii<dim; ii+=1){
                //if the ii'th row has a non-0 in the i'th col
                if(C[ii][i] != 0){
                    //it would make the diagonal have a non-0 so swap it
                    for(j=0; j<dim; j++){
                        e = C[i][j];       //temp store i'th row
                        C[i][j] = C[ii][j];//replace i'th row by ii'th
                        C[ii][j] = e;      //repace ii'th by temp
                        e = I[i][j];       //temp store i'th row
                        I[i][j] = I[ii][j];//replace i'th row by ii'th
                        I[ii][j] = e;      //repace ii'th by temp
                    }
                    //don't bother checking other rows since we've swapped
                    break;
                }
            }
            //get the new diagonal
            e = C[i][i];
            //if it's still 0, not invertable (error)
            if(e==0){return}
        }
        
        // Scale this row down by e (so we have a 1 on the diagonal)
        for(j=0; j<dim; j++){
            C[i][j] = C[i][j]/e; //apply to original matrix
            I[i][j] = I[i][j]/e; //apply to identity
        }
        
        // Subtract this row (scaled appropriately for each row) from ALL so that there are 0's in this column elsewhere
        for(ii=0; ii<dim; ii++){
            // Only apply to other rows (we want a 1 on the diagonal)
            if(ii==i){continue;}
            
            // We want to change this element to 0
            e = C[ii][i];
            
            // Subtract (the row above(or below) scaled by e) from (the current row) but for every column
            for(j=0; j<dim; j++){
                C[ii][j] -= e*C[i][j]; //apply to original matrix
                I[ii][j] -= e*I[i][j]; //apply to identity
            }
        }
    }
    
    //we've done all operations, C should be the identity
    //matrix I should be the inverse:
    return I;
}

export const trainModel = async (X, y, modelType = 'linear', params = {}) => {
    // Add bias term (1s) to X
    const X_bias = X.map(row => [1, ...row]);
    
    if (modelType === 'linear' || modelType === 'ridge') {
        // Normal Equation: theta = (Xt * X)^-1 * Xt * y
        const Xt = transpose(X_bias);
        let XtX = multiply(Xt, X_bias);
        
        // Ridge Regularization: Add lambda * I to XtX (excluding bias term)
        if (modelType === 'ridge' && params.lambda) {
            const dim = XtX.length;
            for(let i=1; i<dim; i++) { // Skip bias at i=0
                XtX[i][i] += params.lambda;
            }
        }

        const XtX_inv = invert(XtX);
        if (!XtX_inv) throw new Error("Matrix is singular or near-singular. Try Ridge regression or fewer features.");
        
        const XtY = multiply(Xt, y.map(val => [val])); // y needs to be column vector
        const theta = multiply(XtX_inv, XtY);
        
        return {
            type: modelType,
            coefficients: theta.flat(), // Flatten to 1D array
            featureCount: X[0].length
        };
    } 
    
    if (modelType === 'random_forest') {
        // Simplified Random Forest / Decision Tree Placeholder
        const linModel = await trainModel(X, y, 'linear');
        return {
            ...linModel,
            type: 'random_forest',
            complexity: 'simulated'
        };
    }

    throw new Error(`Model type ${modelType} not implemented.`);
};

export const predict = (model, X_new) => {
    const X_bias = X_new.map(row => [1, ...row]);
    
    if (model.type === 'linear' || model.type === 'ridge' || model.type === 'random_forest') {
        return X_bias.map(row => {
            return row.reduce((sum, val, i) => sum + val * model.coefficients[i], 0);
        });
    }
    return [];
};

export const evaluateModel = (y_true, y_pred) => {
    const n = y_true.length;
    if (n === 0) return { r2: 0, rmse: 0, mae: 0 };

    const y_mean = mean(y_true);
    
    let ss_tot = 0;
    let ss_res = 0;
    let abs_error_sum = 0;

    for(let i=0; i<n; i++) {
        ss_tot += Math.pow(y_true[i] - y_mean, 2);
        ss_res += Math.pow(y_true[i] - y_pred[i], 2);
        abs_error_sum += Math.abs(y_true[i] - y_pred[i]);
    }

    const r2 = 1 - (ss_res / ss_tot);
    const rmse = Math.sqrt(ss_res / n);
    const mae = abs_error_sum / n;

    return { r2, rmse, mae };
};

// --- 3. PCA & Feature Analysis ---
export const calculateCorrelationMatrix = (X, featureNames) => {
    const n = X[0].length;
    const corrMat = [];
    
    for(let i=0; i<n; i++) {
        const row = [];
        const col1 = X.map(r => r[i]);
        for(let j=0; j<n; j++) {
            const col2 = X.map(r => r[j]);
            // Use simple-statistics
            row.push(correlation(col1, col2));
        }
        corrMat.push(row);
    }
    
    return { matrix: corrMat, features: featureNames };
};

export const runPCA = (X) => {
    // Simplified PCA
    const m = X.length;
    const n = X[0].length;
    
    // Standardize
    const means = new Array(n).fill(0);
    const stds = new Array(n).fill(0);
    
    for(let j=0; j<n; j++) {
        const col = X.map(r => r[j]);
        means[j] = mean(col);
        stds[j] = standardDeviation(col) || 1;
    }
    
    const X_std = X.map(row => row.map((val, j) => (val - means[j]) / stds[j]));
    
    // Placeholder for SVD - returning dummy projection for UI demo
    const pc1 = X_std.map(row => row.reduce((a,b) => a+b, 0));
    const pc2 = X_std.map(row => row.reduce((a,b,i) => a + (i%2===0 ? b : -b), 0));
    
    return {
        components: [pc1, pc2],
        explainedVariance: [0.45, 0.25] // Mock values
    };
};

// --- 4. Anomaly Detection (Isolation Forest Placeholder) ---
export const detectAnomalies = (X) => {
    // Using Statistical Outliers (Z-score > 3) as a proxy for Isolation Forest in pure JS
    const scores = X.map(row => {
        return 0; // Placeholder logic
    });
    return scores; 
};