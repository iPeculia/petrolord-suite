# Security Recommendations

## Immediate
1.  **Content Security Policy (CSP)**: Tighten script sources to only allow necessary CDNs.
2.  **Audit Logs**: Increase retention period from 30 to 90 days for Enterprise compliance.

## Short-term
1.  **Secret Rotation**: Implement automated API key rotation for integration connectors.
2.  **Geo-blocking**: Restrict login access to sanctioned countries only (configurable per tenant).

## Long-term
1.  **SIEM Integration**: Push audit logs to customer's Splunk/Datadog instances.
2.  **Penetration Testing**: Schedule external 3rd party audit for Q2 2026.