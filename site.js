/* ============================================================
   SOUTHERN BEE COLLECTIVE — SITE SETTINGS
   This is the only file you need to edit to add products
   or connect your email list.
   ============================================================ */

const SETTINGS = {
  // Paste your MailerLite form URL here (see SETUP.md, step 2).
  // It looks like: https://assets.mailerlite.com/jsonp/123456/forms/987654321/subscribe
  mailerliteFormUrl: "https://assets.mailerlite.com/jsonp/2737784/forms/202167666866128894/subscribe",
};

/* DIGITAL DOWNLOADS
   Copy one { ... } block to add a product. Fields:
   title, type (Book, Guide, Template, or Printable), description,
   price (leave "" to hide), link (your sales page), image (optional, e.g. "assets/red-light-guide.jpg") */
const DOWNLOADS = [
  // Example (delete the two slashes at the start of each line to use it):
  // {
  //   title: "My First Guide",
  //   type: "Guide",
  //   description: "One or two sentences about what's inside.",
  //   price: "$12",
  //   link: "https://your-sales-page-link",
  //   image: "assets/my-first-guide.jpg",
  // },
];

/* BOUTIQUE GOODS
   Leave empty until you're ready. Same fields as above (type can be anything, like "Apparel"). */
const BOUTIQUE = [];

/* ============================================================
   You shouldn't need to edit below this line.
   ============================================================ */

function esc(s) {
  return String(s ?? "").replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}

function cardHTML(p) {
  const img = p.image
    ? `<img src="${esc(p.image)}" alt="${esc(p.title)}" loading="lazy">`
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

function renderShop() {
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

document.addEventListener("DOMContentLoaded", () => {
  renderShop();
  wireSignup();
  const y = document.getElementById("year");
  if (y) y.textContent = new Date().getFullYear();
});
