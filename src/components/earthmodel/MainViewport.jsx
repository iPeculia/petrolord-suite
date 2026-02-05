import React, { useState } from 'react';
import AppHeader from './AppHeader';

// Core & Phase 1
import DataManager from './data/DataManager';
import SurfaceBuilder from './surface/SurfaceBuilder';
import GridDesigner from './grid/GridDesigner';
import VolumeComputation from './volume/VolumeComputation';

// Phase 2 Modules
import FaciesBuilder from './facies/FaciesBuilder';
import FaciesModeler from './facies/FaciesModeler';
import FaciesViewer from './facies/FaciesViewer';
import PropertyBuilder from './properties/PropertyBuilder';
import PropertyModeler from './properties/PropertyModeler';
import PropertyViewer from './properties/PropertyViewer';
import FaultBuilder from './faults/FaultBuilder';
import FaultViewer from './faults/FaultViewer';
import SeismicImport from './seismic/SeismicImport';
import SeismicViewer from './seismic/SeismicViewer';
import UncertaintyAnalysis from './uncertainty/UncertaintyAnalysis';
import RealizationManager from './uncertainty/RealizationManager';
import AdvancedCanvas3D from './viewer3d/AdvancedCanvas3D';

// Phase 2 Extensions (New)
import ObjectModelingHub from './objects/ObjectModelingHub';
import ChannelModeling from './objects/ChannelModeling';
import LobeModeling from './objects/LobeModeling';
import SaltDomeModeling from './objects/SaltDomeModeling';
import ObjectTemplateLibrary from './objects/ObjectTemplateLibrary';
import ObjectViewer from './objects/ObjectViewer';

import PetrophysicsHub from './petro/PetrophysicsHub';
import PetrophysicalProperties from './petro/PetrophysicalProperties';
import PorosityAnalysis from './petro/PorosityAnalysis';
import RockPhysicsModels from './petro/RockPhysicsModels';
import PetrophysicalCrossPlotsAnalysis from './petro/PetrophysicalCrossPlotsAnalysis';
import PetrophysicalVisualization from './petro/PetrophysicalVisualization';

// Phase 3 Integration Modules
import IntegrationDashboard from './integrations/IntegrationDashboard';
import WorkflowOrchestrator from './integrations/WorkflowOrchestrator';
import LogFaciesAdvanced from './integrations/LogFaciesAdvanced';
import PPFGIntegration from './integrations/PPFGIntegration';
import NPVIntegration from './integrations/NPVIntegration';
import FDPIntegration from './integrations/FDPIntegration';

// Phase 4 ML Modules
import MLHub from './ml/MLHub';
import FaciesPrediction from './ml/FaciesPrediction';
import PropertyPrediction from './ml/PropertyPrediction';
import WellPlacementOptimizationML from './ml/WellPlacementOptimizationML';

