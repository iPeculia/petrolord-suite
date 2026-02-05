export const validateAnomalyCSVData = (csvText) => {
  if (!csvText || csvText.trim().length === 0) return { isValid: false, headers: [] };
  
  const lines = csvText.trim().split('\n');
  if (lines.length < 2) return { isValid: false, headers: [] };
  
  const headers = lines[0].toLowerCase().split(',').map(h => h.trim().replace(/"/g, ''));
  const requiredColumns = [
    'date', 
    'well name', 
    'oil rate', 
    'gas rate', 
    'water rate',
    'choke size',
    'wellhead pressure'
  ];
  
  const isValid = requiredColumns.every(col => 
    headers.some(header => header.includes(col.replace(/\s+/g, '')))
  );

  return { isValid, headers: lines[0].split(',').map(h => h.trim().replace(/"/g, '')) };
};

export const processAnomalyData = async (csvText, settings) => {
  const lines = csvText.trim().split('\n');
  const rawHeaders = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
  const data = lines.slice(1).map(line => {
    const values = line.split(',');
    return rawHeaders.reduce((obj, header, i) => {
      obj[header] = values[i];
      return obj;
    }, {});
  });

  const focusVar = settings.focusVariable;
  const anomalies = [];
  const wellSet = new Set();
  
  // Group by well
  const wellsData = data.reduce((acc, row) => {
    const wellName = row['Well Name'];
    if (!acc[wellName]) acc[wellName] = [];
    acc[wellName].push(row);
    return acc;
  }, {});

  Object.values(wellsData).forEach(wellData => {
    const values = wellData.map(row => parseFloat(row[focusVar])).filter(v => !isNaN(v));
    const mean = values.reduce((sum, v) => sum + v, 0) / values.length;
    const stdDev = Math.sqrt(values.map(v => Math.pow(v - mean, 2)).reduce((sum, v) => sum + v, 0) / values.length);
    
    wellData.forEach(row => {
      const value = parseFloat(row[focusVar]);
      if (isNaN(value)) return;
      
      let isAnomaly = false;
      let expectedRange = '';
      let anomalyType = '';

      switch (settings.detectionMethod) {
        case 'spc':
          const upperLimit = mean + settings.spcStdDevs * stdDev;
          const lowerLimit = mean - settings.spcStdDevs * stdDev;
          expectedRange = `${lowerLimit.toFixed(2)} - ${upperLimit.toFixed(2)}`;
          if (value > upperLimit) { isAnomaly = true; anomalyType = 'High Outlier'; }
          if (value < lowerLimit) { isAnomaly = true; anomalyType = 'Low Outlier'; }
          break;
        case 'ml':
          // Simulate Isolation Forest
          if (Math.random() < settings.mlContamination) {
            isAnomaly = true;
            anomalyType = value > mean ? 'ML High Anomaly' : 'ML Low Anomaly';
          }
          expectedRange = `~${mean.toFixed(2)}`;
          break;
        case 'threshold':
          const min = parseFloat(settings.thresholdMin);
          const max = parseFloat(settings.thresholdMax);
          expectedRange = `${min} - ${max}`;
          if (!isNaN(max) && value > max) { isAnomaly = true; anomalyType = 'Above Threshold'; }
          if (!isNaN(min) && value < min) { isAnomaly = true; anomalyType = 'Below Threshold'; }
          break;
      }
      
      row.isAnomaly = isAnomaly;
      
      if (isAnomaly) {
        anomalies.push({
          'Date': row.Date,
          'Well Name': row['Well Name'],
          'Variable': focusVar,
          'Actual Value': value.toFixed(2),
          'Expected Range': expectedRange,
          'Anomaly Type': anomalyType,
        });
        wellSet.add(row['Well Name']);
      }
    });
  });

  const allProcessedData = Object.values(wellsData).flat();

  // Aggregate for field-level chart
  const fieldTimeSeries = Object.values(data.reduce((acc, row) => {
    const date = row.Date;
    if (!acc[date]) acc[date] = { Date: date, [focusVar]: 0, isAnomaly: false, count: 0 };
    acc[date][focusVar] += parseFloat(row[focusVar]) || 0;
    acc[date].isAnomaly = acc[date].isAnomaly || row.isAnomaly;
    acc[date].count++;
    return acc;
  }, {})).map(d => ({ ...d, [focusVar]: d[focusVar] / d.count }));


  const wellList = Array.from(new Set(data.map(d => d['Well Name'])));

  const insight = anomalies.length > 0 
    ? `Significant anomalies detected primarily in wells: ${Array.from(wellSet).slice(0,3).join(', ')}. Recommend reviewing ${focusVar} trends for these wells.`
    : `No significant anomalies detected for ${focusVar} with the current settings. Production appears stable.`;

  return {
    summary: {
      totalAnomalies: anomalies.length,
      wellsWithAnomalies: wellSet.size,
    },
    anomalies,
    timeSeriesData: allProcessedData,
    fieldTimeSeries,
    wellList,
    focusVariable: focusVar,
    insight,
  };
};