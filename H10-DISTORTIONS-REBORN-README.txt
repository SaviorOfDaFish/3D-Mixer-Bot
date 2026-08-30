MONSTER HUNT H.10 — DISTORTIONS REBORN

This patch is built directly on H9.3 and preserves the existing Hunter Training, season automation, Activity systems, Comeback Points, Hunter Points, Hunt Tokens, pet abilities, Companion XP, eggs, inventory, Big Game, Merchant, Bounties, and other hunt reward logic.

DISTORTION RULES
- Five brand-new current-season Distortions.
- 3-hour duration.
- Hunt cooldown becomes 30 minutes while active.
- Opening resets everyone's hunt so everyone can hunt immediately.
- 10 minutes before collapse, everyone's lastHunt is cleared ONCE, granting one final hunt.
- When it ends, the Distortion closes and normal Hunt cooldown rules return.
- World Shatter auto-engine and manual start are hard-disabled; legacy code remains archived in index.js for reference only.
- Comeback catch bonus and comeback point multiplier remain in the normal capture/reward pipeline and therefore continue during Distortions.
- Activity background swaps to the active Distortion background and returns automatically when no Distortion is active.

NEW DISTORTIONS
1. The Mirror Scar
2. The Black Bloom
3. The Chrono Tear
4. The Upside-Down Sea
5. The Dreaming Gate

ASSET FOLDER
Create: public/assets/distortions/
Place each distortion background/opening/closing image there.
Monster art still uses public/assets/monsters/.
Distortion egg art uses your existing egg asset resolver/folder.
Pet art uses your existing pet asset folder.

MIRROR SCAR ART NAMES
public/assets/distortions/mirror_scar_background.png
public/assets/distortions/mirror_scar_opening.png
public/assets/distortions/mirror_scar_closing.png
public/assets/monsters/gleamcrawler.png
public/assets/monsters/echo_hound.png
public/assets/monsters/reflection_stalker.png
public/assets/monsters/prism_doppel.png
public/assets/monsters/mirrorbound_colossus.png
reflected_egg.png
reflected_egg_hatching.png
gleamlet.png
shardpup.png
echo_sprite.png
mirrormane.png

Cache version: 1940
