const DEFAULT_APPEARANCE = {
  body: "male",
  skin: "#d59a72",
  hair: "short",
  hairColor: "#3f2a22",
  eyes: "round",
  eyeColor: "#4a6d84",
  beard: "none",
  outfit: "ranger",
  cloak: "forest",
  headgear: "none",
  weapon: "bow"
};

let hunter = null;
let gameData = null;
let playerProgress = { level:0, trophies:0, petdex:0 };
let currentScreen = "home";
let currentPetFilter = "All";
let currentInventoryFilter = "All";
let phaseEEvents = null;
let devBountyAttempts = 0;
let timerInterval = null;
let phaseFHunting = null;
let activeHuntZone = null;
let currentEncounter = null;
let selectedTool = null;
let huntAttemptNumber = 1;
let rimebitSecondChanceUsed = false;
let localToolUses = {};
let firstHollowKingTestShown = false;
let phaseGAlignment = null;
let phaseG5Leaderboards = null;
let activeLeaderboard = 'current';

let renameTargetPetKey = null;

function loadPetNicknames() {
  try {
    return JSON.parse(localStorage.getItem("monsterHuntDevPetNames") || "{}") || {};
  } catch {
    return {};
  }
}
let localPetNicknames = loadPetNicknames();

function savePetNicknames() {
  localStorage.setItem("monsterHuntDevPetNames", JSON.stringify(localPetNicknames));
}

function petArtPath(pet) {
  if (!pet) return null;
  const map = {
    veilkin: "/assets/pets/veilkin.png"
  };
  return map[pet.key] || null;
}

function applyLocalPetNames() {
  if (!gameData?.ownedPets) return;
  for (const pet of gameData.ownedPets) {
    if (localPetNicknames[pet.key]) pet.nickname = localPetNicknames[pet.key];
    else if (pet.key !== "rime_sprite") pet.nickname = null;
  }
}



let savedAppearance = loadAppearance();
let workingAppearance = { ...savedAppearance };
let activePetKey = localStorage.getItem("monsterHuntDevActivePet") || "veilkin";

const OPTIONS = {
  body: [
    { value:"male", label:"Male" },
    { value:"female", label:"Female" }
  ],
  skin: [
    { value:"#f4c6a5", label:"Light" }, { value:"#dca37d", label:"Warm" },
    { value:"#b97852", label:"Tan" }, { value:"#8f563b", label:"Deep" },
    { value:"#5f392d", label:"Dark" }, { value:"#3e2823", label:"Rich" }
  ],
  hair: [
    { value:"short", label:"Short" }, { value:"long", label:"Long" },
    { value:"messy", label:"Messy" }, { value:"swept", label:"Side Swept" },
    { value:"ponytail", label:"Ponytail" }, { value:"bald", label:"Bald" },
    { value:"mohawk", label:"Mohawk", unlock:{type:"level",amount:5} },
    { value:"braid", label:"Braid", unlock:{type:"level",amount:10} }
  ],
  hairColor: [
    { value:"#241b18", label:"Black" }, { value:"#4a2f27", label:"Brown" },
    { value:"#8d5a32", label:"Auburn" }, { value:"#c99a4d", label:"Blonde" },
    { value:"#d9d9d9", label:"Silver", unlock:{type:"level",amount:15} },
    { value:"#6b4aa3", label:"Rift Violet", unlock:{type:"petdex",amount:20} }
  ],
  eyes: [
    { value:"round", label:"Round" }, { value:"narrow", label:"Narrow" },
    { value:"wide", label:"Wide" }, { value:"soft", label:"Soft" },
    { value:"sharp", label:"Sharp", unlock:{type:"level",amount:5} }
  ],
  beard: [
    { value:"none", label:"None" }, { value:"stubble", label:"Stubble" },
    { value:"mustache", label:"Mustache" }, { value:"goatee", label:"Goatee" },
    { value:"full", label:"Full Beard", unlock:{type:"level",amount:10} }
  ],
  outfit: [
    { value:"ranger", label:"Ranger" }, { value:"leather", label:"Leather" },
    { value:"scout", label:"Scout" }, { value:"traveler", label:"Traveler" },
    { value:"rift", label:"Rift Hunter", unlock:{type:"level",amount:10} },
    { value:"frost", label:"Frost Hunter", unlock:{type:"level",amount:15} },
    { value:"ember", label:"Ember Hunter", unlock:{type:"petdex",amount:20} }
  ],
  cloak: [
    { value:"none", label:"None" }, { value:"forest", label:"Forest" },
    { value:"brown", label:"Traveler" }, { value:"blue", label:"Blue" },
    { value:"rift", label:"Rift", unlock:{type:"level",amount:10} },
    { value:"ember", label:"Ember", unlock:{type:"petdex",amount:20} },
    { value:"frost", label:"Frost", unlock:{type:"level",amount:15} }
  ],
  headgear: [
    { value:"none", label:"None" }, { value:"cap", label:"Hunter Cap" },
    { value:"band", label:"Headband" },
    { value:"hood", label:"Rift Hood", unlock:{type:"level",amount:10} },
    { value:"horns", label:"Trophy Horns", unlock:{type:"trophies",amount:5} }
  ],
  weapon: [
    { value:"none", label:"None" }, { value:"bow", label:"Hunter Bow" },
    { value:"spear", label:"Spear" }, { value:"sword", label:"Sword" },
    { value:"staff", label:"Rift Staff", unlock:{type:"level",amount:10} }
  ]
};

function loadAppearance() {
  try {
    return { ...DEFAULT_APPEARANCE, ...(JSON.parse(localStorage.getItem("monsterHuntDevAppearance") || "null") || {}) };
  } catch { return { ...DEFAULT_APPEARANCE }; }
}
function saveAppearance() {
  localStorage.setItem("monsterHuntDevAppearance", JSON.stringify(savedAppearance));
}

function unlockText(unlock) {
  if (!unlock) return "";
  if (unlock.type === "level") return `🔒 Level ${unlock.amount}`;
  if (unlock.type === "trophies") return `🔒 ${unlock.amount} Trophies`;
  if (unlock.type === "petdex") return `🔒 PetDex ${unlock.amount}`;
  return "🔒 Locked";
}
function isUnlocked(option) {
  if (!option.unlock) return true;
  if (option.unlock.type === "level") return playerProgress.level >= option.unlock.amount;
  if (option.unlock.type === "trophies") return playerProgress.trophies >= option.unlock.amount;
  if (option.unlock.type === "petdex") return playerProgress.petdex >= option.unlock.amount;
  return false;
}

