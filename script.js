// Mobile navigation
const menuToggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('.nav');
menuToggle?.addEventListener('click', () => {
  const open = nav.classList.toggle('open');
  menuToggle.setAttribute('aria-expanded', String(open));
});
document.querySelectorAll('.nav a').forEach(link => link.addEventListener('click', () => {
  nav.classList.remove('open');
  menuToggle?.setAttribute('aria-expanded', 'false');
}));

// Reveal elements as they enter the viewport
const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });
document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

// Mark images as available only when they load. Missing images keep their styled placeholders.
document.querySelectorAll('img[data-fallback]').forEach(img => {
  img.addEventListener('load', () => {
    if (img.naturalWidth > 0) {
      img.classList.add('loaded');
      img.closest('.portrait-frame, .about-photo-wrap, .gallery-card')?.classList.add('has-image');
    }
  });
  img.addEventListener('error', () => {
    img.style.display = 'none';
    img.closest('.portrait-frame, .about-photo-wrap, .gallery-card')?.classList.remove('has-image');
  });
  if (img.complete && img.naturalWidth > 0) {
    img.closest('.portrait-frame, .about-photo-wrap, .gallery-card')?.classList.add('has-image');
  }
});

// Gallery lightbox
const lightbox = document.querySelector('.lightbox');
const lightboxImage = lightbox?.querySelector('img');
const closeLightbox = () => {
  lightbox?.classList.remove('open');
  lightbox?.setAttribute('aria-hidden', 'true');
  if (lightboxImage) lightboxImage.src = '';
};
document.querySelectorAll('.gallery-card').forEach(card => {
  card.addEventListener('click', () => {
    const image = card.querySelector('img');
    if (!image || !image.complete || image.naturalWidth === 0) return;
    lightboxImage.src = image.src;
    lightboxImage.alt = image.alt;
    lightbox.classList.add('open');
    lightbox.setAttribute('aria-hidden', 'false');
  });
});
lightbox?.querySelector('.lightbox-close')?.addEventListener('click', closeLightbox);
lightbox?.addEventListener('click', e => { if (e.target === lightbox) closeLightbox(); });
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeLightbox(); });

// Hide unavailable video players rather than showing a broken/corrupt-looking player.
document.querySelectorAll('.video-card video').forEach(video => {
  const card = video.closest('.video-card');
  video.addEventListener('error', () => {
    video.style.display = 'none';
    const note = document.createElement('div');
    note.className = 'video-missing';
    note.textContent = 'Video file not found. Add a valid MP4 file in the assets folder.';
    card.insertBefore(note, card.querySelector('p'));
  });
});
