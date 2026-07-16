/* ---------- reveal on scroll ---------- */
const io = new IntersectionObserver(es => {
  es.forEach(e => { if(e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target); } });
}, { threshold: .12, rootMargin: '0px 0px -40px' });
document.querySelectorAll('.rv').forEach(el => io.observe(el));

/* ---------- mobile menu: close the native <details> after a link is chosen ---------- */
const mobileMenu = document.getElementById('mobileMenu');
if(mobileMenu){
  mobileMenu.querySelectorAll('a').forEach(a =>
    a.addEventListener('click', () => { mobileMenu.open = false; }));
}

/* ---------- hero video mute toggle ---------- */
const heroVideo = document.getElementById('heroVideo');
const muteBtn = document.getElementById('muteBtn');
if(heroVideo && muteBtn){
  muteBtn.onclick = () => {
    heroVideo.muted = !heroVideo.muted;
    muteBtn.dataset.muted = heroVideo.muted;
    muteBtn.setAttribute('aria-label', heroVideo.muted ? 'Unmute video' : 'Mute video');
  };
}
