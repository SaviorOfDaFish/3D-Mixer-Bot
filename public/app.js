const DEFAULT_APPEARANCE = {
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

const OPTIONS = {
  skin: [
    ["#f4c6a5", "Light"],
    ["#dca37d", "Warm"],
    ["#b97852", "Tan"],
    ["#8f563b", "Deep"],
    ["#5f392d", "Dark"],
    ["#3e2823", "Rich"]
  ],
  hair: [
    ["short", "Short"],
    ["long", "Long"],
    ["mohawk", "Mohawk"],
    ["braid", "Braid"],
    ["bald", "Bald"]
  ],
  hairColor: [
    ["#241b18", "Black"],
    ["#4a2f27", "Brown"],
    ["#8d5a32", "Auburn"],
    ["#c99a4d", "Blonde"],
    ["#d9d9d9", "Silver"],
    ["#6b4aa3", "Violet"]
  ],
  eyes: [
    ["round", "Round"],
    ["narrow", "Narrow"],
    ["wide", "Wide"]
  ],
  eyeColor: [
    ["#4a6d84", "Blue"]
  ],
  beard: [
    ["none", "None"],
    ["stubble", "Stubble"],
    ["mustache", "Mustache"],
    ["full", "Full Beard"]
  ],
  outfit: [
    ["ranger", "Ranger"],
    ["leather", "Leather"],
    ["rift", "Rift"],
    ["frost", "Frost"],
    ["ember", "Ember"]
  ],
  cloak: [
    ["none", "None"],
    ["forest", "Forest"],
    ["rift", "Rift"],
    ["ember", "Ember"],
    ["frost", "Frost"]
  ],
  headgear: [
    ["none", "None"],
    ["hood", "Hood"],
    ["cap", "Hunter Cap"],
    ["horns", "Trophy Horns"]
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

function applyAppearanceToAvatar(avatar, appearance) {
  if (!avatar) return;

  avatar.style.setProperty("--skin", appearance.skin);
  avatar.style.setProperty("--hair", appearance.hairColor);
  avatar.style.setProperty("--eyes", appearance.eyeColor || "#4a6d84");

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
  const pet = clone.querySelector(".pet");
  if (pet) pet.remove();
  host.appendChild(clone);
  applyAppearanceToAvatar(clone.querySelector(".avatar"), workingAppearance);
}

function createChoiceButtons(containerId, key, items) {
  const container = document.getElementById(containerId);
  container.innerHTML = "";

  items.forEach(([value, label]) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "choice";
    btn.textContent = label;
    btn.dataset.value = value;
    btn.addEventListener("click", () => {
      workingAppearance[key] = value;
      updateEditor();
    });
    container.appendChild(btn);
  });
}

function createSwatches(containerId, key, items) {
  const container = document.getElementById(containerId);
  container.innerHTML = "";

  items.forEach(([value, label]) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "swatch";
    btn.style.setProperty("--swatch", value);
    btn.dataset.value = value;
    btn.title = label;
    btn.setAttribute("aria-label", label);
    btn.addEventListener("click", () => {
      workingAppearance[key] = value;
      updateEditor();
    });
    container.appendChild(btn);
  });
}

function syncSelectedStates() {
  const mappings = [
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
  cloneAvatarForEditor();
  syncSelectedStates();
  document.getElementById("customizerModal").classList.remove("hidden");
}

function closeCustomizer() {
  document.getElementById("customizerModal").classList.add("hidden");
}

function setupCustomizer() {
  createSwatches("skinOptions", "skin", OPTIONS.skin);
  createChoiceButtons("hairOptions", "hair", OPTIONS.hair);
  createSwatches("hairColorOptions", "hairColor", OPTIONS.hairColor);
  createChoiceButtons("eyeOptions", "eyes", OPTIONS.eyes);
  createChoiceButtons("beardOptions", "beard", OPTIONS.beard);
  createChoiceButtons("outfitOptions", "outfit", OPTIONS.outfit);
  createChoiceButtons("cloakOptions", "cloak", OPTIONS.cloak);
  createChoiceButtons("headgearOptions", "headgear", OPTIONS.headgear);

  document.getElementById("customizeBtn").addEventListener("click", openCustomizer);
  document.getElementById("closeCustomizer").addEventListener("click", closeCustomizer);

  document.getElementById("customizerModal").addEventListener("click", (event) => {
    if (event.target.id === "customizerModal") closeCustomizer();
  });

  document.getElementById("resetAppearance").addEventListener("click", () => {
    workingAppearance = { ...DEFAULT_APPEARANCE };
    updateEditor();
  });

  document.getElementById("saveAppearance").addEventListener("click", () => {
    savedAppearance = { ...workingAppearance };
    persistAppearance();
    renderMainAvatar();
    closeCustomizer();
    document.getElementById("status").textContent =
      "✅ Appearance saved locally on this device. Live Monster Hunt data was not touched.";
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

    status.textContent = "✅ Phase B loaded. Character creator is sandboxed from the live game.";
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
