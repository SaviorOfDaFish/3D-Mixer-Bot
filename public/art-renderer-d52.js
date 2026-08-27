(() => {
  const ART_ROOT = "/assets/hunter";
  const PET_ROOT = "/assets/pets";

  const LAYERS = [
    ["body", "body"],
    ["face", "face"],
    ["hair", "hair"],
    ["outfit", "outfit"],
    ["cloak", "cloak"],
    ["headgear", "headgear"],
    ["weapon", "weapon"]
  ];

  const state = {
    enabled: false,
    available: new Set(),
    appearance: null
  };

  function assetPath(slot, value) {
    if (!value || value === "none") return null;
    return `${ART_ROOT}/${slot}-${value}.webp`;
  }

  function ensureStage() {
    const scene = document.querySelector(".scene");
    if (!scene) return null;
    let stage = scene.querySelector("#finalArtStage");
    if (stage) return stage;

    stage = document.createElement("div");
    stage.id = "finalArtStage";
    stage.className = "final-art-stage hidden";
    stage.innerHTML = `
      <div class="final-art-glow"></div>
      <div class="final-hunter-stack" id="finalHunterStack"></div>
    `;
    scene.appendChild(stage);
    return stage;
  }

  async function exists(url) {
    try {
      const r = await fetch(url, { method: "HEAD", cache: "no-store" });
      return r.ok;
    } catch {
      return false;
    }
  }

  async function discover(appearance) {
    state.available.clear();
    const tests = [];
    for (const [slot, key] of LAYERS) {
      const value = appearance[key];
      const url = assetPath(slot, value);
      if (!url) continue;
      tests.push(exists(url).then(ok => { if (ok) state.available.add(url); }));
    }
    await Promise.all(tests);
    return state.available.size;
  }

  function render(appearance) {
    state.appearance = appearance;
    const stage = ensureStage();
    if (!stage) return;

    const stack = stage.querySelector("#finalHunterStack");
    stack.innerHTML = "";

    for (const [slot, key] of LAYERS) {
      const value = appearance[key];
      const url = assetPath(slot, value);
      if (!url || !state.available.has(url)) continue;
      const img = document.createElement("img");
      img.className = `final-layer final-layer-${slot}`;
      img.src = url;
      img.alt = "";
      img.draggable = false;
      stack.appendChild(img);
    }

    // Only hide the proven CSS avatar when actual body art exists.
    const hasBody = [...state.available].some(x => x.includes("/body-"));
    const oldAvatar = document.getElementById("avatarPreview");
    if (hasBody) {
      stage.classList.remove("hidden");
      oldAvatar?.classList.add("art-renderer-hidden");
      state.enabled = true;
    } else {
      stage.classList.add("hidden");
      oldAvatar?.classList.remove("art-renderer-hidden");
      state.enabled = false;
    }
  }

  async function refresh(appearance) {
    await discover(appearance);
    render(appearance);
  }

  window.MonsterHuntFinalArt = { refresh, render, state };
})();