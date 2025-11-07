const checkoutForm = document.getElementById('checkout-form');
const steps = document.querySelectorAll('.checkout-step');
const stepIndicators = document.querySelectorAll('.checkout-steps li');
const feedback = document.getElementById('checkout-feedback');

const showStep = stepNumber => {
  steps.forEach(step => {
    const isActive = Number(step.dataset.step) === stepNumber;
    step.classList.toggle('active', isActive);
    step.toggleAttribute('hidden', !isActive);
  });

  stepIndicators.forEach(indicator => {
    const isActive = Number(indicator.dataset.step) === stepNumber;
    indicator.classList.toggle('active', isActive);
  });
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
    paymentSummary.textContent = paymentInput ? paymentInput.parentElement.textContent.trim() : '—';
  }
};

const goToStep = stepNumber => {
  updateSummary();
  showStep(stepNumber);
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
  feedback.textContent = '¡Gracias! Tu pedido fue confirmado. N° de orden: GP-' + Math.floor(Math.random() * 90000 + 10000);
  feedback.style.display = 'block';
  feedback.classList.add('success');
  checkoutForm.reset();
  goToStep(1);
});

showStep(1);
