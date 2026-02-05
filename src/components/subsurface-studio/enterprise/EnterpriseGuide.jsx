import React from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';

const EnterpriseGuide = () => (
    <ScrollArea className="h-full p-4 text-slate-300 text-sm leading-relaxed">
        <h1 className="text-xl font-bold text-white mb-4">Enterprise Administration Guide</h1>
        
        <h3 className="text-lg font-semibold text-white mt-6 mb-2">1. Security & Authentication</h3>
        <p>EarthModel Studio supports SAML 2.0 and OIDC for Single Sign-On (SSO). Configure your Identity Provider (IdP) metadata URL in the Authentication panel. MFA can be enforced for all users or specific roles.</p>

        <h3 className="text-lg font-semibold text-white mt-6 mb-2">2. Data Governance</h3>
        <p>Data retention policies ensure compliance with regional regulations. Use the Classification Rules engine to automatically tag sensitive subsurface data (e.g., exploration wells) as 'Confidential'.</p>

        <h3 className="text-lg font-semibold text-white mt-6 mb-2">3. Audit & Compliance</h3>
        <p>The Audit Log captures all create, read, update, and delete (CRUD) operations. Logs are immutable and stored for 365 days by default. Use the Export CSV function for external audits (SOC2, ISO).</p>

        <h3 className="text-lg font-semibold text-white mt-6 mb-2">4. Integration</h3>
        <p>Connect to corporate ERP systems for automated AFE cost tracking and OSDU platforms for seamless data ingestion.</p>
    </ScrollArea>
);

export default EnterpriseGuide;