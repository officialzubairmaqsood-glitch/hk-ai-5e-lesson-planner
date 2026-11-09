# AI 5E Lesson Planner — Website v1 (separate project)

## Features
- Animated landing page with one **Design Teaching Material** button; form appears only after clicking.
- No login or registration. Teacher, school, grade, section, subject, topic, duration; curriculum optional.
- Differentiation options, AI instructions, selectable worksheets and optional answer key.
- AI generation via Netlify serverless function, 7-stage 5E procedure, 3 Bloom's objectives, activity and homework content.
- On-screen preview, browser Print / Save PDF, native DOCX download through Netlify function.
- Sample mode without API (Grade 7 Flowcharts example).

## Deploy
1. Create a **NEW** Netlify site; do not replace the HK Clubs portal or Madina's project.
2. Deploy from a Git repository containing this directory (recommended). Netlify will install the `docx` dependency and deploy the functions.
3. Under Site configuration > Environment variables, set `GEMINI_API_KEY` to your Gemini API key. Optionally set `GEMINI_MODEL` (default `gemini-2.5-flash-lite`). Keep the API key secret and server-side.
4. Redeploy, then test generation and DOCX downloads. For PDF choose Print / Save as PDF in the browser.
5. For local function testing, install Netlify CLI, run `npm install` and `netlify dev`. Opening index.html directly permits only the visual form; sample mode works but serverless functions do not.

## Important limitations (do not misrepresent)
- **Exact original uploaded two-page PDF template is NOT implemented yet**. The current output uses the original four-column lesson procedure concept, not pixel-perfect original page design. The supplied original template is included under `reference/` for integration.
- Multi-language document **selection UI** exists, but v1 generates **one selected language at a time**; multi-language batch packages and ZIP export remain to implement.
- The website interface's language selector currently translates the homepage headline/button only. The entire form has not been translated.
- Native DOCX includes editable lesson content but is not guaranteed to occupy exactly two pages. Homework PDF is not yet guaranteed to be exactly two A4 pages.
- No Supabase or teacher accounts are required. Generated content is not saved on the server.
- The open AI endpoint is not production hardened: add rate limiting, abuse protection, spending caps and logging before public launch. Netlify hosting does not include Gemini API usage; API billing is separate.
- Teachers must check AI content for accuracy and alignment before teaching.

## Gemini update
- Uses Gemini through `netlify/functions/generate.mjs`, never from browser JavaScript.
- Requires `GEMINI_API_KEY` in Netlify environment variables. No OpenAI key is needed.
- Model default: `gemini-2.5-flash-lite`; confirm model and current free-tier quota in Google AI Studio.
- Quota exhaustion (HTTP 429) produces a friendly retry-later message; no paid fallback.
- **3,000 packages/month is a planning target, not an enforced quota or guaranteed free capacity.**
- This version does NOT yet implement persistent shared quotas, IP-based abuse protection, lesson caching, or automatic multi-language output. Do not launch publicly at scale until these are added.
- For a manual drag-and-drop deployment, make sure Netlify builds and deploys the functions and installs npm dependencies; a static-only upload will not run generation or DOCX export. Prefer Git-connected deployment.

## November 2026 upgrade
- Added selectable **PowerPoint Presentation (PPTX)** with 15/18 slides, two themes, answer slides and speaker notes. Download from `/.netlify/functions/pptx`.
- Added landscape two-page lesson plan PDF generator at `/.netlify/functions/lesson-pdf`. It recreates the **structure** of the supplied template; review print output before use. It does not modify the original reference PDF.
- Lesson plan preview and DOCX now use the source template's heading and four-column table structure.
- Added optional textbook/unit reference and location fields.
- Gemini API key must remain in Netlify environment variables, never GitHub.
- Netlify must install the new `pptxgenjs` and `pdf-lib` dependencies from package.json. Connect this repo to Netlify and deploy from Git, not a static drop.
- Current PDF export uses PDF standard Helvetica; for Kyrgyz/Russian/Turkish text containing non-Latin glyphs, use DOCX export and print to PDF until embedded Unicode fonts are implemented.
- Slides are generated as editable text and shapes. The slide text is based on the generated lesson package; verify all generated examples and answers before class.
