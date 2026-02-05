export const EMAIL_TEMPLATES = {
    executive: {
        subject: "Executive Summary: [Well Name] PPFG Analysis",
        body: "Please find attached the executive summary for the recent pore pressure analysis. Key risks have been identified..."
    },
    technical: {
        subject: "Technical Report: [Well Name] Detailed Analysis",
        body: "Attached is the full technical report including calibration data, offset comparison, and uncertainty envelopes."
    },
    alert: {
        subject: "URGENT: Pressure Anomaly Detected - [Well Name]",
        body: "Real-time monitoring has detected a significant deviation from the pressure prognosis at [Depth]."
    }
};