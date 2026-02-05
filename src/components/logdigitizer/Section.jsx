import React from 'react';

export const Section = ({ title, icon, children, className = '' }) => (
  <div className={`bg-gray-800/50 p-4 rounded-lg shadow-lg ${className}`}>
    <h3 className="text-lg font-semibold text-teal-300 mb-4 flex items-center gap-2 border-b border-teal-800 pb-2">{icon}{title}</h3>
    <div className="space-y-4">{children}</div>
  </div>
);