const MainViewport = ({ activeModule }) => {
  const [activeProject] = useState({ name: 'Project Alpha', crs: 'EPSG:32631' });
  
  // Local state for sub-navigation
  const [objectView, setObjectView] = useState('hub'); 
  const [petroView, setPetroView] = useState('hub');

  const renderModule = () => {
    switch (activeModule) {
      // --- Core ---
      case 'data': return <DataManager activeProject={activeProject} />;
      case 'surface': return <SurfaceBuilder activeProject={activeProject} />;
      case 'grid': return <GridDesigner activeProject={activeProject} />;
      case 'volume': return <VolumeComputation activeProject={activeProject} />;
      case 'viewer': return <AdvancedCanvas3D />;
        
      // --- Phase 2 Modules ---
      case 'seismic':
        return (
          <div className="h-full grid grid-cols-1 gap-4 p-4 overflow-hidden">
             <SeismicImport />
             <div className="h-[600px] border border-slate-800 rounded-lg overflow-hidden">
                <SeismicViewer />
             </div>
          </div>
        );

      case 'faults':
        return (
          <div className="h-full flex flex-col gap-4 p-4 overflow-hidden">
            <div className="h-1/2"><FaultBuilder /></div>
            <div className="h-1/2"><FaultViewer /></div>
          </div>
        );

      case 'facies':
        return (
          <div className="h-full grid grid-cols-1 lg:grid-cols-12 gap-4 p-4 overflow-hidden">
            <div className="lg:col-span-4 flex flex-col gap-4 overflow-y-auto">
              <FaciesBuilder />
              <FaciesModeler />
            </div>
            <div className="lg:col-span-8 h-full">
              <FaciesViewer />
            </div>
          </div>
        );

      case 'properties':
        return (
          <div className="h-full grid grid-cols-1 lg:grid-cols-12 gap-4 p-4 overflow-hidden">
            <div className="lg:col-span-4 flex flex-col gap-4 overflow-y-auto">
              <PropertyBuilder />
              <PropertyModeler />
            </div>
            <div className="lg:col-span-8 h-full">
              <PropertyViewer />
            </div>
          </div>
        );

      case 'uncertainty':
        return (
          <div className="h-full flex flex-col gap-4 p-4 overflow-hidden">
            <div className="h-1/2"><UncertaintyAnalysis /></div>
            <div className="h-1/2"><RealizationManager /></div>
          </div>
        );

      // --- Object Modeling ---
      case 'objects':
        switch (objectView) {
          case 'channel': return <ChannelModeling onBack={() => setObjectView('hub')} />;
          case 'lobe': return <LobeModeling onBack={() => setObjectView('hub')} />;
          case 'salt': return <SaltDomeModeling onBack={() => setObjectView('hub')} />;
          case 'templates': return <ObjectTemplateLibrary onBack={() => setObjectView('hub')} />;
          case 'viewer': return <ObjectViewer onBack={() => setObjectView('hub')} />;
          default: return <ObjectModelingHub onViewChange={setObjectView} />;
        }

      // --- Petrophysics ---
      case 'petro':
        switch (petroView) {
          case 'properties': return <PetrophysicalProperties onBack={() => setPetroView('hub')} />;
          case 'porosity': return <PorosityAnalysis onBack={() => setPetroView('hub')} />;
          case 'rockphysics': return <RockPhysicsModels onBack={() => setPetroView('hub')} />;
          case 'crossplots': return <PetrophysicalCrossPlotsAnalysis onBack={() => setPetroView('hub')} />;
          case 'visualization': return <PetrophysicalVisualization onBack={() => setPetroView('hub')} />;
          default: return <PetrophysicsHub onViewChange={setPetroView} />;
        }
      
      // --- Phase 3 Integrations ---
      case 'hub': return <IntegrationDashboard />;
      case 'orchestrator': return <WorkflowOrchestrator />;
      case 'int_logfacies': return <LogFaciesAdvanced />;
      case 'int_ppfg': return <PPFGIntegration />;
      case 'int_npv': return <NPVIntegration />;
      case 'int_fdp': return <FDPIntegration />;

      // --- Phase 4 Machine Learning ---
      case 'ml_hub': return <MLHub />;
      case 'ml_facies': return <FaciesPrediction />;
      case 'ml_properties': return <PropertyPrediction />;
      case 'ml_placement': return <WellPlacementOptimizationML />;
      
      case 'ml_faults':
      case 'ml_seismic':
      case 'ml_logs':
      case 'ml_anomalies':
      case 'ml_volume':
        return (
          <div className="flex flex-col items-center justify-center h-full text-slate-500">
            <div className="p-8 bg-slate-900 border border-slate-800 rounded-lg text-center">
              <h3 className="text-xl font-semibold text-slate-200 mb-2">Coming Soon</h3>
              <p>The Machine Learning module "{activeModule}" is currently under development.</p>
            </div>
          </div>
        );

      default:
        return <IntegrationDashboard />;
    }
  };

  return (
    <div className="flex-1 h-full flex flex-col bg-slate-950 overflow-hidden relative">
      <AppHeader 
        activeModule={activeModule} 
        activeProject={activeProject}
        moduleName={activeModule.charAt(0).toUpperCase() + activeModule.slice(1).replace('_', ' ')}
      />
      <div className="flex-1 overflow-hidden relative">
        {renderModule()}
      </div>
    </div>
  );
};

export default MainViewport;