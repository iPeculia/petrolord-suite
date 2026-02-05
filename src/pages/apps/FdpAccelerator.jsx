import React, { useState, useEffect, useCallback } from 'react';
import { Helmet } from 'react-helmet';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { supabase } from '@/lib/customSupabaseClient';
import { useNavigate, useLocation } from 'react-router-dom';
import FdpHeader from '@/components/fdpaccelerator/FdpHeader';
import FdpForm from '@/components/fdpaccelerator/FdpForm';

const FdpAccelerator = () => {
  const { toast } = useToast();
  const { user, session } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [resultUrl, setResultUrl] = useState('');
  const [projectId, setProjectId] = useState(null);

  const [formState, setFormState] = useState({
    projectName: '',
    loc: '',
    partners: '',
    startDate: '',
    endDate: '',
    p50Reserves: '',
    recoveryMethod: 'primary',
    apiGravity: '',
    gor: '',
    viscosity: '',
    royalty: '',
    tax: '',
    costRecovery: '',
    discountRate: '10',
    wells: [],
    facilities: [],
    priceDeck: [],
    supportingFiles: [],
  });

  const loadProjectData = useCallback((project) => {
    setProjectId(project.id);
    setFormState({
      projectName: project.project_name || '',
      loc: project.location || '',
      partners: (project.partners || []).join(', '),
      startDate: project.start_date ? project.start_date.split('T')[0] : '',
      endDate: project.end_date ? project.end_date.split('T')[0] : '',
      p50Reserves: project.p50_reserves_mmbo || '',
      recoveryMethod: project.recovery_method || 'primary',
      apiGravity: project.fluid_properties?.api_gravity || '',
      gor: project.fluid_properties?.gas_oil_ratio || '',
      viscosity: project.fluid_properties?.viscosity_cp || '',
      royalty: project.fiscal_terms?.royalty_pct || '',
      tax: project.fiscal_terms?.tax_pct || '',
      costRecovery: project.fiscal_terms?.cost_recovery_pct || '',
      discountRate: project.fiscal_terms?.discount_rate_pct || '10',
      wells: (project.wells || []).map(w => ({ ...w, id: w.id || Date.now() + Math.random() })),
      facilities: (project.facilities || []).map(f => ({ ...f, id: f.id || Date.now() + Math.random() })),
      priceDeck: (project.price_deck || []).map(p => ({ ...p, id: p.id || Date.now() + Math.random() })),
      supportingFiles: [],
    });
    toast({ title: "Project Loaded", description: `Successfully loaded "${project.project_name}".` });
  }, [toast]);

  useEffect(() => {
    if (location.state?.loadedProject) {
      loadProjectData(location.state.loadedProject);
    }
  }, [location.state, loadProjectData]);

  const handleSaveProject = async () => {
    if (!formState.projectName) {
      toast({ variant: 'destructive', title: 'Project Name Required', description: 'Please enter a name for your project before saving.' });
      return;
    }
    setSaving(true);
    try {
      const projectData = {
        project_name: formState.projectName,
        location: formState.loc,
        partners: formState.partners.split(',').map(s => s.trim()).filter(s => s),
        start_date: formState.startDate || null,
        end_date: formState.endDate || null,
        p50_reserves_mmbo: parseFloat(formState.p50Reserves) || null,
        recovery_method: formState.recoveryMethod,
        fluid_properties: {
          api_gravity: parseFloat(formState.apiGravity) || null,
          gas_oil_ratio: parseFloat(formState.gor) || null,
          viscosity_cp: parseFloat(formState.viscosity) || null,
        },
        fiscal_terms: {
          royalty_pct: parseFloat(formState.royalty) || null,
          tax_pct: parseFloat(formState.tax) || null,
          cost_recovery_pct: parseFloat(formState.costRecovery) || null,
          discount_rate_pct: parseFloat(formState.discountRate) || null,
        },
      };

      let savedProject;
      if (projectId) {
        const { data, error } = await supabase.from('fdp_projects').update({ ...projectData }).eq('id', projectId).select().single();
        if (error) throw error;
        savedProject = data;
        await Promise.all([
          supabase.from('fdp_wells').delete().eq('fdp_project_id', projectId),
          supabase.from('fdp_facilities').delete().eq('fdp_project_id', projectId),
          supabase.from('fdp_price_decks').delete().eq('fdp_project_id', projectId)
        ]);
      } else {
        const { data, error } = await supabase.from('fdp_projects').insert({ ...projectData, user_id: user.id }).select().single();
        if (error) throw error;
        savedProject = data;
        setProjectId(savedProject.id);
      }

      const newProjectId = savedProject.id;
      const { wells, facilities, priceDeck } = formState;
      if (wells.length > 0) {
        const wellData = wells.map(w => ({ name: w.name, type: w.type, count: w.count, drilling_cost_mm_usd: w.drilling_cost_mm_usd, completion_cost_mm_usd: w.completion_cost_mm_usd, fdp_project_id: newProjectId }));
        await supabase.from('fdp_wells').insert(wellData);
      }
      if (facilities.length > 0) {
        const facilityData = facilities.map(f => ({ name: f.name, capex_mm_usd: f.capex_mm_usd, opex_mm_usd_yr: f.opex_mm_usd_yr, description: f.description, fdp_project_id: newProjectId }));
        await supabase.from('fdp_facilities').insert(facilityData);
      }
      if (priceDeck.length > 0) {
        const priceData = priceDeck.map(p => ({ year: p.year, oil_price_usd: p.oil_price_usd, gas_price_usd: p.gas_price_usd, fdp_project_id: newProjectId }));
        await supabase.from('fdp_price_decks').insert(priceData);
      }

      toast({ title: 'Project Saved!', description: `"${formState.projectName}" has been saved successfully.` });
    } catch (err) {
      toast({ variant: 'destructive', title: 'Save Failed', description: err.message });
    } finally {
      setSaving(false);
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    setResultUrl('');

    const formData = new FormData();
    const { projectName, loc, partners, startDate, endDate, p50Reserves, recoveryMethod, apiGravity, gor, viscosity, wells, facilities, royalty, tax, costRecovery, discountRate, priceDeck, supportingFiles } = formState;

    const body = {
      project_name: projectName, location: loc, partners: partners.split(',').map(s => s.trim()).filter(s => s),
      start_date: startDate, end_date: endDate, p50_reserves_mmbo: parseFloat(p50Reserves) || 0, recovery_method: recoveryMethod,
      fluid: { api_gravity: parseFloat(apiGravity) || 0, gas_oil_ratio: parseFloat(gor) || 0, viscosity_cp: parseFloat(viscosity) || 0 },
      wells: wells.map(({ id, ...rest }) => rest), facilities: facilities.map(({ id, ...rest }) => rest),
    };
    const fiscal = { royalty_pct: parseFloat(royalty) || 0, tax_pct: parseFloat(tax) || 0, cost_recovery_pct: parseFloat(costRecovery) || 0 };
    const econ = { discount_rate_pct: parseFloat(discountRate) || 0, price_deck: priceDeck.map(({ id, ...rest }) => rest) };

    formData.append('input', JSON.stringify(body));
    formData.append('fiscal', JSON.stringify(fiscal));
    formData.append('econ', JSON.stringify(econ));
    for (let i = 0; i < supportingFiles.length; i++) {
      formData.append('supporting_files', supportingFiles[i]);
    }

    try {
      if (!session) throw new Error("You must be logged in to generate a document.");
      const { data, error } = await supabase.functions.invoke('generate-fdp', { body: formData });
      if (error) throw error;
      if (data.error) throw new Error(data.error);
      setResultUrl(data.document_url);
      toast({ title: 'FDP Generated!', description: 'Your document is ready for download.' });
    } catch (err) {
      toast({ variant: 'destructive', title: 'Generation Failed', description: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>FDP Accelerator - Petrolord Suite</title>
        <meta name="description" content="AI-powered generation of Field Development Plan documents." />
      </Helmet>
      <div className="flex flex-col h-full bg-slate-900 text-white p-4 sm:p-6">
        <FdpHeader
          navigate={navigate}
          handleSaveProject={handleSaveProject}
          saving={saving}
          projectId={projectId}
        />
        <div className="flex-1 overflow-y-auto pr-2">
          <FdpForm
            formState={formState}
            setFormState={setFormState}
            onSubmit={handleSubmit}
            loading={loading}
            resultUrl={resultUrl}
          />
        </div>
      </div>
    </>
  );
};

export default FdpAccelerator;