import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { mockFAQs } from '@/data/help/mockHelpData';

const FAQSection = ({ searchQuery }) => {
    const filteredFAQs = mockFAQs.filter(faq => 
        faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <Card className="bg-slate-900 border-slate-800">
                <CardHeader>
                    <CardTitle className="text-white">Frequently Asked Questions</CardTitle>
                </CardHeader>
                <CardContent>
                    {filteredFAQs.length > 0 ? (
                        <Accordion type="single" collapsible className="w-full">
                            {filteredFAQs.map((faq) => (
                                <AccordionItem key={faq.id} value={faq.id} className="border-slate-800">
                                    <AccordionTrigger className="text-slate-200 hover:text-white text-left">
                                        {faq.question}
                                    </AccordionTrigger>
                                    <AccordionContent className="text-slate-400">
                                        <div className="mb-2">{faq.answer}</div>
                                        <div className="text-xs text-slate-500 mt-2 pt-2 border-t border-slate-800">
                                            Category: {faq.category}
                                        </div>
                                    </AccordionContent>
                                </AccordionItem>
                            ))}
                        </Accordion>
                    ) : (
                        <div className="text-center py-8 text-slate-500">
                            No FAQs found matching "{searchQuery}"
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
};

export default FAQSection;