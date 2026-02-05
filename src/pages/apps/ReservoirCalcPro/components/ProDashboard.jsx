import React from 'react';
import { useReservoirCalc } from '../contexts/ReservoirCalcContext';
import ProDashboardHome from './ProDashboardHome';
import ReportGenerator from './tools/ReportGenerator';
import ProjectManager from './tools/ProjectManager';
import BatchProcessor from './tools/BatchProcessor';
import ComparisonAnalyzer from './tools/ComparisonAnalyzer';
import TeamCollaboration from './tools/TeamCollaboration';
import DataManager from './tools/DataManager';
import AuditTrail from './tools/AuditTrail';
import Settings from './tools/Settings';

// Placeholder for any missing tool to prevent crashes
const ToolPlaceholder = ({ name }) => (
    <div className="h-full flex items-center justify-center p-8 text-center">
        <div>
            <h2 className="text-xl font-bold text-white mb-2">{name}</h2>
            <p className="text-slate-400">This module is initialized and ready for implementation.</p>
        </div>
    </div>
);

const ProDashboard = () => {
    const { state } = useReservoirCalc();

    // Main Routing Switch
    switch (state.currentView) {
        case 'reporting': 
            return <div className="h-full p-6"><ReportGenerator /></div>;
        case 'projects': 
            return <div className="h-full p-6"><ProjectManager /></div>;
        case 'batch': 
            return <div className="h-full p-6"><BatchProcessor /></div>;
        case 'comparison': 
            return <div className="h-full p-6"><ComparisonAnalyzer /></div>;
        case 'collaboration':
            return <div className="h-full p-6"><TeamCollaboration /></div>;
        case 'data-manager':
            return <div className="h-full p-6"><DataManager /></div>;
        case 'audit-trail':
            return <div className="h-full p-6"><AuditTrail /></div>;
        case 'settings':
            return <div className="h-full p-6"><Settings /></div>;
        case 'dashboard':
        default: 
            return <ProDashboardHome />;
    }
};

export default ProDashboard;