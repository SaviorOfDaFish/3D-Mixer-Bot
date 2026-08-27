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
  headgear: "none"
};

let playerProgress = {
  level: 0,
  trophies: 0,
  petdex: 0
};

const OPTIONS = {
  body: [
    { value: "male", label: "Male" },
    { value: "female", label: "Female" }
  ],
  skin: [
    { value: "#f4c6a5", label: "Light" },
    { value: "#dca37d", label: "Warm" },
    { value: "#b97852", label: "Tan" },
    { value: "#8f563b", label: "Deep" },
    { value: "#5f392d", label: "Dark" },
    { value: "#3e2823", label: "Rich" }
  ],
  hair: [
    { value: "short", label: "Short" },
    { value: "long", label: "Long" },
    { value: "mohawk", label: "Mohawk", unlock: { type: "level", amount: 5 } },
    { value: "braid", label: "Braid", unlock: { type: "level", amount: 10 } },
    { value: "bald", label: "Bald" }
  ],
  hairColor: [
    { value: "#241b18", label: "Black" },
    { value: "#4a2f27", label: "Brown" },
    { value: "#8d5a32", label: "Auburn" },
    { value: "#c99a4d", label: "Blonde" },
    { value: "#d9d9d9", label: "Silver", unlock: { type: "level", amount: 15 } },
    { value: "#6b4aa3", label: "Rift Violet", unlock: { type: "petdex", amount: 20 } }
  ],
  eyes: [
    { value: "round", label: "Round" },
    { value: "narrow", label: "Narrow" },
    { value: "wide", label: "Wide", unlock: { type: "level", amount: 5 } }
  ],
  beard: [
    { value: "none", label: "None" },
    { value: "stubble", label: "Stubble" },
    { value: "mustache", label: "Mustache", unlock: { type: "level", amount: 5 } },
    { value: "full", label: "Full Beard", unlock: { type: "level", amount: 10 } }
  ],
  outfit: [
    { value: "ranger", label: "Ranger" },
    { value: "leather", label: "Leather", unlock: { type: "level", amount: 5 } },
    { value: "rift", label: "Rift Hunter", unlock: { type: "level", amount: 10 } },
    { value: "frost", label: "Frost Hunter", unlock: { type: "level", amount: 15 } },
    { value: "ember", label: "Ember Hunter", unlock: { type: "petdex", amount: 20 } }
  ],
  cloak: [
    { value: "none", label: "None" },
    { value: "forest", label: "Forest" },
    { value: "rift", label: "Rift", unlock: { type: "level", amount: 10 } },
    { value: "ember", label: "Ember", unlock: { type: "petdex", amount: 20 } },
    { value: "frost", label: "Frost", unlock: { type: "level", amount: 15 } }
  ],
  headgear: [
    { value: "none", label: "None" },
    { value: "cap", label: "Hunter Cap", unlock: { type: "petdex", amount: 10 } },
    { value: "hood", label: "Rift Hood", unlock: { type: "level", amount: 10 } },
    { value: "horns", label: "Trophy Horns", unlock: { type: "trophies", amount: 5 } }
  ]
};

let savedAppearance = loadAppearance();
let workingAppearance = { ...savedAppearance };

function loadAppearance() {
  try {
    const saved = JSON.parse(localStorage.getItem("monsterHuntDevAppearance") || "null");
    return { ...DEFAULT_APPEARANCE, ...(saved || {}) };
  } catch {
    return { ...DEFAULT_APPEARANCE };
  }
}

