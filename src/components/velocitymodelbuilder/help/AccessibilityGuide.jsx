import React from 'react';
import { Accessibility } from 'lucide-react';

const AccessibilityGuide = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <h2 className="text-2xl font-bold text-white flex items-center gap-2">
        <Accessibility className="w-6 h-6 text-blue-400"/> Accessibility Features
      </h2>
      <div className="bg-slate-900 p-6 rounded border border-slate-800 text-sm text-slate-300">
        <p className="mb-4">
            We are committed to making velocity modeling accessible to everyone.
        </p>
        <ul className="space-y-2">
            <li><strong>Screen Readers:</strong> All UI components utilize ARIA labels for compatibility with NVDA and VoiceOver.</li>
            <li><strong>Keyboard Navigation:</strong> Full workflow execution is possible without a mouse using Tab navigation and shortcuts.</li>
            <li><strong>High Contrast Mode:</strong> A "High Visibility" theme is available for users with visual impairments.</li>
            <li><strong>Colorblind Safe Palettes:</strong> Default velocity color scales (e.g., Viridis, Cividis) are perceptually uniform and colorblind friendly.</li>
        </ul>
      </div>
    </div>
  );
};

export default AccessibilityGuide;