const navToggle = document.querySelector('.nav-toggle');
const nav = document.querySelector('.primary-nav');

if (navToggle && nav) {
  navToggle.addEventListener('click', () => {
    const expanded = navToggle.getAttribute('aria-expanded') === 'true';
    navToggle.setAttribute('aria-expanded', String(!expanded));
    nav.classList.toggle('open');
    if (nav.classList.contains('open')) {
      nav.style.display = 'flex';
    } else if (window.innerWidth < 768) {
      nav.style.display = 'none';
    }
  });

  const handleResize = () => {
    if (window.innerWidth >= 768) {
      nav.style.display = 'flex';
    } else if (!nav.classList.contains('open')) {
      nav.style.display = 'none';
    }
  };

  handleResize();
  window.addEventListener('resize', handleResize);
}
