const thumbnails = document.querySelectorAll('.thumbnail');
const mainImage = document.getElementById('main-image');
const tabs = document.querySelectorAll('.tab');
const panels = document.querySelectorAll('.tab-panel');
const quantityInput = document.getElementById('quantity');
const quantityButtons = document.querySelectorAll('.quantity-selector button');

thumbnails.forEach(thumbnail => {
  thumbnail.addEventListener('click', () => {
    thumbnails.forEach(btn => btn.classList.remove('active'));
    thumbnail.classList.add('active');
    const image = thumbnail.getAttribute('data-image');
    if (mainImage && image) {
      mainImage.src = image;
    }
  });
});

tabs.forEach(tab => {
  tab.addEventListener('click', () => {
    const target = tab.dataset.tab;
    tabs.forEach(btn => {
      btn.classList.toggle('active', btn === tab);
      btn.setAttribute('aria-selected', String(btn === tab));
    });
    panels.forEach(panel => {
      const isActive = panel.id === target;
      panel.classList.toggle('active', isActive);
      panel.toggleAttribute('hidden', !isActive);
    });
  });
});

quantityButtons.forEach(button => {
  button.addEventListener('click', () => {
    if (!quantityInput) return;
    const currentValue = Number(quantityInput.value) || 1;
    const action = button.dataset.action;
    const nextValue = action === 'increment' ? currentValue + 1 : Math.max(1, currentValue - 1);
    quantityInput.value = String(nextValue);
  });
});
