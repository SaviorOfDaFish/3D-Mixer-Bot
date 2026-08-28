H.2B.3 — CACHE FIX

Replace ONLY:
index.js
public/index.html
public/app-phase-h2b3.js

IMPORTANT:
- app-phase-h2b3.js is a NEW filename. Add it; do not rename it back to app-phase-h2b.js.
- index.html now explicitly loads /app-phase-h2b3.js?v=1330.
- The visible header must say: PHASE H.2B.3 • TOKEN + USE FIX

Expected:
- Merchant purchase immediately updates the top-right Hunt Token total.
- Gear shows Use Item buttons on usable merchant items such as Torn Page,
  Mystery Sack, and Rusted Key.
- Capture items/bait remain tied to hunt flow, not generic Use Item.
