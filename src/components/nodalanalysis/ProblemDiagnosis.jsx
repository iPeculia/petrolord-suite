import React from 'react';
    import { motion } from 'framer-motion';
    import { AlertTriangle, CheckCircle, Search } from 'lucide-react';

    const ProblemDiagnosis = ({ data }) => {
      if (!data) return null;

      const { title, details, action } = data;

      const getIcon = () => {
        if (title.includes("Restriction") || title.includes("Underperformance")) {
            return <AlertTriangle className="w-8 h-8 text-yellow-400" />;
        }
        if (title.includes("Matches Model")) {
            return <CheckCircle className="w-8 h-8 text-green-400" />;
        }
        return <Search className="w-8 h-8 text-blue-400" />;
      };

      const getBorderColor = () => {
        if (title.includes("Restriction") || title.includes("Underperformance")) {
            return "border-yellow-400/50";
        }
        if (title.includes("Matches Model")) {
            return "border-green-400/50";
        }
        return "border-blue-400/50";
      };

      return (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className={`bg-white/5 p-6 rounded-lg border ${getBorderColor()}`}
        >
          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0">{getIcon()}</div>
            <div>
              <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
              <p className="text-white/80 mb-4">{details}</p>
              <h4 className="font-semibold text-lime-300">Recommended Action</h4>
              <p className="text-white/80 mt-1">{action}</p>
            </div>
          </div>
        </motion.div>
      );
    };

    export default ProblemDiagnosis;