function applyAppearanceToAvatar(avatar, appearance) {
  if (!avatar) return;
  avatar.style.setProperty("--skin", appearance.skin);
  avatar.style.setProperty("--hair", appearance.hairColor);
  avatar.style.setProperty("--eyes", appearance.eyeColor || "#4a6d84");
  for (const key of ["body","hair","beard","outfit","cloak","headgear","weapon"]) {
    avatar.dataset[key] = appearance[key];
  }
  const eyes = avatar.querySelector(".eyes");
  if (eyes) {
    eyes.classList.remove("eye-round","eye-narrow","eye-wide");
    eyes.classList.add(`eye-${appearance.eyes}`);
  }
}
function renderMainAvatar() {
  applyAppearanceToAvatar(document.querySelector("#avatarPreview .avatar"), savedAppearance);
}

function navTo(screen) {
  currentScreen = screen;
  document.querySelectorAll(".screen").forEach(s => s.classList.toggle("active", s.dataset.screen === screen));
  document.querySelectorAll(".bottom-nav [data-nav]").forEach(b => b.classList.toggle("nav-active", b.dataset.nav === screen));
  document.getElementById("pageScroll").scrollTop = 0;
}
document.addEventListener("click", e => {
  const nav = e.target.closest("[data-nav]");
  if (nav) navTo(nav.dataset.nav);
});

function petDisplayName(p) {
  return localPetNicknames[p.key] || p.nickname || p.name;
}
function ownedPet(key) { return gameData?.ownedPets.find(p => p.key === key) || null; }
function allKnownPet(key) { return [...(gameData?.petDex || []), ...(gameData?.beyondPets || [])].find(p => p.key === key) || null; }

function renderActivePet() {
  const pet = ownedPet(activePetKey) || gameData?.ownedPets[0];
  if (!pet) return;
  activePetKey = pet.key;
  localStorage.setItem("monsterHuntDevActivePet", activePetKey);
  const petIcon = document.getElementById("petIcon");
  const petImage = document.getElementById("petImage");
  petIcon.textContent = pet.icon;
  const artPath = petArtPath(pet);
  if (artPath) {
    petImage.src = artPath;
    petImage.alt = `${petDisplayName(pet)} companion art`;
    petImage.classList.remove("hidden");
    petIcon.classList.add("hidden");
  } else {
    petImage.removeAttribute("src");
    petImage.classList.add("hidden");
    petIcon.classList.remove("hidden");
  }
  document.getElementById("petName").textContent = petDisplayName(pet);
  document.getElementById("petLevel").textContent = pet.level;
  document.getElementById("petBond").textContent = pet.bond;
  document.getElementById("petAbility").textContent = pet.ability;

  const xpTarget = Math.max(100, pet.level * 100);
  const xpCurrent = Math.round((Number(pet.xp || 0) / 100) * xpTarget);
  const xpNeeded = Math.max(0, xpTarget - xpCurrent);
  const xpPct = Math.min(100, Math.max(0, Number(pet.xp || 0)));
  const petXpText = document.getElementById("petXpText");
  const petXpFill = document.getElementById("petXpFill");
  const petXpNext = document.getElementById("petXpNext");
  if (petXpText) petXpText.textContent = `${xpCurrent} / ${xpTarget}`;
  if (petXpFill) petXpFill.style.width = `${xpPct}%`;
  if (petXpNext) petXpNext.textContent = `${xpNeeded} XP to next level`;
  renderPets();
}

function rarityOrder(r) {
  return ({Legendary:4,Epic:3,Rare:2,Common:1}[r] || 0);
}

function renderPetFilters() {
  const filters = ["All","Forest","Ocean","Mountain","Volcano","Arctic","Void","Sky","Undead","Distortion"];
  const row = document.getElementById("petFilters");
  row.innerHTML = "";
  filters.forEach(name => {
    const b = document.createElement("button");
    b.className = `filter-chip${currentPetFilter === name ? " active" : ""}`;
    b.textContent = name;
    b.onclick = () => { currentPetFilter = name; renderPetFilters(); renderPets(); };
    row.appendChild(b);
  });
}

function renderPets() {
  if (!gameData) return;
  const grid = document.getElementById("petGrid");
  let pets = [...gameData.ownedPets].sort((a,b) => rarityOrder(b.rarity)-rarityOrder(a.rarity) || b.level-a.level);
  if (currentPetFilter === "Distortion") pets = pets.filter(p => !["Forest","Ocean","Mountain","Volcano","Arctic","Void","Sky","Undead"].includes(p.habitat));
  else if (currentPetFilter !== "All") pets = pets.filter(p => p.habitat === currentPetFilter);

  grid.innerHTML = pets.map(p => `
    <article class="pet-card ${p.key === activePetKey ? "active-pet" : ""}" data-rarity="${p.rarity}" data-pet-key="${p.key}">
      <div class="pet-portrait">
        <span class="rarity-pill">${p.rarity}</span>
        ${petArtPath(p)
          ? `<img class="pet-card-image" src="${petArtPath(p)}" alt="${petDisplayName(p)} art" />`
          : `<span class="pet-symbol">${p.icon}</span>`}
      </div>
      <div class="pet-card-body">
        <h3>${petDisplayName(p)}</h3>
        <p class="card-meta">${p.name !== petDisplayName(p) ? `${p.name} • ` : ""}${p.habitat} • Lv. ${p.level}</p>
        <p class="card-ability">${p.ability}</p>
        <div class="pet-progress"><span style="width:${Math.max(8,p.xp)}%"></span></div>
      </div>
    </article>
  `).join("");

  grid.querySelectorAll("[data-pet-key]").forEach(card => {
    card.onclick = () => showPetDetail(card.dataset.petKey);
  });
}

function showPetDetail(key) {
  const p = ownedPet(key) || allKnownPet(key);
  if (!p) return;
  document.getElementById("detailEyebrow").textContent = p.habitat.toUpperCase();
  document.getElementById("detailTitle").textContent = petDisplayName(p);
  const owned = !!ownedPet(key);

  document.getElementById("detailBody").innerHTML = `
    <div class="detail-hero">
      ${petArtPath(p)
        ? `<img class="detail-pet-image" src="${petArtPath(p)}" alt="${petDisplayName(p)} art" />`
        : `<div class="detail-symbol">${p.icon}</div>`}
    </div>
    <div class="detail-stat-grid">
      <div class="detail-stat"><small>Rarity</small><b>${p.rarity}</b></div>
      <div class="detail-stat"><small>Habitat</small><b>${p.habitat}</b></div>
      <div class="detail-stat"><small>Level</small><b>${owned ? p.level : "—"}</b></div>
      <div class="detail-stat"><small>Bond</small><b>${owned ? `${p.bond}/5` : "—"}</b></div>
    </div>
    <p class="detail-copy"><b>${p.ability}</b><br>${p.description}</p>
    ${owned ? `
      <p class="detail-copy">Companion XP: <b>${p.xp}%</b> toward the next level.</p>
      <div class="detail-actions">
        <button class="secondary" id="renameDetailPet">✏️ Name Pet</button>
        <button class="primary" id="equipDetailPet">${p.key === activePetKey ? "Currently Active" : "Make Active"}</button>
      </div>` : `
      <p class="detail-copy">This companion has not been collected in the test profile.</p>`}
  `;
  document.getElementById("detailModal").classList.remove("hidden");
  const equip = document.getElementById("equipDetailPet");
  if (equip) equip.onclick = () => {
    activePetKey = p.key;
    renderActivePet();
    closeDetail();
    document.getElementById("status").textContent = `✅ ${petDisplayName(p)} is now the active DEV companion.`;
  };

  const rename = document.getElementById("renameDetailPet");
  if (rename) rename.onclick = () => openRenamePet(p.key);
}

