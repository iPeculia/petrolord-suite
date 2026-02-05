# Quality Assurance Guide

## Functional Testing
*   **Search:** Verify fuzzy matching handles typos. Verify exact phrase matching.
*   **Navigation:** Verify Deep Linking (URL parameters) opens the correct article.
*   **Responsiveness:** Test on standard breakpoints (Mobile 375px, Tablet 768px, Desktop 1440px).

## Content QA
*   **Formatting:** Ensure Markdown renders h1-h6, lists, and code blocks correctly.
*   **Assets:** Verify all images load and videos play.
*   **Links:** Verify internal cross-linking works within the SPA router.

## Accessibility QA
*   **Contrast:** Text vs Background meets WCAG AA.
*   **Screen Readers:** Navigation and content are readable by NVDA/VoiceOver.
*   **Focus:** Focus indicator is visible on all interactive elements.

## Performance QA
*   **Bundle Size:** Ensure help data doesn't bloat the initial page load (use Code Splitting).
*   **Memory:** Check for leaks when opening/closing the Help sheet repeatedly.