function persistAppearance() {
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

function ensureSavedAppearanceIsValid() {
  for (const [key, value] of Object.entries(savedAppearance)) {
    const set = OPTIONS[key];
    if (!set) continue;
    const option = set.find(item => item.value === value);
    if (option && !isUnlocked(option)) {
      savedAppearance[key] = DEFAULT_APPEARANCE[key];
    }
  }
  persistAppearance();
}

function applyAppearanceToAvatar(avatar, appearance) {
  if (!avatar) return;

  avatar.style.setProperty("--skin", appearance.skin);
  avatar.style.setProperty("--hair", appearance.hairColor);
  avatar.style.setProperty("--eyes", appearance.eyeColor || "#4a6d84");

  avatar.dataset.body = appearance.body || "male";
  avatar.dataset.hair = appearance.hair;
  avatar.dataset.beard = appearance.beard;
  avatar.dataset.outfit = appearance.outfit;
  avatar.dataset.cloak = appearance.cloak;
  avatar.dataset.headgear = appearance.headgear;

  const eyes = avatar.querySelector(".eyes");
  if (eyes) {
    eyes.classList.remove("eye-round", "eye-narrow", "eye-wide");
    eyes.classList.add(`eye-${appearance.eyes}`);
  }
}

function renderMainAvatar() {
  applyAppearanceToAvatar(document.querySelector("#avatarPreview .avatar"), savedAppearance);
}

function cloneAvatarForEditor() {
  const host = document.getElementById("editorAvatarHost");
  host.innerHTML = "";
  const clone = document.getElementById("avatarPreview").cloneNode(true);
  clone.id = "editorAvatarPreview";
  clone.querySelectorAll("[id]").forEach(el => el.removeAttribute("id"));
  host.appendChild(clone);
  applyAppearanceToAvatar(clone.querySelector(".avatar"), workingAppearance);
}

function createChoiceButtons(containerId, key, items) {
  const container = document.getElementById(containerId);
  container.innerHTML = "";

  items.forEach(option => {
    const unlocked = isUnlocked(option);
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = `choice${unlocked ? "" : " locked"}`;
    btn.dataset.value = option.value;
    btn.disabled = !unlocked;

    const label = document.createElement("span");
    label.textContent = option.label;
    btn.appendChild(label);

    if (!unlocked) {
      const note = document.createElement("small");
      note.className = "unlock-note";
      note.textContent = unlockText(option.unlock);
      btn.appendChild(note);
    }

    btn.addEventListener("click", () => {
      if (!unlocked) return;
      workingAppearance[key] = option.value;
      updateEditor();
    });

    container.appendChild(btn);
  });
}

function createSwatches(containerId, key, items) {
  const container = document.getElementById(containerId);
  container.innerHTML = "";

  items.forEach(option => {
    const unlocked = isUnlocked(option);
    const wrap = document.createElement("div");
    wrap.className = "swatch-wrap";

    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = `swatch${unlocked ? "" : " locked"}`;
    btn.style.setProperty("--swatch", option.value);
    btn.dataset.value = option.value;
    btn.title = unlocked ? option.label : `${option.label} — ${unlockText(option.unlock)}`;
    btn.setAttribute("aria-label", btn.title);
    btn.disabled = !unlocked;

    btn.addEventListener("click", () => {
      if (!unlocked) return;
      workingAppearance[key] = option.value;
      updateEditor();
    });

    wrap.appendChild(btn);

    if (!unlocked) {
      const note = document.createElement("span");
      note.className = "swatch-unlock";
      note.textContent = unlockText(option.unlock).replace("🔒 ", "");
      wrap.appendChild(note);
    }

    container.appendChild(wrap);
  });
}

function buildCustomizerControls() {
  createChoiceButtons("bodyOptions", "body", OPTIONS.body);
  createSwatches("skinOptions", "skin", OPTIONS.skin);
  createChoiceButtons("hairOptions", "hair", OPTIONS.hair);
  createSwatches("hairColorOptions", "hairColor", OPTIONS.hairColor);
  createChoiceButtons("eyeOptions", "eyes", OPTIONS.eyes);
  createChoiceButtons("beardOptions", "beard", OPTIONS.beard);
  createChoiceButtons("outfitOptions", "outfit", OPTIONS.outfit);
  createChoiceButtons("cloakOptions", "cloak", OPTIONS.cloak);
  createChoiceButtons("headgearOptions", "headgear", OPTIONS.headgear);
}

function syncSelectedStates() {
  const mappings = [
    ["bodyOptions", "body"],
    ["skinOptions", "skin"],
    ["hairOptions", "hair"],
    ["hairColorOptions", "hairColor"],
    ["eyeOptions", "eyes"],
    ["beardOptions", "beard"],
    ["outfitOptions", "outfit"],
    ["cloakOptions", "cloak"],
    ["headgearOptions", "headgear"]
  ];

  mappings.forEach(([containerId, key]) => {
    document.querySelectorAll(`#${containerId} [data-value]`).forEach(btn => {
      btn.classList.toggle("selected", btn.dataset.value === workingAppearance[key]);
    });
  });
}

function updateEditor() {
  applyAppearanceToAvatar(document.querySelector("#editorAvatarHost .avatar"), workingAppearance);
  syncSelectedStates();
}

function openCustomizer() {
  workingAppearance = { ...savedAppearance };
  buildCustomizerControls();
  cloneAvatarForEditor();
  syncSelectedStates();
  document.getElementById("customizerModal").classList.remove("hidden");
}

function closeCustomizer() {
  document.getElementById("customizerModal").classList.add("hidden");
}

function setupCustomizer() {
  document.getElementById("customizeBtn").addEventListener("click", openCustomizer);
  document.getElementById("closeCustomizer").addEventListener("click", closeCustomizer);

  document.getElementById("customizerModal").addEventListener("click", (event) => {
    if (event.target.id === "customizerModal") closeCustomizer();
  });

  document.getElementById("resetAppearance").addEventListener("click", () => {
    workingAppearance = { ...DEFAULT_APPEARANCE };
    updateEditor();
    syncSelectedStates();
  });

  document.getElementById("saveAppearance").addEventListener("click", () => {
    savedAppearance = { ...workingAppearance };
    persistAppearance();
    renderMainAvatar();
    closeCustomizer();
    document.getElementById("status").textContent =
      "✅ Appearance saved locally. Progression locks are active in the DEV build.";
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeCustomizer();
  });
}

async function loadHunter() {
  const status = document.getElementById("status");

  try {
    const response = await fetch("/api/test-hunter", { cache: "no-store" });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);

    const hunter = await response.json();

    document.getElementById("hunterName").textContent = hunter.name;
    document.getElementById("hunterTitle").textContent = hunter.title;
    document.getElementById("level").textContent = hunter.level;
    document.getElementById("points").textContent = hunter.points;
    document.getElementById("tokens").textContent = hunter.tokens;

    document.getElementById("petIcon").textContent = hunter.activePet.icon;
    document.getElementById("petName").textContent = hunter.activePet.name;
    document.getElementById("petLevel").textContent = hunter.activePet.level;

    document.getElementById("petsCount").textContent = `${hunter.stats.pets} owned`;
    document.getElementById("petdexCount").textContent = hunter.stats.petDex;
    document.getElementById("trophyCount").textContent = `${hunter.stats.trophies} earned`;

    const petdexNumber = Number(String(hunter.stats.petDex).split("/")[0]) || 0;
    playerProgress = {
      level: Number(hunter.level) || 0,
      trophies: Number(hunter.stats.trophies) || 0,
      petdex: petdexNumber
    };

    ensureSavedAppearanceIsValid();
    renderMainAvatar();

    status.textContent =
      `✅ Phase C loaded. Lv.${playerProgress.level} • ${playerProgress.trophies} trophies • PetDex ${playerProgress.petdex}.`;
  } catch (error) {
    console.error(error);
    status.textContent = "❌ Could not load the development test hunter.";
  }
}

document.addEventListener("click", (event) => {
  const button = event.target.closest("[data-demo]");
  if (!button) return;

  const action = button.dataset.demo;
  document.getElementById("status").textContent =
    `🧪 "${action}" tapped successfully. This feature is intentionally demo-only right now.`;
});

setupCustomizer();
renderMainAvatar();
loadHunter();
