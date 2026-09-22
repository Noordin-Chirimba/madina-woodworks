// Mobile menu
const menuToggle = document.querySelector('.menu-toggle');
const siteNav = document.querySelector('.site-nav');

function setMenu(open) {
  if (!siteNav || !menuToggle) return;
  siteNav.classList.toggle('open', open);
  menuToggle.setAttribute('aria-expanded', String(open));
  siteNav.setAttribute('aria-hidden', String(window.innerWidth <= 800 && !open));
  const icon = menuToggle.querySelector('span');
  if (icon) icon.textContent = open ? '−' : '+';
}

setMenu(false);
window.addEventListener('resize', () => {
  if (window.innerWidth > 800) {
    siteNav?.classList.remove('open');
    siteNav?.setAttribute('aria-hidden', 'false');
  }
});
menuToggle?.addEventListener('click', () => setMenu(!siteNav.classList.contains('open')));
siteNav?.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => setMenu(false)));
document.addEventListener('keydown', (e) => { if (e.key === 'Escape') setMenu(false); });
document.addEventListener('click', (e) => {
  if (siteNav?.classList.contains('open') && !e.target.closest('.site-header')) setMenu(false);
});

// Advert slideshow
const adImages = [
  'images/adverts/cylinders.png',
  'images/adverts/euro_handle.png',
  'images/adverts/hinge_handle.png',
  'images/adverts/madina_spring_handle_ad.png'
];

const adSlider = document.querySelector('#ad-slider');
if (adSlider) {
  adImages.forEach((src, index) => {
    const slide = document.createElement('div');
    slide.className = `ad-slide${index === 0 ? ' active' : ''}`;
    slide.innerHTML = `<img src="${src}" alt="Madina advert ${index + 1}" loading="eager" decoding="async" />`;
    adSlider.appendChild(slide);
  });

  let adIndex = 0;
  setInterval(() => {
    const slides = [...adSlider.children];
    if (!slides.length) return;

    slides.forEach((slide, index) => slide.classList.toggle('active', index === adIndex));
    adIndex = (adIndex + 1) % slides.length;
  }, 3200);
}

// Reveal on scroll
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });
document.querySelectorAll('.reveal').forEach((el) => revealObserver.observe(el));

// Product links preselect the project type in the enquiry form
const form = document.querySelector('#enquire-form');
const status = document.querySelector('#form-status');
document.querySelectorAll('[data-project]').forEach((link) => {
  link.addEventListener('click', () => {
    if (form?.elements.project) form.elements.project.value = link.dataset.project;
  });
});

// Enquiry: WhatsApp first, email as the alternative. Nothing is sent until the visitor presses send in their own app.
form?.addEventListener('submit', (event) => {
  event.preventDefault();
  const data = new FormData(form);
  const via = event.submitter?.value || 'whatsapp';
  const lines = [
    "Hello Madina, I'd like a quote.",
    '',
    `Name: ${data.get('name')}`,
    `Contact: ${data.get('contact')}`,
    `Reach me by: ${data.get('preferredContact')}`,
    `Project: ${data.get('project')}`,
    `Details: ${data.get('message') || 'No additional details provided.'}`
  ].join('\n');

  if (via === 'email') {
    const subject = `Website enquiry from ${data.get('name')}`;
    status.textContent = 'Opening your email app...';
    window.location.href = `mailto:info@madinamw.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(lines)}`;
  } else {
    status.textContent = 'Opening WhatsApp...';
    const link = document.createElement('a');
    link.href = `https://wa.me/${form.dataset.whatsapp}?text=${encodeURIComponent(lines)}`;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    link.click();
  }
});

// Hide the floating WhatsApp button while the enquiry form is on screen
const waFloat = document.querySelector('#wa-float');
const enquire = document.querySelector('#enquire');
if (waFloat && enquire) {
  new IntersectionObserver(([entry]) => waFloat.classList.toggle('hide', entry.isIntersecting), { threshold: 0.2 }).observe(enquire);
}
