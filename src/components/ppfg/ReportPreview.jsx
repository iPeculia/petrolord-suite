import React from 'react';

const ReportPreview = () => {
    return (
        <div className="h-full flex flex-col items-center justify-center bg-slate-900/50 border border-dashed border-slate-800 rounded-lg">
            <div className="w-48 h-64 bg-white shadow-lg flex flex-col p-4 animate-pulse">
                <div className="h-4 w-3/4 bg-slate-200 mb-4 rounded"></div>
                <div className="h-2 w-full bg-slate-100 mb-2 rounded"></div>
                <div className="h-2 w-full bg-slate-100 mb-2 rounded"></div>
                <div className="h-2 w-2/3 bg-slate-100 mb-8 rounded"></div>
                
                <div className="h-24 w-full bg-slate-100 rounded mb-4"></div>
                
                <div className="mt-auto flex justify-between">
                    <div className="h-2 w-12 bg-slate-200 rounded"></div>
                    <div className="h-2 w-4 bg-slate-200 rounded"></div>
                </div>
            </div>
            <p className="mt-4 text-xs text-slate-500">Document Preview</p>
        </div>
    );
};

export default ReportPreview;