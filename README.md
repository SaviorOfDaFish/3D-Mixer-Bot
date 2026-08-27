# Monster Hunt — Phase H.2A
## Full Live Systems

Built directly on the WORKING H.1.1 Discord Activity proxy/auth version.

### Live systems now connected to `/data/monster-hunt.db`

- real Discord player
- real normal hunting + capture resolution
- real owned pets
- real equipped pet
- real pet naming
- real PetDex discoveries
- real egg inventory
- real incubator slots/timers
- real Activity incubation
- real Activity hatching
- real bait / capture-item inventory
- real merchant collection inventory
- real current leaderboard
- real weekly leaderboard when weekly score data exists
- real Recent Hunts feed
- real active-event overview
- inactive special events are hidden
- real Activity hunt announcements in Discord
- real Activity hatch announcements in Eggs & Pets channel

### Recent Hunts

Every successful normal capture through either:
- Discord `!hunt`
- the Discord Activity

is now added to the same Recent Hunts feed.

### Eggs

The Eggs tab no longer creates fake DEV eggs.

If you own no eggs, it correctly shows an empty inventory.

When a real egg drops:
1. it appears in Eggs
2. click it to incubate
3. the real timer is saved in SQLite
4. when ready, Hatch becomes available
5. the resulting real pet is saved in SQLite
6. PetDex updates
7. the Eggs & Pets Discord channel receives the hatch update

### Pets

Equip and pet-name actions now save to SQLite rather than only browser storage.

### Events

The Activity only displays special systems that are actually active:
- current daily event
- Big Game Hunt
- World Distortion
- Token Surge
- active Merchant

Detailed Big Game and Distortion tabs appear only while those systems are live.

### Chat commands

All existing `!commands` are preserved and continue to use the same SQLite save.

### Railway

No new Railway storage is needed.

Keep:
- `/data` Volume
- `DISCORD_TOKEN`
- `DISCORD_CLIENT_ID`
- `DISCORD_CLIENT_SECRET`
- `BOT_ENABLED`

### Upload

Replace the files in your current H.1.1 GitHub repo with this ZIP.

After deployment look for:

`Monster Hunt Activity H.2A listening on port 8080`

and:

`PHASE H.2A • LIVE SYSTEMS`

### Recommended tests

1. Open Home — real player + leaderboard.
2. Hunt once — Recent Hunts should update after a successful catch.
3. Gear — should show actual quantities, including zeroes.
4. Pets — if you own a pet, rename/equip it and reload Activity.
5. Use the admin Discord command `!giveegg @you common` for testing.
6. Open Eggs — the real egg should appear.
7. Click egg — it should move into a real incubator.
8. Wait or use your normal admin testing workflow to make it ready.
9. Hatch — real pet should appear and persist after reload.
10. Events — only currently active event cards should appear.

### Next: H.2B

Automated monthly season management:
- 24-hour channel warning
- DMs to participating players
- 1-hour warning
- final standings archive
- competitive reset
- preserve permanent Monster Dex/PetDex/history only
- wipe anything that can help next season: points, tokens, bait, lures, items,
  merchant-use inventory, eggs, pets, knowledge, relics, cooldowns, event state, etc.
