import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Fingerprint } from 'lucide-react';

const SingleSignOn = () => (
    <Card className="bg-slate-950 border-slate-800 m-1">
        <CardContent className="p-6 text-center">
            <Fingerprint className="w-12 h-12 mx-auto text-cyan-400 mb-4" />
            <h3 className="text-lg font-bold text-slate-200">Identity Provider</h3>
            <p className="text-sm text-slate-500 mt-2">SAML 2.0 / OIDC Configuration.</p>
            <div className="mt-4 flex justify-center gap-4">
                <div className="px-3 py-1 bg-slate-900 rounded text-xs text-slate-300 border border-slate-800">Azure AD</div>
                <div className="px-3 py-1 bg-slate-900 rounded text-xs text-slate-300 border border-slate-800">Okta</div>
                <div className="px-3 py-1 bg-slate-900 rounded text-xs text-slate-300 border border-slate-800">Google</div>
            </div>
        </CardContent>
    </Card>
);

export default SingleSignOn;