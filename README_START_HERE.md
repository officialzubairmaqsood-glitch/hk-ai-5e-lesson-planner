# AI Ustad G — Verified Staging Build

This is an improved code package, **not a production-certified release**.

1. Read `VERIFICATION_REPORT.md` before testing.
2. Keep your current production Netlify site unchanged.
3. Deploy to a separate Netlify staging site with the same authorized Gemini environment configuration.
4. Run `npm install` and `node test-qa.mjs`.
5. Test generation and all document exports in English, Kyrgyz, Russian and Turkish. Inspect actual page count, line wrapping, glyphs, question/answer accuracy, and native-language fluency.
6. Do not release until the blockers in the verification report are resolved.

Font file: `netlify/functions/fonts/NotoSans-Regular.ttf` from the Noto font family (SIL Open Font License); see `FONT_LICENSE_NOTE.md`.
