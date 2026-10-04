document.getElementById('year').textContent = new Date().getFullYear();

// lock scroll during the intro so ScrollTrigger positions aren't computed
// against a page the user has already scrolled behind the splash
document.documentElement.style.overflow = 'hidden';
document.body.style.overflow = 'hidden';

// ── TYPED TITLE ──
const titles = ['Noufan TN!', 'Cybersecurity Student!', 'Noufan TN!', 'Cybersecurity Student!', 'Noufan TN!', 'Cybersecurity Student!'];
let titleIdx = 0, charIdx = 0, deleting = false;
const typedEl = document.getElementById('typed-title');
function typeLoop() {
  const current = titles[titleIdx];
  if (!deleting) {
    typedEl.textContent = current.substring(0, charIdx + 1);
    charIdx++;
    if (charIdx === current.length) { deleting = true; setTimeout(typeLoop, 1700); return; }
    setTimeout(typeLoop, 110);
  } else {
    typedEl.textContent = current.substring(0, charIdx - 1);
    charIdx--;
    if (charIdx === 0) { deleting = false; titleIdx = (titleIdx + 1) % titles.length; }
    setTimeout(typeLoop, 40);
  }
}

// ── SWIPER ──
const swiperInner = document.getElementById('swiper-inner');
const dots = document.querySelectorAll('#swiper-dots .dot');
const slides = swiperInner.querySelectorAll('.slide');
let currentSlide = 0;
const totalSlides = slides.length;
function goToSlide(n) {
  currentSlide = (n + totalSlides) % totalSlides;
  swiperInner.style.transform = `translateX(-${currentSlide * 100}%)`;
  dots.forEach((d, i) => d.classList.toggle('active', i === currentSlide));
  dots.forEach((d, i) => d.setAttribute('aria-pressed', String(i === currentSlide)));
  slides.forEach((slide, i) => {
    const isActive = i === currentSlide;
    slide.setAttribute('aria-hidden', String(!isActive));
    slide.querySelectorAll('a, button').forEach(control => control.tabIndex = isActive ? 0 : -1);
  });
}
goToSlide(0);
document.getElementById('swiper-prev').addEventListener('click', () => goToSlide(currentSlide - 1));
document.getElementById('swiper-next').addEventListener('click', () => goToSlide(currentSlide + 1));
dots.forEach((d, i) => d.addEventListener('click', () => goToSlide(i)));
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
let autoPlay = null;
let pageLoaded = document.readyState === 'complete';
let introComplete = false;
function startAutoPlayWhenReady() {
  if (!pageLoaded || !introComplete || prefersReducedMotion || autoPlay !== null) return;
  autoPlay = setInterval(() => goToSlide(currentSlide + 1), 5000);
}
function stopAutoPlay() {
  clearInterval(autoPlay);
  autoPlay = null;
}
window.addEventListener('load', () => {
  pageLoaded = true;
  startAutoPlayWhenReady();
}, { once: true });
const swiperContainer = document.getElementById('swiper-container');
swiperContainer.addEventListener('mouseenter', stopAutoPlay);
swiperContainer.addEventListener('mouseleave', startAutoPlayWhenReady);
swiperContainer.addEventListener('keydown', event => {
  if (event.key === 'ArrowLeft') {
    event.preventDefault();
    goToSlide(currentSlide - 1);
  } else if (event.key === 'ArrowRight') {
    event.preventDefault();
    goToSlide(currentSlide + 1);
  }
});

// ── GSAP ──
gsap.registerPlugin(ScrollTrigger);

