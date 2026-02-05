export const mockFAQs = [
    { id: 'faq1', question: "How do I create a new FDP project?", answer: "Go to the Dashboard, click 'New Project', select a template (e.g., Offshore, Onshore), and follow the guided wizard.", category: "Getting Started" },
    { id: 'faq2', question: "Can I import data from Petrel?", answer: "Yes, use the 'API Integration' module or the 'Data Import' tool in the Subsurface module to connect to Petrel via the RESQML connector.", category: "Data Management" },
    { id: 'faq3', question: "How are NPV calculations updated?", answer: "NPV is recalculated automatically whenever you change inputs in CAPEX, OPEX, Production Profiles, or Price Decks. You can view the formula in the Economics module.", category: "Cost & Economics" }
];

export const mockArticles = [
    { id: 'art1', title: "Field Development Planning 101", category: "Getting Started", readTime: "5 min", views: 1205, content: "A comprehensive guide to the FDP process..." },
    { id: 'art2', title: "Optimizing Well Placement Strategies", category: "Well Strategy", readTime: "12 min", views: 850, content: "Learn how to use the optimization engine..." },
    { id: 'art3', title: "Understanding Risk Matrices", category: "Risk Management", readTime: "8 min", views: 620, content: "How to categorize probability and impact..." }
];

export const mockVideos = [
    { id: 'vid1', title: "FDP Accelerator Tour", duration: "3:45", thumbnail: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&q=80&w=400", category: "Getting Started" },
    { id: 'vid2', title: "Advanced Sensitivity Analysis", duration: "15:20", thumbnail: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=400", category: "Economics" }
];

export const mockGlossary = [
    { term: "CAPEX", definition: "Capital Expenditure - funds used to acquire, upgrade, and maintain physical assets." },
    { term: "FID", definition: "Final Investment Decision - the point at which the project execution phase begins." },
    { term: "NPV", definition: "Net Present Value - the difference between the present value of cash inflows and outflows." }
];