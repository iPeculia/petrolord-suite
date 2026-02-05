/**
 * Calculates a 3D well trajectory from survey stations using the minimum curvature method.
 * @param {Array<Object>} stations - An array of survey station objects, each with md, inc, and azm.
 * @param {Object} wellHead - The well head location {x, y, z}.
 * @returns {Array<Object>} An array of calculated points {x, y, z, md, inc, azm}.
 */
export function calculateWellTrajectory(stations, wellHead) {
    // Robust validation of inputs
    if (!wellHead || typeof wellHead.x !== 'number' || typeof wellHead.y !== 'number' || typeof wellHead.z !== 'number') {
        console.error("Invalid wellHead provided to calculateWellTrajectory:", wellHead);
        return null; // Return null to indicate failure
    }
    if (!stations || !Array.isArray(stations) || stations.length < 1) {
        console.error("Invalid or empty stations array provided to calculateWellTrajectory.");
        return null;
    }

    const trajectory = [];
    const toRadians = (degrees) => degrees * (Math.PI / 180);

    // Add wellhead as the first point
    trajectory.push({
        x: wellHead.x,
        y: wellHead.y,
        z: wellHead.z,
        md: 0,
        inc: 0,
        azm: 0
    });

    let prevStation = { md: 0, inc: 0, azm: 0 };
    let prevPoint = { x: wellHead.x, y: wellHead.y, z: wellHead.z };

    for (let i = 0; i < stations.length; i++) {
        const currStation = stations[i];

        // Validate station data
        if (typeof currStation.md !== 'number' || typeof currStation.inc !== 'number' || typeof currStation.azm !== 'number') {
            console.warn(`Skipping invalid survey station at index ${i}:`, currStation);
            continue;
        }

        const md1 = prevStation.md;
        const inc1 = toRadians(prevStation.inc);
        const azm1 = toRadians(prevStation.azm);

        const md2 = currStation.md;
        const inc2 = toRadians(currStation.inc);
        const azm2 = toRadians(currStation.azm);

        const deltaMD = md2 - md1;
        if (deltaMD <= 0) continue;

        const dogleg = Math.acos(Math.cos(inc2 - inc1) - Math.sin(inc1) * Math.sin(inc2) * (1 - Math.cos(azm2 - azm1)));
        
        let rf = 1; // Ratio Factor
        if (dogleg > 0.0001) { // Avoid division by zero for straight sections
            rf = (2 / dogleg) * Math.tan(dogleg / 2);
        }

        const deltaNorth = (deltaMD / 2) * (Math.sin(inc1) * Math.cos(azm1) + Math.sin(inc2) * Math.cos(azm2)) * rf;
        const deltaEast = (deltaMD / 2) * (Math.sin(inc1) * Math.sin(azm1) + Math.sin(inc2) * Math.sin(azm2)) * rf;
        const deltaZ = (deltaMD / 2) * (Math.cos(inc1) + Math.cos(inc2)) * rf;

        const newPoint = {
            x: prevPoint.x + deltaEast,
            y: prevPoint.y + deltaNorth,
            z: prevPoint.z + deltaZ,
            md: currStation.md,
            inc: currStation.inc,
            azm: currStation.azm
        };

        trajectory.push(newPoint);

        prevStation = currStation;
        prevPoint = newPoint;
    }

    return trajectory;
}

/**
 * Generates a forward-looking survey based on trajectory segments.
 * @param {Object} options - The options for the survey generation.
 * @returns {Object} An object containing the calculated stations and QA results.
 */
export function runForwardSurvey(options) {
    const { surface, segments, units, getGeoCoords } = options;
    if (!segments || !surface) return { stations: [], qa: {} };

    const toRadians = (degrees) => degrees * (Math.PI / 180);
    const toDegrees = (radians) => radians * (180 / Math.PI);
    const dlsUnitDivisor = units === 'meters' ? 30 : 100;

    let current = {
        MD: 0, INC: 0, AZM: 0,
        TVD: 0, North: surface.n, East: surface.e,
        DLS: 0, VS: 0, ClosureDist: 0, ClosureAzm: 0,
        TVDSS: -surface.kb_m
    };
    const stations = [{ ...current, ...getGeoCoords(current.East, current.North) }];
    
    let totalLength = 0;
    let maxDLS = 0;
    let sumDLS = 0;
    let dlsCount = 0;

    for (const segment of segments) {
        const length_m = segment.length_m;
        const buildRate_dpm = segment.buildRate_dpm;
        const turnRate_dpm = segment.turnRate_dpm;

        const md1 = current.MD;
        const inc1 = toRadians(current.INC);
        const azm1 = toRadians(current.AZM);

        const deltaInc = (buildRate_dpm / dlsUnitDivisor) * length_m;
        const deltaAzm = (turnRate_dpm / dlsUnitDivisor) * length_m;

        const inc2 = inc1 + toRadians(deltaInc);
        const azm2 = azm1 + toRadians(deltaAzm);

        const dogleg = Math.acos(Math.cos(inc2 - inc1) - Math.sin(inc1) * Math.sin(inc2) * (1 - Math.cos(azm2 - azm1)));
        
        let rf = 1;
        if (dogleg > 0.0001) {
            rf = (2 / dogleg) * Math.tan(dogleg / 2);
        }

        const deltaNorth = (length_m / 2) * (Math.sin(inc1) * Math.cos(azm1) + Math.sin(inc2) * Math.cos(azm2)) * rf;
        const deltaEast = (length_m / 2) * (Math.sin(inc1) * Math.sin(azm1) + Math.sin(inc2) * Math.sin(azm2)) * rf;
        const deltaZ = (length_m / 2) * (Math.cos(inc1) + Math.cos(inc2)) * rf;
        
        const dls = toDegrees(dogleg) * (dlsUnitDivisor / length_m);
        if (dls > maxDLS) maxDLS = dls;
        sumDLS += dls;
        dlsCount++;

        current = {
            MD: md1 + length_m,
            INC: toDegrees(inc2),
            AZM: toDegrees(azm2) % 360,
            TVD: current.TVD + deltaZ,
            North: current.North + deltaNorth,
            East: current.East + deltaEast,
            DLS: dls,
        };
        
        current.TVDSS = current.TVD - surface.kb_m;
        current.ClosureDist = Math.sqrt(current.North**2 + current.East**2);
        current.ClosureAzm = toDegrees(Math.atan2(current.East, current.North));
        if (current.ClosureAzm < 0) current.ClosureAzm += 360;
        current.VS = current.MD * Math.cos(toRadians(current.INC));

        stations.push({ ...current, ...getGeoCoords(current.East, current.North) });
        totalLength += length_m;
    }
    
    const lastStation = stations[stations.length - 1];
    const l3d = Math.sqrt((lastStation.North - surface.n)**2 + (lastStation.East - surface.e)**2 + (lastStation.TVD)**2);

    const qa = {
        maxDLS,
        meanDLS: dlsCount > 0 ? sumDLS / dlsCount : 0,
        guards: {
            monotonicMD: { pass: stations.every((s, i) => i === 0 || s.MD > stations[i-1].MD) },
            physicalBound: { pass: stations.every(s => s.TVD <= s.MD + 1e-6) },
            lengthSanity: { pass: Math.abs(totalLength - l3d) / totalLength < 0.001, value: Math.abs(totalLength - l3d) / totalLength },
        }
    };

    return { stations, qa };
}