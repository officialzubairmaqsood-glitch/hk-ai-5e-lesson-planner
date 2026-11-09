# AI Ustad G QA integration — staging build

This package is based on the previously supplied multilingual website ZIP, not a verified byte-for-byte copy of the current live Netlify deployment.

Implemented:
- Independent second Gemini language/editorial pass.
- Structural validation after review; reject reviewer changes to lesson duration or required arrays.
- Deterministic QA report and visible teacher-review notice.
- Localized worksheet headings for Kyrgyz, Russian, Turkish and English.
- Known Kyrgyz terminology checks.
- Existing UI, generation, export and lesson planning files preserved.

Limitations:
- NOT production-ready. No live API end-to-end test was possible here.
- Existing PDF renderers still replace non-ASCII text with '?' and MUST be repaired before multilingual PDF deployment.
- No native-speaker certification or complete dictionary.
- Additional Gemini call increases time and API usage.
- If review fails, content is returned with a teacher-review warning, not claimed approved.
- Do NOT deploy over live site yet.

Next steps: Unicode PDF fonts, localized lesson-plan headings, real Gemini tests and native-teacher review.
