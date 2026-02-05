import React from 'react';
    import { Helmet } from 'react-helmet';
    import { Link } from 'react-router-dom';
    import { motion } from 'framer-motion';
    import { Button } from '@/components/ui/button';
    import { ArrowLeft, Target, Eye, Building } from 'lucide-react';

    const AboutUs = () => {
      return (
        <>
          <Helmet>
            <title>About Us - Petrolord</title>
            <meta name="description" content="Learn about the mission, vision, and team behind Petrolord, the digital operating system for the modern energy enterprise." />
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
                <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-white via-lime-100 to-orange-100 bg-clip-text text-transparent mb-4">
                  About Petrolord
                </h1>
                <p className="text-xl md:text-2xl text-slate-300 max-w-3xl mx-auto">
                  Pioneering the digital future of the energy industry, one workflow at a time.
                </p>
              </motion.div>

              <div className="grid md:grid-cols-2 gap-8 my-16 items-center">
                <motion.div
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                >
                  <h2 className="text-4xl font-bold text-lime-300 mb-4 flex items-center"><Target className="mr-3 h-10 w-10" /> Our Mission</h2>
                  <p className="text-slate-300 text-lg leading-relaxed">
                    To empower energy professionals with a unified, intelligent, and intuitive digital operating system. We aim to break down data silos, accelerate decision-making, and unlock new levels of efficiency and value creation across the entire energy lifecycle.
                  </p>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8, delay: 0.4 }}
                >
                  <h2 className="text-4xl font-bold text-orange-300 mb-4 flex items-center"><Eye className="mr-3 h-10 w-10" /> Our Vision</h2>
                  <p className="text-slate-300 text-lg leading-relaxed">
                    To be the indispensable platform that powers the global energy transition, enabling companies to operate more sustainably, profitably, and strategically in an ever-evolving landscape.
                  </p>
                </motion.div>
              </div>

              <motion.div 
                className="my-20 bg-slate-800/50 border border-slate-700 rounded-xl p-8 md:p-12 shadow-2xl"
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7 }}
              >
                <h2 className="text-4xl font-bold text-center text-lime-300 mb-8 flex items-center justify-center"><Building className="mr-3 h-10 w-10" /> Our Story</h2>
                <p className="text-slate-300 text-lg max-w-4xl mx-auto leading-relaxed text-center">
                  Founded by Lordsway Energy, Petrolord was born from a deep understanding of the challenges and opportunities within the energy sector. We saw brilliant engineers and geoscientists hampered by fragmented software and disconnected data. Our journey began with a simple question: "What if we could build a single, cohesive platform that connects every discipline?" Today, Petrolord is the answer—a comprehensive suite of applications designed by industry experts, for industry experts.
                </p>
              </motion.div>
            </div>
          </div>
        </>
      );
    };

    export default AboutUs;