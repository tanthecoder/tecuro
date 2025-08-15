(function(){
  const state = {
    products: [],
    suits: [],
    selectedConcerns: new Set(),
    selectedTraits: new Set(),
    sortKey: 'alpha'
  };

  function intersect(a, b) {
    for (const v of a) { if (b.has(v)) return true; }
    return false;
  }

  function getSelectedValues(selector) {
    return Array.from(document.querySelectorAll(selector + ':checked')).map(i => i.value);
  }

  function updateQueryParams() {
    const params = new URLSearchParams();
    if (state.selectedConcerns.size) params.set('c', Array.from(state.selectedConcerns).join(','));
    if (state.selectedTraits.size) params.set('t', Array.from(state.selectedTraits).join(','));
    if (state.sortKey && state.sortKey !== 'alpha') params.set('sort', state.sortKey);
    const query = params.toString();
    const url = query ? `${location.pathname}?${query}` : location.pathname;
    history.replaceState(null, '', url);
  }

  function applyFilters() {
    const concerns = new Set(state.selectedConcerns);
    const traits = new Set(state.selectedTraits);

    let filtered = state.products.filter(p => {
      const concernOk = concerns.size === 0 || intersect(new Set(p.concerns || []), concerns);
      const traitsOk = Array.from(traits).every(t => p.traits && p.traits[t]);
      return concernOk && traitsOk;
    });

    if (state.sortKey === 'alpha' || state.sortKey === 'pop') {
      filtered.sort((a,b) => a.name.localeCompare(b.name));
    }

    renderGroupedBySuit(filtered);
    updateQueryParams();
  }

  function groupBy(array, key) {
    const map = new Map();
    for (const item of array) {
      const k = item[key] || 'default';
      if (!map.has(k)) map.set(k, []);
      map.get(k).push(item);
    }
    return map;
  }

  function findSuitMeta(suitId) {
    return state.suits.find(s => s.id === suitId);
  }

  function renderGroupedBySuit(items) {
    const container = document.getElementById('product-grid');
    if (!container) return;

    const groups = groupBy(items, 'suit');
    const sections = [];
    for (const [suitId, list] of groups.entries()) {
      const suit = findSuitMeta(suitId) || { name: suitId, bannerImage: '' };
      const banner = suit.bannerImage ? `<div class="suit-banner mb-4"><img src="${suit.bannerImage}" alt="${suit.name}"></div>` : '';
      const cards = list.map(window.TeCuro.renderProductCard).join('');
      sections.push(`
        <section class="mb-10">
          <h2 class="section-title">${suit.name || ''}</h2>
          ${banner}
          <div class="grid sm:grid-cols-2 md:grid-cols-3 gap-6">${cards}</div>
        </section>
      `);
    }

    container.innerHTML = sections.join('');
    window.TeCuro.replaceIcons();
  }

  function initializeFromQuery() {
    const params = new URLSearchParams(location.search);
    const c = params.get('c');
    const t = params.get('t');
    const sort = params.get('sort');

    if (c) state.selectedConcerns = new Set(c.split(',').filter(Boolean));
    if (t) state.selectedTraits = new Set(t.split(',').filter(Boolean));
    if (sort) state.sortKey = sort;

    // Reflect in UI
    document.querySelectorAll('.filter-concern').forEach(el => {
      el.checked = state.selectedConcerns.has(el.value);
    });
    document.querySelectorAll('.filter-trait').forEach(el => {
      el.checked = state.selectedTraits.has(el.value);
    });
    const sortSelect = document.getElementById('sort-select');
    if (sortSelect && state.sortKey) sortSelect.value = state.sortKey;
  }

  async function initialize() {
    try {
      const [products, suits] = await Promise.all([
        window.TeCuro.fetchJSON('./assets/data/products.json'),
        window.TeCuro.fetchJSON('./assets/data/suits.json')
      ]);
      state.products = products;
      state.suits = suits;
    } catch (e) {
      console.error(e);
      state.products = [];
      state.suits = [];
    }

    initializeFromQuery();

    document.querySelectorAll('.filter-concern').forEach(el => {
      el.addEventListener('change', () => {
        state.selectedConcerns = new Set(getSelectedValues('.filter-concern'));
        applyFilters();
      });
    });

    document.querySelectorAll('.filter-trait').forEach(el => {
      el.addEventListener('change', () => {
        state.selectedTraits = new Set(getSelectedValues('.filter-trait'));
        applyFilters();
      });
    });

    const sortSelect = document.getElementById('sort-select');
    if (sortSelect) {
      sortSelect.addEventListener('change', () => {
        state.sortKey = sortSelect.value;
        applyFilters();
      });
    }

    applyFilters();
  }

  document.addEventListener('DOMContentLoaded', initialize);
})(); 