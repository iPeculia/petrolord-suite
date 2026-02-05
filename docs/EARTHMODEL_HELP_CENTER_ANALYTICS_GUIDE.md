# Help Center Analytics Guide

## Metrics to Track
1.  **Search Success Rate:** % of searches that result in an article click.
2.  **Article Deflection:** % of users who open Help and *do not* submit a support ticket afterwards.
3.  **Top Viewed:** Which topics are most popular? (Indicates user pain points or interest).
4.  **Feedback Score:** Ratio of Thumbs Up / Thumbs Down.

## Implementation
*   **Tracking:** Currently implemented via `helpAnalytics.js` (console logging).
*   **Production:** Connect to Google Analytics, Mixpanel, or PostHog events.
    *   Event: `help_search` { query: "string" }
    *   Event: `help_article_view` { articleId: "string" }
    *   Event: `help_feedback` { articleId: "string", positive: boolean }

## Reporting
*   Generate a monthly report summarizing these metrics to guide the Content Team and Product Managers.