import React from 'react';
    import { Helmet } from 'react-helmet';
    import { Link } from 'react-router-dom';
    import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
    import { Button } from '@/components/ui/button';
    import { ArrowLeft, BookText } from 'lucide-react';
    import { appCategories } from '@/data/applications';

    const Documentation = () => {
      const allApps = appCategories.flatMap(category => 
        category.apps.map(app => ({
          ...app,
          category: category.id,
          categoryTitle: category.name
        }))
      );

      const groupedApps = allApps.reduce((acc, app) => {
        const category = app.category || 'Other';
        if (!acc[category]) {
          acc[category] = {
            title: app.categoryTitle,
            apps: []
          };
        }
        acc[category].apps.push(app);
        return acc;
      }, {});

      const categoryOrder = [
        "geoscience",
        "reservoir",
        "drilling",
        "production",
        "facilities",
        "economic-project-management",
      ];

      const sortedCategories = categoryOrder.map(cat => ({
        key: cat,
        ...groupedApps[cat]
      })).filter(c => c.title);


      return (
        <>
          <Helmet>
            <title>Documentation - Petrolord</title>
            <meta name="description" content="Explore the documentation for all applications available on the Petrolord platform." />
          </Helmet>
          <div className="min-h-screen bg-slate-900 text-slate-200 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
              <div className="mb-6">
                <Button asChild variant="outline" className="bg-slate-800 border-slate-700 hover:bg-slate-700">
                  <Link to="/">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Home
                  </Link>
                </Button>
              </div>
              <Card className="bg-slate-800/50 border-slate-700 shadow-lg">
                <CardHeader className="text-center">
                  <CardTitle className="text-4xl font-bold text-lime-300 tracking-tight">Documentation Hub</CardTitle>
                  <p className="text-slate-400 mt-2">Your central resource for guides and tutorials.</p>
                </CardHeader>
                <CardContent className="mt-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {sortedCategories.map((category) => (
                      <Card key={category.key} className="bg-slate-900/70 border-slate-700 flex flex-col">
                        <CardHeader>
                          <CardTitle className="text-2xl text-lime-400">{category.title}</CardTitle>
                        </CardHeader>
                        <CardContent className="flex-grow">
                          <ul className="space-y-3">
                            {category.apps.map((app) => (
                              <li key={app.appId}>
                                <Link to={`/dashboard/apps/${app.appId}`} className="flex items-center space-x-3 text-slate-300 hover:text-lime-300 transition-colors group">
                                  <BookText className="h-5 w-5 text-slate-500 group-hover:text-lime-400" />
                                  <span>{app.name}</span>
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </>
      );
    };

    export default Documentation;