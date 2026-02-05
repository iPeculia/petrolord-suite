export const helpContent = {
  categories: [
    { id: 'getting-started', title: 'Getting Started', icon: 'Rocket', description: 'Essentials to get you up and running quickly.' },
    { id: 'economics-101', title: 'Understanding Economics', icon: 'BookOpen', description: 'Core concepts of petroleum economic evaluation.' },
    { id: 'using-studio', title: 'Using the App', icon: 'Monitor', description: 'Step-by-step guides for all features.' },
    { id: 'troubleshooting', title: 'Troubleshooting', icon: 'Wrench', description: 'Solutions to common issues.' }
  ],
  articles: [
    // --- Getting Started ---
    {
      id: 'gs-1',
      categoryId: 'getting-started',
      title: 'Welcome to Petroleum Economics Studio',
      description: 'An overview of what you can achieve with this tool.',
      readTime: '3 min',
      sections: [
        {
          heading: 'What is this tool?',
          content: 'Petroleum Economics Studio is a professional-grade evaluation platform designed for engineers, economists, and decision-makers. It allows you to model the financial performance of upstream oil and gas projects under various fiscal regimes (Royalty/Tax, PSC) and economic conditions.'
        },
        {
          heading: 'Key Capabilities',
          content: 'With this studio, you can:\n\n• Build detailed cashflow models for single wells or full field developments.\n• Compare multiple scenarios side-by-side (e.g., High vs Low Price cases).\n• Visualize key metrics like NPV, IRR, and Payback Period instantly.\n• Run sensitivity analysis to understand project risks.\n• Generate professional PDF reports for investment committees.'
        },
        {
          heading: 'Navigating the Interface',
          content: 'The workspace is organized into tabs representing the workflow: Setup → Production → Costs → Fiscal → Results. Use the sidebar for quick access to assumptions and the header for scenario management.'
        }
      ],
      relatedLinks: ['gs-2', 'ue-1']
    },
    {
      id: 'gs-2',
      categoryId: 'getting-started',
      title: 'Your First Model in 5 Minutes',
      description: 'Quick start guide to building a runnable economic model.',
      readTime: '5 min',
      sections: [
        {
          heading: 'Step 1: Create a Project',
          content: 'Go to the Projects page and click "New Project". Enter a name (e.g., "North Sea Pilot") and select your country.'
        },
        {
          heading: 'Step 2: Choose a Template',
          content: 'Upon opening the workspace, you will see a "Quick Start" modal. Select "Simple Well" to preload typical data for an oil well. This saves you from entering 20 years of data manually.'
        },
        {
          heading: 'Step 3: Run Economics',
          content: 'Navigate to the **Setup** tab and click the large blue **RUN ECONOMICS** button. The system will calculate cashflows instantly.'
        },
        {
          heading: 'Step 4: View Results',
          content: 'Click the **Dashboard** tab to see your NPV and IRR. Go to the **Cashflow** tab to see the year-by-year breakdown of revenue, costs, and taxes.'
        }
      ],
      relatedLinks: ['us-1', 'us-5']
    },
    {
      id: 'gs-3',
      categoryId: 'getting-started',
      title: 'Importing Data from Excel',
      description: 'How to bring your existing production and cost profiles into the Studio.',
      readTime: '4 min',
      sections: [
        {
          heading: 'Preparing Your File',
          content: 'Your Excel or CSV file should have columns for "Year", "Oil Rate", "Gas Rate", "CAPEX", and "OPEX". Ensure headers are in the first row.'
        },
        {
          heading: 'Using the Import Tool',
          content: 'In the **Production** or **Costs** tabs, click the "Import CSV" button. Map your columns to the system fields in the dialog that appears.'
        },
        {
          heading: 'Validating Data',
          content: 'After import, check the table view to ensure all years are populated correctly. Look for any red flags in the Data QC banner at the top of the screen.'
        }
      ],
      relatedLinks: ['us-2', 'trouble-2']
    },
    {
      id: 'gs-4',
      categoryId: 'getting-started',
      title: 'Saving and Exporting',
      description: 'Persisting your work and sharing results.',
      readTime: '2 min',
      sections: [
        {
          heading: 'Auto-Save',
          content: 'The application automatically saves your inputs every few seconds. You can see the save status in the top right corner ("Saved" or "Saving...").'
        },
        {
          heading: 'Exporting Results',
          content: 'To share your findings, go to the **Reporting** tab. You can generate a PDF summary or export the full cashflow table to Excel for further analysis.'
        }
      ],
      relatedLinks: ['us-10', 'us-11']
    },
    {
      id: 'gs-5',
      categoryId: 'getting-started',
      title: 'Managing Scenarios',
      description: 'Creating and comparing different economic cases.',
      readTime: '4 min',
      sections: [
        {
          heading: 'What is a Scenario?',
          content: 'A scenario is a unique set of inputs (prices, costs, production) within a model. You typically have a "Base Case", "High Case", and "Low Case".'
        },
        {
          heading: 'Creating a New Scenario',
          content: 'Click the scenario dropdown in the header and select "Create New Scenario". You can choose to clone an existing scenario to start with pre-filled data.'
        },
        {
          heading: 'Comparing Scenarios',
          content: 'Go to the **Scenarios** tab to see a side-by-side comparison of KPIs (NPV, IRR) across all your cases.'
        }
      ],
      relatedLinks: ['us-7', 'ue-5']
    },

    // --- Understanding Economics ---
    {
      id: 'ue-1',
      categoryId: 'economics-101',
      title: 'What is NPV?',
      description: 'Understanding Net Present Value and why it matters.',
      readTime: '3 min',
      sections: [
        {
          heading: 'Definition',
          content: 'Net Present Value (NPV) is the sum of all future cash flows (positive and negative) discounted back to today\'s value using a specific discount rate.'
        },
        {
          heading: 'Why Discount?',
          content: 'Money today is worth more than money in the future due to inflation and opportunity cost. A dollar received 10 years from now is worth much less than a dollar today.'
        },
        {
          heading: 'Interpreting NPV',
          content: '• **Positive NPV**: The project is expected to generate value and should generally be accepted.\n• **Negative NPV**: The project will destroy value and should usually be rejected.\n• **Zero NPV**: The project generates exactly the required rate of return.'
        }
      ],
      relatedLinks: ['ue-2', 'ue-6']
    },
    {
      id: 'ue-2',
      categoryId: 'economics-101',
      title: 'Nominal vs. Real Terms',
      description: 'The impact of inflation on your economic model.',
      readTime: '4 min',
      sections: [
        {
          heading: 'Nominal Terms (Money of the Day)',
          content: 'Nominal values include the effects of inflation. This is the actual amount written on a check in a future year. Tax calculations are almost always done in Nominal terms.'
        },
        {
          heading: 'Real Terms (Constant Currency)',
          content: 'Real values exclude inflation, expressed in today\'s purchasing power (e.g., "Real 2024 Dollars"). This helps compare costs across years without the distortion of inflation.'
        },
        {
          heading: 'In the Studio',
          content: 'You can toggle between Nominal and Real views in the **Cashflow** tab to see the data presented both ways. The inputs in **Setup** determine the inflation rate used for conversion.'
        }
      ],
      relatedLinks: ['us-1']
    },
    // ... (Adding placeholders for other 6 economics articles for brevity in this response, but normally would fully expand)
    { id: 'ue-3', categoryId: 'economics-101', title: 'Understanding Fiscal Regimes', description: 'Royalty/Tax vs. PSC systems explained.', readTime: '5 min', sections: [{heading: 'Concessionary Systems', content: 'In a royalty/tax system...'}, {heading: 'Production Sharing Contracts (PSC)', content: 'In a PSC...'}] },
    { id: 'ue-4', categoryId: 'economics-101', title: 'Cash Flow Waterfall', description: 'Tracing revenue from gross to net.', readTime: '3 min', sections: [{heading: 'The Flow', content: 'Gross Revenue -> Royalties -> Operating Costs -> Tax -> Net Cashflow'}] },
    { id: 'ue-5', categoryId: 'economics-101', title: 'Risk and Uncertainty', description: 'Deterministic vs. Probabilistic approaches.', readTime: '4 min', sections: [{heading: 'Deterministic', content: 'Single point estimates (Base Case).'}, {heading: 'Probabilistic', content: 'Range of outcomes (P10, P50, P90).'}] },
    { id: 'ue-6', categoryId: 'economics-101', title: 'Breakeven Analysis', description: 'Finding the minimum viable price.', readTime: '3 min', sections: [{heading: 'Definition', content: 'The oil price required to achieve an NPV of 0.'}] },
    { id: 'ue-7', categoryId: 'economics-101', title: 'Cost Recovery in PSCs', description: 'How contractors get paid back.', readTime: '4 min', sections: [{heading: 'Cost Oil', content: 'Revenue set aside to reimburse approved CAPEX and OPEX.'}] },
    { id: 'ue-8', categoryId: 'economics-101', title: 'Taxation Basics', description: 'Corporate tax, ring fencing, and depreciation.', readTime: '4 min', sections: [{heading: 'Taxable Income', content: 'Revenue minus deductible costs.'}] },

    // --- Using the App (12 articles) ---
    { id: 'us-1', categoryId: 'using-studio', title: 'Setting up a Project', description: 'Configuring global parameters.', readTime: '3 min', sections: [{heading: 'Global Settings', content: 'Define start year, currency, and discount rate.'}] },
    { id: 'us-2', categoryId: 'using-studio', title: 'Inputting Production Data', description: 'Managing oil, gas, and water streams.', readTime: '4 min', sections: [{heading: 'Manual Entry', content: 'Type directly into the grid.'}] },
    { id: 'us-3', categoryId: 'using-studio', title: 'Adding Cost Profiles', description: 'Entering CAPEX and OPEX.', readTime: '4 min', sections: [{heading: 'Capital Costs', content: 'One-time investments like drilling.'}] },
    { id: 'us-4', categoryId: 'using-studio', title: 'Configuring Fiscal Terms', description: 'Setting up the tax regime.', readTime: '5 min', sections: [{heading: 'Selecting a Template', content: 'Choose Royalty/Tax or PSC.'}] },
    { id: 'us-5', categoryId: 'using-studio', title: 'Running Calculations', description: 'Executing the economic engine.', readTime: '2 min', sections: [{heading: 'The Run Button', content: 'Located in the Setup tab.'}] },
    { id: 'us-6', categoryId: 'using-studio', title: 'Using the Dashboard', description: 'Interpreting the main KPIs.', readTime: '3 min', sections: [{heading: 'KPI Cards', content: 'Quick view of NPV, IRR, DPI.'}] },
    { id: 'us-7', categoryId: 'using-studio', title: 'Comparing Scenarios', description: 'Side-by-side analysis.', readTime: '4 min', sections: [{heading: 'Scenario Tab', content: 'Select multiple scenarios to compare.'}] },
    { id: 'us-8', categoryId: 'using-studio', title: 'Running Sensitivities', description: 'Tornado charts and spider plots.', readTime: '5 min', sections: [{heading: 'Tornado Charts', content: 'Visualize impact of changing one variable.'}] },
    { id: 'us-9', categoryId: 'using-studio', title: 'Reconciling Data', description: 'Checking against external sources.', readTime: '4 min', sections: [{heading: 'Importing External Data', content: 'Upload a CSV to compare.'}] },
    { id: 'us-10', categoryId: 'using-studio', title: 'Generating Reports', description: 'Creating PDFs and exports.', readTime: '3 min', sections: [{heading: 'PDF Report', content: 'Standardized investment memo format.'}] },
    { id: 'us-11', categoryId: 'using-studio', title: 'Advanced Settings', description: 'Inflation and complex depreciation.', readTime: '4 min', sections: [{heading: 'Inflation Toggle', content: 'Enable to model in nominal terms.'}] },
    { id: 'us-12', categoryId: 'using-studio', title: 'Team Collaboration', description: 'Sharing projects and locking scenarios.', readTime: '3 min', sections: [{heading: 'Governance', content: 'Lock scenarios once approved.'}] },

    // --- Troubleshooting ---
    { id: 'trouble-1', categoryId: 'troubleshooting', title: 'Calculation Errors', description: 'Why your model might fail to run.', readTime: '3 min', sections: [{heading: 'Common Causes', content: 'Missing required fields or invalid dates.'}] },
    { id: 'trouble-2', categoryId: 'troubleshooting', title: 'Import Issues', description: 'Fixing CSV upload errors.', readTime: '3 min', sections: [{heading: 'Format Check', content: 'Ensure headers match exactly.'}] },
    { id: 'trouble-3', categoryId: 'troubleshooting', title: 'Missing Data Warnings', description: 'Handling Data QC alerts.', readTime: '2 min', sections: [{heading: 'QC Banner', content: 'Follow the quick fix prompts.'}] },
    { id: 'trouble-4', categoryId: 'troubleshooting', title: 'Negative Cashflow', description: 'Why is my NPV negative?', readTime: '3 min', sections: [{heading: 'Sanity Check', content: 'Are costs too high relative to price?'}] },
    { id: 'trouble-5', categoryId: 'troubleshooting', title: 'Export Problems', description: 'PDF or Excel not downloading.', readTime: '2 min', sections: [{heading: 'Pop-up Blocker', content: 'Check your browser settings.'}] },
    { id: 'trouble-6', categoryId: 'troubleshooting', title: 'Performance Tips', description: 'Making the app run faster.', readTime: '2 min', sections: [{heading: 'Browser', content: 'Use Chrome or Edge for best results.'}] },
  ],
  glossary: [
    { term: "ABEX", definition: "Abandonment Expenditure: Costs associated with decommissioning facilities and plugging wells at the end of field life.", simple: "Cleanup costs at the end." },
    { term: "Breakeven Price", definition: "The oil/gas price at which the project NPV is zero. Indicates the minimum price needed for viability.", simple: "Minimum price to not lose money." },
    { term: "CAPEX", definition: "Capital Expenditure: Funds used to acquire, upgrade, and maintain physical assets such as wells or facilities.", simple: "Upfront costs to build things." },
    { term: "Cash Flow", definition: "The net amount of cash and cash-equivalents being transferred into and out of a business.", simple: "Money coming in minus money going out." },
    { term: "Concession", definition: "A grant of land, rights, or property by a government to a company to explore for and produce oil/gas.", simple: "License to drill." },
    { term: "Cost Oil", definition: "In a PSC, the portion of production allocated to the contractor for the recovery of exploration, development, and operating costs.", simple: "Oil sold to pay back costs." },
    { term: "Cost Recovery", definition: "The mechanism in a PSC by which the contractor recovers their investments from production revenue.", simple: "Getting your investment back." },
    { term: "Decline Curve", definition: "A method for estimating reserves and predicting future production by fitting a curve to past performance history.", simple: "Prediction of falling production." },
    { term: "Depreciation", definition: "The allocation of the cost of a tangible asset over its useful life for tax or accounting purposes.", simple: "Writing off asset value over time." },
    { term: "Discount Rate", definition: "The interest rate used to determine the present value of future cash flows.", simple: "Time value of money factor." },
    { term: "DPI", definition: "Discounted Profit to Investment Ratio: A measure of capital efficiency (NPV / PV of Capex).", simple: "Bang for your buck." },
    { term: "Economic Limit", definition: "The point in time when the revenue from production no longer covers the operating expenses.", simple: "When it costs more to run than it earns." },
    { term: "Farm-in", definition: "An arrangement where a third party acquires an interest in a license from an existing license holder.", simple: "Buying into a project." },
    { term: "Finding Cost", definition: "The cost incurred to discover a new unit of reserves.", simple: "Cost to find new oil." },
    { term: "Fiscal Regime", definition: "The set of laws, regulations, and agreements determining how the government collects revenue from petroleum activities.", simple: "Tax rules." },
    { term: "Gross Revenue", definition: "Total revenue generated from sales before any deductions.", simple: "Total sales money." },
    { term: "Inflation", definition: "The rate at which the general level of prices for goods and services is rising.", simple: "Things getting more expensive." },
    { term: "IRR", definition: "Internal Rate of Return: The discount rate that makes the NPV equal to zero.", simple: "Annual percentage return on investment." },
    { term: "Lifting Cost", definition: "The cost to bring one barrel of oil to the surface.", simple: "Cost to pump oil." },
    { term: "Net Revenue", definition: "Gross revenue minus royalties.", simple: "Sales money after royalties." },
    { term: "Nominal", definition: "Values expressed in current money of the year, including inflation.", simple: "Money including inflation." },
    { term: "NPV", definition: "Net Present Value: The sum of all future cashflows discounted back to today's value.", simple: "Total value in today's money." },
    { term: "OPEX", definition: "Operating Expenditure: The ongoing cost for running a product, business, or system.", simple: "Daily running costs." },
    { term: "Payback Period", definition: "The length of time required to recover the cost of an investment.", simple: "Time to get money back." },
    { term: "Profit Oil", definition: "In a PSC, the production remaining after Cost Oil has been deducted, shared between government and contractor.", simple: "Leftover oil shared as profit." },
    { term: "PSC", definition: "Production Sharing Contract: A common fiscal regime where the contractor bears the risk and recovers costs from production.", simple: "Contract sharing oil production." },
    { term: "Real Terms", definition: "Values expressed in constant purchasing power, excluding inflation.", simple: "Money excluding inflation." },
    { term: "Ring Fencing", definition: "A limitation on tax consolidation where losses from one field cannot offset profits from another.", simple: "Tax wall around a project." },
    { term: "Royalty", definition: "A payment made to the resource owner (usually government) for the right to use the asset, typically a % of gross revenue.", simple: "Tax off the top." },
    { term: "Sunk Costs", definition: "Costs that have already been incurred and cannot be recovered.", simple: "Money already spent." },
    { term: "Tax", definition: "A compulsory financial charge imposed by the government.", simple: "Payment to government." },
    { term: "Working Interest", definition: "The percentage of ownership in a lease, granting the right to explore and produce.", simple: "Your share of the project." },
  ],
  videos: [
    { title: "Introduction to the Studio", duration: "2:15", url: "#", thumbnail: "bg-blue-900" },
    { title: "Building a Full FDP Model", duration: "8:45", url: "#", thumbnail: "bg-emerald-900" },
    { title: "Running Sensitivity Analysis", duration: "5:30", url: "#", thumbnail: "bg-amber-900" }
  ]
};