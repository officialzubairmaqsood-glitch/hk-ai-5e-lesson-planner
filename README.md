# AI 5E Lesson Planner — Four-Language / Mixed-Activity Upgrade (test release)

Deploy the **contents** of this folder to the root of your GitHub repository. Keep a backup of the currently working site. Netlify must deploy the new commit; preserve your existing `GEMINI_API_KEY` and working `GEMINI_MODEL` environment variables. Never commit API keys.

## New features
- Four interface language selections: English, Kyrgyz, Russian, Turkish. Form labels and primary navigation translate; document output language can be selected independently.
- Teacher instructions accept any of the four languages. Gemini receives the selected output language.
- Strict class activity blueprint: **5 MCQs, 2 definitions, 2 explanations, 1 matching, 2 critical-thinking, 1 think-yourself, 1 diagram/design/draw, 1 practical** (15 questions total).
- Server checks question counts, duplicate question text, required answers, and distinct MCQ choices; invalid output requests regeneration. This does not guarantee factual correctness; teachers must review.
- A4 portrait worksheet PDF / DOCX, with narrow margins, topic, teacher and student fields; no duration in worksheet headers.
- Existing A4 landscape two-page lesson plan and PPTX function preserved.

## Known limitations — read before using
- Full UI localization is a **first pass**; some dynamically generated options, messages and export headings remain in English.
- Native server-generated worksheet PDFs use PDF-Lib's built-in Latin fonts; **Cyrillic cannot be rendered by that endpoint**. It returns an explicit error instead of corrupt characters. For Kyrgyz/Russian, use the browser Print/Save as PDF or DOCX.
- The strict 15-question activity may be too dense for exactly two readable A4 pages. The PDF export rejects detected overflow; DOCX and browser printing require manual page-count review.
- PDF/DOCX export cannot automatically draw arbitrary topic-specific diagrams. Diagram boxes provide drawing space; some predefined flowchart/network shapes exist.
- No automated full browser-to-Netlify integration tests were performed. Test before replacing the production site.
- The interface allows one output language per generation, not four packages in a single request.
- Existing ZIP, multi-file and other format checkboxes are not a guarantee that all combinations are implemented.

## Smoke test
1. Deploy to a test site and set Gemini environment variables.
2. Switch each interface language; verify labels and typed instructions.
3. Generate an ICT lesson; confirm 15 class-activity questions and their types.
4. Export DOCX, worksheet PDF (English), lesson-plan PDF and PPTX; inspect layout and page count.
5. Generate Kyrgyz and Russian and check DOCX/Print text characters.
6. Check the teacher answer key, matching pair correctness, MCQ distractors and factual accuracy.
