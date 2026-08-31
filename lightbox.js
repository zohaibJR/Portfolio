/* =========================================================
   Project Gallery Lightbox
   Reads a JSON array of image paths from each element's
   data-gallery attribute and lets the user click through
   them with next/prev buttons, dots, or arrow keys.
   Works alongside your existing script.js — doesn't touch it.
========================================================= */

(function () {
  const triggers = document.querySelectorAll('.proj-image[data-gallery]');
  if (!triggers.length) return;

  const lightbox = document.getElementById('lightbox');
  const stageImg = document.getElementById('lightboxImg');
  const titleEl = document.getElementById('lightboxTitle');
  const counterEl = document.getElementById('lightboxCounter');
  const dotsEl = document.getElementById('lightboxDots');
  const prevBtn = lightbox.querySelector('.lightbox-prev');
  const nextBtn = lightbox.querySelector('.lightbox-next');
  const closeEls = lightbox.querySelectorAll('[data-lightbox-close]');

  let images = [];
  let currentIndex = 0;
  let lastFocused = null;

  // Add a small "N photos" badge to any card with more than one image
  triggers.forEach((trigger) => {
    let list = [];
    try {
      list = JSON.parse(trigger.getAttribute('data-gallery')) || [];
    } catch (e) {
      list = [];
    }
    if (list.length > 1) {
      const badge = document.createElement('span');
      badge.className = 'proj-image-count';
      badge.innerHTML = '<i class="fa fa-images"></i> ' + list.length;
      trigger.appendChild(badge);
    }

    trigger.addEventListener('click', () => {
      openLightbox(list, trigger.getAttribute('data-title') || '');
    });
  });

  function openLightbox(list, title) {
    images = list.filter(Boolean);
    if (!images.length) return;
    currentIndex = 0;
    lastFocused = document.activeElement;

    titleEl.textContent = title;
    renderDots();
    showImage(0);

    lightbox.classList.add('open');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    closeEls[closeEls.length - 1] && lightbox.querySelector('.lightbox-close').focus();

    document.addEventListener('keydown', handleKeydown);
  }

  function closeLightbox() {
    lightbox.classList.remove('open');
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    document.removeEventListener('keydown', handleKeydown);
    stageImg.classList.remove('loaded');
    if (lastFocused && typeof lastFocused.focus === 'function') {
      lastFocused.focus();
    }
  }

  function showImage(index) {
    if (!images.length) return;
    currentIndex = (index + images.length) % images.length;

    stageImg.classList.remove('loaded');
    stageImg.onload = () => stageImg.classList.add('loaded');
    stageImg.src = images[currentIndex];
    stageImg.alt = (titleEl.textContent || 'Project') + ' image ' + (currentIndex + 1);

    counterEl.textContent = (currentIndex + 1) + ' / ' + images.length;

    const singleImage = images.length <= 1;
    prevBtn.style.display = singleImage ? 'none' : 'flex';
    nextBtn.style.display = singleImage ? 'none' : 'flex';
    dotsEl.style.display = singleImage ? 'none' : 'flex';

    updateDots();
  }

  function renderDots() {
    dotsEl.innerHTML = '';
    if (images.length <= 1) return;
    images.forEach((_, i) => {
      const dot = document.createElement('button');
      dot.className = 'lightbox-dot';
      dot.setAttribute('aria-label', 'Go to image ' + (i + 1));
      dot.addEventListener('click', () => showImage(i));
      dotsEl.appendChild(dot);
    });
  }

  function updateDots() {
    const dots = dotsEl.querySelectorAll('.lightbox-dot');
    dots.forEach((dot, i) => dot.classList.toggle('active', i === currentIndex));
  }

  function handleKeydown(e) {
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') showImage(currentIndex - 1);
    if (e.key === 'ArrowRight') showImage(currentIndex + 1);
  }

  prevBtn.addEventListener('click', () => showImage(currentIndex - 1));
  nextBtn.addEventListener('click', () => showImage(currentIndex + 1));
  closeEls.forEach((el) => el.addEventListener('click', closeLightbox));
})();