function openRenamePet(key) {
  const pet = ownedPet(key);
  if (!pet) return;
  renameTargetPetKey = key;
  document.getElementById("petNameInput").value = localPetNicknames[key] || pet.nickname || "";
  document.getElementById("renamePetModal").classList.remove("hidden");
  setTimeout(() => document.getElementById("petNameInput").focus(), 50);
}

function closeRenamePet() {
  document.getElementById("renamePetModal").classList.add("hidden");
  renameTargetPetKey = null;
}

function commitPetName(clear=false) {
  if (!renameTargetPetKey) return;
  const pet = ownedPet(renameTargetPetKey);
  if (!pet) return;

  const input = document.getElementById("petNameInput");
  const raw = clear ? "" : input.value.trim();
  const safeName = raw.replace(/[<>]/g, "").slice(0, 24);

  if (safeName) localPetNicknames[renameTargetPetKey] = safeName;
  else delete localPetNicknames[renameTargetPetKey];

  savePetNicknames();
  applyLocalPetNames();

  const finalName = petDisplayName(pet);
  closeRenamePet();

  renderActivePet();
  renderPets();
  renderDex();

  document.getElementById("status").textContent =
    safeName ? `✅ ${pet.name} is now named ${finalName} in this DEV Activity.` : `✅ ${pet.name} is using its species name again.`;
}

function closeDetail() { document.getElementById("detailModal").classList.add("hidden"); }
document.getElementById("closeDetail").onclick = closeDetail;
document.getElementById("detailModal").addEventListener("click", e => { if (e.target.id === "detailModal") closeDetail(); });
document.getElementById("closeRenamePet").onclick = closeRenamePet;
document.getElementById("savePetName").onclick = () => commitPetName(false);
document.getElementById("clearPetName").onclick = () => commitPetName(true);
document.getElementById("renamePetModal").addEventListener("click", e => { if (e.target.id === "renamePetModal") closeRenamePet(); });
document.getElementById("petNameInput").addEventListener("keydown", e => {
  if (e.key === "Enter") commitPetName(false);
});


function renderDex() {
  if (!gameData) return;
  const discovered = new Set(gameData.ownedPets.map(p => p.key));
  const habitats = ["Forest","Ocean","Mountain","Volcano","Arctic","Void","Sky","Undead"];
  const habitatIcons = {Forest:"🌲",Ocean:"🌊",Mountain:"🏔️",Volcano:"🌋",Arctic:"❄️",Void:"🌌",Sky:"☁️",Undead:"🪦"};
  const host = document.getElementById("dexHabitats");
  host.innerHTML = habitats.map(h => {
    const pets = gameData.petDex.filter(p => p.habitat === h);
    const count = pets.filter(p => discovered.has(p.key)).length;
    return `
      <section class="habitat-section">
        <div class="habitat-heading"><h3>${habitatIcons[h]} ${h}</h3><span class="level-pill">${count}/${pets.length}</span></div>
        <div class="dex-list">
          ${pets.map(p => `
            <div class="dex-entry ${discovered.has(p.key) ? "" : "locked"}">
              <div class="dex-icon">
                ${discovered.has(p.key) && petArtPath(p)
                  ? `<img class="dex-pet-image" src="${petArtPath(p)}" alt="${p.name} art" />`
                  : discovered.has(p.key) ? p.icon : "❔"}
              </div>
              <div><b>${discovered.has(p.key) ? (ownedPet(p.key) ? petDisplayName(ownedPet(p.key)) : p.name) : "Undiscovered"}</b><small>${discovered.has(p.key) ? `${p.rarity} • ${p.ability}` : "Keep hatching eggs"}</small></div>
            </div>`).join("")}
        </div>
      </section>`;
  }).join("");

  const beyond = document.getElementById("beyondGrid");
  beyond.innerHTML = gameData.beyondPets.map(p => {
    const found = discovered.has(p.key);
    return `
      <article class="pet-card ${found ? "" : "locked"}" data-rarity="${p.rarity}" ${found ? `data-pet-key="${p.key}"` : ""}>
        <div class="pet-portrait">
          <span class="rarity-pill">${found ? p.rarity : "???"}</span>
          ${found && petArtPath(p)
            ? `<img class="pet-card-image" src="${petArtPath(p)}" alt="${p.name} art" />`
            : `<span class="pet-symbol">${found ? p.icon : "🌀"}</span>`}
        </div>
        <div class="pet-card-body"><h3>${found ? (ownedPet(p.key) ? petDisplayName(ownedPet(p.key)) : p.name) : "Unknown Companion"}</h3><p class="card-meta">${found ? p.habitat : "Beyond the known habitats"}</p></div>
      </article>`;
  }).join("");
  beyond.querySelectorAll("[data-pet-key]").forEach(card => card.onclick = () => showPetDetail(card.dataset.petKey));
}

function renderInventoryFilters() {
  const filters = ["All","Capture Item","Bait","Merchant","Collectible"];
  const row = document.getElementById("inventoryFilters");
  row.innerHTML = "";
  filters.forEach(name => {
    const b = document.createElement("button");
    b.className = `filter-chip${currentInventoryFilter === name ? " active" : ""}`;
    b.textContent = name;
    b.onclick = () => { currentInventoryFilter = name; renderInventoryFilters(); renderInventory(); };
    row.appendChild(b);
  });
}

function renderInventory() {
  if (!gameData) return;
  let items = gameData.inventory;
  if (currentInventoryFilter !== "All") items = items.filter(i => i.type === currentInventoryFilter);
  document.getElementById("inventoryGrid").innerHTML = items.map(i => `
    <article class="inventory-card ${i.qty === 0 ? "zero" : ""}">
      <div class="inventory-top"><span class="inventory-icon">${i.icon}</span><span class="qty-badge">×${i.qty}</span></div>
      <div class="inventory-body"><h3>${i.name}</h3><p class="card-meta">${i.type}</p><p class="card-ability">${i.effect}</p></div>
    </article>
  `).join("");
}

