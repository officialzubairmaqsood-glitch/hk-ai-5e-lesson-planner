# AI Ustad G V4.5 — Complete Netlify source deployment

This is the **complete site source**, not the earlier two-file patch. It includes the homepage, all Netlify Functions, package.json, netlify.toml, and V4.5 generation-first backend.

## Recommended: GitHub-connected Netlify deployment
1. Back up the current working V4.4 repository or branch.
2. Extract this ZIP and upload its project contents to the **root** of the existing GitHub repository on branch `main` (do not upload the enclosing folder).
3. Keep the existing Netlify environment variable `GEMINI_API_KEY`. If you previously set `GEMINI_MODEL`, keep a model available to your key. Never place API keys in GitHub.
4. Netlify will run `npm run build`, which downloads the open-source Noto Sans font into the Functions directory during build. The ZIP intentionally contains no font binaries.
5. Confirm Netlify installed npm dependencies and bundled the Functions; then test generation and PDF/DOCX/PPTX downloads in EN/KG/RU/TR.

**Important:** This is a source deployment. Netlify's plain drag-and-drop static deploy is not appropriate for deploying these serverless functions. Use GitHub-connected Netlify builds or Netlify CLI.

## Expected behavior
- Failed language/quality checks do not block otherwise usable packages.
- Missing sections trigger one targeted Gemini repair attempt.
- If repair fails, usable content is returned as an incomplete draft requiring teacher review.
- If Gemini returns no usable material or is unavailable, generation cannot be guaranteed; retry is necessary.
- Some incomplete drafts may be unsuitable for PDF page-fit constraints; test exports before classroom use.

## Testing status
Local JavaScript syntax checks and package integrity checks only. No live Gemini API calls or Netlify deployment were performed here.
