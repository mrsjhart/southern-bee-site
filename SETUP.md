# Southern Bee Collective website: setup and editing

## Files
- `index.html`, `shop.html`, `subscribe.html`, `about.html`: the four pages
- `styles.css`: colors and fonts (brand yellow is `--honey` at the top)
- `site.js`: **your products and email settings. This is the file you edit most.**
- `assets/logo.png`: your logo (also used as the browser-tab icon)

## Add or change a product
Open `site.js`, copy one `{ ... }` block in `DOWNLOADS`, and fill in the title, type, description, price and the link to its sales page. Put product images in `assets/` and set `image: "assets/your-file.jpg"`. Boutique items go in `BOUTIQUE` the same way.

## Connect MailerLite
1. In MailerLite: Forms → Embedded forms → Create, then open the form's HTML code.
2. Find the line starting `<form action="https://assets.mailerlite.com/jsonp/...`.
3. Copy that URL into `mailerliteFormUrl` at the top of `site.js`.

## Go live on GitHub Pages
1. Create a new public repository on GitHub (for example `southern-bee-site`).
2. Upload these files to it (or let Claude push them).
3. Repository Settings → Pages → Deploy from branch `main`, folder `/ (root)`.
4. Under Custom domain, enter your domain and tick Enforce HTTPS once it's available.
5. In GoDaddy DNS:
   - Four `A` records for `@` pointing to 185.199.108.153, 185.199.109.153, 185.199.110.153, 185.199.111.153 (delete any other `@` A records, such as Squarespace's).
   - A `CNAME` record for `www` pointing to `YOUR-GITHUB-USERNAME.github.io`.
6. Wait for DNS to update (usually under an hour), then cancel Squarespace.
