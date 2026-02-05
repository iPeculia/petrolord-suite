import React from 'react';
import { Helmet } from 'react-helmet';
import { Clock, Route, Thermometer, Layers, AlertTriangle } from 'lucide-react';

const BasinFlowGenesis = () => {
  return (
    <>
      <Helmet>
        <title>BasinFlow Genesis - Coming Soon</title>
        <meta name="description" content="Future home of our advanced petroleum systems modeling application, BasinFlow Genesis." />
      </Helmet>
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 text-white p-6">
        <div className="text-center max-w-4xl">
          <div className="mb-8">
            <Route className="w-24 h-24 text-cyan-400 mx-auto animate-pulse" />
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-500">
            BasinFlow Genesis
          </h1>
          <p className="text-2xl text-slate-300 mb-8">Petroleum Systems Modeling is Under Construction</p>
          
          <div className="p-8 bg-slate-800/50 rounded-2xl border border-slate-700 backdrop-blur-sm">
            <div className="flex items-center justify-center text-lg text-amber-400 mb-6">
              <AlertTriangle className="w-6 h-6 mr-3" />
              <p>This powerful new application is currently in development.</p>
            </div>
            <p className="text-slate-400 text-lg mb-8">
              Soon, you'll be able to simulate the complete lifecycle of a petroleum system—from source rock maturation and hydrocarbon generation to migration pathways and final accumulation. Get ready to de-risk exploration and unlock new opportunities.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
              <div className="flex flex-col items-center p-4 rounded-lg bg-slate-700/50">
                <Thermometer className="w-10 h-10 mb-3 text-red-400" />
                <h3 className="text-xl font-semibold">Thermal Modeling</h3>
                <p className="text-slate-400 mt-2 text-sm">Model burial history and heat flow to predict source rock maturity.</p>
              </div>
              <div className="flex flex-col items-center p-4 rounded-lg bg-slate-700/50">
                <Layers className="w-10 h-10 mb-3 text-green-400" />
                <h3 className="text-xl font-semibold">Migration Pathways</h3>
                <p className="text-slate-400 mt-2 text-sm">Simulate primary and secondary migration to predict charge routes.</p>
              </div>
              <div className="flex flex-col items-center p-4 rounded-lg bg-slate-700/50">
                <Clock className="w-10 h-10 mb-3 text-blue-400" />
                <h3 className="text-xl font-semibold">Timing & Accumulation</h3>
                <p className="text-slate-400 mt-2 text-sm">Analyze the timing of trap formation relative to hydrocarbon charge.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default BasinFlowGenesis;