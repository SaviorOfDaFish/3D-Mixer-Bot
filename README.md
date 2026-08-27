# Monster Hunt Activity — Phase B

Phase B adds a mobile-first Hunter appearance editor while staying completely isolated from the live Monster Hunt game.

## What works

- Discord/Railway-friendly responsive shell
- Custom Hunter avatar built from layered HTML/CSS
- Skin tone
- Hair style
- Hair color
- Eye shape
- Facial hair
- Outfit
- Cloak
- Headgear
- Live preview
- Save + refresh persistence using browser `localStorage`
- Mobile scrolling
- Desktop customizer layout

## Safety

This build still:

- Does NOT import the live Monster Hunt bot
- Does NOT read Railway `/data/data.json`
- Does NOT write player points, pets, tokens, inventory, or events
- Does NOT require the live Discord bot token
- Saves only cosmetic test settings to the browser/device
- Uses the fake `/api/test-hunter` endpoint

## Deploy update

Replace these files in the root of the DEV GitHub repository:

- `server.js`
- `package.json`
- `README.md`
- `public/index.html`
- `public/app.js`
- `public/styles.css`

Railway should automatically redeploy after the GitHub commit.

## Phase B test

1. Launch the Activity in Discord desktop.
2. Tap **Customize**.
3. Change several appearance options.
4. Tap **Save Appearance**.
5. Confirm the Home screen changes.
6. Refresh/reopen the Activity.
7. Confirm the saved appearance remains.
8. Repeat on mobile.
