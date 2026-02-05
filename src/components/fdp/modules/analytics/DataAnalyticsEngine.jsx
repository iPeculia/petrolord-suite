import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from '@/components/ui/button';
import { Play } from 'lucide-react';

const DataAnalyticsEngine = () => {
    return (
        <div className="space-y-6">
            <div className="bg-slate-900 p-4 rounded-lg border border-slate-800 flex flex-col md:flex-row gap-4 items-end">
                <div className="flex-1 w-full space-y-2">
                    <label className="text-sm text-slate-400">Analysis Type</label>
                    <Select defaultValue="correlation">
                        <SelectTrigger className="bg-slate-800 border-slate-700">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="correlation">Correlation Matrix</SelectItem>
                            <SelectItem value="regression">Linear Regression</SelectItem>
                            <SelectItem value="clustering">K-Means Clustering</SelectItem>
                            <SelectItem value="pca">PCA (Dimensionality Reduction)</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div className="flex-1 w-full space-y-2">
                    <label className="text-sm text-slate-400">Dataset</label>
                    <Select defaultValue="wells">
                        <SelectTrigger className="bg-slate-800 border-slate-700">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="wells">Well Log Data</SelectItem>
                            <SelectItem value="production">Production History</SelectItem>
                            <SelectItem value="costs">Cost Database</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <Button className="bg-blue-600 hover:bg-blue-700 min-w-[120px]">
                    <Play className="w-4 h-4 mr-2" /> Run Analysis
                </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card className="lg:col-span-2 bg-slate-900 border-slate-800">
                    <CardHeader>
                        <CardTitle className="text-white text-sm">Visualization Result</CardTitle>
                    </CardHeader>
                    <CardContent className="flex items-center justify-center h-[400px] bg-slate-950 m-4 rounded border border-slate-800 border-dashed">
                        <div className="text-slate-500 text-center">
                            <p>Select parameters and run analysis to view results.</p>
                            <p className="text-xs mt-2">Supports Correlation, Regression, and Clustering plots.</p>
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-slate-900 border-slate-800">
                    <CardHeader>
                        <CardTitle className="text-white text-sm">Statistical Summary</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4 text-sm">
                            <div className="flex justify-between border-b border-slate-800 pb-2">
                                <span className="text-slate-400">Records Analyzed</span>
                                <span className="text-white">0</span>
                            </div>
                            <div className="flex justify-between border-b border-slate-800 pb-2">
                                <span className="text-slate-400">Variables</span>
                                <span className="text-white">-</span>
                            </div>
                            <div className="flex justify-between border-b border-slate-800 pb-2">
                                <span className="text-slate-400">R-Squared</span>
                                <span className="text-white">-</span>
                            </div>
                            <div className="flex justify-between border-b border-slate-800 pb-2">
                                <span className="text-slate-400">P-Value</span>
                                <span className="text-white">-</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default DataAnalyticsEngine;