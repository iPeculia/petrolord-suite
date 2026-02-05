export const generateContourMapData = (inputs) => {
  const { geoPoints } = inputs;

  let xMin = 0, xMax = 9800, yMin = 0, yMax = 9800;
  let xAxisTitle = 'X-Coordinate';
  let yAxisTitle = 'Y-Coordinate';

  if (geoPoints && geoPoints.length > 0) {
      const xCoords = geoPoints.map(p => parseFloat(p.x)).filter(v => !isNaN(v));
      const yCoords = geoPoints.map(p => parseFloat(p.y)).filter(v => !isNaN(v));

      if (xCoords.length > 0 && yCoords.length > 0) {
          xMin = Math.min(...xCoords);
          xMax = Math.max(...xCoords);
          yMin = Math.min(...yCoords);
          yMax = Math.max(...yCoords);
          
          const xRange = xMax - xMin;
          const yRange = yMax - yMin;
          
          xMin -= xRange * 0.1;
          xMax += xRange * 0.1;
          yMin -= yRange * 0.1;
          yMax += yRange * 0.1;

          if (xMin > -180 && xMax < 180 && yMin > -90 && yMax < 90) {
              xAxisTitle = 'Longitude';
              yAxisTitle = 'Latitude';
          }
      }
  }

  const gridSize = 50;
  const x = Array.from({ length: gridSize }, (_, i) => xMin + (i / (gridSize - 1)) * (xMax - xMin));
  const y = Array.from({ length: gridSize }, (_, i) => yMin + (i / (gridSize - 1)) * (yMax - yMin));
  
  const z = [];

  for (let i = 0; i < gridSize; i++) {
    const z_row = [];
    for (let j = 0; j < gridSize; j++) {
      const val = 2500 + 
                  100 * Math.sin((x[j] - xMin) / (xMax - xMin) * 10) + 
                  150 * Math.cos((y[i] - yMin) / (yMax - yMin) * 8) + 
                  50 * Math.sin((x[j]*y[i]) / 100) -
                  0.001 * Math.pow(j - gridSize/2, 2) -
                  0.001 * Math.pow(i - gridSize/2, 2);
      z_row.push(val);
    }
    z.push(z_row);
  }

  const contourPlot = {
    data: [{
      z: z,
      x: x,
      y: y,
      type: 'contour',
      colorscale: 'Viridis',
      contours: {
        coloring: 'lines',
        showlabels: true,
        labelfont: {
          family: 'sans-serif',
          size: 12,
          color: 'white',
        }
      },
      line: {
        width: 1.5
      }
    }],
    layout: {
      title: 'Digitized Contours (2D View)',
      xaxis: { title: xAxisTitle, range: [xMin, xMax] },
      yaxis: { title: yAxisTitle, range: [yMin, yMax] },
      autosize: true,
    }
  };

  const gridPlot3d = {
    data: [{
      z: z,
      x: x,
      y: y,
      type: 'surface',
      colorscale: 'Viridis',
    }],
    layout: {
      title: 'Generated Horizon Grid (3D View)',
      autosize: true,
      scene: {
        xaxis: { title: xAxisTitle },
        yaxis: { title: yAxisTitle },
        zaxis: { title: 'Depth (m)', autorange: 'reversed' },
        aspectratio: { x: 1, y: 1, z: 0.3 }
      },
      margin: { l: 0, r: 0, b: 0, t: 40 }
    }
  };

  return { inputs, contourPlot, gridPlot3d };
};