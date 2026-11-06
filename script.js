// Accessible navigation and persistent theme preference.
const menuButton = document.querySelector('.menu-toggle');
const links = document.querySelector('.nav-links');
function closeMenu() { links.classList.remove('open'); menuButton.setAttribute('aria-expanded', 'false'); menuButton.textContent = '☰'; }
menuButton.addEventListener('click', () => { const open = links.classList.toggle('open'); menuButton.setAttribute('aria-expanded', String(open)); menuButton.textContent = open ? '✕' : '☰'; });
document.querySelectorAll('.nav-links a').forEach(a => a.addEventListener('click', closeMenu));
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeMenu(); });
const themeButton = document.querySelector('#theme-toggle');
function applyTheme(dark) { document.body.classList.toggle('dark', dark); themeButton.textContent = dark ? '☀' : '☾'; themeButton.setAttribute('aria-label', dark ? 'Switch to light mode' : 'Switch to dark mode'); themeButton.title = dark ? 'Light mode' : 'Dark mode'; }
let storedTheme; try { storedTheme = localStorage.getItem('resume-theme'); } catch (_) {}
applyTheme(storedTheme === 'dark');
themeButton.addEventListener('click', () => { const dark = !document.body.classList.contains('dark'); applyTheme(dark); try { localStorage.setItem('resume-theme', dark ? 'dark' : 'light'); } catch (_) {} });
document.querySelector('#year').textContent = new Date().getFullYear();

// Scroll progress bar and active section highlighting.
const progress = document.querySelector('.scroll-progress');
let scrollQueued = false;
function updateScroll() { const max = document.documentElement.scrollHeight - innerHeight; progress.style.transform = `scaleX(${max > 0 ? scrollY / max : 0})`; scrollQueued = false; }
addEventListener('scroll', () => { if (!scrollQueued) { scrollQueued = true; requestAnimationFrame(updateScroll); } }, { passive: true });
addEventListener('resize', updateScroll); updateScroll();

const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
// Reveal sections on entry; all content remains visible without JS or motion support.
const revealTargets = document.querySelectorAll('.section .wrap > .eyebrow, .section .wrap > h2, .section-copy, .chips, .entry, .card, .edu article, .contact .actions');
if ('IntersectionObserver' in window && !reducedMotion) {
  revealTargets.forEach((el, i) => { el.classList.add('reveal-ready'); el.style.setProperty('--reveal-delay', `${(i % 3) * 65}ms`); });
  const revealObserver = new IntersectionObserver(entries => { entries.forEach(entry => { if (entry.isIntersecting) { entry.target.classList.add('revealed'); revealObserver.unobserve(entry.target); } }); }, { threshold: 0.08, rootMargin: '0px 0px -25px 0px' });
  revealTargets.forEach(el => revealObserver.observe(el));
}
const sectionObserver = 'IntersectionObserver' in window ? new IntersectionObserver(entries => { entries.forEach(entry => { if (!entry.isIntersecting) return; document.querySelectorAll('.nav-links a').forEach(a => { const active = a.getAttribute('href') === `#${entry.target.id}`; a.classList.toggle('active', active); if (active) a.setAttribute('aria-current', 'location'); else a.removeAttribute('aria-current'); }); }); }, { rootMargin: '-30% 0px -55% 0px' }) : null;
if (sectionObserver) document.querySelectorAll('main section[id]').forEach(section => sectionObserver.observe(section));

// Gentle typing animation for the job title; respects reduced-motion settings.
const role = document.querySelector('.typing-role');
if (role && !reducedMotion) {
  const full = role.textContent.trim(); role.textContent = '';
  let index = 0;
  const timer = setInterval(() => { role.textContent = full.slice(0, ++index); if (index >= full.length) clearInterval(timer); }, 85);
}
