const http = require("http");
const fs = require("fs");
const path = require("path");

const PORT = Number(process.env.PORT || 3000);
const PUBLIC_DIR = path.join(__dirname, "public");

const CONTENT_TYPES = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".svg": "image/svg+xml"
};

const PET_DEX = [
  { key:"briar_pup", name:"Briar Pup", icon:"🌿", habitat:"Forest", rarity:"Common", ability:"Capture", description:"Slightly increases normal monster capture chance." },
  { key:"myceling", name:"Myceling", icon:"🍄", habitat:"Forest", rarity:"Rare", ability:"Egg Finder", description:"Increases the chance to discover eggs." },
  { key:"rootling_guardian", name:"Rootling Guardian", icon:"🌳", habitat:"Forest", rarity:"Epic", ability:"Item Finder", description:"Finds useful hunting supplies after successful hunts." },
  { key:"verdant_sentinel", name:"Verdant Sentinel", icon:"🦉", habitat:"Forest", rarity:"Legendary", ability:"Shiny Hunter", description:"Greatly increases shiny monster odds." },

  { key:"reef_snapper", name:"Reef Snapper", icon:"🪸", habitat:"Ocean", rarity:"Common", ability:"Bonus Points", description:"Earns bonus points from successful hunts." },
  { key:"abyss_prowler", name:"Abyss Prowler", icon:"🌊", habitat:"Ocean", rarity:"Rare", ability:"Cooldown", description:"Reduces the normal hunt cooldown." },
  { key:"inkfiend_hatchling", name:"Inkfiend Hatchling", icon:"🦑", habitat:"Ocean", rarity:"Epic", ability:"Item Finder", description:"Frequently finds useful hunting supplies." },
  { key:"leviacub", name:"Leviacub", icon:"🐉", habitat:"Ocean", rarity:"Legendary", ability:"Bonus Points", description:"Earns a large point bonus from successful hunts." },

  { key:"pebble_maw", name:"Pebble Maw", icon:"🪨", habitat:"Mountain", rarity:"Common", ability:"Item Finder", description:"Occasionally finds capture items after successful hunts." },
  { key:"crystal_burrower", name:"Crystal Burrower", icon:"💎", habitat:"Mountain", rarity:"Rare", ability:"Egg Finder", description:"Increases the chance to discover eggs." },
  { key:"ironhide_cub", name:"Ironhide Cub", icon:"🦍", habitat:"Mountain", rarity:"Epic", ability:"Capture", description:"Increases normal monster capture chance." },
  { key:"titan_spawn", name:"Titan Spawn", icon:"⛰️", habitat:"Mountain", rarity:"Legendary", ability:"Bonus Points", description:"Earns a large point bonus from successful hunts." },

  { key:"cinderling", name:"Cinderling", icon:"🔥", habitat:"Volcano", rarity:"Common", ability:"Bonus Points", description:"Earns bonus points from successful hunts." },
  { key:"ashfang", name:"Ashfang", icon:"🌋", habitat:"Volcano", rarity:"Rare", ability:"Item Finder", description:"Finds useful items after successful hunts." },
  { key:"ember_drake", name:"Ember Drake", icon:"🐉", habitat:"Volcano", rarity:"Epic", ability:"Egg Finder", description:"Greatly increases the chance to discover eggs." },
  { key:"infernal_wyrmling", name:"Infernal Wyrmling", icon:"🌋", habitat:"Volcano", rarity:"Legendary", ability:"Shiny Hunter", description:"Greatly increases shiny monster odds." },

  { key:"ice_crawler", name:"Ice Crawler", icon:"❄️", habitat:"Arctic", rarity:"Common", ability:"Cooldown", description:"Slightly reduces the normal hunt cooldown." },
  { key:"frost_wretch", name:"Frost Wretch", icon:"🐺", habitat:"Arctic", rarity:"Rare", ability:"Capture", description:"Increases normal monster capture chance." },
  { key:"glacier_horror", name:"Glacier Horror", icon:"🐻", habitat:"Arctic", rarity:"Epic", ability:"Bonus Points", description:"Earns additional points from successful hunts." },
  { key:"white_tyrant_cub", name:"White Tyrant Cub", icon:"👑", habitat:"Arctic", rarity:"Legendary", ability:"Capture", description:"Greatly increases normal monster capture chance." },

  { key:"living_eye", name:"Living Eye", icon:"👁️", habitat:"Void", rarity:"Common", ability:"Egg Finder", description:"Slightly increases the chance to discover eggs." },
  { key:"night_skitter", name:"Night Skitter", icon:"🕷️", habitat:"Void", rarity:"Rare", ability:"Shiny Hunter", description:"Slightly increases shiny monster odds." },
  { key:"void_watcher", name:"Void Watcher", icon:"🌌", habitat:"Void", rarity:"Epic", ability:"Egg Finder", description:"Greatly increases the chance to discover eggs." },
  { key:"astral_spawn", name:"Astral Spawn", icon:"🌠", habitat:"Void", rarity:"Legendary", ability:"Shiny Hunter", description:"Massively increases shiny monster odds." },

  { key:"storm_imp", name:"Storm Imp", icon:"⚡", habitat:"Sky", rarity:"Common", ability:"Item Finder", description:"Occasionally finds capture items after successful hunts." },
  { key:"cloud_ripper", name:"Cloud Ripper", icon:"☁️", habitat:"Sky", rarity:"Rare", ability:"Cooldown", description:"Reduces the normal hunt cooldown." },
  { key:"tempest_hatchling", name:"Tempest Hatchling", icon:"🌩️", habitat:"Sky", rarity:"Epic", ability:"Capture", description:"Greatly increases normal monster capture chance." },
  { key:"storm_emperor_cub", name:"Storm Emperor Cub", icon:"👑", habitat:"Sky", rarity:"Legendary", ability:"Cooldown", description:"Greatly reduces the normal hunt cooldown." },

  { key:"bone_gnawer", name:"Bone Gnawer", icon:"🦴", habitat:"Undead", rarity:"Common", ability:"Bonus Points", description:"Earns bonus points from successful hunts." },
  { key:"grave_whisper", name:"Grave Whisper", icon:"👻", habitat:"Undead", rarity:"Rare", ability:"Egg Finder", description:"Increases the chance to discover eggs." },
  { key:"crypt_fiend", name:"Crypt Fiend", icon:"⚔️", habitat:"Undead", rarity:"Epic", ability:"Item Finder", description:"Frequently finds valuable hunting supplies." },
  { key:"hollow_prince", name:"Hollow Prince", icon:"👑", habitat:"Undead", rarity:"Legendary", ability:"Bonus Points", description:"Earns a massive point bonus from successful hunts." }
];

