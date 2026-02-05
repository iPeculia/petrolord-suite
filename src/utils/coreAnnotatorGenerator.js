export const generateCoreAnnotations = (inputs) => {
  const { topDepth, baseDepth } = inputs;
  const totalDepth = baseDepth - topDepth;

  const annotations = [
    { id: 1, depth: 3005.5, label: 'Sandstone', confidence: 95, box: [10, 5, 80, 20] },
    { id: 2, depth: 3018.2, label: 'Shale', confidence: 88, box: [10, 28, 80, 25] },
    { id: 3, depth: 3025.0, label: 'Fracture', confidence: 75, box: [15, 40, 70, 5] },
    { id: 4, depth: 3035.8, label: 'Sandstone', confidence: 98, box: [10, 55, 80, 30] },
    { id: 5, depth: 3042.1, label: 'Burrow', confidence: 65, box: [25, 70, 50, 8] },
  ];

  const stripLogData = [
    { top: 3000, base: 3015, thickness: 15, lithology: 'Sandstone', description: 'Fine-grained, well-sorted.' },
    { top: 3015, base: 3030, thickness: 15, lithology: 'Shale', description: 'Laminated, dark grey.' },
    { top: 3030, base: 3050, thickness: 20, lithology: 'Sandstone', description: 'Medium-grained, cross-bedded.' },
  ];

  return {
    inputs,
    annotations,
    stripLogData,
    imageSrc: 'https://storage.googleapis.com/hostinger-horizons-assets-prod/43fa5c4b-d185-4d6d-9ff4-a1d78861fb87/4dac35d0aea4f16b2f938fba27160d3f.png',
  };
};