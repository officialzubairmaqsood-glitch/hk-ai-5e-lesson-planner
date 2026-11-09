# AI Ustad G V4 — verified code release candidate (NOT production certified)

## Changes from V3
- Restored the two original reference PDFs from the user-provided GitHub backup.
- Restored the original default Gemini model name; `GEMINI_MODEL` environment override remains supported. This does not establish whether the model is actually accessible.
- Added checks for reviewer-corrupted multiple-choice options, matching pairs, and duplicate questions.
- Blocks publication if the automated language review flags errors or warnings; teacher review is still required.
- Blocks empty worksheets, enforces 15-question class activities, and measures answer-key space before drawing.
- Added automated regression checks for reference preservation, localization dictionaries and safety gates.

## Verified
- Node syntax checks for all `.mjs` files.
- `test-qa.mjs` and `v4-check.mjs` pass.
- ZIP integrity and original reference preservation.

## NOT verified / external requirements
- Real Gemini API calls: API key is in user's Netlify environment, not in this local environment. No API requests were made.
- Rendered PDF and DOCX: npm dependencies unavailable locally; cannot assert exact two-page visual quality. Code rejects overflow, but two-page output is not visually certified.
- PPTX rendering: localization code exists, but native-language editorial correctness and every slide's visual layout are not certified.
- Native-speaker review: must be done by qualified Kyrgyz, Russian and Turkish educators; cannot be simulated by automated checks.
- Production deployment: do not overwrite the live site without user approval.

## Deployment note
Use the full project directory (including `netlify/functions`, `package.json`, `netlify.toml`, `reference`) in the existing GitHub repository. Deploying the ZIP by drag-and-drop alone may omit Netlify Functions. Keep the existing Netlify environment variable `GEMINI_API_KEY` secret.
