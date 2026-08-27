# Monster Hunt — Phase H.2A.1
## Fresh Season Fix + Admin Testing Bypass

This fixes the season-ended lock problem and updates `!resetseason` to the exact
new rule:

KEEP ONLY permanent collection/history.
WIPE anything that can help next season.

### Critical cutover note

If the NEW Railway logs say:

`BOT_ENABLED=false`

then Discord `!commands` are still being answered by the OLD Railway bot.

That is why an old season lock can still appear even when the Activity is using
the new Railway service.

After deploying H.2A.1:

1. Stop the OLD Railway bot/service.
2. Set `BOT_ENABLED=true` in the NEW Railway service.
3. Redeploy.
4. The same Discord bot will reconnect from the NEW Railway project.
5. Run `!volumestatus`.
6. Run `!startnewseason`.
7. Test `!giveegg @yourself common`.

### Reset commands

All three aliases do the same fresh-season reset:

`!resetseason`
`!startnewseason`
`!newseason`

### Preserved

- permanent Monster Dex / lifetime monster catches
- permanent PetDex species discoveries
- permanent pet-collection/history titles and achievements
- Discord identity
- Activity appearance/customization

### Wiped

- Hunter Points
- Hunt Tokens
- token counters
- bait/lures/active bait
- capture items
- merchant purchases / collection / effects
- eggs
- incubators
- owned pets
- equipped pet
- Companion XP and bond progress
- Species Knowledge
- relics
- Ultra progress
- Big Game records/progress
- cooldowns
- daily quests/rewards
- seasonal titles/achievements
- trades
- active merchant
- Token Surge
- Distortions
- shared seasonal world/event progress
- Recent Hunts

### Admin commands during a locked season

Normal players stay locked, but administrators can still use testing and
maintenance commands including `!giveegg`, `!givebait`, `!givecapture`,
`!givepoints`, token admin commands, merchant/admin tests, `!volumestatus`, and
`!startnewseason`.

### Railway

Keep the same `/data` Volume and same SQLite database:

`/data/monster-hunt.db`

No new Volume or database is needed.
