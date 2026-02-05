# Help Center Maintenance Guide

## Adding New Articles
1. Create a new object in the appropriate category file (e.g., `src/data/helpCenter/articles/modeling.js`).
2. Ensure unique `id` generation.
3. Add comprehensive Markdown content.
4. Tag appropriately.
5. The `helpArticles.js` aggregator will automatically include it.

## Updating Existing Content
- Edit the content string in the respective data file.
- Update the `lastUpdated` field.

## Managing Categories
- Edit `src/data/helpCenter/helpCategories.js` to add, remove, or reorder categories.
- Ensure the `icon` import matches available Lucide icons.

## Search Optimization
- Update `src/utils/helpSearch.js` if the scoring algorithm needs tuning.
- Ensure `tags` in articles are relevant synonyms that users might search for.

## Deployment
- The Help Center data is bundled with the application.
- Updates require a new build and deployment of the frontend.