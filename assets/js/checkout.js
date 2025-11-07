const checkoutForm = document.getElementById('checkout-form');
const steps = document.querySelectorAll('.checkout-step');
const stepIndicators = document.querySelectorAll('.checkout-steps li');
const feedback = document.getElementById('checkout-feedback');
const successPanel = document.getElementById('checkout-success');
const successOrder = document.getElementById('success-order');
const newOrderButton = document.getElementById('new-order');
const checkoutStepsNav = document.querySelector('.checkout-steps');
const stepStatus = document.getElementById('step-status');
const stepTitle = document.getElementById('step-title');
const stepDesc = document.getElementById('step-desc');
const summaryList = document.getElementById('summary-items');
const summaryEmpty = document.getElementById('summary-empty');
const summaryTotals = document.getElementById('summary-totals');
const summarySubtotal = document.getElementById('summary-subtotal');
const summaryShipping = document.getElementById('summary-shipping');
const summaryTotal = document.getElementById('summary-total');
const totalSteps = steps.length;
const paymentRadios = document.querySelectorAll('input[name=\"payment\"]');
const paymentDetails = checkoutForm?.querySelector('.payment-details');
const paymentCardInputs = paymentDetails ? paymentDetails.querySelectorAll('input') : [];
const CART_STORAGE_KEY = 'gaspelCart';
const SHIPPING_COST = 0;

const formatPrice = value =>
  new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 }).format(value);

const getStoredCart = () => {
  try {
    return JSON.parse(localStorage.getItem(CART_STORAGE_KEY)) || [];
  } catch (error) {
    console.error('No se pudo leer el carrito', error);
    return [];
  }
};

