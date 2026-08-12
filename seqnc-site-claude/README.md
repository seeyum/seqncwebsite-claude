# Seqnc Automations — Website

React + Vite + TypeScript. Bilingual (EN / FR) with a language toggle in the nav; the choice is stored in localStorage.

## Run locally

\`\`\`
npm install
npm run dev
\`\`\`

## Editing copy

All visible text lives in \`src/i18n/en.ts\` and \`src/i18n/fr.ts\`. The two files share the same shape — if you add a key to \`en.ts\`, TypeScript will require it in \`fr.ts\`. Components never contain hardcoded copy.

## Structure

- \`src/pages/Index.tsx\` — homepage, composed of the section components
- \`src/components/\` — one file per section
- \`src/pages/PrivacyPolicy.tsx\`, \`src/pages/TermsAndConditions.tsx\` — legal pages (/privacy, /terms)
- \`src/theme.ts\` — colors, fonts, shared style fragments
