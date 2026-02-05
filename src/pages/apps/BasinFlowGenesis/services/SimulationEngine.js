import { BurialCompactionEngine } from './BurialCompactionEngine';
import { HeatTransportEngine } from './HeatTransportEngine';
import { MaturityEngine } from './MaturityEngine';
import { PhaseBehaviorEngine } from './PhaseBehaviorEngine';
import { ExpulsionEngine } from './ExpulsionEngine';
import { getThermalProps } from './ThermalPropertiesLibrary';
import { Units } from './PhysicsUtils';

export class SimulationEngine {
    
    static async run(project, onProgress) {
        console.log("Starting Simulation...", project);
        
        // Safety check for project
        if (!project || !project.stratigraphy) {
            throw new Error("Invalid project data: Stratigraphy is missing.");
        }

        // 1. Initialize
        // Clone stratigraphy to avoid mutating state directly
        let layers = [];
        try {
             layers = JSON.parse(JSON.stringify(project.stratigraphy));
        } catch (e) {
             throw new Error("Failed to parse stratigraphy data.");
        }
        
        // Sort layers by age (Oldest first for deposition simulation)
        const chronologicalLayers = [...layers].sort((a, b) => (b.ageStart || 0) - (a.ageStart || 0));
        
        // Pre-calculate Solid Thickness (Decompacted Basis)
        BurialCompactionEngine.initializeSolidThickness(chronologicalLayers);
        
        // Simulation Time Stepping
        const maxAge = Math.max(...chronologicalLayers.map(l => l.ageStart || 0));
        const minAge = 0;
        const dt = 1; // 1 Ma steps for better resolution
        
        let currentTime = maxAge;
        let activeLayers = []; 
        
        // Results Storage
        const history = {
            timeSteps: [], // Array of ages
            burial: [],     // Array of arrays [layerIndex][timeStepIndex] = { top, bottom }
            temperature: [], // Array of arrays [layerIndex][timeStepIndex] = Temp
            maturity: [],    // Array of arrays [layerIndex][timeStepIndex] = Ro
            transformation: [], // Array of arrays [layerIndex][timeStepIndex] = TR
            generation: [],  // Array of arrays [layerIndex][timeStepIndex] = Rate
            expulsion: []    // Array of arrays [layerIndex][timeStepIndex] = Cumulative Mass
        };

        // Initialize storage arrays for each layer
        chronologicalLayers.forEach(() => {
            history.burial.push([]);
            history.temperature.push([]);
            history.maturity.push([]);
            history.transformation.push([]);
            history.generation.push([]);
            history.expulsion.push([]);
        });
        
        // Initialize State for Maturity & Expulsion tracking
        const layerStates = {};
        chronologicalLayers.forEach(l => {
            // Safe access to nested properties
            const kerogenType = l.sourceRock?.kerogen || 'type2';
            
            layerStates[l.id] = {
                maturity: MaturityEngine.initializeState(kerogenType),
                expelled: 0,
                generated: 0,
                retained: 0,
                saturation: 0
            };
        });
        
        // --- MAIN LOOP ---
        while (currentTime >= minAge) {
            // 1. Deposit new layers
            activeLayers = chronologicalLayers.filter(l => (l.ageStart || 0) >= currentTime);
            // Sort active layers by depth
            activeLayers.sort((a, b) => (a.ageStart || 0) - (b.ageStart || 0));
            
            // 2. Compaction & Burial (Geometry)
            let currentDepth = 0; // Surface
            const nodeData = [];
            
            // Calculate geometry for all active layers
            activeLayers.forEach(layer => {
                const props = BurialCompactionEngine.calculateLayerProperties(layer, currentDepth);
                
                // Store Geometry Result
                const layerIndex = chronologicalLayers.findIndex(l => l.id === layer.id);
                
                // Prepare data for Heat Engine
                const centerDepth = (props.topDepth + props.bottomDepth) / 2;
                const thermalProps = getThermalProps(layer.lithology || 'shale');
                
                nodeData.push({
                    id: layer.id,
                    z: centerDepth,
                    dz: props.thickness,
                    T: 20, // Will be solved
                    k: thermalProps.conductivity,
                    rho: props.rhoBulk,
                    Cp: thermalProps.heatCapacity,
                    radiogenic: thermalProps.radiogenic
                });
                
                // Update depth for next layer below
                currentDepth = props.bottomDepth;

                // Store transient geometry
                 if(history.burial[layerIndex]) {
                    history.burial[layerIndex].push({
                        age: currentTime,
                        top: props.topDepth,
                        bottom: props.bottomDepth,
                        thickness: props.thickness
                    });
                 }
            });
            
            // 3. Heat Transport
            // Recover previous T
             nodeData.forEach(node => {
                const layerIndex = chronologicalLayers.findIndex(l => l.id === node.id);
                const prevTemps = history.temperature[layerIndex];
                if (prevTemps && prevTemps.length > 0) {
                    node.T = prevTemps[prevTemps.length - 1].value;
                } else {
                    node.T = 20 + (node.z * 0.03); // Initial gradient guess
                }
            });

            // Boundary Conditions
            const surfaceT = 20; 
            const basalQ = (project.heatFlow?.value || 60) / 1000; 
            
            // Solve
            const newTemps = HeatTransportEngine.solve(nodeData, Units.ma_to_sec(dt), surfaceT, basalQ);
            
            // Update nodes & Store
            newTemps.forEach((T, i) => {
                const node = nodeData[i];
                node.T = T;
                const layerIndex = chronologicalLayers.findIndex(l => l.id === node.id);
                if(history.temperature[layerIndex]) {
                    history.temperature[layerIndex].push({ age: currentTime, value: T, depth: node.z });
                }
            });
            
            // 4. Maturity & Expulsion
            nodeData.forEach(node => {
                const layer = chronologicalLayers.find(l => l.id === node.id);
                const state = layerStates[node.id];
                const layerIndex = chronologicalLayers.findIndex(l => l.id === node.id);

                // Safety checks
                if (!layer || !state) return;

                // Maturity Step
                const newMaturityState = MaturityEngine.step(
                    state.maturity, 
                    Units.c_to_k(node.T), 
                    dt, 
                    layer.sourceRock?.kerogen || 'type2'
                );
                
                // Calculate Generation Rate (change in TR)
                const deltaTR = newMaturityState.totalTransformation - state.maturity.totalTransformation;
                
                // Mass Generation (Simplified)
                const genRate = deltaTR; // Normalized rate
                
                // Expulsion (Only if source rock)
                let expelledInc = 0;
                if (layer.sourceRock?.isSource) {
                    // Simple Threshold Model
                    if (newMaturityState.Ro > 0.7) {
                        expelledInc = deltaTR * 0.8; // 80% expulsion efficiency above window
                    }
                }

                // Update State
                state.maturity = newMaturityState;
                state.generated += genRate;
                state.expelled += expelledInc;
                
                // Store
                if(history.maturity[layerIndex]) history.maturity[layerIndex].push({ age: currentTime, value: newMaturityState.Ro });
                if(history.transformation[layerIndex]) history.transformation[layerIndex].push({ age: currentTime, value: newMaturityState.totalTransformation });
                if(history.generation[layerIndex]) history.generation[layerIndex].push({ age: currentTime, value: genRate });
                if(history.expulsion[layerIndex]) history.expulsion[layerIndex].push({ age: currentTime, value: state.expelled });
            });
            
            history.timeSteps.push(currentTime);

            // Report Progress
            if (onProgress) onProgress(maxAge > 0 ? ((maxAge - currentTime) / maxAge) * 100 : 100);
            
            // Step
            currentTime -= dt;
        }
        
        return {
            meta: {
                layers: chronologicalLayers.map(l => ({ id: l.id, name: l.name, lithology: l.lithology, color: l.color })),
                maxDepth: Math.max(...(history.burial.flat().map(b => b.bottom) || [0]))
            },
            data: history
        };
    }
}