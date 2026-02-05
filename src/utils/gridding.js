import kriging from 'kriging';

const smoothGrid = (grid, passes = 1) => {
  if (!grid) return null;
  const gridHeight = grid.length;
  if (gridHeight === 0) return grid;
  const gridWidth = grid[0].length;
  if (gridWidth === 0) return grid;
  
  let smoothedGrid = JSON.parse(JSON.stringify(grid));

  for (let p = 0; p < passes; p++) {
    let currentGrid = JSON.parse(JSON.stringify(smoothedGrid));
    for (let j = 1; j < gridHeight - 1; j++) {
      for (let i = 1; i < gridWidth - 1; i++) {
        if (currentGrid[j][i] === null) continue;
        
        let sum = 0;
        let count = 0;
        
        for (let dj = -1; dj <= 1; dj++) {
          for (let di = -1; di <= 1; di++) {
            if (currentGrid[j + dj][i + di] !== null) {
              sum += currentGrid[j + dj][i + di];
              count++;
            }
          }
        }
        
        if (count > 0) {
          smoothedGrid[j][i] = sum / count;
        }
      }
    }
  }
  return smoothedGrid;
};

const calculateIdwGrid = (points, width, height, cellSize, power = 3) => {
  if (points.length === 0) return null;

  const gridWidth = Math.ceil(width / cellSize);
  const gridHeight = Math.ceil(height / cellSize);

  const gridX = Array.from({ length: gridWidth }, (_, i) => i * cellSize);
  const gridY = Array.from({ length: gridHeight }, (_, i) => i * cellSize);
  let gridZ = Array(gridHeight).fill(0).map(() => Array(gridWidth).fill(null));

  for (let j = 0; j < gridHeight; j++) {
    for (let i = 0; i < gridWidth; i++) {
      const gridPointX = i * cellSize;
      const gridPointY = j * cellSize;

      let totalWeight = 0;
      let weightedSum = 0;
      let isAtSamplePoint = false;

      for (const p of points) {
        const dx = p.x - gridPointX;
        const dy = p.y - gridPointY;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < 0.001) {
          gridZ[j][i] = p.z;
          isAtSamplePoint = true;
          break;
        }

        const weight = 1 / Math.pow(distance, power);
        totalWeight += weight;
        weightedSum += weight * p.z;
      }

  if (!isAtSamplePoint && totalWeight > 0) {
      gridZ[j][i] = weightedSum / totalWeight;
    }
  }
}

  gridZ = smoothGrid(gridZ, 1);
  return { x: gridX, y: gridY, z: gridZ };
};

const calculateKrigingGrid = (points, width, height, cellSize) => {
    if (points.length < 3) {
        throw new Error("Kriging requires at least 3 data points.");
    }

    const values = points.map(p => p.z);
    const x = points.map(p => p.x);
    const y = points.map(p => p.y);

    const variogram = kriging.train(values, x, y, 'gaussian', 0, 100);

    const gridWidth = Math.ceil(width / cellSize);
    const gridHeight = Math.ceil(height / cellSize);

    const gridX = Array.from({ length: gridWidth }, (_, i) => i * cellSize);
    const gridY = Array.from({ length: gridHeight }, (_, i) => i * cellSize);
    let gridZ = Array(gridHeight).fill(0).map(() => Array(gridWidth).fill(null));

    for (let j = 0; j < gridHeight; j++) {
        for (let i = 0; i < gridWidth; i++) {
            gridZ[j][i] = kriging.predict(i * cellSize, j * cellSize, variogram);
        }
    }
    
    return { x: gridX, y: gridY, z: gridZ };
};

export const generateGrid = async (points, width, height, cellSize, method, toast) => {
    switch (method) {
        case 'idw':
            return calculateIdwGrid(points, width, height, cellSize);
        case 'kriging':
            try {
                return calculateKrigingGrid(points, width, height, cellSize);
            } catch (error) {
                toast({ variant: 'destructive', title: 'Kriging Failed', description: error.message });
                return null;
            }
        case 'min_curvature':
            toast({
                title: 'Using IDW Fallback',
                description: "Minimum Curvature algorithm isn't fully implemented yet. Using Inverse Distance Weighting instead.",
                variant: "warning"
            });
            // Fallback to IDW
            return calculateIdwGrid(points, width, height, cellSize, 3);
        default:
            return calculateIdwGrid(points, width, height, cellSize);
    }
};