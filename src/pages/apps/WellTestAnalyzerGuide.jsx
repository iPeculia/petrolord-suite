import React from 'react';
import { Helmet } from 'react-helmet';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Download } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

const guideContent = `# 🚀 Well Test Analyzer: User's Guide

## 🌟 Overview

Welcome to the Well Test Analyzer! This powerful application is your go-to solution for unlocking critical insights from pressure transient data. Designed for petroleum engineers and geoscientists, it transforms raw well test data into actionable intelligence about your reservoir and wellbore.

**What does it do?**

*   **Data-Driven Decisions**: Rapidly analyze pressure and rate data to determine key reservoir characteristics like permeability (kh), skin factor, and initial pressure (Pi).
*   **Comprehensive Diagnostics**: Utilize industry-standard diagnostic plots—Derivative, Horner, MDH/Agarwal, and Flow Regimes—to visually interpret complex reservoir behavior.
*   **Enhanced Model Fitting**: Apply various analytical models (Homogeneous, Dual Porosity, Boundary) to accurately fit your data and refine your understanding.
*   **Gas Well Capability**: Seamlessly handle gas well data with automated pseudo-pressure and pseudo-time calculations, ensuring accurate analysis for all fluid types.
*   **Interactive & Intuitive**: Enjoy an interactive experience with zoomable plots, adjustable smoothing, and a user-friendly interface that streamlines your workflow.
*   **Project Management**: Save, load, and manage all your analysis projects, creating a persistent workspace for continuous well test interpretation.
*   **Automated Reporting & Integration**: Generate professional PDF reports and easily integrate your results with other industry-standard tools like Nodal Analysis and Material Balance.

The Well Test Analyzer is engineered to empower you with precision, speed, and clarity in every well test interpretation!

## 🛠️ Getting Started: The Workflow

### 1. Load Your Data
- **Drag & Drop**: Begin by dragging your well test data file (in .csv, .txt, or .las format) into the upload area.
- **Run a Demo**: Alternatively, click "Run Analysis" to load a sample dataset and explore the application's features immediately.

### 2. Quality Control (QC) & Mapping
- **Column Mapping**: Once data is loaded, you'll enter the QC panel. Here, you must map your data columns to 'Time' and 'Pressure'. 'Rate' is optional but recommended for comprehensive analysis.
- **Visual QC**: A plot of your raw data is displayed. Visually inspect it for anomalies, noise, or inconsistencies.
- **Select a Model**: Choose the appropriate analytical model for your reservoir (e.g., Homogeneous, Dual Porosity).
- **Confirm Properties**: Review and adjust fluid and reservoir properties if needed.
- **Fit Model**: Click "Confirm & Fit Model" to proceed with the analysis.

### 3. Analyze & Interpret Results
- **Key Parameters**: The main results table displays the calculated Key Performance Indicators (KPIs) like Permeability, Skin, and Initial Pressure, along with their P10/P90 confidence intervals.
- **Diagnostic Plots**:
    - **Derivative Plot**: The primary diagnostic tool. Use the log-log plot of pressure change and its derivative to identify flow regimes (wellbore storage, radial flow, boundaries).
    - **Horner Plot**: A classic semi-log plot used for buildup tests to estimate initial reservoir pressure.
    - **MDH/Agarwal Plot**: Another semi-log plot for identifying radial flow and estimating permeability.
    - **Regimes Plot**: A summary chart that visually identifies the duration of each dominant flow regime.
- **Interactivity**:
    - **Zoom & Pan**: Click and drag on any plot to zoom into areas of interest. Use the mouse wheel to zoom in and out.
    - **Derivative Smoothing**: Use the slider below the plots to apply Bourdet smoothing, which helps clarify noisy derivative data.

### 4. Manage Your Work
- **Save Project**: After a successful analysis, click the "Save" button. Give your project a name. This saves all inputs and results.
- **Load Project**: Click "Load Project" to open a dialog with all your saved analyses. You can search, load, or delete projects from this hub.
- **Update Project**: If you load a project and re-run the analysis, clicking "Update" will save the new results over the existing project.

### 5. Export & Integrate
- **Generate PDF Report**: Click "Generate PDF Report" to create a professional, shareable summary of your analysis, including all inputs, results, and plots.
- **Integrate**: Use the integration buttons to send key results (like permeability and skin) to other Petrolord applications, such as Nodal Analysis or Material Balance, for a seamless integrated workflow.
`;

const WellTestAnalyzerGuide = () => {
  const navigate = useNavigate();

  const handleDownload = () => {
    const blob = new Blob([guideContent], { type: 'text/markdown;charset=utf-8' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'Well_Test_Analyzer_User_Guide.md';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <>
      <Helmet>
        <title>Well Test Analyzer User Guide - Petrolord</title>
        <meta name="description" content="A comprehensive guide to using the Well Test Analyzer application." />
      </Helmet>
      <div className="flex flex-col h-full bg-slate-900 text-white p-4 md:p-6">
        <div className="flex items-center justify-between mb-4 flex-shrink-0">
          <Button variant="outline" onClick={() => navigate(-1)} className="text-slate-300 border-slate-600 hover:bg-slate-700">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <h1 className="text-2xl font-bold text-white">Well Test Analyzer User's Guide</h1>
          <Button onClick={handleDownload} className="bg-lime-600 hover:bg-lime-700">
            <Download className="w-4 h-4 mr-2" />
            Download Guide
          </Button>
        </div>
        <ScrollArea className="flex-grow bg-slate-800/50 border border-slate-700 rounded-lg">
          <div className="p-6 prose prose-invert prose-sm max-w-none prose-headings:text-lime-300 prose-strong:text-white">
            <div dangerouslySetInnerHTML={{ __html: guideContent.replace(/# (.*)/g, '<h1>$1</h1>').replace(/## (.*)/g, '<h2>$1</h2>').replace(/### (.*)/g, '<h3>$1</h3>').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\* (.*)/g, '<li>$1</li>').replace(/(\r\n|\n|\r)/gm, '<br>') }} />
          </div>
        </ScrollArea>
      </div>
    </>
  );
};

export default WellTestAnalyzerGuide;