import React, { useState } from 'react';
    import { Helmet } from 'react-helmet';
    import { Link } from 'react-router-dom';
    import { motion } from 'framer-motion';
    import { Button } from '@/components/ui/button';
    import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from '@/components/ui/card';
    import { ArrowLeft, Briefcase, MapPin, BrainCircuit } from 'lucide-react';
    import ApplicationForm from '@/components/company/ApplicationForm';

    const jobOpenings = [
      {
        title: 'Senior Reservoir Engineer',
        location: 'Houston, TX (Remote)',
        department: 'Reservoir Management',
        description: 'Lead complex reservoir simulation and modeling projects. Drive innovation in our next-gen reservoir engineering tools.',
      },
      {
        title: 'Lead Frontend Developer (React)',
        location: 'Global (Remote)',
        department: 'Software Engineering',
        description: 'Architect and build beautiful, high-performance user interfaces for our suite of energy applications using React, Vite, and TailwindCSS.',
      },
      {
        title: 'Petroleum Data Scientist',
        location: 'Calgary, AB (Hybrid)',
        department: 'Geoscience & AI',
        description: 'Apply machine learning and AI techniques to solve complex subsurface challenges. Develop predictive models for drilling and production optimization.',
      },
      {
        title: 'Cloud Infrastructure Engineer',
        location: 'London, UK (Remote)',
        department: 'Platform & Infrastructure',
        description: 'Design, build, and maintain the scalable cloud infrastructure that powers the entire Petrolord ecosystem on Supabase and related cloud tech.',
      },
    ];

    const Careers = () => {
      const [isFormOpen, setIsFormOpen] = useState(false);
      const [selectedJob, setSelectedJob] = useState('');

      const handleApplyClick = (jobTitle) => {
        setSelectedJob(jobTitle);
        setIsFormOpen(true);
      };

      const handleCloseForm = () => {
        setIsFormOpen(false);
        setSelectedJob('');
      };
      
      return (
        <>
          <Helmet>
            <title>Careers - Petrolord</title>
            <meta name="description" content="Join the team at Lordsway Energy and help build the future of the energy industry with the Petrolord platform." />
          </Helmet>
          <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-900 to-green-950 text-slate-200">
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
                  Shape the Future of Energy
                </h1>
                <p className="text-xl md:text-2xl text-slate-300 max-w-3xl mx-auto">
                  Join Lordsway Energy and be part of a team that's revolutionizing an industry. We're looking for passionate innovators and problem-solvers.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: 0.2 }}
                className="my-16"
              >
                <h2 className="text-4xl font-bold text-center text-lime-300 mb-12 flex items-center justify-center">
                  <Briefcase className="mr-3 h-10 w-10" />
                  Current Openings
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {jobOpenings.map((job, index) => (
                    <Card key={index} className="bg-slate-800/60 border-slate-700 flex flex-col transform hover:scale-105 hover:border-lime-400 transition-all duration-300 shadow-lg">
                      <CardHeader>
                        <CardTitle className="text-2xl text-lime-400">{job.title}</CardTitle>
                        <CardDescription className="flex items-center space-x-4 pt-2">
                          <span className="flex items-center"><BrainCircuit className="mr-2 h-4 w-4 text-slate-400"/>{job.department}</span>
                          <span className="flex items-center"><MapPin className="mr-2 h-4 w-4 text-slate-400"/>{job.location}</span>
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="flex-grow">
                        <p className="text-slate-300">{job.description}</p>
                      </CardContent>
                      <CardFooter>
                        <Button onClick={() => handleApplyClick(job.title)} className="w-full bg-gradient-to-r from-lime-500 to-green-600 hover:from-lime-600 hover:to-green-700 text-slate-900 font-bold">
                          Apply Now
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: 0.4 }}
                className="text-center my-20"
              >
                <h3 className="text-2xl font-bold text-white">Don't see your perfect role?</h3>
                <p className="text-slate-400 mt-2 mb-4">We're always looking for exceptional talent. Send us your resume!</p>
                <Button onClick={() => handleApplyClick('General Application')} size="lg" variant="outline" className="border-lime-400 text-lime-400 hover:bg-lime-400 hover:text-slate-900">
                  Submit a General Application
                </Button>
              </motion.div>

            </div>
          </div>
          <ApplicationForm isOpen={isFormOpen} onClose={handleCloseForm} jobTitle={selectedJob} />
        </>
      );
    };

    export default Careers;