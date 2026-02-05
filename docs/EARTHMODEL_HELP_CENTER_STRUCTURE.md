# EarthModel Pro Help Center Structure

## Architecture
The Help Center is built as a comprehensive, integrated module within the EarthModel Pro application. It uses a centralized data structure to manage articles, categories, and resources, ensuring easy maintenance and scalability.

## Core Components

### 1. Data Layer
- **helpCategories.js:** Defines the hierarchy and metadata for help topics.
- **helpArticles.js:** The main registry of all help content, aggregating data from specific category files.
- **helpFAQ.js:** A dedicated store for Frequently Asked Questions.

### 2. Component Layer
- **HelpCenter.jsx:** The main container component, implementing a slide-over sheet UI.
- **Search Engine:** A client-side full-text search utility (`helpSearch.js`) that indexes titles, content, and tags.

## Navigation Flow
1. **Entry:** User clicks "Help" icon in the sidebar or top bar.
2. **Home:** Displays Search Bar, Popular Categories, and Quick Links.
3. **Category View:** Lists all articles within a specific category.
4. **Article View:** Displays the full markdown content of an article with navigation controls.
5. **Search:** Overlay results that lead directly to articles.

## Content Strategy
- **Markdown-based:** All articles are written in Markdown for easy formatting (headers, lists, code blocks).
- **Tagging:** A robust tagging system allows for related article discovery and better search relevance.
- **Difficulty Levels:** Articles are tagged as Beginner, Intermediate, or Advanced to guide users appropriate content.