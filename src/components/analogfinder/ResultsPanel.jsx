import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Download, FileText, Globe, Brain, Database } from 'lucide-react';

const ResultsPanel = ({ 
  results, 
  downloadCSV, 
  downloadJSON 
}) => {
  const aiGeneratedCount = results.analogs.filter(a => a.aiGenerated).length;
  const databaseCount = results.analogs.length - aiGeneratedCount;

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-6"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">Ranked Analog Fields</h2>
          <div className="flex space-x-2">
            <Button
              onClick={downloadCSV}
              variant="outline"
              size="sm"
              className="border-lime-400/50 text-lime-300 hover:bg-lime-500/20"
            >
              <Download className="w-4 h-4 mr-2" />
              CSV
            </Button>
            <Button
              onClick={downloadJSON}
              variant="outline"
              size="sm"
              className="border-lime-400/50 text-lime-300 hover:bg-lime-500/20"
            >
              <FileText className="w-4 h-4 mr-2" />
              JSON
            </Button>
          </div>
        </div>

        <div className="bg-white/5 rounded-lg p-4 mb-6">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
            <div>
              <p className="text-lime-300">Search Scope</p>
              <p className="text-white font-medium">
                {results.searchCriteria.maxSearchDistance === 'global' 
                  ? 'Global' 
                  : `${results.searchCriteria.maxSearchDistance} km radius`}
              </p>
            </div>
            <div>
              <p className="text-lime-300">Field Location</p>
              <p className="text-white font-medium">
                {results.searchCriteria.latitude && results.searchCriteria.longitude
                  ? `${parseFloat(results.searchCriteria.latitude).toFixed(2)}°, ${parseFloat(results.searchCriteria.longitude).toFixed(2)}°`
                  : 'Not specified'}
              </p>
            </div>
            <div>
              <p className="text-lime-300">Database Results</p>
              <p className="text-white font-medium flex items-center">
                <Database className="w-4 h-4 mr-1 text-blue-400" />
                {databaseCount}
              </p>
            </div>
            <div>
              <p className="text-lime-300">AI Generated</p>
              <p className="text-white font-medium flex items-center">
                <Brain className="w-4 h-4 mr-1 text-green-400" />
                {aiGeneratedCount}
              </p>
            </div>
            <div>
              <p className="text-lime-300">Total Results</p>
              <p className="text-white font-medium">{results.analogs.length}</p>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto mb-6">
          <table className="w-full text-white text-sm">
            <thead>
              <tr className="border-b border-white/20">
                <th className="text-left py-3 px-2 text-lime-200">Rank</th>
                <th className="text-left py-3 px-2 text-lime-200">Field Name</th>
                <th className="text-left py-3 px-2 text-lime-200">Country</th>
                <th className="text-right py-3 px-2 text-lime-200">Similarity</th>
                <th className="text-right py-3 px-2 text-lime-200">Distance (km)</th>
                <th className="text-right py-3 px-2 text-lime-200">Thickness (m)</th>
                <th className="text-right py-3 px-2 text-lime-200">Porosity (%)</th>
                <th className="text-left py-3 px-2 text-lime-200">Source</th>
              </tr>
            </thead>
            <tbody>
              {results.analogs.map((analog, index) => (
                <tr key={index} className="border-b border-white/10 hover:bg-white/5">
                  <td className="py-3 px-2 font-semibold">{analog.rank}</td>
                  <td className="py-3 px-2 font-medium">{analog.fieldName}</td>
                  <td className="py-3 px-2">{analog.country}</td>
                  <td className="text-right py-3 px-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      analog.similarityScore > 90 ? 'bg-green-500/20 text-green-300' :
                      analog.similarityScore > 85 ? 'bg-yellow-500/20 text-yellow-300' :
                      'bg-orange-500/20 text-orange-300'
                    }`}>
                      {analog.similarityScore}%
                    </span>
                  </td>
                  <td className="text-right py-3 px-2">
                    {analog.distance ? analog.distance.toFixed(0) : 'N/A'}
                  </td>
                  <td className="text-right py-3 px-2">{analog.avgThickness.toFixed(1)}</td>
                  <td className="text-right py-3 px-2">{analog.avgPorosity.toFixed(1)}</td>
                  <td className="py-3 px-2">
                    {analog.aiGenerated ? (
                      <span className="flex items-center text-green-300 text-xs">
                        <Brain className="w-3 h-3 mr-1" />
                        AI
                      </span>
                    ) : (
                      <span className="flex items-center text-blue-300 text-xs">
                        <Database className="w-3 h-3 mr-1" />
                        DB
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="bg-white/5 rounded-lg p-6 mb-6">
          <h3 className="text-lg font-semibold text-white mb-4">Global Analog Locations</h3>
          <div className="h-64 flex items-center justify-center border-2 border-dashed border-white/20 rounded-lg">
            <div className="text-center">
              <Globe className="w-12 h-12 text-green-400 mx-auto mb-4" />
              <p className="text-lime-200">Interactive similarity heatmap</p>
              <p className="text-lime-300 text-sm">Showing {results.analogs.length} analog fields color-coded by similarity score</p>
              {results.searchCriteria.maxSearchDistance !== 'global' && (
                <p className="text-orange-300 text-xs mt-2">
                  Search limited to {results.searchCriteria.maxSearchDistance} km radius
                </p>
              )}
            </div>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-6"
      >
        <h2 className="text-2xl font-bold text-white mb-6">Top Analog Details</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {results.analogs.slice(0, 4).map((analog, index) => (
            <div key={index} className="bg-white/5 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-semibold text-white">{analog.fieldName}</h3>
                <div className="flex items-center space-x-2">
                  <span className="text-green-300 font-medium">#{analog.rank}</span>
                  {analog.aiGenerated ? (
                    <Brain className="w-4 h-4 text-green-400" title="AI Generated" />
                  ) : (
                    <Database className="w-4 h-4 text-blue-400" title="Database Match" />
                  )}
                </div>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-lime-300">Recovery Factor:</span>
                  <span className="text-white">{analog.recoveryFactor.toFixed(1)}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-lime-300">EUR:</span>
                  <span className="text-white">{analog.eur.toFixed(0)} Mbbl</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-lime-300">Adjustment Factor:</span>
                  <span className="text-white">{analog.adjustmentFactor.toFixed(2)}x</span>
                </div>
                {analog.distance && (
                  <div className="flex justify-between">
                    <span className="text-lime-300">Distance:</span>
                    <span className="text-white">{analog.distance.toFixed(0)} km</span>
                  </div>
                )}
                <p className="text-lime-200 text-xs mt-2">{analog.productionHistory}</p>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-6"
      >
        <h2 className="text-2xl font-bold text-white mb-6">"Why This Analog?" Explanation</h2>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {Object.entries(results.weights).map(([parameter, weight]) => (
            <div key={parameter} className="text-center">
              <div className="bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg p-4 mb-2">
                <div className="text-2xl font-bold text-white">{weight}%</div>
              </div>
              <p className="text-lime-200 text-sm capitalize">{parameter.replace(/([A-Z])/g, ' $1')}</p>
            </div>
          ))}
        </div>
        <div className="mt-6 space-y-3">
          <p className="text-lime-300 text-sm text-center">
            Similarity scores calculated using weighted parameters based on geological significance
            {results.searchCriteria.latitude && results.searchCriteria.longitude && (
              <span className="block mt-1">
                Distance weighting applied for location-based matching
              </span>
            )}
          </p>
          <div className="bg-gradient-to-r from-green-500/10 to-blue-500/10 rounded-lg p-4 border border-green-500/20">
            <p className="text-green-200 text-sm">
              🤖 <strong>AI Enhancement:</strong> This search found {databaseCount} matches from database and generated {aiGeneratedCount} new analogs using AI. All new analogs are now stored for future searches, continuously expanding the global database.
            </p>
          </div>
        </div>
      </motion.div>
    </>
  );
};

export default ResultsPanel;