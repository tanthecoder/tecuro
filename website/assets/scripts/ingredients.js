(function(){
  let ingredients = [];
  let fuse = null;

  function render(items) {
    const container = document.getElementById('ingredient-list');
    if (!container) return;
    container.innerHTML = items.map(item => `
      <article class="card">
        <h3 class="card-title">${item.name}</h3>
        <div class="text-xs text-stone-600 mb-2">${item.aliases?.join(', ') || ''}</div>
        <p class="card-body">${item.description || ''}</p>
        <div class="mt-2 flex flex-wrap gap-2 text-xs text-stone-600">${(item.tags||[]).map(t => `<span class=\"px-2 py-1 rounded-full border border-stone-200\">${t}</span>`).join('')}</div>
      </article>
    `).join('');
    window.TeCuro.replaceIcons();
  }

  async function initialize() {
    try {
      ingredients = await window.TeCuro.fetchJSON('./assets/data/ingredients.json');
      fuse = new Fuse(ingredients, { keys: ['name', 'aliases', 'tags'], threshold: 0.3 });
      render(ingredients);
    } catch (e) {
      console.error(e);
      render([]);
    }

    const input = document.getElementById('search');
    if (input) {
      let handle;
      input.addEventListener('input', () => {
        clearTimeout(handle);
        handle = setTimeout(() => {
          const q = input.value.trim();
          if (!q) { render(ingredients); return; }
          const results = fuse.search(q).map(r => r.item);
          render(results);
        }, 200);
      });
    }
  }

  document.addEventListener('DOMContentLoaded', initialize);
})(); 