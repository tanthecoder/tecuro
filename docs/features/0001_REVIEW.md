### Te Curo Static Website — Code Review (0001)

#### Summary
Overall, the static site aligns closely with the plan: core pages exist, data files are seeded, and basic interactivity works (featured products, product filtering, ingredient search, and newsletter validation). Notable gaps include missing planned navigation/theming functions, incomplete SEO items (canonical links, JSON-LD), inconsistent mobile menu behavior due to missing Alpine on some pages, and absent deliverables like `site.webmanifest`, `favicon.ico`, and `assets/images/`.

---

#### Plan Coverage
- **Pages**: Implemented `index.html`, `about.html`, `products.html`, `ingredients.html`, `education.html`, `contact.html`, `legal/privacy.html`, `legal/terms.html`. Future pages were optional and are not present.
- **Data**: `assets/data/ingredients.json` seeded with the 8 requested ingredients; `assets/data/products.json` contains plausible placeholders mapping to those ingredients.
- **JS Interactivity**:
  - `website/assets/scripts/main.js`: Core helpers (`replaceIcons`, `initializeAOS`, `fetchJSON`), featured product rendering, product card template.
  - `website/assets/scripts/products.js`: Loads products, checkboxes for concerns/traits, alphabetical sort, renders grid.
  - `website/assets/scripts/ingredients.js`: Loads data, builds search index with Fuse.js, debounced search, renders list.
  - `website/assets/scripts/forms.js`: Email validation + simulated success; consent checkbox enforced.
- **Styling/Theming**: Base/theme/components CSS with color tokens reflecting planned vibes; Tailwind CDN used for utilities with some custom utility-like classes.
- **SEO**: Per-page `<title>` and meta description present. `robots.txt` and `sitemap.xml` exist.

---

#### Issues and Gaps
- **Navigation & Theming (deviates from plan)**
  - Planned functions (`initializeNavigation()`, `handleMobileMenuToggle()`, `applyPreferredTheme()`) are not implemented. Mobile menu toggling relies on Alpine directives in markup.
  - **Bug**: Pages using Alpine directives (`x-data`, `@click`, `:class`) lack the Alpine script: `ingredients.html`, `about.html`, `education.html`, `contact.html`, and `legal/*` (menus won’t toggle on mobile). `index.html` and `products.html` include Alpine; others do not.
  - Theming tokens exist (`theme.css` with `[data-theme]`), but no code applies a theme or respects user preference.

- **Products Page Functionality**
  - Filtering logic matches the plan (concerns OR, traits AND) and aligns with data keys. Sorting supports only alphabetical; “Popularity” placeholder is not exposed.
  - URL query param syncing (`syncFiltersWithQueryParams()`) is not implemented; filter state is not preserved across reloads/deeplinks.

- **Ingredients Page Functionality**
  - Search index uses Fuse.js (`name`, `aliases`, `tags`) with debounced input as planned. No details accordion/modal is provided; list renders simple cards only.

- **SEO/Analytics/Perf**
  - Canonical links are missing across all pages.
  - JSON-LD structured data (Organization/Product) not present.
  - Open Graph/Twitter meta not present.
  - `robots.txt` references `./sitemap.xml`; best practice is an absolute URL or root-relative `/sitemap.xml`.
  - `sitemap.xml` uses relative `./` paths; sitemaps should use absolute URLs; optional `<lastmod>` not included.
  - Analytics (Plausible/Umami) is not included (optional per plan).
  - Critical CSS not inlined (acceptable at this stage), but AOS CSS is included on some pages that don’t use it.

- **Deliverables Missing**
  - `website/site.webmanifest`, `website/favicon.ico`, and `website/assets/images/` are not present.

- **Accessibility**
  - Landmarks are used correctly (`header/nav/main/footer`).
  - Mobile menu button lacks `aria-expanded` state management when toggled (due to Alpine reliance and missing script on some pages).
  - No skip-to-content link; focus-visible styles rely on defaults.

- **Maintainability/Style**
  - Mixing Tailwind CDN utilities with custom utility-like classes (`components.css`) may introduce duplication/overlap; keep custom utilities minimal or consolidate.
  - Functions are grouped differently from the plan (single `applyFilters` instead of discrete `filter/sort/render`), which is fine but consider naming to improve clarity/testability.

---

#### Data Alignment Check
- `products.json` keys (`concerns`, `traits.fragranceFree|alcoholFree|syntheticPreservativeFree`) match UI filter values and code checks in `products.js`.
- `ingredients.json` fields match plan (ids, names, aliases, description, sources, caution, tags, references, booleans). Fuse.js searches on `name`, `aliases`, `tags` as expected.

---

#### Actionable Fixes
- **Mobile navigation**
  - Either include Alpine on all pages using Alpine directives, or remove Alpine and implement planned functions in `main.js`:
    - `initializeNavigation()` to wire toggle, set `aria-expanded`, manage menu visibility.
    - `handleMobileMenuToggle()` called on click.
  - Ensure consistent header markup and script includes across all pages (consider a shared partial if templating is introduced later).

- **Theming**
  - Implement `applyPreferredTheme()` to set `data-theme` on `<html>` or `<body>`, read from `localStorage` and/or media query.
  - Optionally provide a simple theme switcher to demonstrate the token system.

- **Products filters**
  - Add `syncFiltersWithQueryParams()`: read from `location.search` on load to initialize state; update query params on change.
  - Add a visible “Popularity” sort option that currently aliases to alphabetical until a real metric exists.

- **SEO**
  - Add `<link rel="canonical" href="..." />` on each page.
  - Add JSON-LD: Organization on `index.html`; consider Product list on `products.html` later.
  - Add Open Graph/Twitter meta on key pages (title/description/image).
  - Update `robots.txt` to `Sitemap: /sitemap.xml` (or full URL) and convert `sitemap.xml` `<loc>` entries to absolute URLs.

- **Assets**
  - Add `website/site.webmanifest` and `website/favicon.ico`; link them from all pages (`<link rel="manifest" href="/site.webmanifest">`, `<link rel="icon" href="/favicon.ico">`).
  - Create `website/assets/images/` and point `heroImage` fields or CSS backgrounds to placeholders.

- **Accessibility**
  - Manage `aria-expanded` on the mobile menu button; ensure the target `<ul>` has appropriate visibility toggling that works without Alpine.
  - Add a skip link and ensure focus-visible styles are clearly visible.

- **Perf hygiene**
  - Remove AOS CSS/JS from pages that don’t use it; keep it only on `index.html` (or where used).
  - Consider a small build step later to purge unused Tailwind classes and minify CSS/JS.

---

#### Quick Nits
- `sitemap.xml` already includes legal pages; consider adding `<lastmod>` timestamps when you update content.
- Product cards use empty `heroImage` URLs; consider a neutral placeholder image to avoid broken backgrounds.

---

#### Verdict
Solid initial implementation that demonstrates the planned experience. Address the navigation inconsistency, finish the planned navigation/theming utilities, and round out SEO/assets to fully meet the plan’s deliverables. 