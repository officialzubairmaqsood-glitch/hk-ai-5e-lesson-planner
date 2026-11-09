# AI Ustad G V4.5 — generation-first patch

Apply only `index.html` and `netlify/functions/generate.mjs` over the working V4.4 deployment. Keep all other files, fonts, Netlify configuration and GEMINI_API_KEY as they are.

- Quality and Kyrgyz corpus warnings do not block complete packages.
- Proofreading retries twice for structurally complete packages; fallback retains original generated content.
- If required sections are missing, a targeted Gemini repair request runs once.
- If repair fails, the available content is returned as an incomplete draft with `qualityReport.incompleteDraft`, `missingSections`, `repairAttempted` and `repairSucceeded` metadata.
- If no usable educational content was generated, the endpoint returns an error rather than pretending a package exists.
- The existing homepage, waiting screen, forms and export functions are unchanged.

## Known limitations
- DOCX/PDF/PPTX exports may not display empty sections elegantly; test incomplete drafts before using them in class.
- Gemini quota, timeouts, API failures, and malformed JSON can still prevent generation. No software can guarantee success when the AI provider returns no usable content.
- Automatic validation does not replace teacher proofreading.
- No live Gemini or Netlify deployment test was performed in this environment.