const BEYOND_PETS = [
  { key:"ember_imp", name:"Ember Imp", icon:"🔥", habitat:"Infernal Rift", rarity:"Rare", ability:"Kindled Hunt", description:"After a failed capture, it can strengthen the next attempt.", image:"ember_imp.png" },
  { key:"ashbound_familiar", name:"Ashbound Familiar", icon:"🌋", habitat:"Infernal Rift", rarity:"Legendary", ability:"From the Ashes", description:"Can manifest rewards from successful hunts.", image:"ashbound_familiar.png" },
  { key:"frost_mephit", name:"Frost Mephit", icon:"❄️", habitat:"Shattered Frost", rarity:"Rare", ability:"Frozen Time", description:"Periodically freezes time between hunts.", image:"frost_mephit.png" },
  { key:"rime_sprite", name:"Rime Sprite", icon:"💎", habitat:"Shattered Frost", rarity:"Legendary", ability:"Second Chance", description:"May hold a fleeing monster in place for another chance.", image:"rime_sprite.png" },
  { key:"runeclaw_familiar", name:"Runeclaw Familiar", icon:"🔮", habitat:"Sunken Arcane", rarity:"Rare", ability:"Rune Reader", description:"Reads a creature's true pattern and strengthens knowledge.", image:"runeclaw_familiar.png" },
  { key:"glyph_wisp", name:"Glyph Wisp", icon:"🌀", habitat:"Sunken Arcane", rarity:"Legendary", ability:"Arcane Duplication", description:"May duplicate the magical signature of a newly discovered egg.", image:"glyph_wisp.png" },
  { key:"bone_familiar", name:"Bone Familiar", icon:"💀", habitat:"Hollow Veil", rarity:"Rare", ability:"Grave Scavenger", description:"Digs useful supplies from places best left undisturbed.", image:"bone_familiar.png" },
  { key:"veilkin", name:"Veilkin", icon:"👻", habitat:"Hollow Veil", rarity:"Legendary", ability:"Veilwalk", description:"Can keep a fleeing encounter from ending.", image:"veilkin.png" },
  { key:"star_familiar", name:"Star Familiar", icon:"✨", habitat:"Astral Fracture", rarity:"Rare", ability:"Written in the Stars", description:"Occasionally foresees a fortunate hunt.", image:"star_familiar.png" },
  { key:"paradox_imp", name:"Paradox Imp", icon:"🌌", habitat:"Astral Fracture", rarity:"Legendary", ability:"Paradox", description:"Sometimes causes one successful capture to have happened twice.", image:"paradox_imp.png" }
];

