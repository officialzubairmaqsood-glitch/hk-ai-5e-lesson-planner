# AI Ustad G — Multilingual QA integration (release candidate, not production certified)

## What is included
- Approved four-language website interface, unchanged form and Netlify functions.
- Two-pass Gemini generation + independent proofreading with deterministic quality report.
- Localized headings in lesson and worksheet PDFs and DOCX; Unicode font embedding with pdf-lib/fontkit.
- A4 landscape lesson PDF (2 pages) and A4 portrait worksheets with explicit overflow errors rather than hidden text.
- No API keys included. Existing Netlify GEMINI_API_KEY and GEMINI_MODEL environment variables must remain configured.

## Important deployment caveats
- This package was assembled from the available project copy; compare with live GitHub before replacing production files.
- Unicode fonts are fetched at runtime from Google Fonts' public repository (OFL), not bundled in this ZIP. Netlify function must have outbound network access. You may set AIUSTAD_FONT_URL to a trusted TTF URL; no font files are included.
- The two-pass AI pipeline consumes extra API quota and may time out on slow models.
- Long questions trigger explicit export errors; exact two-page worksheets are not yet guaranteed for every subject and input.
- Teacher approval is mandatory; native-speaker acceptance tests and live Gemini/Netlify end-to-end tests remain outstanding.
- DO NOT replace the production site without staging verification.

## Test plan
1. Deploy to a separate Netlify staging site connected to a test branch.
2. Set GEMINI_API_KEY and GEMINI_MODEL in staging environment.
3. Generate one lesson in each of Kyrgyz, Russian, Turkish and English.
4. Inspect all PDFs, DOCX and PPTX; verify no missing Cyrillic, no overlapping or clipped text.
5. Check QA report and compare against teacher-approved corrections from Grade 7 Python sample.
6. Obtain native teacher sign-off before production.
