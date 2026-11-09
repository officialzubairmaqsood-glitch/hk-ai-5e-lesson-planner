# AI Ustad G — Release testing, 9 November 2026

## Implemented in this build
- Replaced static English PowerPoint slide headings, prompts, fallback classroom instructions, and speaker-note labels with Kyrgyz, Russian, Turkish, English locale dictionaries.
- Fixed 5E stage fallback for translated stage names by selecting the corresponding stage position.
- Improved two-page PDF worksheet pagination: simulate actual drawing for every ordered split and select the most balanced split that fits. Export explicitly fails when no readable two-page layout fits, rather than clipping or silently adding a third page. Some long AI questions will require regeneration; this is not a universal guarantee of successful two-page output.
- Retained earlier Unicode font bundling, DOCX translations and fail-closed independent proofreading.

## Tests actually executed
- JavaScript syntax checks for all Netlify .mjs modules: PASS.
- Existing deterministic QA test script: executed.
- Actual PPTX generation using installed pptxgenjs: PASS in all four locales; four valid PPTX files produced, each with 18 slides.
- Inspected PowerPoint XML slide headings: PASS for localized learning-goals heading in all four languages.
- ZIP integrity: verified.

## Cannot honestly mark as completed
- Live Gemini generation and second AI proofreading: NOT RUN; no authorized GEMINI_API_KEY / staging Netlify environment provided.
- End-to-end PDF/DOCX renderer execution: NOT RUN; npm dependency installation timed out; PDF split code passed syntax checks but not real document visual inspection.
- Exact two-page worksheet *for every possible generated input*: impossible without content-length limits; this implementation explicitly fails if content does not fit.
- Native-speaker teacher approval: NOT OBTAINED; only actual Kyrgyz/Russian/Turkish teachers can certify generated content. Do not describe this as passed.
- Real generated PPTX content in all four languages: the four mock tests use English lesson data to isolate the static UI translation; real AI output still requires live testing.

## Release verdict
STAGING ONLY. Do not replace production until Gemini and all export formats are tested with real samples and native teachers approve them.