const OWNED_KEYS = [
  "briar_pup","myceling","verdant_sentinel","reef_snapper","leviacub",
  "crystal_burrower","ember_drake","ice_crawler","living_eye","storm_imp",
  "bone_gnawer","frost_mephit","rime_sprite","star_familiar"
];

const OWNED_PETS = [...PET_DEX, ...BEYOND_PETS]
  .filter(p => OWNED_KEYS.includes(p.key))
  .map((p, index) => ({
    ...p,
    id: index + 1,
    nickname: index === 11 ? "Rimebit" : null,
    level: [4,7,12,3,9,5,10,6,2,8,5,8,11,7][index] || 1,
    xp: [35,82,56,20,77,46,92,61,18,69,43,74,89,58][index] || 0,
    bond: [2,3,4,2,3,2,4,3,1,3,2,4,5,3][index] || 1
  }));

const INVENTORY = [
  { key:"berry", name:"Hunter Berry", icon:"🍓", qty:5, type:"Capture Item", effect:"+10% capture chance." },
  { key:"honey", name:"Sticky Honey", icon:"🍯", qty:2, type:"Capture Item", effect:"+20% capture chance." },
  { key:"net", name:"Enchanted Net", icon:"🕸️", qty:1, type:"Capture Item", effect:"+30% capture chance." },
  { key:"masterCharm", name:"Master Charm", icon:"🌟", qty:0, type:"Capture Item", effect:"Guaranteed capture." },
  { key:"rare_bait", name:"Rare Bait", icon:"🟦", qty:3, type:"Bait", effect:"Improves the rarity of the next ordinary encounter." },
  { key:"epic_bait", name:"Epic Bait", icon:"🟪", qty:1, type:"Bait", effect:"Greatly improves the rarity of the next ordinary encounter." },
  { key:"legendary_bait", name:"Legendary Bait", icon:"🟨", qty:1, type:"Bait", effect:"Targets the highest rarity tier for the next ordinary encounter." },
  { key:"fresh_tracks", name:"Fresh Tracks", icon:"🐾", qty:1, type:"Merchant", effect:"Immediately clears the normal hunt cooldown.", image:"fresh_tracks.png" },
  { key:"golden_lure", name:"Golden Lure", icon:"🟡", qty:1, type:"Merchant", effect:"Next ordinary encounter is guaranteed Legendary.", image:"golden_lure.png" },
  { key:"mystery_sack", name:"Mystery Sack", icon:"🎒", qty:2, type:"Merchant", effect:"Opens for a random reward.", image:"mystery_sack.png" },
  { key:"rusted_key", name:"Rusted Key", icon:"🗝️", qty:1, type:"Collectible", effect:"Opens a forgotten hunter cache containing Hunt Tokens.", image:"rusted_key.png" },
  { key:"monster_whistle", name:"Monster Whistle", icon:"📯", qty:1, type:"Collectible", effect:"Clears hunt cooldown and guarantees Rare or better.", image:"monster_whistle.png" }
];

