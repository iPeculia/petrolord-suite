// Mock Optimization Service for EarthModel Pro Phase 4

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Mock fitness function - simulates checking a location against a grid
const evaluateLocation = (x, y, grid) => {
    const centerX = grid.width / 2;
    const centerY = grid.height / 2;
    
    // Create a sweet spot
    const sweetSpotRadius = grid.width / 5;
    const dist = Math.sqrt(Math.pow(x - centerX, 2) + Math.pow(y - centerY, 2));
    
    let score = 1 - (dist / (grid.width / 2)); // Higher score closer to center
    
    // Add some noise/complexity
    score *= (1 + 0.2 * Math.sin(x/50) * Math.cos(y/50));
    
    return Math.max(0, score); // Fitness should not be negative
};

export const optimizationService = {
  runGeneticAlgorithm: async ({ populationSize, generations, mutationRate, grid }, onProgress) => {
    let population = [];
    
    // 1. Initialize Population
    for (let i = 0; i < populationSize; i++) {
        population.push({
            x: Math.random() * grid.width,
            y: Math.random() * grid.height,
        });
    }

    let bestSolution = null;

    for (let gen = 0; gen < generations; gen++) {
        // 2. Evaluate Fitness
        population.forEach(individual => {
            individual.fitness = evaluateLocation(individual.x, individual.y, grid);
        });

        // Sort by fitness (descending)
        population.sort((a, b) => b.fitness - a.fitness);
        bestSolution = population[0];

        // Report progress
        if (onProgress) {
            onProgress({
                generation: gen + 1,
                bestFitness: bestSolution.fitness,
                population: [...population] 
            });
        }
        await delay(300); // Simulate processing time per generation

        // 3. Evolve
        const newPopulation = [];
        
        // Elitism: keep top 10%
        const eliteCount = Math.floor(populationSize * 0.1);
        for(let i = 0; i < eliteCount; i++) {
            newPopulation.push(population[i]);
        }
        
        while (newPopulation.length < populationSize) {
            // Selection (Tournament)
            const parent1 = population[Math.floor(Math.random() * (populationSize / 2))];
            const parent2 = population[Math.floor(Math.random() * (populationSize / 2))];
            
            // Crossover (Average)
            let child = {
                x: (parent1.x + parent2.x) / 2,
                y: (parent1.y + parent2.y) / 2
            };
            
            // Mutation
            if (Math.random() < mutationRate) {
                child.x += (Math.random() - 0.5) * (grid.width * 0.1);
                child.y += (Math.random() - 0.5) * (grid.height * 0.1);
            }
            
            // Clamp to bounds
            child.x = Math.max(0, Math.min(grid.width, child.x));
            child.y = Math.max(0, Math.min(grid.height, child.y));
            
            newPopulation.push(child);
        }
        
        population = newPopulation;
    }
    
    return bestSolution;
  },
};