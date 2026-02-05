import React, { Suspense, lazy, useEffect } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider } from '@/contexts/SupabaseAuthContext';
import { ReservoirProvider } from '@/contexts/ReservoirContext';
import { IntegrationProvider } from '@/contexts/IntegrationContext';
import { StudioProvider } from '@/contexts/StudioContext';
import { HSEProvider } from '@/contexts/HSEContext'; // NEW Provider
import ProtectedRoute from '@/components/ProtectedRoute';
import OnboardingRoute from '@/components/OnboardingRoute';
import SuperAdminRoute from '@/components/SuperAdminRoute';
import AuthGuard from '@/components/AuthGuard';
import AppRoute from '@/components/AppRoute';
import DashboardLayout from '@/layouts/DashboardLayout';
import { Toaster } from '@/components/ui/toaster';
import ErrorBoundary from '@/components/ErrorBoundary';
import { GuidedModeProvider } from '@/pages/apps/MechanicalEarthModel/contexts/GuidedModeContext';
import { WellCorrelationProvider } from '@/contexts/WellCorrelationContext';
import { AdminOrgProvider } from '@/contexts/AdminOrganizationContext';
import ProtectedAppRoute from '@/components/ProtectedAppRoute';
import { runAccessDiagnostics } from '@/utils/debugAccess';
import { SUITE_PERMISSIONS, HSE_PERMISSIONS } from '@/constants/permissions'; // For routing checks

// Eager loaded components
import Home from '@/pages/Home';
import Login from '@/pages/Login';
import Signup from '@/pages/Signup';
import ForgotPassword from '@/pages/ForgotPassword';
import SetPassword from '@/pages/SetPassword';
import Dashboard from '@/pages/Dashboard';
import PaymentVerification from '@/pages/PaymentVerification';
import AcceptInvite from '@/pages/auth/AcceptInvite';
import ConfirmationPage from '@/pages/auth/ConfirmationPage';

// Lazy loaded Module Hubs
const DrillingCompletionsHub = lazy(() => import('@/pages/dashboard/DrillingCompletionsHub'));
const ProductionOperationsHub = lazy(() => import('@/pages/dashboard/ProductionOperationsHub'));
const EconomicsProjectManagementHub = lazy(() => import('@/pages/dashboard/EconomicsProjectManagementHub'));
const FacilitiesEngineeringHub = lazy(() => import('@/pages/dashboard/FacilitiesEngineeringHub'));
const GeoscienceAnalytics = lazy(() => import('@/pages/dashboard/GeoscienceAnalytics'));
const ReservoirManagement = lazy(() => import('@/pages/dashboard/ReservoirManagement'));
const Assurance = lazy(() => import('@/pages/dashboard/Assurance'));

// Super Admin Console
const SuperAdminConsole = lazy(() => import('@/pages/SuperAdminConsole'));