const renderOrderSummary = () => {
  if (!summaryList || !summaryEmpty || !summaryTotals || !summarySubtotal || !summaryShipping || !summaryTotal) return;
  const cart = getStoredCart();
  if (!cart.length) {
    summaryList.innerHTML = '';
    summaryEmpty.hidden = false;
    summaryTotals.hidden = true;
    return;
  }

  summaryEmpty.hidden = true;
  summaryTotals.hidden = false;
  summaryList.innerHTML = cart
    .map(
      item => `
        <li>
          <span>${item.name} × ${item.quantity}</span>
          <strong>${formatPrice(item.price * item.quantity)}</strong>
        </li>
      `
    )
    .join('');

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  summarySubtotal.textContent = formatPrice(subtotal);
  summaryShipping.textContent = SHIPPING_COST === 0 ? 'Gratis' : formatPrice(SHIPPING_COST);
  summaryTotal.textContent = formatPrice(subtotal + SHIPPING_COST);
};
const showStep = stepNumber => {
  let activeStep;
  steps.forEach(step => {
    const isActive = Number(step.dataset.step) === stepNumber;
    step.classList.toggle('active', isActive);
    step.toggleAttribute('hidden', !isActive);
    if (isActive) {
      activeStep = step;
    }
  });

  stepIndicators.forEach(indicator => {
    const isActive = Number(indicator.dataset.step) === stepNumber;
    indicator.classList.toggle('active', isActive);
  });

  updateStepProgress(stepNumber, activeStep);
  if (stepNumber > 1 && activeStep) {
    activeStep.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
};

const updateSummary = () => {
  const summaryFields = checkoutForm.querySelectorAll('[data-summary]');
  summaryFields.forEach(field => {
    const name = field.getAttribute('data-summary');
    const input = checkoutForm.querySelector(`[name="${name}"]`);
    if (input) {
      field.textContent = input.value || '—';
    }
  });

  const paymentInput = checkoutForm.querySelector('input[name="payment"]:checked');
  const paymentSummary = checkoutForm.querySelector('[data-summary="payment"]');
  if (paymentSummary) {
    if (paymentInput) {
      const title = paymentInput
        .closest('.payment-card')
        ?.querySelector('.payment-card__title')
        ?.textContent.trim();
      paymentSummary.textContent = title || '—';
    } else {
      paymentSummary.textContent = '—';
    }
  }
};

const goToStep = stepNumber => {
  updateSummary();
  showStep(stepNumber);
};

const updateStepProgress = (stepNumber, activeStep) => {
  if (!stepStatus || !stepTitle || !stepDesc) return;
  stepStatus.textContent = `Paso ${stepNumber} de ${totalSteps}`;
  if (activeStep) {
    const computedTitle = activeStep.dataset.stepTitle || activeStep.querySelector('h2')?.textContent || '';
    const computedDesc = activeStep.dataset.stepDesc || '';
    stepTitle.textContent = computedTitle;
    stepDesc.textContent = computedDesc;
  }
};

const handlePaymentDetailsVisibility = () => {
  if (!paymentDetails) return;
  const selected = checkoutForm.querySelector('input[name="payment"]:checked');
  const needsCard = selected && (selected.value === 'credit' || selected.value === 'debit');
  paymentDetails.toggleAttribute('hidden', !needsCard);
  paymentCardInputs.forEach(input => {
    input.required = Boolean(needsCard);
    if (!needsCard) {
      input.value = '';
    }
  });
};

checkoutForm?.addEventListener('click', event => {
  const nextButton = event.target.closest('.next-step');
  const prevButton = event.target.closest('.prev-step');

  if (nextButton) {
    const currentStep = Number(nextButton.closest('.checkout-step').dataset.step);
    if (currentStep === 1 && !checkoutForm.reportValidity()) {
      return;
    }
    if (currentStep === 2) {
      const paymentSelected = checkoutForm.querySelector('input[name="payment"]:checked');
      if (!paymentSelected) {
        feedback.textContent = 'Elegí un método de pago para continuar.';
        feedback.style.display = 'block';
        feedback.focus?.();
        return;
      }
      handlePaymentDetailsVisibility();
      if (!checkoutForm.reportValidity()) {
        return;
      }
      feedback.style.display = 'none';
    }
    goToStep(currentStep + 1);
  }

  if (prevButton) {
    const currentStep = Number(prevButton.closest('.checkout-step').dataset.step);
    feedback.style.display = 'none';
    goToStep(currentStep - 1);
  }
});

checkoutForm?.addEventListener('submit', event => {
  event.preventDefault();
  const orderId = 'GP-' + Math.floor(Math.random() * 90000 + 10000);
  enterSuccessState(orderId);
});

newOrderButton?.addEventListener('click', () => {
  successPanel.hidden = true;
  checkoutForm.hidden = false;
  checkoutStepsNav?.classList.remove('checkout-steps--hidden');
  feedback.style.display = 'none';
  checkoutForm.reset();
  paymentDetails?.setAttribute('hidden', '');
  showStep(1);
});

paymentRadios.forEach(radio => {
  radio.addEventListener('change', () => {
    feedback.style.display = 'none';
    handlePaymentDetailsVisibility();
  });
});

const enterSuccessState = orderId => {
  if (!successPanel) return;
  if (successOrder) {
    successOrder.textContent = orderId;
  }
  checkoutForm.hidden = true;
  successPanel.hidden = false;
  checkoutStepsNav?.classList.add('checkout-steps--hidden');
  feedback.style.display = 'none';
  if (stepStatus) stepStatus.textContent = 'Pedido confirmado';
  if (stepTitle) stepTitle.textContent = '¡Gracias por tu compra!';
  if (stepDesc) stepDesc.textContent = 'Te enviamos un correo con todos los detalles y el seguimiento.';
  checkoutForm.reset();
  paymentDetails?.setAttribute('hidden', '');
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

handlePaymentDetailsVisibility();
renderOrderSummary();
showStep(1);

window.addEventListener('storage', event => {
  if (event.key === CART_STORAGE_KEY) {
    renderOrderSummary();
  }
});
