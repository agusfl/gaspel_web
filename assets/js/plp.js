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
    rating: 4.8
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
  if (cartFeedback) {
    cartFeedback.textContent = `${product.name} agregado al carrito`;
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
          <img src="${product.image}" alt="${product.name}" loading="lazy" data-fallback="${product.fallbackImage || ''}" />
          <h3>${product.name}</h3>
          <p class="price">${formatPrice(product.price)}</p>
          <p class="installments">${product.installments}</p>
          <p class="rating">⭐ ${product.rating}</p>
          <div class="card-actions">
            <a class="btn btn-primary btn-sm" href="pdp.html">Ver detalles</a>
            <button type="button" class="btn-icon add-to-cart" data-product-id="${product.id}" aria-label="Agregar ${product.name} al carrito">
              +
            </button>
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
};

const getCheckedValues = name =>
  Array.from(filterForm.querySelectorAll(`input[name="${name}"]:checked`)).map(input => input.value);

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
    const button = event.target.closest('.add-to-cart');
    if (!button) return;
    const { productId } = button.dataset;
    if (!productId) return;
    addProductToCart(productId);
    button.classList.add('added');
    window.setTimeout(() => button.classList.remove('added'), 1200);
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
