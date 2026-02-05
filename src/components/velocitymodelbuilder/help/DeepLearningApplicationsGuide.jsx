import React from 'react';
import { Network } from 'lucide-react';

const DeepLearningApplicationsGuide = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <h2 className="text-2xl font-bold text-white flex items-center gap-2">
        <Network className="w-6 h-6 text-pink-400"/> Deep Learning Applications
      </h2>
      <div className="prose prose-invert max-w-none text-sm text-slate-300">
        <p>
            Deep Neural Networks (DNNs) and Convolutional Neural Networks (CNNs) are pushing the boundaries of velocity modeling.
        </p>
        <ul>
            <li><strong>Seismic-to-Velocity Translation:</strong> A U-Net architecture trained to predict interval velocity volumes directly from seismic amplitude cubes.</li>
            <li><strong>Fault Detection:</strong> CNNs automatically identify fault planes that compartmentalize velocity regimes.</li>
            <li><strong>Super-Resolution:</strong> Generative Adversarial Networks (GANs) upsample low-frequency tomography models to high-resolution velocity models.</li>
        </ul>
      </div>
    </div>
  );
};

export default DeepLearningApplicationsGuide;