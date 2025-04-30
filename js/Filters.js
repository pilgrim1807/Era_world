document.addEventListener('DOMContentLoaded', () => {
  const checkboxes = document.querySelectorAll('.filter-grid-item input[type="checkbox"]');
  const cardsContainer = document.querySelector('.grid-row');
  const cards = Array.from(document.querySelectorAll('.card_box'));
  const noResultsBox = document.getElementById('no-results-message');
  const clearBtn = document.getElementById('clear-filters');

  const filterMap = {
    "1": "ra",
    "2": "colorTemp",
    "3": "bodyColor",
    "4": "diffuser",
    "5": "model",
    "6": "size",
    "7": "power"    
  };

  function getActiveFilters() {
    const filters = {};
    checkboxes.forEach(cb => {
      if (cb.checked) {
        const match = cb.name.match(/filter_(\d+)/);
        if (match) {
          const key = match[1];
          const value = cb.value.trim().toLowerCase();
          if (!filters[key]) filters[key] = [];
          filters[key].push(value);
        }
      }
    });
    return filters;
  }

  function filterCards() {
    const activeFilters = getActiveFilters();
    let matchedCards = [];
    let unmatchedCards = [];

    cards.forEach(card => {
      let isMatch = true;
      for (const filterKey in activeFilters) {
        const dataAttr = filterMap[filterKey];
        const cardValue = (card.dataset[dataAttr] || "").toLowerCase().trim();
        const filterValues = activeFilters[filterKey];
        if (!filterValues.includes(cardValue)) {
          isMatch = false;
          break;
        }
      }
      if (isMatch) matchedCards.push(card);
      else unmatchedCards.push(card);
    });

    cardsContainer.innerHTML = '';
    matchedCards.forEach(card => {
      card.classList.remove('hidden');
      cardsContainer.appendChild(card);
    });
    unmatchedCards.forEach(card => {
      card.classList.add('hidden');
      cardsContainer.appendChild(card);
    });

    noResultsBox.style.display = (Object.keys(activeFilters).length > 0 && matchedCards.length === 0) ? 'flex' : 'none';
  }

  function resetFilters() {
    checkboxes.forEach(cb => cb.checked = false);
    noResultsBox.style.display = 'none';
    cards.forEach(card => card.classList.remove('hidden'));
    cards.forEach(card => cardsContainer.appendChild(card)); 
  }

  checkboxes.forEach(cb => cb.addEventListener('change', filterCards));
  document.querySelector('.reset-btn')?.addEventListener('click', e => {
    e.preventDefault();
    resetFilters();
  });
  clearBtn?.addEventListener('click', resetFilters);

  filterCards();

  
});