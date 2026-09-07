MONSTER HUNT H10.7.4 — GLOBAL BACKGROUND SHOWCASE FIX

ALREADY PRESENT:
- Backgrounds page for unlocking/equipping backgrounds.
- Equipped background is used behind every Activity page.
- Live Distortions temporarily override the equipped cosmetic background.
- Existing Hide Menus / Show Menus JavaScript toggle.

FIXED/EXPANDED:
- Added the missing CSS for the existing Hide Menus toggle.
- The toggle now works globally on every page.
- In background-view mode, all menus/cards/navigation disappear.
- The small "Show Menus" control stays visible so players can return.
- It works with both normal equipped backgrounds and active Distortion backgrounds.
- The player's background preference remains unchanged.

CURRENT BACKGROUND SYSTEM:
- Hunter Camp starter background.
- Habitat unlock entries for Moonfen, Glasswaste, Gloamwood, Stormreach,
  Emberdeep, Frostgrave, Sporewilds, and Starfall Basin.
- Distortion entries for Mirror Scar and Black Bloom.
- Mixer Galaxy secret-code background.
- Dedicated art can be mapped into these slots later; the unlock/equip system
  does not need to be rebuilt.

REPLACE:
- public/index.html
- public/styles-phase-h2c.css

public/app-phase-h2d7.js and root index.js are included unchanged for convenience.
