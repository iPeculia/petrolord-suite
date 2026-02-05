import React from 'react';
import { Helmet } from 'react-helmet';
import SeismicSectionViewer from './SeismicSectionViewer'; // Reusing the component

const SeismicTraceViewer = () => {
  return (
    <>
      <Helmet>
        <title>Seismic Trace Viewer</title>
        <meta name="description" content="A powerful in-browser tool to view and interpret seismic SEG-Y files. Visualize 2D and 3D seismic data with advanced rendering options." />
      </Helmet>
      <SeismicSectionViewer />
    </>
  );
};

export default SeismicTraceViewer;