function renderCollection() {
  if (!gameData) return;

  document.getElementById("trophyGrid").innerHTML = gameData.trophies.map(t => `
    <article class="trophy-card ${t.earned ? "" : "locked"}">
      <div class="trophy-art">${t.earned ? t.icon : "🔒"}</div>
      <div class="trophy-body"><h3>${t.earned ? t.name : "Unknown Trophy"}</h3><p class="card-meta">${t.source}</p><p class="card-ability">${t.earned ? t.description : "Complete the matching bounty to reveal this trophy."}</p></div>
    </article>
  `).join("");

  document.getElementById("titleList").innerHTML = gameData.titles.map(t => `
    <div class="title-row ${t.unlocked ? "" : "locked"} ${hunter?.title === t.name ? "equipped" : ""}">
      <div><b>${t.secret && !t.unlocked ? "???" : t.name}</b><div class="title-state">${t.unlocked ? (hunter?.title === t.name ? "⭐ Equipped" : "Unlocked") : "Undiscovered"}</div></div>
      <span>${t.unlocked ? "🎖️" : "🔒"}</span>
    </div>
  `).join("");

  document.getElementById("cosmeticGrid").innerHTML = gameData.cosmetics.map(c => `
    <article class="cosmetic-card ${c.unlocked ? "" : "locked"}">
      <div class="cosmetic-art">${c.unlocked ? cosmeticIcon(c.slot) : "🔒"}</div>
      <div class="cosmetic-body"><h3>${c.name}</h3><p class="card-meta">${c.slot}</p><p class="card-ability">${c.unlocked ? "Unlocked" : c.requirement}</p></div>
    </article>
  `).join("");
}
function cosmeticIcon(slot) {
  return ({Cloak:"🧥",Headgear:"🪖",Outfit:"🥋",Weapon:"⚔️"}[slot] || "✨");
}

function buildCustomizerControls() {
  createChoiceButtons("bodyOptions","body",OPTIONS.body);
  createSwatches("skinOptions","skin",OPTIONS.skin);
  createChoiceButtons("hairOptions","hair",OPTIONS.hair);
  createSwatches("hairColorOptions","hairColor",OPTIONS.hairColor);
  createChoiceButtons("eyeOptions","eyes",OPTIONS.eyes);
  createChoiceButtons("beardOptions","beard",OPTIONS.beard);
  createChoiceButtons("outfitOptions","outfit",OPTIONS.outfit);
  createChoiceButtons("cloakOptions","cloak",OPTIONS.cloak);
  createChoiceButtons("headgearOptions","headgear",OPTIONS.headgear);
  createChoiceButtons("weaponOptions","weapon",OPTIONS.weapon);
}
function createChoiceButtons(containerId,key,items) {
  const container = document.getElementById(containerId);
  container.innerHTML = "";
  items.forEach(option => {
    const unlocked = isUnlocked(option);
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = `choice${unlocked ? "" : " locked"}`;
    btn.dataset.value = option.value;
    btn.disabled = !unlocked;
    btn.innerHTML = `<span>${option.label}</span>${unlocked ? "" : `<small class="unlock-note">${unlockText(option.unlock)}</small>`}`;
    btn.onclick = () => { if (unlocked) { workingAppearance[key] = option.value; updateEditor(); } };
    container.appendChild(btn);
  });
}
function createSwatches(containerId,key,items) {
  const container = document.getElementById(containerId);
  container.innerHTML = "";
  items.forEach(option => {
    const unlocked = isUnlocked(option);
    const wrap = document.createElement("div");
    wrap.className = "swatch-wrap";
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = `swatch${unlocked ? "" : " locked"}`;
    btn.style.setProperty("--swatch",option.value);
    btn.dataset.value = option.value;
    btn.disabled = !unlocked;
    btn.title = unlocked ? option.label : `${option.label} — ${unlockText(option.unlock)}`;
    btn.onclick = () => { if (unlocked) { workingAppearance[key] = option.value; updateEditor(); } };
    wrap.appendChild(btn);
    if (!unlocked) {
      const note = document.createElement("span"); note.className="swatch-unlock"; note.textContent=unlockText(option.unlock).replace("🔒 ",""); wrap.appendChild(note);
    }
    container.appendChild(wrap);
  });
}
function syncSelectedStates() {
  const map = [["bodyOptions","body"],["skinOptions","skin"],["hairOptions","hair"],["hairColorOptions","hairColor"],["eyeOptions","eyes"],["beardOptions","beard"],["outfitOptions","outfit"],["cloakOptions","cloak"],["headgearOptions","headgear"],["weaponOptions","weapon"]];
  map.forEach(([id,key]) => document.querySelectorAll(`#${id} [data-value]`).forEach(b => b.classList.toggle("selected",b.dataset.value===workingAppearance[key])));
}
function cloneAvatarForEditor() {
  const host = document.getElementById("editorAvatarHost");
  host.innerHTML="";
  const clone = document.getElementById("avatarPreview").cloneNode(true);
  clone.id="editorAvatarPreview";
  clone.querySelectorAll("[id]").forEach(el => el.removeAttribute("id"));
  host.appendChild(clone);
  applyAppearanceToAvatar(clone.querySelector(".avatar"),workingAppearance);
}
function updateEditor() {
  applyAppearanceToAvatar(document.querySelector("#editorAvatarHost .avatar"),workingAppearance);
  syncSelectedStates();
}
function openCustomizer() {
  workingAppearance={...savedAppearance};
  buildCustomizerControls();
  cloneAvatarForEditor();
  syncSelectedStates();
  document.getElementById("customizerModal").classList.remove("hidden");
}
function closeCustomizer() { document.getElementById("customizerModal").classList.add("hidden"); }

document.getElementById("customizeBtn").onclick=openCustomizer;
document.getElementById("closeCustomizer").onclick=closeCustomizer;
document.getElementById("customizerModal").addEventListener("click",e=>{if(e.target.id==="customizerModal")closeCustomizer();});
document.getElementById("resetAppearance").onclick=()=>{workingAppearance={...DEFAULT_APPEARANCE};updateEditor();};
document.getElementById("saveAppearance").onclick=()=>{
  savedAppearance={...workingAppearance}; saveAppearance(); renderMainAvatar(); closeCustomizer();
  document.getElementById("status").textContent="✅ Hunter appearance saved locally in the Phase D sandbox.";
};



