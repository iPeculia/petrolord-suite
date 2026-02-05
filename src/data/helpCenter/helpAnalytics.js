// Mock analytics data for the help center admin dashboard
export const helpAnalytics = {
  overview: {
    totalViews: 45200,
    avgTimeOnPage: '3:45',
    helpfulRate: '88%',
    topSearchTerms: ['import las', 'grid generation', 'fault seal', 'export', 'petrophysics']
  },
  topArticles: [
    { id: 'gs-detailed-1', title: 'Welcome to EarthModel Pro', views: 5400 },
    { id: 'sm-detailed-5', title: 'Grid Building', views: 4200 },
    { id: 'pp-detailed-1', title: 'Petrophysics Basics', views: 3800 }
  ],
  userFeedback: [
    { id: 1, articleId: 'sm-detailed-3', comment: 'Very clear explanation of fault truncation.', rating: 5 },
    { id: 2, articleId: 'ml-detailed-2', comment: 'Needs more examples on parameter tuning.', rating: 3 }
  ]
};