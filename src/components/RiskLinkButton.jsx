import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ShieldCheck } from 'lucide-react';

const RiskLinkButton = ({ moduleName }) => {
  const navigate = useNavigate();

  const handleRiskClick = () => {
    // Navigate to Assurance dashboard with module context
    navigate(`/dashboard/assurance?source=${moduleName}`);
  };

  return (
    <Button 
      variant="ghost" 
      size="sm" 
      className="text-slate-400 hover:text-teal-400 hover:bg-teal-500/10 gap-2 border border-slate-700"
      onClick={handleRiskClick}
    >
      <ShieldCheck className="w-4 h-4" />
      <span>Risk</span>
    </Button>
  );
};

export default RiskLinkButton;