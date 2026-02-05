# Help Center Maintenance Guide

## Adding New Articles
1.  Navigate to `src/data/helpCenter/articles/`.
2.  Open the relevant category file (e.g., `StructuralModelingDetailed.js`).
3.  Add a new object to the exported array.
    - Ensure `id` is unique.
    - Use Markdown for the `content` field.
    - Update metadata (`tags`, `difficulty`, `lastUpdated`).

## Updating FAQs
1.  Open `src/data/helpCenter/faqDetailed.js`.
2.  Add or modify the objects.
3.  Ensure the `category` matches an existing Help Center category for proper filtering.

## Managing Resources
1.  Upload the physical file (PDF/ZIP) to `public/assets/`.
2.  Update `src/data/helpCenter/resourcesDetailed.js` with the path and metadata.

## Search Optimization
1.  When adding a new article, update `src/data/helpCenter/searchKeywords.js`.
2.  Add synonyms or common misspellings to improve discoverability.

## Quality Assurance
- **Links:** Verify all markdown links work.
- **Images:** Ensure all referenced images exist in the public assets folder.
- **Formatting:** Check rendering of headers, lists, and code blocks in the app.