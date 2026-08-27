# Monster Hunt Activity — DEV Shell

This folder is intentionally separate from the live Monster Hunt bot.

## Safety rules for Phase A

- Does NOT import the live bot.
- Does NOT read `data.json`.
- Does NOT write player data.
- Does NOT require the Discord bot token.
- Uses a fake `/api/test-hunter` endpoint only.
- Mobile-first and vertically scrollable.

## Run locally

1. Install Node.js 20+.
2. Open a terminal in this folder.
3. Run:
   `npm start`
4. Open:
   `http://localhost:3000`

## Next milestone

Deploy this folder as a completely separate development service, then connect it to a separate Discord development application. Only after desktop + mobile launch successfully should real Monster Hunt data be connected read-only.