// Apps - Lazy Loaded
// ... (Keeping all existing lazy imports identical)
const QuickVol = lazy(() => import('@/pages/apps/QuickVol'));
const ReservoirCalcPro = lazy(() => import('@/pages/apps/ReservoirCalcPro/ReservoirCalcPro'));
const WellSpacingOptimizer = lazy(() => import('@/pages/apps/WellSpacingOptimizer'));
const WellboreStabilityAnalyzer = lazy(() => import('@/pages/apps/WellboreStabilityAnalyzer'));
const OffsetWellIncidentFinder = lazy(() => import('@/pages/apps/OffsetWellIncidentFinder'));
const NpvScenarioBuilder = lazy(() => import('@/pages/apps/NpvScenarioBuilder'));
const ValueOfInformationAnalyzer = lazy(() => import('@/pages/apps/ValueOfInformationAnalyzer'));
const ProbabilisticBreakevenAnalyzer = lazy(() => import('@/pages/apps/ProbabilisticBreakevenAnalyzer'));
const FdpAccelerator = lazy(() => import('@/pages/apps/FDPAccelerator'));
const ProjectManagementPro = lazy(() => import('@/pages/apps/ProjectManagementPro'));
const TechnicalReportAutopilot = lazy(() => import('@/pages/apps/TechnicalReportAutopilot'));
const WellCorrelationPanel = lazy(() => import('@/pages/apps/WellCorrelationPanel'));
const CrossplotGenerator = lazy(() => import('@/pages/apps/CrossplotGenerator'));
const PetrophysicsEstimator = lazy(() => import('@/pages/apps/PetrophysicsEstimator'));
const SeismicInterpreter = lazy(() => import('@/pages/apps/SeismicInterpreter'));
const VelocityModelBuilder = lazy(() => import('@/pages/apps/VelocityModelBuilder'));
const ContourMapDigitizer = lazy(() => import('@/pages/apps/ContourMapDigitizer'));
const WellPlanning = lazy(() => import('@/pages/apps/WellPlanning'));
const ScenarioPlanner = lazy(() => import('@/pages/apps/ScenarioPlanner'));
const EorDesigner = lazy(() => import('@/pages/apps/EorDesigner'));
const UncertaintyAnalysis = lazy(() => import('@/pages/apps/UncertaintyAnalysis'));
const ReservoirSimulationConnector = lazy(() => import('@/pages/apps/ReservoirSimulationConnector'));
const ReliefBlowdownSizer = lazy(() => import('@/pages/apps/ReliefBlowdownSizer'));
const FacilityLayoutMapper = lazy(() => import('@/pages/apps/FacilityLayoutMapper'));
const SeparatorSlugCatcherDesigner = lazy(() => import('@/pages/apps/SeparatorSlugCatcherDesigner'));
const CompressorPumpPack = lazy(() => import('@/pages/apps/CompressorPumpPack'));
const HeatExchangerSizer = lazy(() => import('@/pages/apps/HeatExchangerSizer'));
const GasTreatingDehydration = lazy(() => import('@/pages/apps/GasTreatingDehydration'));
const PipelineSizer = lazy(() => import('@/pages/apps/PipelineSizer'));
const CorrosionRatePredictor = lazy(() => import('@/pages/apps/CorrosionRatePredictor'));
const WellSchematicDesigner = lazy(() => import('@/pages/apps/WellSchematicDesigner'));
const AfeCostControlManager = lazy(() => import('@/pages/apps/AfeCostControlManager'));
const CapitalPortfolioStudio = lazy(() => import('@/pages/apps/CapitalPortfolioStudio'));
const FiscalRegimeDesigner = lazy(() => import('@/pages/apps/FiscalRegimeDesigner'));
const WaterfloodDashboard = lazy(() => import('@/pages/apps/WaterfloodDashboard'));
const DeclineCurveAnalysis = lazy(() => import('@/pages/apps/DeclineCurveAnalysis'));
const FluidSystemsStudio = lazy(() => import('@/pages/apps/FluidSystemsStudio'));
const LogFaciesAnalysis = lazy(() => import('@/pages/apps/LogFaciesAnalysis'));
const AutomatedLogDigitizer = lazy(() => import('@/pages/apps/AutomatedLogDigitizer'));
const NetworkDiagramPro = lazy(() => import('@/pages/apps/NetworkDiagramPro'));
const ReservoirBalanceSurveillance = lazy(() => import('@/pages/apps/ReservoirBalanceSurveillance'));
const ArtificialLiftDesigner = lazy(() => import('@/pages/apps/ArtificialLiftDesigner'));
const WellboreFlowSimulator = lazy(() => import('@/pages/apps/WellboreFlowSimulator'));
const TorqueDragPredictor = lazy(() => import('@/pages/apps/TorqueDragPredictor'));
const CementingSimulationApp = lazy(() => import('@/pages/apps/CementingSimulationApp'));
const FracCompletionApp = lazy(() => import('@/pages/apps/FracCompletionApp'));
const RtoDashboard = lazy(() => import('@/pages/apps/RtoDashboard'));
const PorePressureFracGradient = lazy(() => import('@/pages/apps/PorePressureFracGradient')); 
const DrillingFluidsHydraulics = lazy(() => import('@/pages/apps/DrillingFluidsHydraulics'));
const SubsurfaceStudio = lazy(() => import('@/pages/apps/SubsurfaceStudio'));
const EarthModelStudio = lazy(() => import('@/pages/apps/EarthModelStudio'));
const EarthModelStudioProjects = lazy(() => import('@/pages/apps/EarthModelStudioProjects'));
const BasinFlowAnalysis = lazy(() => import('@/pages/apps/BasinFlowAnalysis')); 
const BasinFlowGenesis = lazy(() => import('@/pages/apps/BasinFlowGenesis/BasinFlowGenesis')); 
const AnalogFinder = lazy(() => import('@/pages/apps/AnalogFinder'));
const WellLogAnalyzer = lazy(() => import('@/pages/apps/WellLogAnalyzer'));
const ProductionSurveillanceDashboard = lazy(() => import('@/pages/apps/ProductionSurveillanceDashboard'));
const WellTestDataAnalyzer = lazy(() => import('@/pages/apps/WellTestDataAnalyzer'));
const FlowAssuranceMonitor = lazy(() => import('@/pages/apps/FlowAssuranceMonitor'));
const IntegratedAssetModeler = lazy(() => import('@/pages/apps/IntegratedAssetModeler'));
const MaterialBalanceAnalysis = lazy(() => import('@/pages/apps/MaterialBalanceAnalysis'));
const WellToSeismicTie = lazy(() => import('@/pages/apps/WellToSeismicTie'));
const MechanicalEarthModel = lazy(() => import('@/pages/apps/MechanicalEarthModel/MechanicalEarthModel'));
const ExpertMode = lazy(() => import('@/pages/apps/MechanicalEarthModel/ExpertMode'));
const Analytics = lazy(() => import('@/pages/apps/MechanicalEarthModel/Analytics'));
const EarthModelPro = lazy(() => import('@/pages/apps/EarthModelPro'));
const GeoscienceHub = lazy(() => import('@/pages/apps/GeoscienceHub'));
const WellCorrelationTool = lazy(() => import('@/pages/apps/WellCorrelationTool'));
const MaterialBalancePro = lazy(() => import('@/pages/apps/MaterialBalancePro'));
const CasingTubingDesignPro = lazy(() => import('@/pages/apps/CasingTubingDesignPro/CasingTubingDesignPro'));
const CasingWearAnalyzer = lazy(() => import('@/pages/apps/CasingWearAnalyzer/CasingWearAnalyzer'));
const StructuralMappingSuite = lazy(() => import('@/pages/apps/StructuralMappingSuite'));
const PetroleumEconomicsStudioProjects = lazy(() => import('@/pages/apps/PetroleumEconomicsStudio/ProjectsList'));
const PetroleumEconomicsStudioWorkspace = lazy(() => import('@/pages/apps/PetroleumEconomicsStudio/ModelWorkspace'));
const PetroleumEconomicsStudioTemplates = lazy(() => import('@/pages/apps/PetroleumEconomicsStudio/TemplatesLibrary'));
const EpeCaseList = lazy(() => import('@/pages/apps/epe/EpeCaseList'));
const EpeCaseDetail = lazy(() => import('@/pages/apps/epe/EpeCaseDetail'));
const EpeRunConsole = lazy(() => import('@/pages/apps/epe/EpeRunConsole'));
const EpeResultsViewer = lazy(() => import('@/pages/apps/epe/EpeResultsViewer'));
const EpeRunComparison = lazy(() => import('@/pages/apps/epe/EpeRunComparison'));
const MobileLayout = lazy(() => import('@/layouts/MobileLayout'));
const MobileDashboard = lazy(() => import('@/pages/mobile/MobileDashboard'));
const MobileProjectList = lazy(() => import('@/pages/mobile/MobileProjectList'));
const MobileTasks = lazy(() => import('@/pages/mobile/MobileTasks'));
const MobileNotifications = lazy(() => import('@/pages/mobile/MobileNotifications'));
const MobileProfile = lazy(() => import('@/pages/mobile/MobileProfile'));
const QuoteDashboard = lazy(() => import('@/pages/QuoteDashboard'));
const GetQuote = lazy(() => import('@/pages/GetQuote'));
const MyProjects = lazy(() => import('@/pages/MyProjects'));
const Profile = lazy(() => import('@/pages/Profile'));
const AdminCreateUser = lazy(() => import('@/pages/AdminCreateUser'));
const AdminOrganizations = lazy(() => import('@/pages/admin/AdminOrganizations'));
const OrgDetail = lazy(() => import('@/pages/admin/OrgDetail'));
const OrgEdit = lazy(() => import('@/pages/admin/OrgEdit'));
const OrgSendQuote = lazy(() => import('@/pages/admin/OrgSendQuote'));
const SystemHealth = lazy(() => import('@/pages/admin/SystemHealth'));
const AdminCenter = lazy(() => import('@/pages/admin/AdminCenter'));
const TermsOfService = lazy(() => import('@/pages/legal/TermsOfService'));
const PrivacyPolicy = lazy(() => import('@/pages/legal/PrivacyPolicy'));
const Support = lazy(() => import('@/pages/legal/Support'));
const Documentation = lazy(() => import('@/pages/legal/Documentation'));
const AboutUs = lazy(() => import('@/pages/company/AboutUs'));
const Careers = lazy(() => import('@/pages/company/Careers'));
const Solutions = lazy(() => import('@/pages/Solutions'));
const Resources = lazy(() => import('@/pages/Resources'));
const NextGen = lazy(() => import('@/pages/NextGen'));
const QuoteBuilder = lazy(() => import('@/pages/QuoteBuilder'));
const ModuleAccess = lazy(() => import('@/pages/ModuleAccess'));
const EmployeeManagement = lazy(() => import('@/pages/EmployeeManagement'));
const AccessRequests = lazy(() => import('@/pages/admin/AccessRequests'));
const SubscriptionManagement = lazy(() => import('@/pages/SubscriptionManagement'));
const RenewSubscription = lazy(() => import('@/pages/RenewSubscription'));
const SubscriptionUsageAnalytics = lazy(() => import('@/pages/SubscriptionUsageAnalytics'));
const SubscriptionHistory = lazy(() => import('@/pages/SubscriptionHistory'));
const AuditLogs = lazy(() => import('@/pages/admin/AuditLogs'));
const TeamManagement = lazy(() => import('@/pages/admin/TeamManagement'));
const BulkImportEmployees = lazy(() => import('@/pages/admin/BulkImportEmployees'));
const AppAnalyticsDashboard = lazy(() => import('@/pages/admin/AppAnalyticsDashboard'));
const AdminSeedApps = lazy(() => import('@/pages/admin/AdminSeedApps')); 
const MasterAppsViewer = lazy(() => import('@/pages/admin/MasterAppsViewer'));