function renderHomeLeaderboard() {
  if (!phaseG5Leaderboards) return;
  const rows = phaseG5Leaderboards[activeLeaderboard] || [];
  const list = document.getElementById("leaderboardList");
  if (!list) return;
  list.innerHTML = rows.map(row => `
    <div class="leader-row ${row.self ? "self" : ""}">
      <span class="leader-rank">${row.rank === 1 ? "🥇" : row.rank === 2 ? "🥈" : row.rank === 3 ? "🥉" : `#${row.rank}`}</span>
      <span class="leader-name">${row.name}${row.self ? " <small>YOU</small>" : ""}</span>
      <b>${row.points} ⭐</b>
    </div>
  `).join("");
  document.querySelectorAll("[data-leaderboard]").forEach(btn => {
    btn.classList.toggle("active", btn.dataset.leaderboard === activeLeaderboard);
    btn.onclick = () => {
      activeLeaderboard = btn.dataset.leaderboard;
      renderHomeLeaderboard();
    };
  });
}


let huntFlowStep = "overview";
let selectedHuntMethod = null;
let selectedCaptureTool = null;
let currentRoll = null;

function showHuntStep(step) {
  huntFlowStep = step;
  document.querySelectorAll("[data-hunt-step]").forEach(page => {
    page.classList.toggle("active", page.dataset.huntStep === step);
  });
  const scroll = document.getElementById("pageScroll");
  if (scroll) scroll.scrollTop = 0;
}

function cloneHunterForHuntOverview() {
  const host = document.getElementById("huntOverviewAvatarHost");
  if (!host) return;
  host.innerHTML = "";
  const source = document.getElementById("avatarPreview");
  if (!source) return;
  const clone = source.cloneNode(true);
  clone.id = "huntOverviewAvatar";
  clone.querySelectorAll("[id]").forEach(el => el.removeAttribute("id"));
  host.appendChild(clone);
}

function updateHuntOverviewProfile() {
  if (!hunter || !gameData) return;
  cloneHunterForHuntOverview();

  document.getElementById("huntOverviewHunterName").textContent = hunter.name;
  document.getElementById("huntOverviewTitle").textContent = hunter.title;
  document.getElementById("huntOverviewLevel").textContent = hunter.level;

  const pet = ownedPet(activePetKey) || gameData.ownedPets[0];
  if (!pet) return;
  document.getElementById("huntOverviewPetName").textContent = petDisplayName(pet);
  document.getElementById("huntOverviewPetAbility").textContent = pet.ability;
  document.getElementById("huntOverviewPetLevel").textContent = pet.level;
  document.getElementById("huntOverviewPetBond").textContent = pet.bond;

  const art = petArtPath(pet);
  const img = document.getElementById("huntOverviewPetImage");
  const fallback = document.getElementById("huntOverviewPetFallback");
  if (art) {
    img.src = art;
    img.alt = `${petDisplayName(pet)} companion art`;
    img.classList.remove("hidden");
    fallback.classList.add("hidden");
  } else {
    img.classList.add("hidden");
    fallback.classList.remove("hidden");
    fallback.textContent = pet.icon;
  }
}

function renderPhaseFHunting() {
  if (!phaseFHunting) return;

  updateHuntOverviewProfile();

  const grid = document.getElementById("huntZoneGrid");
  grid.innerHTML = phaseFHunting.zones.map(zone => `
    <button class="hunt-zone-card" data-zone="${zone.key}">
      <div class="hunt-zone-art">${zone.icon}</div>
      <div class="hunt-zone-body">
        <p class="eyebrow">${zone.subtitle}</p>
        <h3>${zone.name}</h3>
        <p>${zone.description}</p>
      </div>
    </button>
  `).join("");

  grid.querySelectorAll("[data-zone]").forEach(card => {
    card.onclick = () => beginHuntFromZone(card.dataset.zone);
  });

  localToolUses = Object.fromEntries(phaseFHunting.captureTools.map(t => [t.key, t.uses]));

  document.getElementById("encounterBackBtn").onclick = returnToHuntOverview;
  document.getElementById("encounterLeaveBtn").onclick = returnToHuntOverview;
  document.getElementById("attemptBackBtn").onclick = () => showHuntStep("encounter");
  document.getElementById("resultBackBtn").onclick = resetEncounterForNextHunt;
  document.getElementById("resultOverviewBtn").onclick = returnToHuntOverview;

  document.getElementById("normalHuntChoice").onclick = () => chooseHuntMethod("none");
  document.getElementById("baitHuntChoice").onclick = openBaitPicker;

  showHuntStep("overview");
}

function beginHuntFromZone(key) {
  activeHuntZone = phaseFHunting.zones.find(z => z.key === key);
  if (!activeHuntZone) return;

  huntAttemptNumber = 1;
  currentEncounter = weightedRandomMonster(activeHuntZone);
  selectedHuntMethod = null;
  selectedCaptureTool = null;
  currentRoll = null;
  rimebitSecondChanceUsed = false;

  populateEncounterPage();
  showHuntStep("encounter");
}

function returnToHuntOverview() {
  activeHuntZone = null;
  currentEncounter = null;
  selectedHuntMethod = null;
  selectedCaptureTool = null;
  document.getElementById("baitPicker").classList.add("hidden");
  updateHuntOverviewProfile();
  showHuntStep("overview");
}

function weightedRandomMonster(zone) {
  if (zone.key === "wildwood" && !firstHollowKingTestShown) {
    const hollowKing = zone.monsters.find(m => m.name === "The Hollow King");
    if (hollowKing) {
      firstHollowKingTestShown = true;
      return hollowKing;
    }
  }
  if (zone.monsters.length === 1) return zone.monsters[0];
  const weights = zone.monsters.map(m => {
    if (m.rarity === "Common") return 50;
    if (m.rarity === "Rare") return 28;
    if (m.rarity === "Epic") return 15;
    if (m.rarity === "Legendary") return 7;
    return 20;
  });
  let roll = Math.random() * weights.reduce((a,b)=>a+b,0);
  for (let i=0;i<zone.monsters.length;i++) {
    roll -= weights[i];
    if (roll <= 0) return zone.monsters[i];
  }
  return zone.monsters[0];
}

function populateArtTarget(imgId, fallbackId, encounter, mode="contain") {
  const img = document.getElementById(imgId);
  const fallback = document.getElementById(fallbackId);
  if (encounter?.image) {
    img.src = encounter.image;
    img.alt = `${encounter.name} art`;
    img.classList.remove("hidden");
    fallback.classList.add("hidden");
  } else {
    img.classList.add("hidden");
    fallback.classList.remove("hidden");
    fallback.textContent = encounter?.icon || "❔";
  }
}

function getDifficulty(chance) {
  if (chance >= 70) return "Low";
  if (chance >= 50) return "Moderate";
  if (chance >= 30) return "High";
  return "Extreme";
}

function getPossibleRewards(encounter) {
  const rewards = [];
  rewards.push({icon:"⭐", label:"Hunter Points", value:`+${encounter.points || 0}`});
  if (encounter.tokens) rewards.push({icon:"🪙", label:"Hunt Tokens", value:`+${encounter.tokens}`});
  if (encounter.petXp) rewards.push({icon:"🐾", label:"Pet XP", value:`+${encounter.petXp}`});
  (encounter.drops || []).forEach(drop => {
    rewards.push({icon:drop.icon || "🎒", label:drop.name, value:`×${drop.qty || 1}`});
  });
  return rewards;
}

function populateEncounterPage() {
  if (!activeHuntZone || !currentEncounter) return;
  const pet = ownedPet(activePetKey) || gameData.ownedPets[0];

  document.getElementById("encounterZoneType").textContent = activeHuntZone.subtitle.toUpperCase();
  document.getElementById("encounterZoneName").textContent = activeHuntZone.name;
  document.getElementById("encounterAttemptNumber").textContent = `Attempt ${huntAttemptNumber}`;

  populateArtTarget("encounterMonsterImage","encounterMonsterFallback",currentEncounter);

  document.getElementById("encounterMonsterName").textContent = currentEncounter.name;
  document.getElementById("encounterMonsterRarity").textContent = currentEncounter.rarity;
  document.getElementById("encounterCatchChance").textContent = `${currentEncounter.baseChance}%`;
  document.getElementById("encounterHabitat").textContent = activeHuntZone.name;
  document.getElementById("encounterDifficulty").textContent = getDifficulty(currentEncounter.baseChance);
  document.getElementById("encounterPetName").textContent = pet ? petDisplayName(pet) : "None";
  document.getElementById("encounterDescription").textContent =
    currentEncounter.name === "The Hollow King"
      ? "A dread monarch of the dead, ruler of forgotten souls and shattered thrones."
      : `A ${currentEncounter.rarity.toLowerCase()} creature has appeared in ${activeHuntZone.name}.`;

  const levelTag = document.getElementById("encounterMonsterLevel");
  if (currentEncounter.level) {
    levelTag.textContent = `Level ${currentEncounter.level}`;
    levelTag.classList.remove("hidden");
  } else {
    levelTag.classList.add("hidden");
  }

  document.getElementById("possibleRewards").innerHTML =
    getPossibleRewards(currentEncounter).map(r => `
      <div class="possible-reward-row"><span>${r.icon} ${r.label}</span><b>${r.value}</b></div>
    `).join("") || `<div class="possible-reward-row"><span>🎒 Rewards</span><b>Varies</b></div>`;

  document.getElementById("baitPicker").classList.add("hidden");
}

function openBaitPicker() {
  selectedHuntMethod = "bait";
  const picker = document.getElementById("baitPicker");
  picker.classList.remove("hidden");

  const grid = document.getElementById("captureToolGrid");
  const baitTools = phaseFHunting.captureTools.filter(t => t.key !== "none");
  grid.innerHTML = baitTools.map(tool => {
    const uses = localToolUses[tool.key];
    const unavailable = uses === 0;
    return `
      <button class="capture-tool" data-tool="${tool.key}" ${unavailable ? "disabled" : ""}>
        <span class="tool-icon">${tool.icon}</span>
        <strong>${tool.name}</strong>
        <small>${tool.bonus >= 100 ? "Guaranteed DEV catch" : `+${tool.bonus}% catch chance`}</small>
        <small>${uses === null ? "Unlimited" : `${uses} left in DEV`}</small>
      </button>
    `;
  }).join("");

  grid.querySelectorAll("[data-tool]").forEach(btn => {
    btn.onclick = () => chooseHuntMethod(btn.dataset.tool);
  });

  picker.scrollIntoView({behavior:"smooth", block:"nearest"});
}

function chooseHuntMethod(toolKey) {
  const tool = phaseFHunting.captureTools.find(t => t.key === toolKey);
  if (!tool || !currentEncounter) return;
  if (localToolUses[toolKey] === 0) return;

  selectedCaptureTool = tool;
  selectedHuntMethod = toolKey === "none" ? "normal" : "bait";
  populateAttemptPage();
  showHuntStep("attempt");
}

function populateAttemptPage() {
  const tool = selectedCaptureTool || phaseFHunting.captureTools[0];
  const chance = Math.min(100, currentEncounter.baseChance + Number(tool.bonus || 0));
  const pet = ownedPet(activePetKey) || gameData.ownedPets[0];

  document.getElementById("attemptZoneName").textContent = activeHuntZone.name;
  document.getElementById("attemptChancePill").textContent = `${chance}%`;

  populateArtTarget("attemptMonsterImage","attemptMonsterFallback",currentEncounter);

  document.getElementById("attemptMonsterName").textContent = currentEncounter.name;
  document.getElementById("attemptMonsterRarity").textContent = currentEncounter.rarity;
  document.getElementById("attemptCatchChance").textContent = `${chance}%`;
  document.getElementById("attemptHunterLevel").textContent = hunter.level;
  document.getElementById("attemptPetName").textContent = pet ? petDisplayName(pet) : "None";
  document.getElementById("attemptMethodName").textContent = tool.name;
  document.getElementById("attemptRarityInfo").textContent = currentEncounter.rarity;
  document.getElementById("attemptLevelInfo").textContent = currentEncounter.level || "—";
  document.getElementById("attemptPointsInfo").textContent = `+${currentEncounter.points || 0}`;
  document.getElementById("attemptTokensInfo").textContent = currentEncounter.tokens ? `+${currentEncounter.tokens}` : "—";
  document.getElementById("rollTargetLabel").textContent = `Need ≤ ${chance}`;
  document.getElementById("rollMeterFill").style.width = `${chance}%`;

  const levelTag = document.getElementById("attemptMonsterLevel");
  if (currentEncounter.level) {
    levelTag.textContent = `Level ${currentEncounter.level}`;
    levelTag.classList.remove("hidden");
  } else {
    levelTag.classList.add("hidden");
  }

  document.getElementById("performCaptureBtn").onclick = performCapture;
}

function performCapture() {
  if (!currentEncounter || !selectedCaptureTool) return;

  const tool = selectedCaptureTool;
  const chance = Math.min(100, currentEncounter.baseChance + Number(tool.bonus || 0));

  if (localToolUses[tool.key] !== null && localToolUses[tool.key] > 0) {
    localToolUses[tool.key]--;
  }

  currentRoll = Math.floor(Math.random() * 100) + 1;
  const success = chance >= 100 || currentRoll <= chance;

  if (success) {
    showCaptureSuccess(currentRoll, chance, tool);
  } else {
    maybeUseRimebitSecondChance(currentRoll, chance, tool);
  }
}

function maybeUseRimebitSecondChance(roll, chance, tool) {
  // DEV demo rate remains intentionally high.
  if (!rimebitSecondChanceUsed && Math.random() < 0.55) {
    rimebitSecondChanceUsed = true;
    document.getElementById("attemptFlavor").textContent =
      `❄️ Rimebit froze the fleeing creature! Your roll was ${roll}; you get one Second Chance reroll.`;
    const btn = document.getElementById("performCaptureBtn");
    btn.textContent = "❄️ Rimebit: Reroll Catch";
    btn.onclick = performRimebitReroll;
  } else {
    showCaptureFailure(roll, chance);
  }
}

function performRimebitReroll() {
  const tool = selectedCaptureTool;
  const chance = Math.min(100, currentEncounter.baseChance + Number(tool.bonus || 0));
  currentRoll = Math.floor(Math.random() * 100) + 1;

  if (currentRoll <= chance) showCaptureSuccess(currentRoll, chance, tool, true);
  else showCaptureFailure(currentRoll, chance, true);
}

function populateResultArtwork() {
  populateArtTarget("resultMonsterImage","resultMonsterFallback",currentEncounter);
}

function showCaptureSuccess(roll, chance, tool, secondChance=false) {
  populateResultArtwork();

  const pointReward = Number(currentEncounter.points || 0);
  const tokenReward = Number(currentEncounter.tokens || (activeHuntZone.key === "biggame" ? 1 : 0));
  const petXpReward = Number(currentEncounter.petXp || Math.max(5, pointReward * 5));
  const drops = Array.isArray(currentEncounter.drops) ? currentEncounter.drops : [];

  document.getElementById("resultStatusIcon").textContent = "🏆";
  document.getElementById("resultZoneName").textContent = activeHuntZone.name;
  document.getElementById("huntResultTitle").textContent = `🎉 ${currentEncounter.name} Caught!`;
  document.getElementById("huntResultText").textContent =
    `${secondChance ? "Rimebit's Second Chance worked! " : ""}Roll ${roll} succeeded against a ${chance}% DEV catch chance using ${tool.name}.`;

  const rewards = [
    `<div><span>⭐ Hunter Points</span><b>+${pointReward}</b></div>`,
    tokenReward ? `<div><span>🪙 Hunt Tokens</span><b>+${tokenReward}</b></div>` : "",
    `<div><span>🐾 Pet XP</span><b>+${petXpReward}</b></div>`,
    ...drops.map(drop => `<div><span>${drop.icon || "🎒"} ${drop.name}</span><b>×${drop.qty || 1}</b></div>`)
  ].filter(Boolean);

  if (activeHuntZone.key === "distortion") {
    rewards.push(`<div><span>🌀 Distortion Bonus</span><b>Eligible</b></div>`);
  }
  if (activeHuntZone.key === "bounty") {
    rewards.push(`<div><span>🔎 Bounty Evidence</span><b>Collected</b></div>`);
  }

  document.getElementById("huntResultRewards").innerHTML = rewards.join("");

  document.getElementById("huntResultDetails").innerHTML = `
    <div><span>Catch Chance</span><b>${chance}%</b></div>
    <div><span>Roll</span><b>${roll}</b></div>
    <div><span>Method</span><b>${tool.name}</b></div>
    <div><span>Rarity</span><b>${currentEncounter.rarity}</b></div>
    ${currentEncounter.level ? `<div><span>Monster Level</span><b>${currentEncounter.level}</b></div>` : ""}
    <div><span>Active Pet</span><b>${petDisplayName(ownedPet(activePetKey) || gameData.ownedPets[0])}</b></div>
    ${secondChance ? `<div><span>Companion Effect</span><b>Second Chance</b></div>` : ""}
  `;

  document.getElementById("huntAgainBtn").textContent = "🏹 Hunt Again";
  document.getElementById("huntAgainBtn").onclick = resetEncounterForNextHunt;

  showHuntStep("result");
}

function showCaptureFailure(roll, chance, secondChance=false) {
  populateResultArtwork();

  document.getElementById("resultStatusIcon").textContent = "💨";
  document.getElementById("resultZoneName").textContent = activeHuntZone.name;
  document.getElementById("huntResultTitle").textContent = "💨 The Creature Escaped";
  document.getElementById("huntResultText").textContent =
    `${secondChance ? "Even after Rimebit's Second Chance, " : ""}roll ${roll} missed the ${chance}% DEV catch chance.`;

  document.getElementById("huntResultRewards").innerHTML = `
    <div><span>🧪 Live rewards</span><b>None changed</b></div>
  `;

  document.getElementById("huntResultDetails").innerHTML = `
    <div><span>Catch Chance</span><b>${chance}%</b></div>
    <div><span>Roll</span><b>${roll}</b></div>
    <div><span>Method</span><b>${selectedCaptureTool?.name || "Normal Hunt"}</b></div>
    <div><span>Rarity</span><b>${currentEncounter.rarity}</b></div>
    ${secondChance ? `<div><span>Companion Effect</span><b>Second Chance used</b></div>` : ""}
  `;

  document.getElementById("huntAgainBtn").textContent = "🏹 Hunt Again";
  document.getElementById("huntAgainBtn").onclick = resetEncounterForNextHunt;

  showHuntStep("result");
}

function resetEncounterForNextHunt() {
  if (!activeHuntZone) {
    returnToHuntOverview();
    return;
  }

  huntAttemptNumber++;
  currentEncounter = weightedRandomMonster(activeHuntZone);
  selectedCaptureTool = null;
  selectedHuntMethod = null;
  currentRoll = null;
  rimebitSecondChanceUsed = false;

  document.getElementById("attemptFlavor").textContent = "You steady yourself and prepare for the hunt…";
  document.getElementById("performCaptureBtn").textContent = "🎲 Roll to Catch";

  populateEncounterPage();
  showHuntStep("encounter");
}

function formatCountdown(ms) {
  ms = Math.max(0, Number(ms) || 0);
  const total = Math.floor(ms / 1000);
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;
  return `${String(h).padStart(2,"0")}:${String(m).padStart(2,"0")}:${String(s).padStart(2,"0")}`;
}

function switchEventView(view) {
  document.querySelectorAll(".event-tab").forEach(b => b.classList.toggle("active", b.dataset.eventView === view));
  document.querySelectorAll("[data-event-view-panel]").forEach(p => p.classList.toggle("active", p.dataset.eventViewPanel === view));
}

function setupEventNavigation() {
  document.querySelectorAll(".event-tab").forEach(b => {
    b.onclick = () => switchEventView(b.dataset.eventView);
  });
  document.querySelectorAll("[data-open-event]").forEach(b => {
    b.onclick = () => switchEventView(b.dataset.openEvent);
  });
}

function renderPhaseEEvents() {
  if (!phaseEEvents) return;
  setupEventNavigation();

  const big = phaseEEvents.bigGame;
  document.getElementById("bigGameScore").textContent = `${big.playerScore} 🪙`;
  document.getElementById("bigGameWallet").textContent = `${big.tokenBalance} 🪙`;

  document.getElementById("bigGameLeaderboard").innerHTML = big.leaderboard.map((entry, i) => `
    <div class="leaderboard-row ${entry.name === "Activity Test Hunter" ? "you" : ""}">
      <div class="rank-medal">${["🥇","🥈","🥉"][i] || `#${i+1}`}</div>
      <div><b>${entry.name}</b>${entry.name === "Activity Test Hunter" ? `<small style="display:block;color:#a5b4fc">You</small>` : ""}</div>
      <div class="leader-score">${entry.score} 🪙</div>
    </div>
  `).join("");

  document.getElementById("bigGameTokenRewards").innerHTML = Object.entries(big.tokenRewards).map(([rarity,value]) => `
    <div class="reward-chip">${rarity}<b>+${value} 🪙</b></div>
  `).join("");

  const bounty = phaseEEvents.bounty;
  document.getElementById("bountyNpc").textContent = bounty.npc;
  document.getElementById("bountyClue").textContent = bounty.clue;
  document.getElementById("bountyParticipants").textContent = bounty.participants;
  document.getElementById("bountyAttempts").textContent = bounty.attempts;

  const distortion = phaseEEvents.distortion;
  document.getElementById("distortionName").textContent = distortion.name;
  document.getElementById("distortionStory").textContent = distortion.story;
  document.getElementById("distortionMonsters").innerHTML = distortion.monsters.map(m => `
    <div class="distortion-monster">
      <span class="monster-icon">${m.icon}</span>
      <div><b>${m.name}</b><small>${m.rarity}</small></div>
      <span class="distortion-points">+${m.points} pts</span>
    </div>
  `).join("");

  document.getElementById("planeGrid").innerHTML = distortion.knownPlanes.map(p => `
    <div class="plane-card ${p.discovered ? "" : "unknown"}">
      <span>${p.icon}</span><b>${p.name}</b>
    </div>
  `).join("");

  setupDevEventButtons();
  updateEventTimers();
}

function updateEventTimers() {
  if (!phaseEEvents) return;
  const now = Date.now();
  const bigRemaining = phaseEEvents.bigGame.endsAt - now;
  const distortionRemaining = phaseEEvents.distortion.endsAt - now;
  const bigText = formatCountdown(bigRemaining);
  const distortionText = formatCountdown(distortionRemaining);

  const bg = document.getElementById("bigGameTimer");
  const dt = document.getElementById("distortionTimer");
  const obg = document.getElementById("overviewBigGameTime");
  const od = document.getElementById("overviewDistortionTime");
  if (bg) bg.textContent = `${bigText} remaining`;
  if (dt) dt.textContent = `${distortionText} remaining`;
  if (obg) obg.textContent = `${bigText} remaining`;
  if (od) od.textContent = `${distortionText} remaining`;
}

function startEventTimers() {
  if (timerInterval) clearInterval(timerInterval);
  timerInterval = setInterval(updateEventTimers, 1000);
}

function showDevResult(button, text) {
  const old = button.parentElement.querySelector(".dev-result");
  if (old) old.remove();
  const result = document.createElement("div");
  result.className = "dev-result";
  result.textContent = text;
  button.insertAdjacentElement("afterend", result);
}

function setupDevEventButtons() {
  const bigBtn = document.getElementById("devBigGameHunt");
  const bountyBtn = document.getElementById("devBountyHunt");
  const distortionBtn = document.getElementById("devDistortionHunt");

  if (bigBtn) bigBtn.onclick = () => {
    const samples = [
      "🐺 Rare creature caught! DEV reward: +2 Hunt Tokens.",
      "🌿 Common creature caught! DEV reward: +1 Hunt Token.",
      "🐉 Legendary trail found! DEV reward: +8 Hunt Tokens.",
      "💨 The creature escaped. No DEV tokens awarded."
    ];
    showDevResult(bigBtn, samples[Math.floor(Math.random()*samples.length)]);
  };

  if (bountyBtn) bountyBtn.onclick = () => {
    devBountyAttempts++;
    const samples = [
      "🔎 You found fresh thorn-covered fur. The target passed through recently.",
      "🐾 The tracks turn toward the creek. Whatever made them is heavy.",
      "🌲 A damaged tree reveals deep claw marks several feet above the ground.",
      "💨 Nothing. The trail goes cold."
    ];
    document.getElementById("bountyAttempts").textContent = phaseEEvents.bounty.attempts + devBountyAttempts;
    showDevResult(bountyBtn, samples[Math.floor(Math.random()*samples.length)]);
  };

  if (distortionBtn) distortionBtn.onclick = () => {
    const m = phaseEEvents.distortion.monsters[Math.floor(Math.random()*phaseEEvents.distortion.monsters.length)];
    showDevResult(distortionBtn, `🌀 DEV encounter: ${m.icon} ${m.name} — ${m.rarity}. No live hunt was created.`);
  };
}

async function boot() {
  try {
    const [hunterRes,dataRes,eventRes,huntRes,alignRes,leaderRes] = await Promise.all([
      fetch("/api/test-hunter",{cache:"no-store"}),
      fetch("/api/phase-d-data",{cache:"no-store"}),
      fetch("/api/phase-e-events",{cache:"no-store"}),
      fetch("/api/phase-f-hunting",{cache:"no-store"}),
      fetch("/api/phase-g-alignment",{cache:"no-store"}),
      fetch("/api/phase-g5-leaderboards",{cache:"no-store"})
    ]);
    if (!hunterRes.ok || !dataRes.ok || !eventRes.ok || !huntRes.ok || !alignRes.ok || !leaderRes.ok) throw new Error("Failed to load DEV data.");
    hunter = await hunterRes.json();
    gameData = await dataRes.json();
    phaseEEvents = await eventRes.json();
    phaseFHunting = await huntRes.json();
    phaseGAlignment = await alignRes.json();
    phaseG5Leaderboards = await leaderRes.json();
    applyLocalPetNames();

    document.getElementById("hunterName").textContent=hunter.name;
    document.getElementById("hunterTitle").textContent=hunter.title;
    document.getElementById("level").textContent=hunter.level;
    document.getElementById("points").textContent=hunter.points;
    document.getElementById("tokens").textContent=hunter.tokens;
    document.getElementById("petsCount").textContent=`${gameData.ownedPets.length} owned`;
    document.getElementById("ownedPetCount").textContent=gameData.ownedPets.length;
    document.getElementById("petdexCount").textContent=hunter.stats.petDex;
    document.getElementById("dexProgress").textContent=hunter.stats.petDex;
    document.getElementById("trophyCount").textContent=`${hunter.stats.trophies} trophies`;

    playerProgress={
      level:Number(hunter.level)||0,
      trophies:Number(hunter.stats.trophies)||0,
      petdex:Number(String(hunter.stats.petDex).split("/")[0])||0
    };

    const ownedKeys=new Set(gameData.ownedPets.map(p=>p.key));
    if (!ownedKeys.has(activePetKey)) activePetKey=hunter.activePetKey;

    renderMainAvatar();
    renderPetFilters();
    renderPets();
    renderDex();
    renderInventoryFilters();
    renderInventory();
    renderCollection();
    renderActivePet();

    renderHomeLeaderboard();
    renderPhaseEEvents();
    renderPhaseFHunting();
    startEventTimers();

    document.getElementById("status").textContent="✅ Phase G.8 loaded. Hunt Overview → full-art Encounter → zoomed Attempt → full Result flow is active.";
  } catch (err) {
    console.error(err);
    document.getElementById("status").textContent="❌ Phase D DEV data failed to load.";
  }
}

document.addEventListener("keydown",e=>{if(e.key==="Escape"){closeCustomizer();closeDetail();}});
boot();
