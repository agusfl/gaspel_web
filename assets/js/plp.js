const products = [
  {
    id: 'vanitory-nordik',
    name: 'Vanitory Colgante 80 Olmo',
    price: 418099,
    category: 'banos',
    brand: 'ferrum',
    image: 'assets/img/vanitory.jpg',
    fallbackImage: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=600&q=80',
    installments: '12 cuotas de $45.700',
    rating: 4.8,
    sponsored: true
  },
  {
    id: 'inodoro-ferrum',
    name: 'Combo Inodoro Ferrum Bari',
    price: 286388,
    category: 'sanitarios',
    brand: 'ferrum',
    image: 'assets/img/inodoro.jpg',
    fallbackImage: 'https://images.unsplash.com/photo-1523419409543-0c1df022bddf?auto=format&fit=crop&w=600&q=80',
    installments: '12 cuotas de $31.500',
    rating: 4.6
  },
  {
    id: 'griferia-hidroflow',
    name: 'Grifería FV Pétalo Plus',
    price: 132231,
    category: 'banos',
    brand: 'fv',
    image: 'assets/img/griferia.jpg',
    fallbackImage: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=600&q=80',
    installments: '6 cuotas de $24.500',
    rating: 4.4
  },
  {
    id: 'ceramico-ilva',
    name: 'Cerámica Cañuelas Potenza 50x50',
    price: 10608,
    category: 'revestimientos',
    brand: 'ilva',
    image: 'assets/img/ceramica.jpg',
    fallbackImage: 'https://images.unsplash.com/photo-1523419409543-0c1df022bddf?auto=format&fit=crop&w=600&q=80',
    installments: '3 cuotas de $3.700',
    rating: 4.7
  }
];

const productGrid = document.getElementById('product-grid');
const filterForm = document.getElementById('filter-form');
const searchInput = document.getElementById('search');
const sortSelect = document.getElementById('sort-select');
const priceRange = document.getElementById('price-range');
const priceOutput = document.getElementById('price-output');
const cartFeedback = document.getElementById('cart-feedback');
const cartCountBadges = document.querySelectorAll('.cart-count');
const cartLink = document.querySelector('.cart-link');
const cartModal = document.getElementById('cart-modal');
const cartItemsList = document.getElementById('cart-items');
const cartEmptyState = document.getElementById('cart-empty');
const cartTotal = document.getElementById('cart-total');
const cartFooter = document.getElementById('cart-footer');
let lastFocusedElement = null;

const formatPrice = value =>
  new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 }).format(value);

const CART_STORAGE_KEY = 'gaspelCart';
const canUseStorage = typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';

const getStoredCart = () => {
  if (!canUseStorage) return [];
  try {
    return JSON.parse(localStorage.getItem(CART_STORAGE_KEY)) || [];
  } catch (error) {
    console.error('No se pudo leer el carrito', error);
    return [];
  }
};

const persistCart = cart => {
  if (!canUseStorage) return;
  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
  } catch (error) {
    console.error('No se pudo guardar el carrito', error);
  }
};

const getCartItemCount = (cart = []) => cart.reduce((total, item) => total + (item.quantity || 0), 0);
const getCartTotal = (cart = []) => cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

const updateCartCountBadges = (cart = getStoredCart()) => {
  const count = getCartItemCount(cart);
  cartCountBadges.forEach(badge => {
    badge.textContent = count;
    badge.classList.toggle('is-empty', count === 0);
    badge.setAttribute('aria-label', count === 1 ? '1 producto en el carrito' : `${count} productos en el carrito`);
  });
  return count;
};

const syncProductQuantityBadges = (cart = getStoredCart()) => {
  if (!productGrid) return;
  const quantityMap = cart.reduce((acc, item) => {
    acc[item.id] = item.quantity;
    return acc;
  }, {});

  productGrid.querySelectorAll('[data-count-for]').forEach(badge => {
    const productId = badge.dataset.countFor;
    const quantity = quantityMap[productId] || 0;
    const minusButton = productGrid.querySelector(`.remove-from-cart[data-product-id="${productId}"]`);
    if (quantity > 0) {
      badge.textContent = `x${quantity}`;
      badge.hidden = false;
      if (minusButton) minusButton.hidden = false;
    } else {
      badge.hidden = true;
      if (minusButton) minusButton.hidden = true;
    }
  });
};

