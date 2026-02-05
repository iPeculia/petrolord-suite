# Workflow: Setting up a Safety Alert

**Goal**: Notify Drilling Engineer if Kick detection probability > 80%.

1.  **Navigate**: Settings > Notifications > Rules.
2.  **Create New**: Click "+ Rule".
3.  **Condition**:
    *   Source: "ML Anomaly Detector"
    *   Parameter: "Kick Probability"
    *   Operator: ">"
    *   Value: "0.80"
4.  **Action**:
    *   Channel: "SMS" + "In-App High Priority"
    *   Recipient: "Drilling Superintendent"
5.  **Activate**: Enable rule.