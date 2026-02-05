import React from 'react';
    import { Helmet } from 'react-helmet';
    import { Link, useNavigate } from 'react-router-dom';
    import { motion } from 'framer-motion';
    import { Button } from '@/components/ui/button';
    import { ArrowLeft, ChevronRight, Layers, BarChart3, Anchor, Zap, Factory, Milestone } from 'lucide-react';

    const solutionCategories = [
      {
        name: 'Geoscience & Subsurface',
        icon: Layers,
        color: 'from-cyan-400 to-blue-500',
        path: '/dashboard/geoscience',
        description: 'Visualize, interpret, and model complex subsurface data with unparalleled speed and accuracy. From seismic to petrophysics, unlock a complete picture of your assets.',
        apps: ['EarthModel Studio', 'AI Log Digitizer', 'Well Correlation Panel', 'Seismic Interpretation'],
      },
      {
        name: 'Reservoir Management',
        icon: BarChart3,
        color: 'from-lime-400 to-green-500',
        path: '/dashboard/reservoir',
        description: 'Optimize reservoir performance with integrated tools for decline curve analysis, fluid characterization, waterflood monitoring, and material balance.',
        apps: ['Decline Curve Analysis', 'Fluid Systems Studio', 'Waterflood Dashboard', 'Reservoir Balance'],
      },
      {
        name: 'Drilling & Completions',
        icon: Anchor,
        color: 'from-red-500 to-orange-500',
        path: '/dashboard/drilling',
        description: 'Plan, execute, and optimize drilling operations with advanced tools for well planning, casing design, real-time optimization, and incident prevention.',
        apps: ['Well Planning', 'Casing & Tubing Design', 'Torque & Drag', 'RTO Dashboard'],
      },
      {
        name: 'Production Operations',
        icon: Zap,
        color: 'from-yellow-400 to-amber-500',
        path: '/dashboard/production',
        description: 'Maximize production and ensure asset integrity with a suite of tools for nodal analysis, artificial lift design, flow assurance, and well performance monitoring.',
        apps: ['Nodal Analysis Engine', 'Artificial Lift Designer', 'Flow Assurance Monitor', 'Well Schematic Designer'],
      },
      {
        name: 'Facilities Engineering',
        icon: Factory,
        color: 'from-blue-500 to-indigo-600',
        path: '/dashboard/facilities',
        description: 'Design, model, and manage surface facilities with precision. From pipeline sizing to relief systems, ensure your infrastructure is safe, efficient, and robust.',
        apps: ['Relief & Blowdown Sizing', 'Pipeline Sizer', 'Facility Layout Mapper', 'Corrosion Prediction'],
      },
      {
        name: 'Economics & Project Management',
        icon: Milestone,
        color: 'from-purple-500 to-indigo-600',
        path: '/dashboard/economic-project-management',
        description: 'Drive strategic decisions and maximize value with powerful tools for economic evaluation, capital portfolio optimization, AFE management, and FDP acceleration.',
        apps: ['Economic Planning Engine', 'Capital Portfolio Studio', 'AFE & Cost Control', 'FDP Accelerator'],
      },
    ];

    const Solutions = () => {
        const navigate = useNavigate();

        return (
            <>
                <Helmet>
                    <title>Solutions - Petrolord</title>
                    <meta name="description" content="Explore the integrated suite of solutions offered by Petrolord, covering the entire energy lifecycle from subsurface to strategy." />
                </Helmet>
                <div className="min-h-screen bg-gradient-to-b from-slate-900 to-green-950 text-slate-200">
                    <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 py-12">
                        <div className="absolute top-4 left-4">
                            <Button asChild variant="outline" className="bg-slate-800/50 border-slate-700 hover:bg-slate-700 backdrop-blur-sm">
                                <Link to="/">
                                    <ArrowLeft className="mr-2 h-4 w-4" />
                                    Back to Home
                                </Link>
                            </Button>
                        </div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8 }}
                            className="text-center my-12"
                        >
                            <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-white via-lime-200 to-green-300 bg-clip-text text-transparent mb-4">
                                Integrated Energy Solutions
                            </h1>
                            <p className="text-xl md:text-2xl text-slate-300 max-w-4xl mx-auto">
                                A unified platform connecting every discipline across the energy value chain, from pore to port.
                            </p>
                        </motion.div>

                        <div className="space-y-16 my-20">
                            {solutionCategories.map((category, index) => (
                                <motion.div
                                    key={category.name}
                                    initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.8, delay: 0.2 }}
                                    className="grid md:grid-cols-5 gap-8 items-center"
                                >
                                    <div className={`md:col-span-2 ${index % 2 !== 0 ? 'md:order-last' : ''}`}>
                                        <div className={`relative inline-block p-6 bg-slate-800/50 border border-slate-700 rounded-2xl`}>
                                             <div className={`absolute -inset-px bg-gradient-to-r ${category.color} rounded-2xl blur-lg opacity-20`}></div>
                                            <category.icon className="h-24 w-24 text-lime-300" />
                                        </div>
                                    </div>
                                    <div className="md:col-span-3">
                                        <h2 className={`text-4xl font-bold mb-4 bg-gradient-to-r ${category.color} bg-clip-text text-transparent`}>{category.name}</h2>
                                        <p className="text-slate-300 text-lg mb-6 leading-relaxed">{category.description}</p>
                                        <div className="flex flex-wrap gap-2 mb-6">
                                            {category.apps.map(app => (
                                                <span key={app} className="bg-slate-700 text-slate-300 text-xs font-medium px-2.5 py-1 rounded-full">{app}</span>
                                            ))}
                                        </div>
                                        <Button onClick={() => navigate(category.path)} className={`bg-gradient-to-r ${category.color} text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300`}>
                                            Explore {category.name.split(' ')[0]} Apps
                                            <ChevronRight className="ml-2 h-4 w-4" />
                                        </Button>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>
            </>
        );
    };

    export default Solutions;