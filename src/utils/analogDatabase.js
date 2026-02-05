const ANALOG_DB_KEY = 'analogfinder_database';

export const initializeDatabase = () => {
  const existingDb = localStorage.getItem(ANALOG_DB_KEY);
  if (!existingDb) {
    const initialDb = {
      analogs: [],
      searches: [],
      lastUpdated: new Date().toISOString(),
      version: '1.0'
    };
    localStorage.setItem(ANALOG_DB_KEY, JSON.stringify(initialDb));
    return initialDb;
  }
  return JSON.parse(existingDb);
};

export const getDatabase = () => {
  return JSON.parse(localStorage.getItem(ANALOG_DB_KEY) || '{}');
};

export const saveAnalogToDatabase = (analog, searchCriteria) => {
  const db = getDatabase();
  
  const existingIndex = db.analogs.findIndex(a => 
    a.fieldName === analog.fieldName && a.country === analog.country
  );
  
  if (existingIndex === -1) {
    db.analogs.push({
      ...analog,
      id: generateId(),
      addedDate: new Date().toISOString(),
      searchContext: {
        lithology: searchCriteria.lithologyType,
        environment: searchCriteria.depositionalEnvironment,
        structure: searchCriteria.structuralSetting,
        drive: searchCriteria.driveMethod
      }
    });
  } else {
    db.analogs[existingIndex] = {
      ...db.analogs[existingIndex],
      ...analog,
      lastUpdated: new Date().toISOString()
    };
  }
  
  db.lastUpdated = new Date().toISOString();
  localStorage.setItem(ANALOG_DB_KEY, JSON.stringify(db));
};

export const saveSearchToDatabase = (searchCriteria, results) => {
  const db = getDatabase();
  
  const searchRecord = {
    id: generateId(),
    timestamp: new Date().toISOString(),
    criteria: searchCriteria,
    resultsCount: results.length,
    location: searchCriteria.latitude && searchCriteria.longitude ? {
      lat: parseFloat(searchCriteria.latitude),
      lng: parseFloat(searchCriteria.longitude)
    } : null
  };
  
  db.searches.push(searchRecord);
  
  if (db.searches.length > 100) {
    db.searches = db.searches.slice(-100);
  }
  
  localStorage.setItem(ANALOG_DB_KEY, JSON.stringify(db));
};

export const searchDatabase = (criteria, maxResults = 10) => {
  const db = getDatabase();
  if (!db.analogs || db.analogs.length === 0) return [];
  
  const matches = db.analogs.filter(analog => {
    let score = 0;
    let maxScore = 0;
    
    if (analog.searchContext && analog.searchContext.lithology === criteria.lithologyType) {
      score += 30;
    }
    maxScore += 30;
    
    if (analog.searchContext && analog.searchContext.drive === criteria.driveMethod) {
      score += 25;
    }
    maxScore += 25;
    
    if (analog.searchContext && analog.searchContext.environment === criteria.depositionalEnvironment) {
      score += 20;
    }
    maxScore += 20;
    
    if (analog.searchContext && analog.searchContext.structure === criteria.structuralSetting) {
      score += 15;
    }
    maxScore += 15;
    
    if (analog.avgThickness && criteria.netPayThickness) {
      const thicknessMatch = Math.abs(analog.avgThickness - parseFloat(criteria.netPayThickness)) / parseFloat(criteria.netPayThickness);
      if (thicknessMatch < 0.3) score += 10;
    }
    maxScore += 10;
    
    return maxScore > 0 && (score / maxScore) > 0.4;
  });
  
  return matches.slice(0, maxResults);
};

export const getDatabaseStats = () => {
  const db = getDatabase();
  return {
    totalAnalogs: db.analogs ? db.analogs.length : 0,
    totalSearches: db.searches ? db.searches.length : 0,
    lastUpdated: db.lastUpdated,
    countries: db.analogs ? [...new Set(db.analogs.map(a => a.country))].length : 0,
    lithologies: db.analogs ? [...new Set(db.analogs.map(a => a.searchContext?.lithology))].length : 0
  };
};

const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

export const clearDatabase = () => {
  localStorage.removeItem(ANALOG_DB_KEY);
  return initializeDatabase();
};