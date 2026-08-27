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
let savedAppearance = loadAppearance();
let workingAppearance = { ...savedAppearance };
let activePetKey = localStorage.getItem("monsterHuntDevActivePet") || "rime_sprite";

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
    { value:"mohawk", label:"Mohawk", unlock:{type:"level",amount:5} },
    { value:"braid", label:"Braid", unlock:{type:"level",amount:10} },
    { value:"bald", label:"Bald" }
  ],
  hairColor: [
    { value:"#241b18", label:"Black" }, { value:"#4a2f27", label:"Brown" },
    { value:"#8d5a32", label:"Auburn" }, { value:"#c99a4d", label:"Blonde" },
    { value:"#d9d9d9", label:"Silver", unlock:{type:"level",amount:15} },
    { value:"#6b4aa3", label:"Rift Violet", unlock:{type:"petdex",amount:20} }
  ],
  eyes: [
    { value:"round", label:"Round" }, { value:"narrow", label:"Narrow" },
    { value:"wide", label:"Wide", unlock:{type:"level",amount:5} }
  ],
  beard: [
    { value:"none", label:"None" }, { value:"stubble", label:"Stubble" },
    { value:"mustache", label:"Mustache", unlock:{type:"level",amount:5} },
    { value:"full", label:"Full Beard", unlock:{type:"level",amount:10} }
  ],
  outfit: [
    { value:"ranger", label:"Ranger" },
    { value:"leather", label:"Leather", unlock:{type:"level",amount:5} },
    { value:"rift", label:"Rift Hunter", unlock:{type:"level",amount:10} },
    { value:"frost", label:"Frost Hunter", unlock:{type:"level",amount:15} },
    { value:"ember", label:"Ember Hunter", unlock:{type:"petdex",amount:20} }
  ],
  cloak: [
    { value:"none", label:"None" }, { value:"forest", label:"Forest" },
    { value:"rift", label:"Rift", unlock:{type:"level",amount:10} },
    { value:"ember", label:"Ember", unlock:{type:"petdex",amount:20} },
    { value:"frost", label:"Frost", unlock:{type:"level",amount:15} }
  ],
  headgear: [
    { value:"none", label:"None" },
    { value:"cap", label:"Hunter Cap", unlock:{type:"petdex",amount:10} },
    { value:"hood", label:"Rift Hood", unlock:{type:"level",amount:10} },
    { value:"horns", label:"Trophy Horns", unlock:{type:"trophies",amount:5} }
  ],
  weapon: [
    { value:"none", label:"None" },
    { value:"bow", label:"Hunter Bow" },
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

function petDisplayName(p) { return p.nickname || p.name; }
function ownedPet(key) { return gameData?.ownedPets.find(p => p.key === key) || null; }
function allKnownPet(key) { return [...(gameData?.petDex || []), ...(gameData?.beyondPets || [])].find(p => p.key === key) || null; }

function renderActivePet() {
  const pet = ownedPet(activePetKey) || gameData?.ownedPets[0];
  if (!pet) return;
  activePetKey = pet.key;
  localStorage.setItem("monsterHuntDevActivePet", activePetKey);
  document.getElementById("petIcon").textContent = pet.icon;
  document.getElementById("petName").textContent = petDisplayName(pet);
  document.getElementById("petLevel").textContent = pet.level;
  document.getElementById("petBond").textContent = pet.bond;
  document.getElementById("petAbility").textContent = pet.ability;
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
        <span class="pet-symbol">${p.icon}</span>
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
    <div class="detail-hero"><div class="detail-symbol">${p.icon}</div></div>
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
}
function closeDetail() { document.getElementById("detailModal").classList.add("hidden"); }
document.getElementById("closeDetail").onclick = closeDetail;
document.getElementById("detailModal").addEventListener("click", e => { if (e.target.id === "detailModal") closeDetail(); });

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
              <div class="dex-icon">${discovered.has(p.key) ? p.icon : "❔"}</div>
              <div><b>${discovered.has(p.key) ? p.name : "Undiscovered"}</b><small>${discovered.has(p.key) ? `${p.rarity} • ${p.ability}` : "Keep hatching eggs"}</small></div>
            </div>`).join("")}
        </div>
      </section>`;
  }).join("");

  const beyond = document.getElementById("beyondGrid");
  beyond.innerHTML = gameData.beyondPets.map(p => {
    const found = discovered.has(p.key);
    return `
      <article class="pet-card ${found ? "" : "locked"}" data-rarity="${p.rarity}" ${found ? `data-pet-key="${p.key}"` : ""}>
        <div class="pet-portrait"><span class="rarity-pill">${found ? p.rarity : "???"}</span><span class="pet-symbol">${found ? p.icon : "🌀"}</span></div>
        <div class="pet-card-body"><h3>${found ? p.name : "Unknown Companion"}</h3><p class="card-meta">${found ? p.habitat : "Beyond the known habitats"}</p></div>
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

async function boot() {
  try {
    const [hunterRes,dataRes] = await Promise.all([
      fetch("/api/test-hunter",{cache:"no-store"}),
      fetch("/api/phase-d-data",{cache:"no-store"})
    ]);
    if (!hunterRes.ok || !dataRes.ok) throw new Error("Failed to load DEV data.");
    hunter = await hunterRes.json();
    gameData = await dataRes.json();

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

    document.getElementById("status").textContent="✅ Phase D loaded. All data is fake/local; the live Monster Hunt save remains untouched.";
  } catch (err) {
    console.error(err);
    document.getElementById("status").textContent="❌ Phase D DEV data failed to load.";
  }
}

document.addEventListener("keydown",e=>{if(e.key==="Escape"){closeCustomizer();closeDetail();}});
boot();