const TROPHIES = [
  { key:"briarjaw_fang", name:"Briarjaw Fang", icon:"🦷", earned:true, source:"Bounty Hunt", description:"Taken from the Briarjaw after a successful bounty." },
  { key:"loaded_knucklebone", name:"Loaded Knucklebone", icon:"🎲", earned:true, source:"Bounty Hunt", description:"A warped bone die recovered from the Knucklebone Horror." },
  { key:"crowned_horn", name:"Crowned Horn", icon:"🦌", earned:true, source:"Bounty Hunt", description:"A prestigious trophy from the Crowned Ravager." },
  { key:"graveglass_eye", name:"Graveglass Eye", icon:"👁️", earned:true, source:"Bounty Hunt", description:"A black crystal eye carrying a ghostly pupil." },
  { key:"riftmaw_shard", name:"Riftmaw Shard", icon:"💠", earned:false, source:"Bounty Hunt", description:"A dimensional shard from the Riftmaw." }
];

const TITLES = [
  { name:"Rift Hunter", unlocked:true },
  { name:"Shiny Hunter", unlocked:true },
  { name:"Event Hunter", unlocked:true },
  { name:"Perfectly Executed", unlocked:true },
  { name:"Against All Odds", unlocked:false },
  { name:"The Chosen Mixer", unlocked:false, secret:true }
];

const COSMETICS = [
  { key:"forest_cloak", name:"Forest Cloak", slot:"Cloak", unlocked:true, requirement:"Starter cosmetic" },
  { key:"rift_cloak", name:"Rift Cloak", slot:"Cloak", unlocked:true, requirement:"Reach Level 10" },
  { key:"frost_cloak", name:"Frost Cloak", slot:"Cloak", unlocked:false, requirement:"Reach Level 15" },
  { key:"trophy_horns", name:"Trophy Horns", slot:"Headgear", unlocked:false, requirement:"Earn 5 bounty trophies" },
  { key:"ember_outfit", name:"Ember Hunter Armor", slot:"Outfit", unlocked:false, requirement:"Discover 20 PetDex companions" },
  { key:"big_game_mantle", name:"Big Game Champion Mantle", slot:"Cloak", unlocked:false, requirement:"Win a Big Game Hunt" }
];


const PHASE_E_EVENTS = {
  bigGame: {
    active: true,
    title: "Big Game Hunt",
    startedAt: Date.now() - 34 * 60 * 1000,
    endsAt: Date.now() + 86 * 60 * 1000,
    huntCooldownMinutes: 30,
    playerScore: 11,
    tokenBalance: 18,
    leaderboard: [
      { name: "Fiddle", score: 18 },
      { name: "Card and Book Dragon", score: 14 },
      { name: "Activity Test Hunter", score: 11 },
      { name: "daba9494", score: 8 },
      { name: "Mythicredd", score: 5 }
    ],
    tokenRewards: { Common: 1, Rare: 2, Epic: 4, Legendary: 8, Mythic: 15 },
    placementRewards: [50, 30, 15]
  },

  bounty: {
    active: true,
    id: "bounty-briarjaw-dev",
    npc: "Aldric",
    npcIcon: "🧔",
    targetHidden: true,
    discoveredName: null,
    clue: "Deep claw marks score the old trees. The tracks are too broad for a wolf, and thorn-covered fur has been found near the creek.",
    difficulty: "Dangerous",
    participants: 6,
    attempts: 17,
    postedAt: Date.now() - 9 * 60 * 60 * 1000,
    durationText: "Until captured",
    participationReward: "+20 Hunter Points • +5 Hunt Tokens",
    catcherReward: "Major bounty reward + trophy",
    trophy: "Briarjaw Fang",
    possibleTargets: [
      { name: "The Briarjaw", icon: "🌿", trophy: "Briarjaw Fang" },
      { name: "The Knucklebone Horror", icon: "🎲", trophy: "Loaded Knucklebone" },
      { name: "The Crowned Ravager", icon: "🦌", trophy: "Crowned Horn" },
      { name: "The Graveglass Stalker", icon: "👁️", trophy: "Graveglass Eye" },
      { name: "The Riftmaw", icon: "💠", trophy: "Riftmaw Shard" }
    ]
  },

  distortion: {
    active: true,
    key: "frost",
    name: "The Shattered Frost",
    icon: "❄️",
    plane: "Shattered Frost",
    startedAt: Date.now() - 41 * 60 * 1000,
    endsAt: Date.now() + 139 * 60 * 1000,
    huntCooldownMinutes: 30,
    eventMonsterChance: 60,
    eggDropChance: 40,
    egg: "Shardbound Egg",
    colorClass: "frost",
    story: "A fracture has opened above the hunting grounds. Frozen ruins can be seen through the breach, and creatures from the Shattered Frost are crossing into our world.",
    monsters: [
      { name: "Shardling", rarity: "Common", icon: "❄️", points: 3 },
      { name: "Frostgaze Watcher", rarity: "Rare", icon: "👁️", points: 5 },
      { name: "Rimeclaw Horror", rarity: "Rare", icon: "🐺", points: 5 },
      { name: "Glacial Runegolem", rarity: "Epic", icon: "🧊", points: 8 },
      { name: "Aurora Wyrm", rarity: "Legendary", icon: "🐉", points: 15 }
    ],
    knownPlanes: [
      { key:"infernal", name:"The Infernal Rift", icon:"🔥", discovered:true },
      { key:"frost", name:"The Shattered Frost", icon:"❄️", discovered:true },
      { key:"arcane", name:"The Sunken Arcane", icon:"🌊", discovered:true },
      { key:"hollow", name:"The Hollow Veil", icon:"👻", discovered:true },
      { key:"astral", name:"The Astral Fracture", icon:"🌌", discovered:true },
      { key:"verdant", name:"Unknown Plane", icon:"❔", discovered:false },
      { key:"dream", name:"Unknown Plane", icon:"❔", discovered:false }
    ]
  },

  nextSeason: {
    focus: ["Big Game Hunts", "Bounty Hunts"],
    ambientSystem: "Distortions",
    ultrasEnabled: false
  }
};

