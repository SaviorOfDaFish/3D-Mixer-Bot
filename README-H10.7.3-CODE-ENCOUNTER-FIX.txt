MONSTER HUNT H10.7.3 — SECRET CODE ENCOUNTER AUTO-OPEN FIX

FIXED:
- RIFTHUNT and all future encounter-type Secret Codes now immediately open
  the actual Hunt encounter after successful redemption.
- Fixed a frontend race where navigating to Hunt caused an async refresh to
  force the UI back to the Hunt Overview after the code encounter opened.
- If you already redeemed RIFTHUNT before this fix and The Mixer encounter is
  still stored on your account, entering RIFTHUNT again will RESUME that same
  encounter instead of saying the one-time code is used.
- This does NOT grant a second encounter and does NOT make codes reusable.
- One-time-use-per-player behavior remains intact.

REPLACE:
- index.js
- public/index.html
- public/app-phase-h2d7.js

public/styles-phase-h2c.css is included unchanged for convenience.

DEPLOY:
Commit -> Push origin -> Railway redeploy -> fully close/reopen Activity.

TEST:
Enter RIFTHUNT in the Hunt page Code box.
It should close the code popup and take you directly to The Mixer encounter.
