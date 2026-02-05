import React from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

const FAQSection = () => {
  const faqs = [
    { q: "Can I use this tool for Depth-to-Time conversion?", a: "Yes, the engine is bidirectional. Simply input your depth surfaces and select 'Inverse' mode in the conversion panel." },
    { q: "Is my data secure?", a: "Absolutely. We use end-to-end encryption and are SOC2 compliant. Your proprietary velocity data is never used to train public AI models without explicit consent." },
    { q: "How many wells can I import?", a: "The Enterprise tier supports up to 500 wells per project. For basin-wide studies with thousands of wells, please contact support for a custom instance." },
    { q: "Does it support feet or meters?", a: "Both. You can set the Project Units in the global settings. We also handle mixed unit inputs (e.g., depth in ft, velocity in m/s) via the Unit Converter." },
    { q: "What if my velocity model has inversions?", a: "You can enable 'Allow Inversions' in the Physics settings. By default, we flag them as potential data errors, but they are physically valid in salt or overpressure scenarios." }
  ];

  return (
    <div className="max-w-3xl mx-auto">
        <h2 className="text-xl font-bold text-white mb-6">Frequently Asked Questions</h2>
        <Accordion type="single" collapsible className="w-full space-y-2">
            {faqs.map((faq, i) => (
                <AccordionItem key={i} value={`faq-${i}`} className="bg-slate-900 border border-slate-800 rounded-lg px-4">
                    <AccordionTrigger className="text-slate-200 hover:no-underline hover:text-blue-400 transition-colors py-4">
                        {faq.q}
                    </AccordionTrigger>
                    <AccordionContent className="text-slate-400 text-sm pb-4">
                        {faq.a}
                    </AccordionContent>
                </AccordionItem>
            ))}
        </Accordion>
    </div>
  );
};

export default FAQSection;