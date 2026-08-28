PHASE H.2C — LIVE BIG GAME HUNT

Replace/add ONLY these 4 files:
index.js
public/index.html
public/app-phase-h2c.js
public/styles-phase-h2c.css

WHAT IS LIVE
- Events tab refreshes authenticated live event state when opened.
- Big Game appears only while the real Big Game Hunt is active.
- Big Game detail page shows:
  * exact live event countdown
  * existing 30-minute event hunt cooldown
  * your event token score
  * your rank
  * your actual Hunt Token wallet
  * live leaderboard
  * existing rarity token rewards
  * existing Top 3 point rewards (50 / 30 / 15)
- The Big Game leaderboard/status re-syncs every 5 seconds while Events is open.
- Hunt Now routes into the existing LIVE Activity hunt/capture flow.
- If your Big Game hunt is on cooldown, the button becomes a live countdown.
- Big Game catches use the existing backend reward logic and same SQLite state.
- After an Activity capture, Big Game event data refreshes again.
- Bounty and Distortion Activity panels are hidden for H.2C until their live phases are wired.

ADMIN TEST
Use the existing admin command:
!startbiggame
Then open Activity -> Events.

VERIFY HEADER
PHASE H.2C • LIVE BIG GAME HUNT
