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

    status.textContent = "✅ Fake test hunter loaded. Live game data remains disconnected.";
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
    `🧪 "${action}" tapped successfully. This button is intentionally demo-only in Phase A.`;
});

loadHunter();