const refreshCartUI = cart => {
  const snapshot = cart || getStoredCart();
  const count = updateCartCountBadges(snapshot);
  syncProductQuantityBadges(snapshot);
  if (cartModal && cartModal.classList.contains('is-visible')) {
    renderCartModal(snapshot);
  }
  return { snapshot, count };
};

const addProductToCart = productId => {
  const product = products.find(item => item.id === productId);
  if (!product) return;
  const cart = getStoredCart();
  const existing = cart.find(item => item.id === productId);
  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({ id: product.id, name: product.name, price: product.price, quantity: 1 });
  }
  persistCart(cart);
  const { count } = refreshCartUI(cart);
  if (cartFeedback) {
    cartFeedback.textContent = `${product.name} agregado al carrito. Total: ${count}`;
  }
};

const removeProductFromCart = productId => {
  const cart = getStoredCart();
  const targetIndex = cart.findIndex(item => item.id === productId);
  if (targetIndex === -1) return;

  const product = cart[targetIndex];
  if (product.quantity > 1) {
    product.quantity -= 1;
  } else {
    cart.splice(targetIndex, 1);
  }

  persistCart(cart);
  refreshCartUI(cart);
  if (cartFeedback) {
    cartFeedback.textContent = `${product.name} actualizado en el carrito.`;
  }
};

const deleteProductFromCart = productId => {
  const cart = getStoredCart();
  const product = cart.find(item => item.id === productId);
  if (!product) return;
  const updatedCart = cart.filter(item => item.id !== productId);
  persistCart(updatedCart);
  refreshCartUI(updatedCart);
  if (cartFeedback) {
    cartFeedback.textContent = `${product.name} eliminado del carrito.`;
  }
};

const renderProducts = items => {
  if (!productGrid) return;
  if (!items.length) {
    productGrid.innerHTML = '<p class="empty">No hay productos que coincidan con tu búsqueda.</p>';
    return;
  }

  productGrid.innerHTML = items
    .map(
      product => `
        <article class="product-card" data-category="${product.category}" data-brand="${product.brand}">
          ${product.sponsored ? '<span class="product-badge">Sponsored</span>' : ''}
          <img src="${product.image}" alt="${product.name}" loading="lazy" data-fallback="${product.fallbackImage || ''}" />
          <h3>${product.name}</h3>
          <p class="price">${formatPrice(product.price)}</p>
          <p class="installments">${product.installments}</p>
          <p class="rating">⭐ ${product.rating}</p>
          <div class="card-actions">
            <a class="btn btn-primary btn-sm" href="pdp.html">Ver detalles</a>
            <div class="quantity-inline">
              <button type="button" class="btn-icon btn-icon--muted remove-from-cart" data-product-id="${product.id}" aria-label="Quitar ${product.name} del carrito" hidden>
                −
              </button>
              <span class="product-counter" data-count-for="${product.id}" hidden>0</span>
              <button type="button" class="btn-icon add-to-cart" data-product-id="${product.id}" aria-label="Agregar ${product.name} al carrito">
                +
              </button>
            </div>
          </div>
        </article>
      `
    )
    .join('');

  productGrid.querySelectorAll('img[data-fallback]').forEach(image => {
    image.addEventListener('error', () => {
      if (image.dataset.fallbackApplied || !image.dataset.fallback) return;
      image.dataset.fallbackApplied = 'true';
      image.src = image.dataset.fallback;
    });
  });

  syncProductQuantityBadges();
};

const getCheckedValues = name =>
  Array.from(filterForm.querySelectorAll(`input[name="${name}"]:checked`)).map(input => input.value);

const renderCartModal = cart => {
  if (!cartModal || !cartItemsList || !cartTotal) return;
  const isEmpty = cart.length === 0;
  if (cartEmptyState) cartEmptyState.hidden = !isEmpty;
  cartItemsList.hidden = isEmpty;
  if (cartFooter) {
    cartFooter.hidden = isEmpty;
  }

  if (isEmpty) {
    cartItemsList.innerHTML = '';
    cartTotal.textContent = formatPrice(0);
    return;
  }

  cartItemsList.innerHTML = cart
    .map(
      item => `
        <li class="cart-modal__item">
          <div>
            <p class="cart-modal__item-title">${item.name}</p>
            <p class="cart-modal__item-meta">${item.quantity} × ${formatPrice(item.price)}</p>
          </div>
          <div class="cart-modal__item-actions">
            <strong>${formatPrice(item.price * item.quantity)}</strong>
            <button type="button" class="cart-modal__remove" data-product-id="${item.id}">Quitar</button>
          </div>
        </li>
      `
    )
    .join('');

  cartTotal.textContent = formatPrice(getCartTotal(cart));
};

