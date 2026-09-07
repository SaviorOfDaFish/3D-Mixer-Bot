MONSTER HUNT H10.6.40 — BOUNTY POINT BALANCE + PET ABILITY CARDS

BASE:
H10.6.39 stable frontend.

REPLACE:
- index.js                         (repo ROOT)
- public/index.html
- public/styles-phase-h2c.css

BOUNTY POINT CHANGE:
Current Big Hunt podium scale remains 15 / 10 / 5.

Bounty completion is now:
- Every participating hunter: +5 Hunter Points
- Bounty catcher: +10 additional Hunter Points
- Catcher total: +15 Hunter Points

This keeps a Bounty catcher capped at the same 15-point top reward as Big Hunt.
Hunt Token rewards were NOT reduced:
- Participant: +5 Hunt Tokens
- Catcher: +20 additional Hunt Tokens (25 total because the catcher also participated)

PET ABILITY UI:
- Every active Companion ability is displayed in its own bordered card.
- Ability name, Rank, and effect are separated vertically for easier reading.
- Natural and inherited abilities retain distinct accent borders.

NO OTHER GAME BALANCE OR FRONTEND SYSTEMS WERE CHANGED.

After replacing:
1. Commit to main.
2. Push origin.
3. Wait for Railway to redeploy.
4. Fully close/reopen the Discord Activity.


TARGETED IMAGE HOTFIX (2026-09-07):
- Corrected Coffincrawl display name/image filename while preserving the existing `coffinrawl` save-data key.
- Bounty trophy/reward art now falls back to the bounty monster art when the dedicated trophy image file is missing.
- Hatch reveal companion art is hard-capped and clipped inside its art area so oversized source PNGs cannot cover the name, rarity, or ability text.
- No global character/monster renderer paths were changed.

DICE LOCKER RESTORE — H10.6.41 (2026-09-07):
- Restored the server-side Dice Locker payload that the existing frontend expects at phaseD.diceLocker.
- Restored POST /api/activity/dice-cosmetic so Equip Dice Look saves correctly.
- Dice Color, Number Color, and Prestige Theme grids no longer render blank.
- Starter defaults remain Hunter's Sapphire + White Numbers + Classic.
- Added progression locks for extra colors and Galaxy / Distortion prestige themes.
- Existing saved dice cosmetic choices are preserved when still unlocked/valid.
- No dice physics, D100 result logic, character renderer, bounty balance, or image-hotfix behavior was changed.


H10.6.42 — EXPANDED DICE COSMETICS
- Expanded Dice Body Colors from 6 to 14.
- Expanded Number Colors from 6 to 12.
- Expanded Prestige Themes from 3 to 10.
- Added Moonfen Mist, Emberdeep Forge, Frostgrave Aurora, Mirror Scar, Black Bloom, Prismatic Glass, and Legendary Hunter.
- Added unique locker-preview treatments for special finishes.
- Existing Galaxy and Distortion themes remain intact.
- Unlocks use Hunter Level, PetDex discoveries, and current-season Bounty Trophies.
- Dice cosmetics remain visual only and do not change D100 physics or results.
