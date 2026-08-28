H.2B.2 — TOKEN SYNC + INVENTORY USE BUTTONS

Replace ONLY:
index.js
public/app-phase-h2b.js

FIXES
- Merchant purchases immediately update the Activity's visible Hunt Token balance.
- Opening Gear also refreshes the visible Token and Hunter Point counters.
- Usable merchant items now show a Use Item button in Gear.
- Using an item from the Activity runs the same existing gameplay effects as !use.
- Item quantity is consumed live and the inventory refreshes immediately.
- Token/point rewards from usable items update the Activity immediately.
- Capture items and bait do not get generic Use buttons because they are consumed in their existing Hunt flows.
- Permanent collectibles and sealed merchant eggs do not get Use buttons.
