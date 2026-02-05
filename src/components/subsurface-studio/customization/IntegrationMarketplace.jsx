import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Puzzle, Download, ExternalLink } from 'lucide-react';

const IntegrationMarketplace = () => {
    const integrations = [
        { name: 'Schlumberger Petrel', category: 'Connector', installed: true, desc: 'Sync wells and horizons via Ocean API.' },
        { name: 'Salesforce CRM', category: 'Business', installed: false, desc: 'Link assets to opportunities and accounts.' },
        { name: 'OSDU Data Platform', category: 'Data Lake', installed: true, desc: 'Standardized energy data exchange.' },
        { name: 'SAP S/4HANA', category: 'ERP', installed: false, desc: 'Automated AFE invoicing and cost tracking.' },
        { name: 'PowerBI Embedded', category: 'Analytics', installed: false, desc: 'Embed Microsoft PowerBI dashboards.' },
        { name: 'Esri ArcGIS', category: 'GIS', installed: true, desc: 'Advanced geospatial mapping layers.' },
    ];

    return (
        <div className="h-full p-1 space-y-4 overflow-y-auto">
            <div className="flex justify-between items-center">
                <h3 className="text-lg font-bold text-slate-200 flex items-center">
                    <Puzzle className="w-5 h-5 mr-2 text-orange-400" /> Integration Hub
                </h3>
                <Button variant="outline" size="sm">Request Integration</Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {integrations.map((item, i) => (
                    <Card key={i} className="bg-slate-950 border-slate-800 flex flex-col">
                        <CardHeader className="pb-2">
                            <div className="flex justify-between items-start">
                                <Badge variant="outline" className="mb-2 text-[10px] text-slate-500 border-slate-700">{item.category}</Badge>
                                {item.installed && <Badge className="bg-green-900/30 text-green-400 hover:bg-green-900/30 text-[10px]">Installed</Badge>}
                            </div>
                            <CardTitle className="text-sm text-slate-200">{item.name}</CardTitle>
                        </CardHeader>
                        <CardContent className="flex-grow flex flex-col justify-between pt-0">
                            <p className="text-xs text-slate-500 mb-4">{item.desc}</p>
                            <Button 
                                size="sm" 
                                variant={item.installed ? "secondary" : "default"} 
                                className={`w-full text-xs ${!item.installed && "bg-orange-600 hover:bg-orange-700"}`}
                            >
                                {item.installed ? 'Configure' : 'Install'}
                            </Button>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
};

export default IntegrationMarketplace;