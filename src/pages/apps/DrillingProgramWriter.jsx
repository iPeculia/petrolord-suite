import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { ClipboardList, ArrowLeft } from 'lucide-react';
import InputForm from '@/components/drillingprogram/InputForm';
import OutputDisplay from '@/components/drillingprogram/OutputDisplay';

const DrillingProgramWriter = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleGenerateProgram = async (inputs) => {
    setLoading(true);
    setResult(null);

    toast({
      title: "Generating Program... ⏳",
      description: "The AI is assembling your drilling program. This might take a moment.",
    });

    console.log("Simulating POST to /api/drilling/program-writer with inputs:", inputs);
    await new Promise(resolve => setTimeout(resolve, 2500));

    try {
      const dummyResponse = {
        downloadUrl: "/templates/dummy-drilling-program.pdf",
        summary: {
          wellName: inputs.wellMetadata.wellName,
          totalDepth: inputs.wellMetadata.totalDepth,
          casingPoints: inputs.casingPlan.sections.length,
          fluidStages: inputs.fluidProgram.sections.length,
        },
      };

      setResult(dummyResponse);
      toast({
        title: "Program Generated! ✅",
        description: "Your drilling program is ready for review and download.",
      });
    } catch (error) {
      console.error("Program Generation Error:", error);
      toast({
        title: "Generation Failed",
        description: "An error occurred while generating the program.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Drilling Program Writer - Petrolord Suite</title>
        <meta name="description" content="AI-assisted generation of comprehensive drilling programs from key inputs." />
      </Helmet>
      <div className="p-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="mb-8">
          <div className="flex items-center space-x-4 mb-4">
            <Link to="/dashboard/drilling">
              <Button variant="outline" size="sm" className="border-lime-400/50 text-lime-300 hover:bg-lime-500/20">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Drilling
              </Button>
            </Link>
          </div>
          <div className="flex items-center space-x-4 mb-4">
            <div className="bg-gradient-to-r from-teal-500 to-cyan-500 p-3 rounded-xl">
              <ClipboardList className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-white">Drilling Program Writer</h1>
              <p className="text-lime-200 text-lg">AI-powered generation of drilling programs</p>
            </div>
          </div>
        </motion.div>
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          <div className="lg:col-span-2">
            <InputForm onGenerate={handleGenerateProgram} loading={loading} />
          </div>
          <div className="lg:col-span-3">
            <OutputDisplay result={result} loading={loading} />
          </div>
        </div>
      </div>
    </>
  );
};

export default DrillingProgramWriter;