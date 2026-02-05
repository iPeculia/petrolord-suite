import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Fingerprint } from 'lucide-react';

const MobileSecurity = () => (
    <Card className="bg-slate-950 border-slate-800 m-1">
        <CardContent className="p-6 text-center">
            <Fingerprint className="w-12 h-12 mx-auto text-red-400 mb-4" />
            <h3 className="text-lg font-bold text-slate-200">Mobile Security</h3>
            <p className="text-sm text-slate-500 mt-2">Biometric unlock required.</p>
        </CardContent>
    </Card>
);

export default MobileSecurity;