const openCartModal = () => {
  if (!cartModal) return;
  lastFocusedElement = document.activeElement;
  cartModal.classList.add('is-visible');
  cartModal.setAttribute('aria-hidden', 'false');
  document.body.classList.add('modal-open');
  const closeButton = cartModal.querySelector('.cart-modal__close');
  closeButton?.focus();
};

const closeCartModal = () => {
  if (!cartModal) return;
  cartModal.classList.remove('is-visible');
  cartModal.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('modal-open');
  if (lastFocusedElement && typeof lastFocusedElement.focus === 'function') {
    lastFocusedElement.focus();
  }
};

const isPlainClick = event =>
  event.button === 0 && !event.metaKey && !event.ctrlKey && !event.shiftKey && !event.altKey;

const applyFilters = () => {
  const categories = getCheckedValues('category');
  const brands = getCheckedValues('brand');
  const searchTerm = searchInput.value.trim().toLowerCase();
  const maxPrice = Number(priceRange.value);

  let filtered = products.filter(product => {
    const matchesCategory = categories.includes(product.category);
    const matchesBrand = brands.includes(product.brand);
    const matchesPrice = product.price <= maxPrice;
    const matchesSearch = product.name.toLowerCase().includes(searchTerm);
    return matchesCategory && matchesBrand && matchesPrice && matchesSearch;
  });

  switch (sortSelect.value) {
    case 'price-asc':
      filtered = filtered.sort((a, b) => a.price - b.price);
      break;
    case 'price-desc':
      filtered = filtered.sort((a, b) => b.price - a.price);
      break;
    default:
      filtered = filtered.sort((a, b) => b.rating - a.rating);
  }

  renderProducts(filtered);
};

if (productGrid) {
  applyFilters();
  productGrid.addEventListener('click', event => {
    const addButton = event.target.closest('.add-to-cart');
    if (addButton) {
      const { productId } = addButton.dataset;
      if (productId) {
        addProductToCart(productId);
        addButton.classList.add('added');
        window.setTimeout(() => addButton.classList.remove('added'), 1200);
      }
      return;
    }

    const removeButton = event.target.closest('.remove-from-cart');
    if (removeButton) {
      const { productId } = removeButton.dataset;
      if (productId) {
        removeProductFromCart(productId);
      }
    }
  });
}

if (filterForm) {
  filterForm.addEventListener('change', applyFilters);
}

if (searchInput) {
  searchInput.addEventListener('input', () => {
    window.clearTimeout(searchInput._debounce);
    searchInput._debounce = window.setTimeout(applyFilters, 200);
  });
}

if (sortSelect) {
  sortSelect.addEventListener('change', applyFilters);
}

if (priceRange && priceOutput) {
  priceOutput.textContent = formatPrice(Number(priceRange.value));
  priceRange.addEventListener('input', () => {
    priceOutput.textContent = formatPrice(Number(priceRange.value));
    applyFilters();
  });
}

if (cartLink && cartModal) {
  cartLink.addEventListener('click', event => {
    if (!isPlainClick(event)) return;
    event.preventDefault();
    const { snapshot } = refreshCartUI();
    renderCartModal(snapshot);
    openCartModal();
  });
}

if (cartModal) {
  cartModal.addEventListener('click', event => {
    const target = event.target;
    if (target instanceof Element && target.closest('[data-close-cart]')) {
      event.preventDefault();
      closeCartModal();
    }
  });
}

document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && cartModal && cartModal.classList.contains('is-visible')) {
    closeCartModal();
  }
});

if (cartItemsList) {
  cartItemsList.addEventListener('click', event => {
    const removeButton = event.target.closest('.cart-modal__remove');
    if (!removeButton) return;
    const { productId } = removeButton.dataset;
    if (!productId) return;
    deleteProductFromCart(productId);
  });
}

refreshCartUI();

if (canUseStorage) {
  window.addEventListener('storage', () => {
    const { snapshot } = refreshCartUI();
    if (cartModal && cartModal.classList.contains('is-visible')) {
      renderCartModal(snapshot);
    }
  });
}

const params = new URLSearchParams(window.location.search);
const requestedCategory = params.get('category');

if (requestedCategory) {
  filterForm
    .querySelectorAll('input[name="category"]')
    .forEach(input => {
      input.checked = input.value === requestedCategory;
    });
  applyFilters();
}
