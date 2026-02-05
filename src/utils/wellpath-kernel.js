export const calculateWellTrajectory = (surveyStations, wellHead) => {
    if (!surveyStations || surveyStations.length === 0) {
      return [];
    }
  
    const trajectory = [];
    let currentPoint = {
      md: wellHead.md || 0,
      tvd: wellHead.z || 0,
      n: 0,
      e: 0,
      x: wellHead.x || 0,
      y: wellHead.y || 0,
      z: -(wellHead.z || 0)
    };
    trajectory.push({ ...currentPoint });
  
    let prevStation = { md: 0, inc: 0, az: 0 };
  
    for (let i = 0; i < surveyStations.length; i++) {
      const station = surveyStations[i];
  
      const md_diff = station.md - prevStation.md;
      if (md_diff <= 0) continue;
  
      const inc1_rad = prevStation.inc * (Math.PI / 180);
      const inc2_rad = station.inc * (Math.PI / 180);
      const az1_rad = prevStation.az * (Math.PI / 180);
      const az2_rad = station.az * (Math.PI / 180);
  
      const beta = Math.acos(Math.cos(inc2_rad - inc1_rad) - (Math.sin(inc1_rad) * Math.sin(inc2_rad) * (1 - Math.cos(az2_rad - az1_rad))));
  
      const rf = (beta !== 0) ? (2 / beta) * Math.tan(beta / 2) : 1;
  
      const dN = (md_diff / 2) * (Math.sin(inc1_rad) * Math.cos(az1_rad) + Math.sin(inc2_rad) * Math.cos(az2_rad)) * rf;
      const dE = (md_diff / 2) * (Math.sin(inc1_rad) * Math.sin(az1_rad) + Math.sin(inc2_rad) * Math.sin(az2_rad)) * rf;
      const dTVD = (md_diff / 2) * (Math.cos(inc1_rad) + Math.cos(inc2_rad)) * rf;
  
      const nextPoint = {
        md: station.md,
        tvd: currentPoint.tvd + dTVD,
        n: currentPoint.n + dN,
        e: currentPoint.e + dE,
      };

      nextPoint.x = (wellHead.x || 0) + nextPoint.e;
      nextPoint.y = (wellHead.y || 0) + nextPoint.n;
      nextPoint.z = -nextPoint.tvd;
  
      trajectory.push(nextPoint);
      
      currentPoint = { ...nextPoint };
      prevStation = { ...station };
    }
  
    return trajectory;
  };