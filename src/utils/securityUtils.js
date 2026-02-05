// Security & Compliance Utilities for Petrophysics Estimator

// --- Encryption (AES-GCM) ---

export const generateEncryptionKey = async () => {
  return await window.crypto.subtle.generateKey(
    {
      name: "AES-GCM",
      length: 256,
    },
    true,
    ["encrypt", "decrypt"]
  );
};

export const exportKey = async (key) => {
  const exported = await window.crypto.subtle.exportKey("jwk", key);
  return JSON.stringify(exported);
};

export const importKey = async (jwkString) => {
  const jwk = JSON.parse(jwkString);
  return await window.crypto.subtle.importKey(
    "jwk",
    jwk,
    "AES-GCM",
    true,
    ["encrypt", "decrypt"]
  );
};

export const encryptData = async (data, key) => {
  const encoded = new TextEncoder().encode(JSON.stringify(data));
  const iv = window.crypto.getRandomValues(new Uint8Array(12));
  const encrypted = await window.crypto.subtle.encrypt(
    {
      name: "AES-GCM",
      iv: iv,
    },
    key,
    encoded
  );

  return {
    encrypted: Array.from(new Uint8Array(encrypted)),
    iv: Array.from(iv),
  };
};

export const decryptData = async (encryptedData, iv, key) => {
  const decrypted = await window.crypto.subtle.decrypt(
    {
      name: "AES-GCM",
      iv: new Uint8Array(iv),
    },
    key,
    new Uint8Array(encryptedData)
  );

  const decoded = new TextDecoder().decode(decrypted);
  return JSON.parse(decoded);
};

// --- Data Masking ---

export const maskWellData = (well, level = 'standard') => {
  const masked = { ...well };
  
  if (level === 'restricted' || level === 'confidential') {
    masked.name = `WELL-${well.api?.slice(-4) || 'XXXX'}`;
    masked.operator = 'REDACTED OPERATOR';
    masked.api = 'XX-XXX-XXXXX';
    masked.location = { lat: 0, lon: 0, notes: 'Location Masked' };
    masked.field = 'RESTRICTED FIELD';
  } else if (level === 'internal') {
    masked.operator = 'Internal Operator';
  }

  return masked;
};

export const getClassificatonBadgeColor = (classification) => {
  switch (classification?.toLowerCase()) {
    case 'public': return 'bg-green-500/10 text-green-500 border-green-500/50';
    case 'internal': return 'bg-blue-500/10 text-blue-500 border-blue-500/50';
    case 'confidential': return 'bg-amber-500/10 text-amber-500 border-amber-500/50';
    case 'restricted': return 'bg-red-500/10 text-red-500 border-red-500/50';
    default: return 'bg-slate-500/10 text-slate-500 border-slate-500/50';
  }
};

// --- Compliance & Audit ---

export const generateMockAuditLogs = (count = 10) => {
  const actions = ['Project Accessed', 'Data Exported', 'Settings Changed', 'Well Imported', 'Encryption Enabled'];
  const actors = ['user_admin', 'analyst_01', 'auditor_external'];
  const logs = [];
  
  for (let i = 0; i < count; i++) {
    logs.push({
      id: crypto.randomUUID(),
      action: actions[Math.floor(Math.random() * actions.length)],
      actor: actors[Math.floor(Math.random() * actors.length)],
      timestamp: new Date(Date.now() - Math.floor(Math.random() * 1000000000)).toISOString(),
      ip: `192.168.1.${Math.floor(Math.random() * 255)}`,
      status: Math.random() > 0.1 ? 'Success' : 'Failed',
      details: 'Operation completed successfully via secure channel.'
    });
  }
  return logs.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
};

export const complianceChecklist = [
  { id: 'gdpr_1', label: 'Data Encryption at Rest', standard: 'GDPR Art. 32', status: true },
  { id: 'gdpr_2', label: 'Right to Erasure (Retention Policy)', standard: 'GDPR Art. 17', status: true },
  { id: 'sox_1', label: 'Access Control Logs', standard: 'SOX Sec. 404', status: true },
  { id: 'sox_2', label: 'Data Integrity Validation', standard: 'SOX Sec. 302', status: false },
  { id: 'hipaa_1', label: 'PHI Anonymization', standard: 'HIPAA §164.514', status: true }, // Applicable if personal data in logs
];