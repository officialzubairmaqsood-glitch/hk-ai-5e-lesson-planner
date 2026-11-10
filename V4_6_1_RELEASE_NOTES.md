# AI Ustad G V4.6.1 — Reliability release

Complete deployment based on the existing V4.6 project.

## Changes
- Background generation worker (Netlify 15-minute function), job start and status polling.
- Persistent job storage with Netlify Blobs; job IDs are unguessable and results expire from access after 24 hours.
- Automatic Gemini/Groq fallback and bounded same-provider retry with status-aware handling.
- Existing V4.6 UI, animated robot, multilingual options, worksheets and document exporters preserved.
- Existing worksheet recovery and quality-warning behavior preserved.

## Important limitations
- Does not guarantee success during simultaneous API outages or quota exhaustion.
- Live API and Netlify deployment not tested in this environment.
- V4.6 visual PPTX improvements remain as implemented in the source; no new photographic image generation.
- Background status polling is valid only while the results screen remains open.
- Generated jobs are private by possession of their random job ID; do not share job links.
- Blobs may retain stored data after the 24-hour access expiry; configure data-retention cleanup if needed.

## Deploy
1. Backup the GitHub main branch.
2. Upload all extracted project files to the repository root, preserving netlify/functions.
3. Netlify builds with npm run build. Keep GEMINI_API_KEY, GEMINI_MODEL, GROQ_API_KEY in Netlify Functions environment variables.
4. Verify start-generation, generation-worker and generation-status functions are deployed.
5. Test one English and one Kyrgyz lesson and DOCX/PDF/PPTX downloads before general use.

## Troubleshooting
Check Netlify function logs for generation-worker, start-generation, and generation-status. Never post API keys in screenshots.
