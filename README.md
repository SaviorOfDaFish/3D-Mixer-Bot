# Monster Hunt — Phase H.0.1
## Fresh Season + New Railway Volume + SQLite + Discord Bridge

This build starts the new Monster Hunt season from zero.

There is NO old-season save migration and NO data.json import.

## Storage

Mount the NEW Railway Volume at:

`/data`

The new season is stored in:

`/data/monster-hunt.db`

Both the Discord bot and Discord Activity are served by this same new Railway
service.

## Admin checks

`!volumestatus`
- verifies the `/data` Volume
- shows `/data/monster-hunt.db`
- shows saved player count
- shows save size and last write
- confirms Activity writes are still OFF

`!activitytest`
- sends a test update into the configured Monster Hunt Discord channel
- verifies the new combined service can send Activity/game announcements

## Setup

1. Upload this ZIP's contents to the NEW GitHub repository.
2. Deploy that repository in the NEW Railway project.
3. Add a Railway Volume and mount it at `/data`.
4. Add your existing Discord bot token as `DISCORD_TOKEN`.
5. Set `BOT_ENABLED=false` at first.
6. Deploy.
7. Open the Activity and confirm `PHASE H.0.1 • FRESH SEASON`.
8. Stop the OLD Railway bot.
9. Change the NEW service to `BOT_ENABLED=true`.
10. Redeploy.
11. In Discord run `!volumestatus`.
12. Run `!activitytest`.

Do not run the old and new Railway deployments with the same Discord bot token
at the same time.

## What H.0.1 does NOT do yet

The Activity is still read-only and most G.9 screens still use DEV player data.
H.0.1 is the infrastructure cutover.

## Next: H.1

H.1 will replace DEV data with real new-season SQLite data:
- Discord player identity
- real profile / points / tokens
- real pets and equipped companion
- real eggs and incubators
- real PetDex
- real inventory
- real leaderboards
- real active events
- real Recent Hunts
- real monster / pet / egg image mapping

H.2 will enable Activity gameplay writes and real Discord hunt updates.
