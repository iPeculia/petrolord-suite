import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ChevronRight, Shield, Activity, Lock, Users } from 'lucide-react';

const HSEInfoCard = () => {
  return (
    <section className="py-12 px-6 bg-slate-900">
      <div className="container mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="relative bg-gradient-to-br from-[#1a1a2e] to-[#0f3a4a] border border-cyan-500/30 rounded-2xl overflow-hidden shadow-[0_0_40px_-10px_rgba(6,182,212,0.3)] group hover:shadow-[0_0_60px_-10px_rgba(6,182,212,0.5)] transition-all duration-500"
        >
          {/* Background Glow Effects */}
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-cyan-500/10 blur-[120px] rounded-full pointer-events-none mix-blend-screen"></div>
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-600/10 blur-[100px] rounded-full pointer-events-none mix-blend-screen"></div>

          <div className="relative z-10 flex flex-col p-8 md:p-12 gap-8">
            
            {/* Title Section */}
            <div className="flex flex-col gap-2">
              <h2 className="text-4xl md:text-5xl font-bold text-white tracking-tight">
                Petrolord HSE
              </h2>
              <div className="h-1 w-24 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full"></div>
            </div>

            <div className="flex flex-col md:flex-row items-center gap-10">
              {/* Left Content */}
              <div className="flex-1 space-y-8">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-gradient-to-br from-cyan-500/20 to-blue-600/20 rounded-xl border border-cyan-500/30 text-cyan-400 shadow-inner">
                    <Shield className="w-8 h-8 drop-shadow-[0_0_8px_rgba(34,211,238,0.5)]" />
                  </div>
                  <Badge className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white border-none px-4 py-1.5 text-xs font-bold tracking-wide shadow-lg shadow-cyan-900/50">
                    100% FREE TO START
                  </Badge>
                </div>

                <div className="space-y-3">
                  <h3 className="text-3xl font-bold text-white leading-tight">
                    Integrated HSSE Management
                  </h3>
                  <p className="text-xl md:text-2xl text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-blue-300 font-light">
                    for the Modern Energy Enterprise
                  </p>
                </div>

                <p className="text-lg text-slate-300 leading-relaxed max-w-2xl font-medium">
                  Petrolord HSE is the complete digital platform to manage health, safety, security, and environment workflows. 
                  Streamline compliance, reduce risk, and build a safer future today.
                </p>

                <div className="flex flex-wrap gap-6 pt-2">
                  <div className="flex items-center gap-2.5 px-3 py-2 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
                    <Activity className="w-5 h-5 text-orange-500" />
                    <span className="text-sm font-semibold text-slate-200">Incident Reporting</span>
                  </div>
                  <div className="flex items-center gap-2.5 px-3 py-2 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
                    <Lock className="w-5 h-5 text-yellow-400" />
                    <span className="text-sm font-semibold text-slate-200">Permit to Work</span>
                  </div>
                  <div className="flex items-center gap-2.5 px-3 py-2 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
                    <Users className="w-5 h-5 text-emerald-400" />
                    <span className="text-sm font-semibold text-slate-200">Audit & Inspection</span>
                  </div>
                </div>

                <div className="pt-4">
                  <Button 
                    size="lg"
                    className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold text-lg px-8 py-6 h-auto shadow-lg shadow-orange-900/30 hover:shadow-orange-900/50 transition-all duration-300 group-hover:scale-[1.02] border-t border-white/20"
                    onClick={() => window.location.href = 'https://hse.petrolord.com'}
                  >
                    Explore HSE
                    <ChevronRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </div>
              </div>

              {/* Right Visual */}
              <div className="w-full md:w-1/3 flex justify-center items-center">
                <div className="relative">
                  <div className="absolute inset-0 bg-cyan-400/20 blur-[50px] rounded-full animate-pulse-slow"></div>
                  <Shield className="w-48 h-48 md:w-64 md:h-64 text-slate-900/50 fill-cyan-500/10 stroke-cyan-400 drop-shadow-[0_0_15px_rgba(34,211,238,0.3)]" strokeWidth={0.5} />
                  <div className="absolute inset-0 flex items-center justify-center">
                     <Activity className="w-24 h-24 text-cyan-300 drop-shadow-[0_0_10px_rgba(34,211,238,0.8)]" strokeWidth={1.5} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default HSEInfoCard;