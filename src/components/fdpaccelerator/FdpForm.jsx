import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Bot, Download } from 'lucide-react';
import ProjectDetailsSection from './ProjectDetailsSection';
import ReservesSection from './ReservesSection';
import FluidPropsSection from './FluidPropsSection';
import WellsSection from './WellsSection';
import FacilitiesSection from './FacilitiesSection';
import FiscalSection from './FiscalSection';
import PriceDeckSection from './PriceDeckSection';
import SupportingDocsSection from './SupportingDocsSection';

const FdpForm = ({ formState, setFormState, onSubmit, loading, resultUrl }) => {
  const handleFormSubmit = (e) => {
    e.preventDefault();
    onSubmit();
  };

  return (
    <form id="fdp-form" onSubmit={handleFormSubmit} className="space-y-4 max-w-4xl mx-auto">
      <ProjectDetailsSection formState={formState} setFormState={setFormState} />
      <ReservesSection formState={formState} setFormState={setFormState} />
      <FluidPropsSection formState={formState} setFormState={setFormState} />
      <WellsSection formState={formState} setFormState={setFormState} />
      <FacilitiesSection formState={formState} setFormState={setFormState} />
      <FiscalSection formState={formState} setFormState={setFormState} />
      <PriceDeckSection formState={formState} setFormState={setFormState} />
      <SupportingDocsSection formState={formState} setFormState={setFormState} />

      <div className="pt-4">
        <Button id="generate-fdp-btn" type="submit" disabled={loading} className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold py-3 text-lg">
          {loading ? <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div> : <Bot className="w-5 h-5 mr-2" />}
          Generate FDP
        </Button>
      </div>

      <div id="fdp-result" className="pt-4 text-center">
        {resultUrl && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <a href={resultUrl} download={`${formState.projectName.replace(/ /g, '_') || 'FDP'}_Document.txt`} className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-lime-600 hover:bg-lime-700">
              <Download className="w-5 h-5 mr-2" /> Download FDP Document
            </a>
          </motion.div>
        )}
      </div>
    </form>
  );
};

export default FdpForm;