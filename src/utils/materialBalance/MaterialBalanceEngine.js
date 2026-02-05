
export const interpolatePVT = (pressure, pvtData) => {
  // Mock interpolation
  return { Bo: 1.2, Bg: 0.001, Rs: 500, ViscO: 1.5, ViscG: 0.02 };
};

export const calculateF_Oil = (Np, Gp, Wp, Bo, Bg, Bw, Rs) => {
  return Np * (Bo + (0 - Rs) * Bg) + Wp * Bw; // Simplified
};

export const calculateF_Gas = (Gp, Bg, Wp, Bw) => {
  return Gp * Bg + Wp * Bw;
};

export const calculateEg_Gas = (Bg, Bgi) => {
  return Bg - Bgi;
};

export const calculateEfw = (Boi, cw, cf, Swi, deltaP) => {
  return Boi * ((cw * Swi + cf) / (1 - Swi)) * deltaP;
};

export const calculateEo = (Bo, Boi, Rs, Rsi, Bg) => {
  return (Bo - Boi) + (Rsi - Rs) * Bg;
};

export const calculateEg = (Boi, Bg, Bgi) => {
  return Boi * (Bg / Bgi - 1);
};

export const calculateF = (Np, Gp, Wp, Bo, Bg, Bw, Rs, Rsi, Rp, Boi, Bgi, Rsw, Z) => {
    return Np * Bo + (Gp - Np * Rs) * Bg + Wp * Bw;
};