// Loading fallback
const PageLoader = () => (
  <div className="flex items-center justify-center h-full w-full bg-slate-950 text-white min-h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-lime-400"></div>
  </div>
);

const ExternalRedirect = ({ url }) => {
  React.useEffect(() => {
    window.location.href = url;
  }, [url]);
  return <PageLoader />;
};

function App() {
  const location = useLocation();
  const isDashboard = location.pathname.startsWith('/dashboard') || location.pathname.startsWith('/mobile');

  useEffect(() => {
    window.runAccessDiagnostics = runAccessDiagnostics;
  }, []);

  return (
    <AuthProvider>
      <HSEProvider> {/* Wrap with HSEProvider */}
        <IntegrationProvider>
          <AuthGuard>
            <ErrorBoundary>
              <StudioProvider>
                <ReservoirProvider>
                  <WellCorrelationProvider>
                    <AdminOrgProvider>
                      <div className={`${isDashboard ? "h-screen overflow-hidden" : "min-h-screen overflow-y-auto"} w-full bg-slate-950 text-slate-100`}>
                        <Suspense fallback={<PageLoader />}>
                          <Routes>
                            <Route path="/" element={<Home />} />
                            <Route path="/login" element={<Login />} />
                            <Route path="/signup" element={<Signup />} />
                            <Route path="/auth/confirm" element={<ConfirmationPage />} />
                            <Route path="/forgot-password" element={<ForgotPassword />} />
                            <Route path="/auth/reset-password" element={<SetPassword />} />
                            <Route path="/set-password" element={<SetPassword />} />
                            
                            <Route path="/auth/accept-invite" element={<AcceptInvite />} />
                            <Route path="/payment/verify" element={<PaymentVerification />} />

                            {/* Super Admin specific route for console access */}
                            <Route path="/super-admin" element={
                              <ProtectedRoute requiredRole="super_admin">
                                <SuperAdminConsole />
                              </ProtectedRoute>
                            } />

                            <Route path="/admin-create-user" element={
                              <SuperAdminRoute>
                                <AdminCreateUser />
                              </SuperAdminRoute>
                            } />
                            <Route path="/admin/organizations" element={
                              <SuperAdminRoute>
                                <AdminOrganizations />
                              </SuperAdminRoute>
                            } />
                            <Route path="/admin/organizations/:orgId" element={
                              <SuperAdminRoute>
                                <OrgDetail />
                              </SuperAdminRoute>
                            } />
                            <Route path="/admin/organizations/:orgId/edit" element={
                              <SuperAdminRoute>
                                <OrgEdit />
                              </SuperAdminRoute>
                            } />
                            <Route path="/admin/organizations/:orgId/send-quote" element={
                              <SuperAdminRoute>
                                <OrgSendQuote />
                              </SuperAdminRoute>
                            } />
                            <Route path="/admin/system-health" element={
                              <SuperAdminRoute>
                                <SystemHealth />
                              </SuperAdminRoute>
                            } />
                            <Route path="/admin/center" element={
                              <SuperAdminRoute>
                                <AdminCenter />
                              </SuperAdminRoute>
                            } />
                            <Route path="/admin/seed-apps" element={
                              <SuperAdminRoute>
                                <AdminSeedApps />
                              </SuperAdminRoute>
                            } />
                            <Route path="/admin/master-apps-viewer" element={
                              <SuperAdminRoute>
                                <MasterAppsViewer />
                              </SuperAdminRoute>
                            } />
                            
                            {/* Mobile Routes (PWA) */}
                            <Route path="/mobile" element={
                              <ProtectedRoute>
                                <MobileLayout />
                              </ProtectedRoute>
                            }>
                              <Route index element={<Navigate to="dashboard" replace />} />
                              <Route path="dashboard" element={<MobileDashboard />} />
                              <Route path="projects" element={<MobileProjectList />} />
                              <Route path="tasks" element={<MobileTasks />} />
                              <Route path="notifications" element={<MobileNotifications />} />
                              <Route path="profile" element={<MobileProfile />} />
                            </Route>

                            {/* Dashboard routes use DashboardLayout */}
                            {/* Note: DashboardSidebar is part of DashboardLayout. It will show/hide links based on isSuperAdmin and permissions. */}
                            <Route path="/dashboard" element={
                              <OnboardingRoute>
                                <ProtectedRoute>
                                  <DashboardLayout />
                                </ProtectedRoute>
                              </OnboardingRoute>
                            }>
                              <Route index element={<Dashboard />} />
                              <Route path="upgrade" element={<QuoteBuilder />} />
                              {/* ModuleAccess is typically for org admins to manage app access for their members */}
                              <Route path="modules" element={<ModuleAccess />} />
                              {/* EmployeeManagement is for org admins to manage their organization's employees */}
                              <Route path="employees" element={<EmployeeManagement />} />
                              <Route path="access-requests" element={<AccessRequests />} />
                              
                              {/* Admin Management Routes - Gated by Permissions via ProtectedRoute */}
                              {/* These routes are primarily for non-super admins to manage their specific organization */}
                              <Route path="audit-logs" element={
                                <ProtectedRoute requiredPermission={SUITE_PERMISSIONS.MANAGE_ORGANIZATION}>
                                  <AuditLogs />
                                </ProtectedRoute>
                              } />
                              <Route path="teams" element={
                                <ProtectedRoute requiredPermission={SUITE_PERMISSIONS.MANAGE_USERS}>
                                  <TeamManagement />
                                </ProtectedRoute>
                              } />
                              <Route path="bulk-import" element={
                                <ProtectedRoute requiredPermission={SUITE_PERMISSIONS.MANAGE_USERS}>
                                  <BulkImportEmployees />
                                </ProtectedRoute>
                              } />
                              <Route path="analytics" element={
                                <ProtectedRoute requiredPermission={SUITE_PERMISSIONS.VIEW_ANALYTICS}>
                                  <AppAnalyticsDashboard />
                                </ProtectedRoute>
                              } />

                              {/* Subscription Management Routes */}
                              <Route path="subscriptions" element={
                                <ProtectedRoute requiredPermission={SUITE_PERMISSIONS.MANAGE_BILLING}>
                                  <SubscriptionManagement />
                                </ProtectedRoute>
                              } />
                              <Route path="subscriptions/renew/:moduleId" element={<RenewSubscription />} />
                              <Route path="subscriptions/analytics" element={
                                <ProtectedRoute requiredPermission={SUITE_PERMISSIONS.VIEW_ANALYTICS}>
                                  <SubscriptionUsageAnalytics />
                                </ProtectedRoute>
                              } />
                              <Route path="subscriptions/history" element={
                                <ProtectedRoute requiredPermission={SUITE_PERMISSIONS.MANAGE_BILLING}>
                                  <SubscriptionHistory />
                                </ProtectedRoute>
                              } />

                              <Route path="quote/:quoteId" element={<QuoteDashboard />} />
                              <Route path="get-quote" element={<GetQuote />} />
                              
                              {/* Module Hubs */}
                              <Route path="geoscience" element={<AppRoute appName="geoscience"><GeoscienceAnalytics /></AppRoute>} />
                              <Route path="reservoir" element={<AppRoute appName="reservoir"><ReservoirManagement /></AppRoute>} />
                              <Route path="drilling" element={<AppRoute appName="drilling"><DrillingCompletionsHub /></AppRoute>} />
                              <Route path="production" element={<AppRoute appName="production"><ProductionOperationsHub /></AppRoute>} />
                              <Route path="economics" element={<AppRoute appName="economics"><EconomicsProjectManagementHub /></AppRoute>} />
                              <Route path="facilities" element={<AppRoute appName="facilities"><FacilitiesEngineeringHub /></AppRoute>} />
                              <Route path="assurance" element={<AppRoute appName="assurance"><Assurance /></AppRoute>} />
                              
                              {/* HSE - Permission Gated */}
                              <Route path="hse" element={
                                <ProtectedRoute requiredPermission={HSE_PERMISSIONS.VIEW_DASHBOARD} appContext="hse">
                                  <ExternalRedirect url="https://hse.petrolord.com" />
                                </ProtectedRoute>
                              } />

                              {/* Fallbacks */}
                              <Route path="geoscience/*" element={<Navigate to="/dashboard/geoscience" replace />} />
                              <Route path="reservoir/*" element={<Navigate to="/dashboard/reservoir" replace />} />
                              <Route path="drilling/*" element={<Navigate to="/dashboard/drilling" replace />} />
                              <Route path="production/*" element={<Navigate to="/dashboard/production" replace />} />
                              <Route path="economics/*" element={<Navigate to="/dashboard/economics" replace />} />
                              <Route path="facilities/*" element={<Navigate to="/dashboard/facilities" replace />} />
                              <Route path="assurance/*" element={<Navigate to="/dashboard/assurance" replace />} />
                              
                              {/* App Routes (Keep existing structure) */}
                              <Route path="apps/geoscience/hub" element={<ProtectedAppRoute appId="geoscience-hub" appName="Geoscience Hub"><GeoscienceHub /></ProtectedAppRoute>} />
                              <Route path="apps/geoscience/quickvol" element={<ProtectedAppRoute appId="quickvol" appName="QuickVol"><ReservoirCalcPro /></ProtectedAppRoute>} /> {/* Changed to ReservoirCalcPro, QuickVol was causing an error */}
                              <Route path="apps/geoscience/reservoircalc-pro" element={<ProtectedAppRoute appId="reservoircalc-pro" appName="ReservoirCalc Pro"><ReservoirCalcPro /></ProtectedAppRoute>} />
                              <Route path="apps/geoscience/well-correlation-panel" element={<ProtectedAppRoute appId="well-correlation-panel" appName="Well Correlation"><WellCorrelationTool /></ProtectedAppRoute>} />
                              <Route path="apps/geoscience/structural-mapping-suite" element={<ProtectedAppRoute appId="structural-mapping-suite" appName="Structural Mapping Suite"><StructuralMappingSuite /></ProtectedAppRoute>} />
                              
                              <Route path="apps/geoscience/crossplot-generator" element={<CrossplotGenerator />} />
                              <Route path="apps/geoscience/petrophysics-estimator" element={<PetrophysicsEstimator />} />
                              <Route path="apps/geoscience/log-facies-analysis" element={<LogFaciesAnalysis />} />
                              <Route path="apps/geoscience/seismic-interpreter" element={<SeismicInterpreter />} />
                              <Route path="apps/geoscience/well-log-analyzer" element={<WellLogAnalyzer />} />
                              <Route path="apps/geoscience/automated-log-digitizer" element={<AutomatedLogDigitizer />} />
                              <Route path="apps/geoscience/contour-map-digitizer" element={<ContourMapDigitizer />} />
                              <Route path="apps/geoscience/velocity-model-builder" element={<VelocityModelBuilder />} />
                              <Route path="apps/geoscience/analog-finder" element={<AnalogFinder />} />
                              <Route path="apps/geoscience/well-to-seismic-tie" element={<WellToSeismicTie />} />
                              <Route path="apps/geoscience/earth-model-pro" element={<EarthModelPro />} />
                              <Route path="apps/geoscience/earth-model-studio" element={<EarthModelStudio />} />
                              <Route path="apps/geoscience/earth-model-studio/projects" element={<EarthModelStudioProjects />} />
                              <Route path="apps/geoscience/basinflow-genesis" element={<BasinFlowGenesis />} />

                              <Route path="apps/geoscience/mechanical-earth-model" element={
                                <AppRoute appName="mechanical-earth-model">
                                  <GuidedModeProvider>
                                      <MechanicalEarthModel />
                                  </GuidedModeProvider>
                                </AppRoute>
                              } />
                              
                              <Route path="apps/reservoir/fluid-systems-studio" element={<FluidSystemsStudio />} />
                              <Route path="apps/reservoir/waterflood-dashboard" element={<WaterfloodDashboard />} />
                              <Route path="apps/reservoir/decline-curve-analysis" element={<DeclineCurveAnalysis />} />
                              <Route path="apps/reservoir/reservoir-balance" element={<ReservoirBalanceSurveillance />} />
                              <Route path="apps/reservoir/scenario-planner" element={<ScenarioPlanner />} />
                              <Route path="apps/reservoir/eor-designer" element={<EorDesigner />} />
                              <Route path="apps/reservoir/uncertainty-analysis" element={<UncertaintyAnalysis />} />
                              <Route path="apps/reservoir/reservoir-simulation-connector" element={<ReservoirSimulationConnector />} />
                              <Route path="apps/reservoir/material-balance-pro" element={<MaterialBalancePro />} />

                              <Route path="apps/drilling/well-planning" element={<WellPlanning />} />
                              <Route path="apps/drilling/casing-tubing-design-pro" element={<ProtectedAppRoute appId="casing-tubing-design-pro" appName="Casing & Tubing Design Pro"><CasingTubingDesignPro /></ProtectedAppRoute>} />
                              <Route path="apps/drilling/casing-wear-analyzer" element={<CasingWearAnalyzer />} />
                              <Route path="apps/drilling/drilling-fluids-hydraulics" element={<DrillingFluidsHydraulics />} />
                              <Route path="apps/drilling/torque-drag-predictor" element={<TorqueDragPredictor />} />
                              <Route path="apps/drilling/cementing-simulation" element={<CementingSimulationApp />} />
                              <Route path="apps/drilling/frac-completion" element={<FracCompletionApp />} />
                              <Route path="apps/drilling/pore-pressure-fracture-gradient" element={<PorePressureFracGradient />} />
                              <Route path="apps/drilling/rto-dashboard" element={<RtoDashboard />} />
                              <Route path="apps/drilling/incident-finder" element={<OffsetWellIncidentFinder />} />
                              <Route path="apps/drilling/wellbore-stability-analyzer" element={<WellboreStabilityAnalyzer />} />
                              <Route path="apps/drilling/well-spacing-optimizer" element={<WellSpacingOptimizer />} />

                              <Route path="apps/production/surveillance-dashboard" element={<ProductionSurveillanceDashboard />} />
                              <Route path="apps/production/well-test-analyzer" element={<WellTestDataAnalyzer />} />
                              <Route path="apps/production/wellbore-flow-simulator" element={<WellboreFlowSimulator />} />
                              <Route path="apps/production/artificial-lift-designer" element={<ArtificialLiftDesigner />} />
                              <Route path="apps/production/flow-assurance-monitor" element={<FlowAssuranceMonitor />} />
                              <Route path="apps/production/integrated-asset-modeler" element={<IntegratedAssetModeler />} />
                              <Route path="apps/production/well-schematic-designer" element={<WellSchematicDesigner />} />
                              <Route path="apps/production/network-diagram-pro" element={<NetworkDiagramPro />} />

                              <Route path="apps/economics/project-management-pro" element={<ProjectManagementPro />} />
                              <Route path="apps/economics/afe-cost-control" element={<AfeCostControlManager />} />
                              <Route path="apps/economics/npv-scenario-builder" element={<NpvScenarioBuilder />} />
                              <Route path="apps/economics/fiscal-regime-designer" element={<FiscalRegimeDesigner />} />
                              <Route path="apps/economics/capital-portfolio-studio" element={<CapitalPortfolioStudio />} />
                              <Route path="apps/economics/fdp-accelerator" element={<FdpAccelerator />} />
                              <Route path="apps/economics/report-autopilot" element={<TechnicalReportAutopilot />} />
                              <Route path="apps/economics/breakeven-analyzer" element={<ProbabilisticBreakevenAnalyzer />} />
                              <Route path="apps/economics/voi-analyzer" element={<ValueOfInformationAnalyzer />} />
                              
                              <Route path="apps/economics/petroleum-economics-studio" element={<Navigate to="petroleum-economics-studio/projects" replace />} />
                              <Route path="apps/economics/petroleum-economics-studio/projects" element={<ProtectedAppRoute appId="petroleum-economics-studio" appName="Petroleum Economics Studio"><PetroleumEconomicsStudioProjects /></ProtectedAppRoute>} />
                              <Route path="apps/economics/petroleum-economics-studio/workspace/:projectId?" element={<PetroleumEconomicsStudioWorkspace />} />
                              <Route path="apps/economics/petroleum-economics-studio/templates" element={<PetroleumEconomicsStudioTemplates />} />
                              
                              <Route path="apps/economics/epe/cases" element={<EpeCaseList />} />
                              <Route path="apps/economics/epe/cases/:caseId" element={<EpeCaseDetail />} />
                              <Route path="apps/economics/epe/run/:runId" element={<EpeRunConsole />} />
                              <Route path="apps/economics/epe/results/:runId" element={<EpeResultsViewer />} />
                              <Route path="apps/economics/epe/compare" element={<EpeRunComparison />} />

                              <Route path="apps/facilities/pipeline-sizer" element={<PipelineSizer />} />
                              <Route path="apps/facilities/separator-slug-catcher-designer" element={<SeparatorSlugCatcherDesigner />} />
                              <Route path="apps/facilities/compressor-pump-pack" element={<CompressorPumpPack />} />
                              <Route path="apps/facilities/heat-exchanger-sizer" element={<HeatExchangerSizer />} />
                              <Route path="apps/facilities/gas-treating-dehydration" element={<GasTreatingDehydration />} />
                              <Route path="apps/facilities/relief-blowdown-sizer" element={<ReliefBlowdownSizer />} />
                              <Route path="apps/facilities/facility-network-hydraulics" element={<FacilityLayoutMapper />} />
                              <Route path="apps/facilities/facility-layout-mapper" element={<FacilityLayoutMapper />} />
                              <Route path="apps/facilities/corrosion-rate-predictor" element={<CorrosionRatePredictor />} />
                              
                              <Route path="my-projects" element={<MyProjects />} />
                            </Route>

                            <Route path="/profile" element={
                              <ProtectedRoute>
                                <Profile />
                              </ProtectedRoute>
                            }/>

                            <Route path="/solutions" element={<Solutions />} />
                            <Route path="/resources" element={<Resources />} />
                            <Route path="/nextgen" element={<NextGen />} />
                            <Route path="/about-us" element={<AboutUs />} />
                            <Route path="/careers" element={<Careers />} />
                            <Route path="/legal/terms-of-service" element={<TermsOfService />} />
                            <Route path="/legal/privacy-policy" element={<PrivacyPolicy />} />
                            <Route path="/legal/support" element={<Support />} />
                            <Route path="/legal/documentation" element={<Documentation />} />

                            <Route path="*" element={<Navigate to="/" replace />} />
                          </Routes>
                        </Suspense>
                      </div>
                    </AdminOrgProvider>
                  </WellCorrelationProvider>
                </ReservoirProvider>
              </StudioProvider>
            </ErrorBoundary>
          </AuthGuard>
          <Toaster />
        </IntegrationProvider>
      </HSEProvider>
    </AuthProvider>
  );
}

export default App;