if (prefersReducedMotion) {
  document.getElementById('splash').style.display = 'none';
  document.documentElement.style.overflow = '';
  document.body.style.overflow = '';
  typedEl.textContent = titles[0];
  introComplete = true;
  gsap.set('.home-banner-title, .col-span, #skills-tag, #skills-title, .skill-card-title, .skill-chip, #swiper-container, #edu-title, .edu-card, #contact-panel, .contact-link-el', { opacity: 1, x: 0, y: 0, scale: 1 });
  gsap.set('.card-line-top, .card-line-left, .proj-frame-top, .proj-frame-bottom, .proj-frame-left, .proj-frame-right, #edu-title-border, #edu-line, #footer-line', { scaleX: 1, scaleY: 1 });
} else {
// SPLASH — unlocks scroll and refreshes trigger positions when done
const splashTL = gsap.timeline({
  onComplete: () => {
    document.getElementById('splash').style.display = 'none';
    document.documentElement.style.overflow = '';
    document.body.style.overflow = '';
    ScrollTrigger.refresh();
    typeLoop();
    introComplete = true;
    startAutoPlayWhenReady();
    gsap.to('.home-banner-title, .col-span', { opacity: 1, y: 0, duration: 0.7, stagger: 0.12, delay: 0.15 });
  }
});
gsap.set('.home-banner-title, .col-span', { opacity: 0, y: 16 });
splashTL
  .from('.letter', { y: 90, opacity: 0, duration: 0.9, stagger: 0.05, ease: 'power3.out' })
  .from('.letter-down', { y: -90, opacity: 0, duration: 0.9, stagger: 0.05, ease: 'power3.out' }, '0')
  .from('.splash-sub-letter', { y: 40, opacity: 0, duration: 0.4, stagger: 0.03, ease: 'power3.out' }, '+=0.25')
  .to('.letter, .letter-down', { y: 90, opacity: 0, duration: 0.7, stagger: { amount: 0.4, from: 'end' }, ease: 'power3.in' }, '+=0.7')
  .to('.splash-sub-letter', { y: 40, opacity: 0, duration: 0.7, stagger: { amount: 0.4, from: 'end' }, ease: 'power3.in' }, '<')
  .to('.splash-col', { y: '100vh', duration: 1.1, stagger: { amount: 0.5, from: 'start' }, ease: 'power3.inOut' }, '-=0.9');

// ABOUT — image + text slide in (plays once)
gsap.fromTo('.profile-photo', { opacity: 0, x: -60 }, {
  opacity: 1, x: 0, duration: 0.7,
  scrollTrigger: { trigger: '.profile-photo', start: 'top 80%', toggleActions: 'play none none none' }
});

gsap.fromTo('.about-subtitle', { opacity: 0, x: 60 }, {
  opacity: 1, x: 0, duration: 0.8,
  scrollTrigger: { trigger: '.about-subtitle', start: 'top 80%', toggleActions: 'play none none none' }
});

gsap.fromTo('.slide', { opacity: 0, y: 24 }, {
  opacity: 1, y: 0, duration: 0.7, stagger: 0.12,
  scrollTrigger: { trigger: '#projects', start: 'top 72%', toggleActions: 'play none none none' }
});

// SKILLS — tag/title, then per-card border draw + title fade + chip stagger (plays once)
const skillsTL = gsap.timeline({ scrollTrigger: { trigger: '#skills', start: 'top 72%', toggleActions: 'play none none none' } });
skillsTL.to(['#skills-tag', '#skills-title'], { opacity: 1, y: 0, duration: 0.5, stagger: 0.12 });
for (let i = 0; i < 3; i++) {
  const card = `#skill-card-${i}`;
  skillsTL
    .fromTo(`${card} .card-line-top`,  { scaleX: 0 }, { scaleX: 1, duration: 0.6 })
    .fromTo(`${card} .card-line-left`, { scaleY: 0 }, { scaleY: 1, duration: 0.6 }, '>-0.2')
    .to(`${card} .skill-card-title`, { opacity: 1, duration: 0.35 }, '>-0.15')
    .to(`${card} .skill-chip`, { opacity: 1, scale: 1, stagger: 0.04, ease: 'back.out(1.7)', duration: 0.5 }, '<');
}

// PROJECTS — title frame + swiper border draw (plays once)
gsap.timeline({ scrollTrigger: { trigger: '.swiper-outer', start: 'top 82%', toggleActions: 'play none none none' } })
  .fromTo('.proj-frame-top',    { scaleX: 0 }, { scaleX: 1, duration: 0.4 })
  .fromTo('.proj-frame-right',  { scaleY: 0 }, { scaleY: 1, duration: 0.4 }, '>')
  .fromTo('.proj-frame-bottom', { scaleX: 0 }, { scaleX: 1, duration: 0.4 }, '>')
  .fromTo('.proj-frame-left',   { scaleY: 0 }, { scaleY: 1, duration: 0.4 }, '>')
  .to('#swiper-container', { opacity: 1, duration: 0.5 }, '>');

// EDUCATION — title border, progressive line, zig-zag cards
gsap.fromTo('#edu-title-border', { scaleX: 0 }, {
  scaleX: 1, duration: 0.6,
  scrollTrigger: { trigger: '.edu-title-wrap', start: 'top 78%', toggleActions: 'play none none none' }
});
gsap.to('#edu-title', {
  opacity: 1, duration: 0.5,
  scrollTrigger: { trigger: '#edu-title', start: 'top 78%', toggleActions: 'play none none none' }
});
gsap.fromTo('#edu-line', { scaleY: 0 }, {
  scaleY: 1, ease: 'none',
  scrollTrigger: { trigger: '.edu-list-zigzag', start: 'top 75%', end: 'bottom 85%', scrub: 1 }
});
for (let i = 0; i < 3; i++) {
  gsap.fromTo(`#edu-card-${i}`, { opacity: 0, x: i % 2 === 0 ? 60 : -60 }, {
    opacity: 1, x: 0, duration: 0.6,
    scrollTrigger: { trigger: `#edu-card-${i}`, start: 'top 82%', toggleActions: 'play none none none' }
  });
}

// CONTACT — panel fade, links stagger pop (plays once)
gsap.to('#contact-panel', {
  opacity: 1, duration: 0.7,
  scrollTrigger: { trigger: '#contact-panel', start: 'top 85%', toggleActions: 'play none none none' }
});
gsap.to('.contact-link-el', {
  opacity: 1, scale: 1, stagger: 0.1, duration: 0.5,
  scrollTrigger: { trigger: '.contact-links', start: 'top 85%', toggleActions: 'play none none none' }
});

// FOOTER line draw (plays once)
gsap.fromTo('#footer-line', { scaleX: 0 }, {
  scaleX: 1, duration: 0.6,
  scrollTrigger: { trigger: '#footer-line', start: 'top 95%', toggleActions: 'play none none none' }
});
}
