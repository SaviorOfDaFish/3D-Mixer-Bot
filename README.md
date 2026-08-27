# Monster Hunt H.2A.2 — Live Action Sync Fix

Fixes the two live issues found after the bot cutover:

1. **Roll to Catch**
   - capture POST now has explicit server-side error handling
   - browser button always unlocks after the request
   - connection/server errors are shown in the Activity instead of appearing to do nothing

2. **Discord !giveegg -> Activity Eggs**
   - Eggs now refresh from `/api/activity/sync`
   - that endpoint reads the current SQLite `/data/monster-hunt.db` state for the authenticated Discord user
   - Discord username/display name is synchronized to the same player record
   - Activity status correctly reports writes enabled

## Deploy
Replace the current GitHub repo files with this build and let Railway redeploy.

Expected log:
`Monster Hunt Activity H.2A.2 listening on port 8080`

Keep `BOT_ENABLED=true` on the NEW Railway service.

## Test
1. Discord: `!giveegg @MixedGaming190 common`
2. Close/reopen the Activity (or switch away from Eggs and back).
3. Eggs should show the granted Common Egg.
4. Hunt -> start a hunt -> choose Normal Hunt -> Roll to Catch.
5. The roll should resolve to the result screen.

If either operation fails, the Activity now prints the actual error instead of silently doing nothing.
