(function () {
  const TeCuro = {
    initialize() {
      this.applyPreferredTheme();
      this.initializeNavigation();
      this.replaceIcons();
      this.initializeAOS();
    },
    replaceIcons() {
      if (window.feather && typeof window.feather.replace === 'function') {
        window.feather.replace();
      }
    },
    initializeAOS() {
      if (window.AOS && typeof window.AOS.init === 'function') {
        window.AOS.init({ once: true, duration: 600, easing: 'ease-out' });
      }
    },
    async fetchJSON(path) {
      const response = await fetch(path, { cache: 'no-store' });
      if (!response.ok) { throw new Error(`Failed to load ${path}`); }
      return await response.json();
    },
    async renderFeaturedProducts(containerId, limit) {
      try {
        const container = document.getElementById(containerId);
        if (!container) return;
        const products = await this.fetchJSON('./assets/data/products.json');
        const items = products.slice(0, limit || 3);
        container.innerHTML = items.map(this.renderProductCard).join('');
        this.replaceIcons();
      } catch (err) {
        console.error(err);
      }
    },
    renderProductCard(product) {
      const traits = [];
      if (product.traits?.fragranceFree) traits.push('Fragrance-free');
      if (product.traits?.alcoholFree) traits.push('Alcohol-free');
      if (product.traits?.syntheticPreservativeFree) traits.push('No synthetic preservatives');
      return `
        <article class="card">
          <div class="media-container  rounded-xl border border-stone-200 bg-stone-50 mb-3">
            <img src="${product.heroImage || ''}" alt="${product.name || 'Product image'}" class="media-img">
          </div>
          <h3 class="card-title">${product.name}</h3>
          <p class="card-body">${product.shortDescription || ''}</p>
          <div class="mt-2 flex flex-wrap gap-2 text-xs text-stone-600">${traits.map(t => `<span class="px-2 py-1 rounded-full border border-stone-200">${t}</span>`).join('')}</div>
        </article>
      `;
    },
    // New: suits on home
    async renderFeaturedSuits(containerId, limit) {
      try {
        const container = document.getElementById(containerId);
        if (!container) return;
        const suits = await this.fetchJSON('./assets/data/suits.json');
        const items = suits.slice(0, limit || 3);
        container.innerHTML = items.map(this.renderSuitCard).join('');
        this.replaceIcons();
      } catch (err) {
        console.error(err);
      }
    },
    renderSuitCard(suit) {
      return `
        <article class="card">
          <div class="suit-card-banner mb-3">
            <img src="${suit.bannerImage || ''}" alt="${suit.name || 'Suit'} banner">
          </div>
          <h3 class="card-title">${suit.name}</h3>
          <p class="card-body">${suit.description || ''}</p>
        </article>
      `;
    },
    // Navigation and theming
    initializeNavigation() {
      const toggle = document.getElementById('menu-toggle');
      const menu = document.getElementById('nav-menu');
      if (!toggle || !menu) return;
      const handle = () => {
        const isHidden = menu.classList.contains('hidden');
        if (isHidden) {
          menu.classList.remove('hidden');
          toggle.setAttribute('aria-expanded', 'true');
        } else {
          menu.classList.add('hidden');
          toggle.setAttribute('aria-expanded', 'false');
        }
      };
      toggle.addEventListener('click', handle);
    },
    applyPreferredTheme() {
      try {
        const stored = localStorage.getItem('tecuro-theme');
        const theme = stored || 'earthy';
        document.documentElement.setAttribute('data-theme', theme);
      } catch (_) {
        document.documentElement.setAttribute('data-theme', 'earthy');
      }
    }
  };

  window.TeCuro = TeCuro;
  document.addEventListener('DOMContentLoaded', () => TeCuro.initialize());
})(); 