# Monster Hunt — Phase H.1

## Live player + live hunting

H.1 connects the Discord Activity to the actual Discord user with the official
Embedded App SDK and the `identify` OAuth scope.

Both the Discord chat commands and the Activity use the same:

`/data/monster-hunt.db`

### Railway variables required

Keep:

`DISCORD_TOKEN`
`BOT_ENABLED=true`

Add:

`DISCORD_CLIENT_ID=<your Discord Application ID>`
`DISCORD_CLIENT_SECRET=<OAuth2 Client Secret from the same Discord Application>`

Do not put the Client Secret in GitHub.

### Discord Developer Portal

Use the SAME Discord Application/Bot you already have.

Under OAuth2, make sure there is at least one Redirect URI. For an Activity-only
OAuth flow, Discord's own guide allows a placeholder such as:

`https://127.0.0.1`

The Embedded App SDK handles the Activity authorization flow.

### Chat commands still work

YES.

Players who cannot access the Discord Activity can continue using the existing
chat commands because the original command handler is still included.

Examples:
- `!hunt`
- `!usebait rare`
- `!captureitems`
- `!eggs`
- `!incubate`
- `!hatch`
- `!pets`
- `!petdex`
- `!leaderboard`
- `!daily`
- merchant, Big Game, Ultra Hunt, and all other existing commands

The Activity and commands share the same SQLite save.

### H.1 test

1. Upload this build to the new GitHub repo.
2. Add `DISCORD_CLIENT_ID` and `DISCORD_CLIENT_SECRET` in Railway.
3. Deploy.
4. Open the Activity.
5. Your real Discord display name should replace `Activity Test Hunter`.
6. Run `!volumestatus`; opening the Activity should have created your real player.
7. Open Hunt.
8. Your hunter should appear.
9. Press `Begin Hunt`.
10. A real monster encounter is generated using the same normal-hunt logic as the bot.
11. The Monster Hunt Discord channel receives an Activity encounter update.
12. Choose Hunt Normally or one of your real owned capture items.
13. Roll to Catch.
14. The actual game result is saved to SQLite and posted to Discord.

### Art

Real monster definitions use their existing image filenames.

Add art under:

`public/assets/monsters/`
`public/assets/pets/`
`public/assets/eggs/`

Missing assets will fall back until the full art library is uploaded.
