# AI Ustad G V4.6 — Complete Netlify/GitHub deployment

This archive is the complete project root, not a two-file patch. It is based on the provided V4.5 complete deployment ZIP.

## Deployment
1. Back up the existing GitHub `main` branch.
2. Extract this ZIP. Upload the *contents* (not the enclosing folder) into the repository root on `main`, preserving `netlify/functions`.
3. Netlify automatically builds from GitHub using `npm run build` and deploys the functions.
4. In Netlify Project configuration > Environment variables, retain `GEMINI_API_KEY`, `GEMINI_MODEL` and `GROQ_API_KEY` (do not put secrets in GitHub). Optional `GROQ_MODEL` defaults to `llama-3.3-70b-versatile`.
5. Test a short English lesson, then Kyrgyz, Russian and Turkish, and download DOCX/PDF/PPTX.

## Changes
- Gemini-first 5E lesson generation; Groq automatic fallback when Gemini fails.
- Groq-first worksheet recovery; Gemini automatic fallback when Groq fails.
- Five-question minimum for each worksheet; repair missing sections where possible. Existing complete material preserved.
- Nonblocking teacher-review warnings and incomplete draft labeling.
- New native editable PowerPoint process diagram and three-column comparison table; existing slide layouts retained.
- Animated simple robot waiting screen, localized status messages, regenerate and return-home/reset controls.
- Additional UI translations and language-selector synchronization.

## Important limitations
- Free API tiers and Netlify function timeouts may still interrupt generation. No guarantee of 100% first-click success.
- This build has passed static JavaScript syntax checks, but live provider calls and actual document rendering require deployed testing.
- AI-produced educational content requires teacher review. A warning is not proof of correctness.
- External image sourcing is not included: PowerPoint diagrams and tables are editable native shapes, but photographic images are not guaranteed.
- If both providers fail to return usable material, the app reports an error rather than claiming success.
