import React from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { BrainCircuit, Rocket, Globe, Award, GraduationCap, Briefcase, UserCheck, User, Sparkles } from 'lucide-react';

import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import RegistrationForm from '@/components/nextgen/RegistrationForm';

const NextGen = () => {
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const programPillars = [
    {
      icon: BrainCircuit,
      title: 'Learn',
      description: 'Monthly digital workshops, free access to Petrolord content, and a structured skill roadmap from beginner to pro.',
    },
    {
      icon: Rocket,
      title: 'Build',
      description: 'Innovation challenges, hackathons, and collaborative projects using Petrolord APIs. Gain real-world experience.',
    },
    {
      icon: Globe,
      title: 'Connect',
      description: 'Network with industry leaders, alumni, and partner companies. Join the annual NextGen Energy Summit.',
    },
    {
      icon: Award,
      title: 'Lead',
      description: 'Leadership development tracks, represent Petrolord at global forums, and earn recognition for your innovations.',
    },
  ];

  const membershipTiers = [
    {
      icon: GraduationCap,
      title: 'Student Member',
      description: 'For undergraduates & recent graduates. Access training, webinars, and competitions.',
    },
    {
      icon: Briefcase,
      title: 'NextGen Fellow',
      description: 'For advanced members & project contributors. Receive mentorship, certification, and access to innovation labs.',
    },
    {
      icon: UserCheck,
      title: 'Ambassador',
      description: 'University or regional leaders. Represent Petrolord, organize events, and recruit members.',
    },
    {
      icon: User,
      title: 'Mentor/Advisor',
      description: 'Industry experts & Lordsway professionals. Guide projects and host knowledge sessions.',
    },
  ];

  return (
    <>
      <Helmet>
        <title>Petrolord NextGen - Empowering the Future of Energy</title>
        <meta name="description" content="Join Petrolord NextGen to empower young minds with the knowledge, skills, and digital tools to transform the energy industry." />
      </Helmet>
      <div className="min-h-screen bg-gradient-to-b from-slate-900 to-green-950 text-slate-200">
        <Header />
        <main>
          {/* Hero Section */}
          <motion.section
            className="relative container mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16 text-center overflow-hidden"
            initial="hidden"
            animate="visible"
            variants={fadeIn}
          >
             <Sparkles className="absolute top-1/4 left-1/4 w-32 h-32 text-lime-500/20 animate-pulse" />
             <Sparkles className="absolute bottom-1/4 right-1/4 w-32 h-32 text-cyan-500/20 animate-pulse delay-300" />
            <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-lime-300 via-green-400 to-cyan-400 bg-clip-text text-transparent mb-4">
              Petrolord NextGen
            </h1>
            <p className="text-xl md:text-2xl text-slate-300 max-w-4xl mx-auto">
              Building Africa’s Next Generation of Energy Innovators.
            </p>
          </motion.section>

          {/* Mission & Vision Section */}
          <motion.section
            className="container mx-auto px-4 sm:px-6 lg:px-8 py-16"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={staggerContainer}
          >
            <div className="grid md:grid-cols-2 gap-12">
              <motion.div variants={fadeIn}>
                <h2 className="text-3xl font-bold text-lime-400 mb-4">Our Mission</h2>
                <p className="text-slate-300 text-lg">
                  To empower young minds with the knowledge, skills, and digital tools to transform the energy industry through innovation, technology, and collaboration — nurturing a new generation of professionals equipped for a sustainable and data-driven energy future.
                </p>
              </motion.div>
              <motion.div variants={fadeIn}>
                <h2 className="text-3xl font-bold text-cyan-400 mb-4">Our Vision</h2>
                <p className="text-slate-300 text-lg">
                  To be the leading youth innovation platform advancing Africa’s energy technology evolution — cultivating the thinkers, developers, and leaders of tomorrow’s digital oil and gas ecosystem.
                </p>
              </motion.div>
            </div>
          </motion.section>

          {/* Program Pillars Section */}
          <section className="py-20 bg-slate-900/30">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <motion.h2
                className="text-4xl font-bold text-center mb-12 bg-gradient-to-r from-lime-300 to-cyan-400 bg-clip-text text-transparent"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.5 }}
                variants={fadeIn}
              >
                Program Pillars
              </motion.h2>
              <motion.div
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.2 }}
                variants={staggerContainer}
              >
                {programPillars.map((pillar, index) => (
                  <motion.div key={index} variants={fadeIn}>
                    <Card className="bg-slate-800/50 border-slate-700 h-full text-center hover:border-lime-400 transition-colors duration-300 transform hover:-translate-y-2">
                      <CardHeader>
                        <div className="mx-auto bg-slate-700/50 rounded-full p-4 w-fit mb-4">
                          <pillar.icon className="w-10 h-10 text-lime-400" />
                        </div>
                        <CardTitle className="text-2xl text-slate-100">{pillar.title}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-slate-400">{pillar.description}</p>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </section>

          {/* Membership Section */}
          <section className="py-20">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <motion.h2
                className="text-4xl font-bold text-center mb-12 bg-gradient-to-r from-lime-300 to-cyan-400 bg-clip-text text-transparent"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.5 }}
                variants={fadeIn}
              >
                Membership Tiers
              </motion.h2>
              <motion.div
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.2 }}
                variants={staggerContainer}
              >
                {membershipTiers.map((tier, index) => (
                  <motion.div key={index} variants={fadeIn}>
                    <Card className="bg-slate-800/50 border-slate-700 h-full text-center hover:border-cyan-400 transition-colors duration-300 transform hover:-translate-y-2">
                      <CardHeader>
                        <div className="mx-auto bg-slate-700/50 rounded-full p-4 w-fit mb-4">
                          <tier.icon className="w-10 h-10 text-cyan-400" />
                        </div>
                        <CardTitle className="text-2xl text-slate-100">{tier.title}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-slate-400">{tier.description}</p>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </section>

          {/* Registration Section */}
          <section id="register" className="py-20 bg-slate-900/30">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <motion.div
                className="max-w-3xl mx-auto"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.3 }}
                variants={fadeIn}
              >
                <Card className="bg-slate-800/70 border-slate-700 p-4 sm:p-8 shadow-2xl shadow-lime-500/10">
                  <CardHeader className="text-center">
                    <CardTitle className="text-4xl font-bold bg-gradient-to-r from-lime-300 to-cyan-400 bg-clip-text text-transparent">
                      Join the Movement
                    </CardTitle>
                    <p className="text-slate-400 mt-2">Become a part of Africa's energy revolution. Register now!</p>
                  </CardHeader>
                  <CardContent>
                    <RegistrationForm />
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </section>
        </main>
        <Footer />
      </div>
    </>
  );
};

export default NextGen;