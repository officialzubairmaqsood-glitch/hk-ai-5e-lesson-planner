# V4.4 targeted hotfix

Changes: localized result buttons and headings (Kyrgyz/Russian/Turkish), translated generation messages, and displayed up to three deterministic QA issue paths to aid diagnosis. Fixed QA to allow warning-only results to be returned as `review_required` (teacher review still mandatory), while errors remain blocked. English heading detection now checks exact standalone headings instead of rejecting legitimate sentences that merely mention them.

Not yet verified: live Gemini responses, real export visual quality, complete localization of all dynamically generated content, native teacher approval. The AI reviewer remains mandatory; if it fails, generation will still fail.

Deployment: replace existing repository files at the same paths, do not upload ZIP itself. A commit on main automatically deploys to Netlify. Restore from backup branch if production breaks.
