import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { useGuidedMode } from '../../../contexts/GuidedModeContext';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { HelpCircle, FileText, MapPin, Database, Layers, BarChart, FilePlus, FolderOpen, AlertCircle, CheckCircle, X, Loader2, ChevronsRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useToast } from '@/components/ui/use-toast';
import { useNavigate } from 'react-router-dom';

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.1,
      duration: 0.5,
      ease: "easeOut"
    }
  })
};

const analysisTypes = [
  { id: '1D', name: '1D Analysis', description: 'Standard vertical well analysis.', icon: BarChart, enabled: true, features: ['Layered rock properties', 'Vertical stress profile', 'Wellbore stability window'] },
  { id: '2D', name: '2D Analysis', description: 'For deviated wells or complex geology.', icon: Layers, enabled: false, features: ['Cross-sectional modeling', 'Fault-block analysis', 'Trajectory optimization'] },
  { id: '3D', name: '3D Analysis', description: 'Full 3D geomechanical modeling.', icon: Database, enabled: false, features: ['Field-wide stress mapping', 'Reservoir compaction effects', 'Multiple well interaction'] },
];

const quickStartOptions = [
    { id: 'scratch', name: 'Start from Scratch', description: 'Begin with a blank slate and enter all parameters manually.', icon: FilePlus },
    { id: 'template', name: 'Start from Template', description: 'Use a predefined template for a common scenario (e.g., Deepwater GOM).', icon: FileText },
    { id: 'load', name: 'Load Previous Project', description: 'Load data and settings from a previously saved MEM project.', icon: FolderOpen },
]

