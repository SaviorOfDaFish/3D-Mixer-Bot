(() => {
  const ROOT = "/assets/hunter";
  const SLOT_ORDER = ["cloak","weapon","body","outfit","face","hair","headgear"];
  const EXT = "svg";

  function getAppearance() {
    try {
      return { body:"male", face:"default", hair:"short", outfit:"ranger", cloak:"forest", headgear:"none", weapon:"bow",
        ...(JSON.parse(localStorage.getItem("monsterHuntDevAppearance") || "{}")) };
    } catch {
      return { body:"male", face:"default", hair:"short", outfit:"ranger", cloak:"forest", headgear:"none", weapon:"bow" };
    }
  }

  function fileFor(slot, appearance) {
    const map = {
      body: appearance.body || "male",
      face: "default",
      hair: appearance.hair || "short",
      outfit: appearance.outfit || "ranger",
      cloak: appearance.cloak || "none",
      headgear: appearance.headgear || "none",
      weapon: appearance.weapon || "bow"
    };
    const value = map[slot];
    if (!value || value === "none" || value === "bald") return null;
    return `${ROOT}/${slot}-${value}.${EXT}`;
  }

  async function exists(url) {
    try {
      const r = await fetch(url, {method:"HEAD", cache:"no-store"});
      return r.ok;
    } catch { return false; }
  }

  async function render(appearance = getAppearance()) {
    const scene = document.querySelector(".scene");
    const fallback = document.getElementById("avatarPreview");
    if (!scene || !fallback) return;

    let stage = document.getElementById("finalArtStage");
    if (!stage) {
      stage = document.createElement("div");
      stage.id = "finalArtStage";
      stage.className = "final-art-stage hidden";
      scene.appendChild(stage);
    }

    const bodyUrl = fileFor("body", appearance);
    if (!bodyUrl || !(await exists(bodyUrl))) {
      stage.classList.add("hidden");
      fallback.classList.remove("art-renderer-hidden");
      return;
    }

    stage.innerHTML = `<div class="final-art-glow"></div><div class="final-stack"></div>`;
    const stack = stage.querySelector(".final-stack");

    for (const slot of SLOT_ORDER) {
      const url = fileFor(slot, appearance);
      if (!url || !(await exists(url))) continue;
      const img = document.createElement("img");
      img.className = `final-layer final-${slot}`;
      img.src = url;
      img.alt = "";
      img.draggable = false;
      stack.appendChild(img);
    }

    stage.classList.remove("hidden");
    fallback.classList.add("art-renderer-hidden");
  }

  window.MonsterHuntFinalArt = { render, refresh: render };
})();