function safeFilePath(urlPath) {
  const cleanPath = decodeURIComponent((urlPath || "/").split("?")[0]);
  const requested = cleanPath === "/" ? "/index.html" : cleanPath;
  const resolved = path.normalize(path.join(PUBLIC_DIR, requested));
  if (!resolved.startsWith(PUBLIC_DIR)) return null;
  return resolved;
}

function json(res, payload) {
  res.writeHead(200, { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store" });
  res.end(JSON.stringify(payload));
}

const server = http.createServer((req, res) => {
  if (req.url === "/api/test-hunter") {
    return json(res, {
      name: "Activity Test Hunter",
      level: 12,
      points: 245,
      tokens: 18,
      title: "Rift Hunter",
      activePetKey: "rime_sprite",
      activePet: { name: "Rimebit", level: 11, icon: "💎" },
      stats: {
        pets: OWNED_PETS.length,
        petDex: "17/32",
        trophies: TROPHIES.filter(t => t.earned).length
      }
    });
  }

  if (req.url === "/api/phase-d-data") {
    return json(res, {
      ownedPets: OWNED_PETS,
      petDex: PET_DEX,
      beyondPets: BEYOND_PETS,
      inventory: INVENTORY,
      trophies: TROPHIES,
      titles: TITLES,
      cosmetics: COSMETICS
    });
  }

  if (req.url === "/api/phase-e-events") {
    return json(res, PHASE_E_EVENTS);
  }

  const filePath = safeFilePath(req.url);
  if (!filePath) {
    res.writeHead(403);
    return res.end("Forbidden");
  }

  fs.stat(filePath, (statErr, stat) => {
    if (statErr || !stat.isFile()) {
      res.writeHead(404);
      return res.end("Not found");
    }

    const ext = path.extname(filePath).toLowerCase();
    res.writeHead(200, {
      "Content-Type": CONTENT_TYPES[ext] || "application/octet-stream",
      "Cache-Control": "no-store"
    });
    fs.createReadStream(filePath).pipe(res);
  });
});

server.listen(PORT, "0.0.0.0", () => {
  console.log(`Monster Hunt Activity Phase E DEV running on port ${PORT}`);
  console.log("SAFE MODE: fake test data + local cosmetic/pet selection only.");
});
