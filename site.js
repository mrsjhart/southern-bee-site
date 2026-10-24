/* ============================================================
   SOUTHERN BEE COLLECTIVE — SITE SETTINGS
   ============================================================ */

const SETTINGS = {
  // Paste your MailerLite form URL here (see SETUP.md, step 2).
  // It looks like: https://assets.mailerlite.com/jsonp/123456/forms/987654321/subscribe
  mailerliteFormUrl: "https://assets.mailerlite.com/jsonp/2737784/forms/202167666866128894/subscribe",
};

/* Products and page text live in the content/ folder and are edited
   through Pages CMS (see EDITING.md), so there's nothing to change here. */

/* ============================================================
   You shouldn't need to edit below this line.
   ============================================================ */

function esc(s) {
  return String(s ?? "").replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}

function cardHTML(p) {
  const img = p.image
    ? `<img src="${esc(p.image)}" alt="${esc(p.imageAlt || p.title)}" loading="lazy" width="400" height="500">`
    : `<span class="ph" aria-hidden="true">${esc(p.title)}</span>`;
  const btn = p.link
    ? `<a class="btn" href="${esc(p.link)}" target="_blank" rel="noopener">Get it</a>`
    : `<span class="btn" aria-disabled="true">Coming soon</span>`;
  return `<article class="card" data-type="${esc(p.type)}">
    <div class="card-img">${img}</div>
    <div class="card-body">
      <span class="tag">${esc(p.type)}</span>
      <h3>${esc(p.title)}</h3>
      <p>${esc(p.description)}</p>
      <div class="meta"><span class="price">${esc(p.price)}</span>${btn}</div>
    </div>
  </article>`;
}

function renderShop(DOWNLOADS, BOUTIQUE) {
  const grid = document.getElementById("downloads-grid");
  if (grid && !DOWNLOADS.length) {
    const featured = grid.closest("[data-hide-when-empty]");
    if (featured) featured.hidden = true;
    grid.className = "empty";
    grid.innerHTML = `<h3>New downloads are on the way</h3>
      <p>Books, guides, templates and printables are being added now. Join the list to hear the moment they're ready.</p>
      <a class="btn ghost" href="subscribe.html">Join the list</a>`;
  } else if (grid) {
    const limit = Number(grid.dataset.limit) || DOWNLOADS.length;
    grid.innerHTML = DOWNLOADS.slice(0, limit).map(cardHTML).join("");

    const filters = document.getElementById("filters");
    if (filters) {
      const types = ["All", ...new Set(DOWNLOADS.map(p => p.type))];
      filters.innerHTML = types.map((t, i) =>
        `<button class="chip" type="button" aria-pressed="${i === 0}" data-type="${esc(t)}">${esc(t)}</button>`).join("");
      filters.addEventListener("click", e => {
        const chip = e.target.closest(".chip");
        if (!chip) return;
        filters.querySelectorAll(".chip").forEach(c => c.setAttribute("aria-pressed", c === chip));
        const t = chip.dataset.type;
        grid.querySelectorAll(".card").forEach(card => {
          card.hidden = t !== "All" && card.dataset.type !== t;
        });
      });
    }
  }

  const boutique = document.getElementById("boutique-grid");
  if (boutique) {
    if (BOUTIQUE.length) {
      boutique.className = "grid";
      boutique.innerHTML = BOUTIQUE.map(cardHTML).join("");
    } else {
      boutique.className = "empty";
      boutique.innerHTML = `<h3>Boutique goods are on the way</h3>
        <p>Join the list and you'll be the first to hear when they drop.</p>
        <a class="btn ghost" href="subscribe.html">Join the list</a>`;
    }
  }
}

function wireSignup() {
  document.querySelectorAll(".signup-form").forEach(form => {
    const note = form.querySelector(".form-note");
    form.addEventListener("submit", async e => {
      e.preventDefault();
      const email = form.querySelector("input[type=email]").value.trim();
      const name = form.querySelector("input[name=name]")?.value.trim() || "";
      if (!email) return;
      if (!SETTINGS.mailerliteFormUrl) {
        note.textContent = "Email signup isn't connected yet. Check back soon!";
        return;
      }
      const data = new FormData();
      data.append("fields[email]", email);
      if (name) data.append("fields[name]", name);
      data.append("ml-submit", "1");
      data.append("anticsrf", "true");
      note.textContent = "Signing you up…";
      try {
        await fetch(SETTINGS.mailerliteFormUrl, { method: "POST", body: data, mode: "no-cors" });
        form.reset();
        note.textContent = "You're in! Check your inbox to confirm.";
      } catch {
        note.textContent = "That didn't go through. Please check your connection and try again.";
      }
    });
  });
}

async function loadJSON(path, fallback) {
  try {
    const res = await fetch(path, { cache: "no-cache" });
    return res.ok ? await res.json() : fallback;
  } catch {
    return fallback;
  }
}

function applySiteText(text) {
  document.querySelectorAll("[data-content]").forEach(el => {
    const value = text[el.dataset.content];
    if (!value) return;
    if (el.dataset.content === "aboutText") {
      el.innerHTML = String(value).split(/\n\s*\n/).map(para => `<p>${esc(para.trim())}</p>`).join("");
    } else if (el.dataset.content === "contactEmail") {
      el.textContent = value;
      el.href = "mailto:" + value;
    } else {
      el.textContent = value;
    }
  });
}

document.addEventListener("DOMContentLoaded", async () => {
  const needsShop = document.getElementById("downloads-grid") || document.getElementById("boutique-grid");
  const [text, downloads, boutique] = await Promise.all([
    loadJSON("content/site.json", {}),
    needsShop ? loadJSON("content/downloads.json", []) : [],
    needsShop ? loadJSON("content/boutique.json", []) : [],
  ]);
  applySiteText(text);
  renderShop(downloads.filter(p => p && p.title), boutique.filter(p => p && p.title));
  wireSignup();
  const y = document.getElementById("year");
  if (y) y.textContent = new Date().getFullYear();
});
