MONSTER HUNT H10.7.1 — H10.6.43 + SECRETS & DISCOVERY MERGE

THIS PACKAGE USES THE H10.6.43 PLAYER-GALLERY-FULL-ART ZIP YOU JUST UPLOADED AS THE WORKING BASE.

REPLACE:
- index.js                         (repo ROOT)
- public/index.html
- public/styles-phase-h2c.css
- public/app-phase-h2d7.js

PRESERVED FROM H10.6.43:
- Player Gallery full-character framing / head-cropping fix
- Coffincrawl image/name hotfix
- Hatch reveal image containment fix
- Bounty trophy art fallback
- Current Big Hunt / Bounty point rebalance
- Restored Dice Locker backend
- Expanded custom Dice Body Colors
- Expanded Number Colors
- Galaxy / Distortion / Moonfen / Emberdeep / Frostgrave / Mirror Scar /
  Black Bloom / Prismatic / Legendary dice themes
- Existing pet-ability readability styling

MERGED H10.7 FEATURES:
1. SECRET CODES
   - 🔐 Code button on Hunt page
   - Codes NEVER expire
   - Normal codes are ONE-TIME USE PER PLAYER
   - Codes can unlock cosmetics/backgrounds
   - Codes can start immediate custom encounters that bypass normal hunt cooldown
   - Encounter code is NOT consumed if the player already has an active encounter

2. SERVER RECORDS
   - Biggest Monster
   - Most Bounties
   - Rarest Catch
   - Longest Catch Streak
   - Longest Physical D100 Success Streak
   - Most Lifetime Catches
   - Specimen size and streak tracking begin with H10.7 because old catches did not store those values

3. COMMUNITY RIDDLES
   - New Riddle tab under Events
   - Answers are entered through the same Code button
   - Riddle solve is one-time GLOBAL for the server
   - Starter riddle reveals the Nameless Merchant

4. BACKGROUND UNLOCKS
   - New Backgrounds page
   - Equipped background appears behind ALL Activity pages
   - Habitat backgrounds unlock through catches
   - Mixer Galaxy can unlock through a secret code
   - Live Distortions temporarily override the cosmetic background
   - After a Distortion ends, the player's equipped background returns

TEST CODES CURRENTLY CONFIGURED:
- MIXER190  -> unlock/equip Mixer Galaxy background
- RIFTHUNT  -> immediate special encounter with The Mixer

DEPLOY:
1. Replace the four files above.
2. Commit to main.
3. Push origin.
4. Wait for Railway to redeploy.
5. Fully close and reopen the Discord Activity.
