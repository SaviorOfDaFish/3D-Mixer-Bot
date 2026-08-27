# Monster Hunt — Phase H.1.1
## Discord Activity Proxy Fix

H.1 loaded the Activity shell but did not complete the live Discord-user/API
connection. The screenshots showed the exact symptoms:
- Home stuck on `Loading...`
- Hunt still showing `Activity Test Hunter`
- no live `Begin Hunt` button

H.1.1 fixes the Activity API routing to use Discord's official embedded-app
proxy path:

`/.proxy/api/...`

This includes authentication, profile loading, leaderboards, player data, hunt
start, capture resolution, and all other Activity API calls.

## Upload

Replace the H.1 files in the SAME new GitHub repo with this build.

Keep the existing Railway Volume mounted at:

`/data`

Keep the Railway variables:
- `DISCORD_TOKEN`
- `BOT_ENABLED`
- `DISCORD_CLIENT_ID`
- `DISCORD_CLIENT_SECRET`

## Test

After Railway deploys, the logs should say:

`Monster Hunt Activity H.1.1 listening on port 8080`

Then open the Activity in Discord.

Expected:
1. Home changes from `Loading...` to your Discord display name.
2. Hunt no longer says `Activity Test Hunter`.
3. Hunt displays `Begin Hunt`.
4. Opening the Activity creates/loads your real SQLite player.
5. `!volumestatus` should show the saved-player count.

If it still fails, send the Railway logs immediately after opening the Activity.

## Chat commands

All existing `!commands` still work. Activity support is additive; players who
cannot use Activities can continue playing entirely through Discord chat.