const WelcomeStep = () => {
    const { state, dispatch } = useGuidedMode();
    const { toast } = useToast();
    const navigate = useNavigate();
    const { projectDetails, quickStartOption, validation, calculationStatus } = state;
    const [localProjectDetails, setLocalProjectDetails] = useState(state.projectDetails);
    const [errors, setErrors] = useState({});
    const isSaving = calculationStatus === 'saving';

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        const [section, field] = name.split('.');
        if (field) {
            setLocalProjectDetails(prev => ({ ...prev, [section]: { ...prev[section], [field]: value } }));
        } else {
            setLocalProjectDetails(prev => ({ ...prev, [name]: value }));
        }
    };
    
    const handleSelectChange = (name, value) => {
         const [section, field] = name.split('.');
         if (field) {
            setLocalProjectDetails(prev => ({ ...prev, [section]: { ...prev[section], [field]: value } }));
         } else {
            setLocalProjectDetails(prev => ({ ...prev, [name]: value }));
         }
    };
    
    const handleQuickStart = (action) => {
        dispatch({type: 'SET_QUICK_START_OPTION', payload: action});
        if (action !== 'scratch') {
            toast({
                title: "🚧 Feature Not Implemented",
                description: "This quick-start option isn't available yet. Starting from scratch.",
            });
            dispatch({type: 'SET_QUICK_START_OPTION', payload: 'scratch'});
        }
    }

    const validateForm = useCallback(() => {
        const newErrors = {};
        if (!localProjectDetails.projectName || localProjectDetails.projectName.trim().length < 3) newErrors.projectName = 'Project name must be at least 3 characters.';
        if (!localProjectDetails.wellName || localProjectDetails.wellName.trim().length === 0) newErrors.wellName = 'Well name is required.';
        if (!localProjectDetails.maxDepth || isNaN(Number(localProjectDetails.maxDepth)) || Number(localProjectDetails.maxDepth) <= 0) newErrors.maxDepth = 'Depth must be a positive number.';
        if (!localProjectDetails.formation.name || localProjectDetails.formation.name.trim().length === 0) newErrors.formationName = 'Formation name is required.';
        if (localProjectDetails.formation.topDepth === null || localProjectDetails.formation.topDepth === '' || isNaN(Number(localProjectDetails.formation.topDepth)) || Number(localProjectDetails.formation.topDepth) < 0) newErrors.formationTopDepth = 'Top depth must be a non-negative number.';
        if (!localProjectDetails.formation.bottomDepth || isNaN(Number(localProjectDetails.formation.bottomDepth)) || Number(localProjectDetails.formation.bottomDepth) <= 0) newErrors.formationBottomDepth = 'Base depth must be a positive number.';
        if (Number(localProjectDetails.formation.topDepth) >= Number(localProjectDetails.formation.bottomDepth)) newErrors.formationDepthRange = 'Base depth must be greater than top depth.';
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    }, [localProjectDetails]);

    useEffect(() => {
        const isValid = validateForm();
        if (state.validation[0] !== isValid) {
            dispatch({ type: 'SET_VALIDATION', payload: { step: 0, isValid } });
        }
    }, [localProjectDetails, validateForm, state.validation, dispatch]);

    const handleNext = () => {
        dispatch({ type: 'UPDATE_PROJECT_DETAILS', payload: localProjectDetails });
        if (validateForm()) {
            dispatch({type: 'SET_CALCULATION_STATUS', payload: 'saving'});
            setTimeout(() => {
                dispatch({type: 'SET_CALCULATION_STATUS', payload: 'idle'});
                dispatch({type: 'NEXT_STEP' });
                toast({ title: "Project Initialized", description: "Your project settings have been saved." });
            }, 1000);
        }
    };
    
    const FieldWrapper = ({ children, className }) => <div className={`flex flex-col gap-2 ${className}`}>{children}</div>;

    const InputField = ({ id, name, label, value, placeholder, icon, tooltip, error, type = 'text', maxLength }) => (
        <FieldWrapper>
            <div className="flex items-center justify-between">
                <Label htmlFor={id} className="text-slate-300 font-semibold">{label}</Label>
                {tooltip && <TooltipProvider><Tooltip><TooltipTrigger asChild><HelpCircle className="h-4 w-4 text-slate-500 cursor-help" /></TooltipTrigger><TooltipContent><p>{tooltip}</p></TooltipContent></Tooltip></TooltipProvider>}
            </div>
            <div className="relative">
                {icon && <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">{icon}</div>}
                <Input id={id} name={name} type={type} value={value || ''} onChange={handleInputChange} placeholder={placeholder} className={`bg-slate-900 border-slate-600 ${icon ? 'pl-10' : ''} ${error ? 'border-red-500 focus-visible:ring-red-500' : ''}`} maxLength={maxLength} />
            </div>
            <AnimatePresence>{error && <motion.p initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="text-sm text-red-400 flex items-center gap-1"><AlertCircle className="h-4 w-4" /> {error}</motion.p>}</AnimatePresence>
        </FieldWrapper>
    );
    
    const SelectField = ({ id, name, label, value, placeholder, items, tooltip, error }) => (
        <FieldWrapper>
             <div className="flex items-center justify-between">
                <Label htmlFor={id} className="text-slate-300 font-semibold">{label}</Label>
                {tooltip && <TooltipProvider><Tooltip><TooltipTrigger asChild><HelpCircle className="h-4 w-4 text-slate-500 cursor-help" /></TooltipTrigger><TooltipContent><p>{tooltip}</p></TooltipContent></Tooltip></TooltipProvider>}
            </div>
            <Select name={name} value={value} onValueChange={(v) => handleSelectChange(name,v)}>
                <SelectTrigger className={`w-full bg-slate-900 border-slate-600 ${error ? 'border-red-500 focus-visible:ring-red-500' : ''}`}><SelectValue placeholder={placeholder} /></SelectTrigger>
                <SelectContent className="bg-slate-800 text-white border-slate-700">{items.map(item => <SelectItem key={item} value={item}>{item}</SelectItem>)}</SelectContent>
            </Select>
            <AnimatePresence>{error && <motion.p initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="text-sm text-red-400 flex items-center gap-1"><AlertCircle className="h-4 w-4" /> {error}</motion.p>}</AnimatePresence>
        </FieldWrapper>
    );

    return (
        <div className="h-full w-full max-w-7xl mx-auto">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center mb-8">
                <h1 className="text-3xl font-bold text-white tracking-tight">Project Setup</h1>
                <p className="mt-2 text-lg text-slate-400">Define the scope and details of your new Mechanical Earth Model.</p>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    <motion.div custom={0} initial="hidden" animate="visible" variants={cardVariants}>
                        <Card className="bg-slate-800/50 border-slate-700">
                            <CardHeader><CardTitle className="text-xl text-white">Project & Well Details</CardTitle></CardHeader>
                            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                                <InputField id="project-name" name="projectName" label="Project Name" value={localProjectDetails.projectName} onChange={handleInputChange} placeholder="e.g., Prospect Alpha" icon={<FileText className="h-4 w-4" />} tooltip="A unique name for this project." error={errors.projectName} />
                                <InputField id="well-name" name="wellName" label="Well Name" value={localProjectDetails.wellName} onChange={handleInputChange} placeholder="e.g., Well-1" icon={<FileText className="h-4 w-4" />} tooltip="The name of the well to be analyzed." error={errors.wellName} />
                                <FieldWrapper className="md:col-span-2">
                                     <Label htmlFor="description" className="text-slate-300 font-semibold">Description (Optional)</Label>
                                     <Textarea id="description" name="description" placeholder="Briefly describe project objectives, location, or other relevant details..." value={localProjectDetails.description} onChange={handleInputChange} className="bg-slate-900 border-slate-600" maxLength={250} />
                                     <p className="text-xs text-slate-500 text-right">{localProjectDetails.description?.length || 0} / 250</p>
                                </FieldWrapper>
                                <InputField id="location" name="location" label="Location (Optional)" value={localProjectDetails.location} onChange={handleInputChange} placeholder="e.g., Block 21, North Sea" icon={<MapPin className="h-4 w-4" />} tooltip="The geographical location or field name." />
                                 <FieldWrapper>
                                     <Label htmlFor="depth" className="text-slate-300 font-semibold">Total Well Depth</Label>
                                    <div className="flex gap-2">
                                        <InputField id="depth" name="maxDepth" value={localProjectDetails.maxDepth} onChange={handleInputChange} placeholder="e.g., 4500" type="number" error={errors.maxDepth} />
                                        <Select name="depthUnit" value={localProjectDetails.depthUnit} onValueChange={(v) => handleSelectChange('depthUnit', v)}>
                                            <SelectTrigger className="w-[80px] bg-slate-900 border-slate-600"><SelectValue /></SelectTrigger>
                                            <SelectContent className="bg-slate-800 text-white border-slate-700"><SelectItem value="m">m</SelectItem><SelectItem value="ft">ft</SelectItem></SelectContent>
                                        </Select>
                                    </div>
                                </FieldWrapper>
                            </CardContent>
                        </Card>
                    </motion.div>
                     <motion.div custom={1} initial="hidden" animate="visible" variants={cardVariants}>
                        <Card className="bg-slate-800/50 border-slate-700">
                             <CardHeader><CardTitle className="text-xl text-white">Zone of Interest</CardTitle><CardDescription>Define the primary formation for analysis.</CardDescription></CardHeader>
                             <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                                <InputField id="formation-name" name="formation.name" label="Formation Name" value={localProjectDetails.formation.name} onChange={handleInputChange} placeholder="e.g., Viking Formation" error={errors.formationName} tooltip="The stratigraphic name of the formation." />
                                <SelectField id="formation-type" name="formation.type" label="Formation Type" value={localProjectDetails.formation.type} onValueChange={(v) => handleSelectChange('formation.type', v)} items={['Sandstone', 'Shale', 'Carbonate', 'Mixed Lithology']} placeholder="Select formation type" tooltip="The dominant lithology." />
                                <FieldWrapper>
                                     <Label className="text-slate-300 font-semibold">Formation Depth Range (MD)</Label>
                                    <div className="flex gap-2 items-start">
                                        <InputField id="top-depth" name="formation.topDepth" value={localProjectDetails.formation.topDepth} onChange={handleInputChange} placeholder="Top" type="number" error={errors.formationTopDepth} />
                                        <InputField id="base-depth" name="formation.bottomDepth" value={localProjectDetails.formation.bottomDepth} onChange={handleInputChange} placeholder="Base" type="number" error={errors.formationBottomDepth} />
                                    </div>
                                    <AnimatePresence>{errors.formationDepthRange && <motion.p initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="text-sm text-red-400 flex items-center gap-1"><AlertCircle className="h-4 w-4" /> {errors.formationDepthRange}</motion.p>}</AnimatePresence>
                                </FieldWrapper>
                             </CardContent>
                        </Card>
                    </motion.div>
                </div>
                {/* Right Column */}
                <div className="lg:col-span-1 space-y-6">
                     <motion.div custom={2} initial="hidden" animate="visible" variants={cardVariants}>
                        <Card className="bg-slate-800/50 border-slate-700">
                             <CardHeader><CardTitle className="text-xl text-white">Analysis Type</CardTitle></CardHeader>
                             <CardContent className="space-y-3">
                                {analysisTypes.map(type => (
                                    <motion.div key={type.id} whileHover={type.enabled ? { scale: 1.02 } : {}} whileTap={type.enabled ? { scale: 0.98 } : {}}>
                                        <button onClick={() => localProjectDetails.analysisType !== type.id && handleSelectChange('analysisType', type.id)} disabled={!type.enabled} className={`w-full p-4 border-2 rounded-lg text-left transition-all duration-200 ${localProjectDetails.analysisType === type.id ? 'bg-blue-600/20 border-blue-500' : 'bg-slate-900/50 border-slate-700 hover:border-slate-500'} ${!type.enabled ? 'opacity-50 cursor-not-allowed' : ''}`}>
                                            <div className="flex justify-between items-center mb-2">
                                                <div className="flex items-center"><type.icon className="h-5 w-5 mr-3 text-blue-400" /> <h3 className="font-bold text-slate-100">{type.name}</h3></div>
                                                {!type.enabled && <span className="text-xs bg-yellow-600/50 text-yellow-300 px-2 py-1 rounded-full">Coming Soon</span>}
                                                {localProjectDetails.analysisType === type.id && <CheckCircle className="h-5 w-5 text-green-400" />}
                                            </div>
                                            <p className="text-sm text-slate-400 ml-8">{type.description}</p>
                                        </button>
                                    </motion.div>
                                ))}
                            </CardContent>
                        </Card>
                    </motion.div>
                    <motion.div custom={3} initial="hidden" animate="visible" variants={cardVariants}>
                        <Card className="bg-slate-800/50 border-slate-700">
                            <CardHeader><CardTitle className="text-xl text-white">Quick Start</CardTitle></CardHeader>
                            <CardContent className="space-y-3">
                                {quickStartOptions.map(opt => (
                                    <Button key={opt.id} variant={quickStartOption === opt.id ? "secondary" : "outline"} className="w-full justify-start bg-slate-700/50 hover:bg-slate-700" onClick={() => handleQuickStart(opt.id)}>
                                        <opt.icon className={`h-5 w-5 mr-3 ${quickStartOption === opt.id ? 'text-blue-300' : 'text-blue-400'}`} />
                                        <div className='text-left'><p>{opt.name}</p><p className='text-xs text-slate-400 font-normal'>{opt.description}</p></div>
                                        {quickStartOption === opt.id && <CheckCircle className="h-5 w-5 text-green-400 ml-auto" />}
                                    </Button>
                                ))}
                            </CardContent>
                        </Card>
                    </motion.div>
                </div>
            </div>
             <div className="flex justify-between items-center mt-8 pt-4 border-t border-slate-700">
                <Button variant="ghost" onClick={() => navigate('/dashboard/geoscience/mechanical-earth-model')}>
                    <X className="h-4 w-4 mr-2" />
                    Cancel
                </Button>
                <Button onClick={handleNext} disabled={!validation[0] || isSaving}>
                    {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <ChevronsRight className="mr-2 h-4 w-4" /> }
                    {isSaving ? 'Saving...' : 'Next Step: Data Upload'}
                </Button>
            </div>
        </div>
    );
};

export default WelcomeStep;