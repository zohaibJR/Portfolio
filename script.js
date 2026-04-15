/* ============================================================
   ZOHAIB PORTFOLIO — REDESIGNED SCRIPT
   ============================================================ */

$(document).ready(function () {

  /* ===== Custom Cursor ===== */
  const cursor = document.getElementById('cursor');
  const follower = document.getElementById('cursorFollower');
  let mouseX = 0, mouseY = 0;
  let followerX = 0, followerY = 0;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursor.style.left = mouseX + 'px';
    cursor.style.top = mouseY + 'px';
  });

  function animateCursor() {
    followerX += (mouseX - followerX) * 0.12;
    followerY += (mouseY - followerY) * 0.12;
    follower.style.left = followerX + 'px';
    follower.style.top = followerY + 'px';
    requestAnimationFrame(animateCursor);
  }
  animateCursor();

  // Scale cursor on hover
  $('a, button, .skill-card, .project-card').on('mouseenter', () => {
    cursor.style.transform = 'translate(-50%,-50%) scale(2)';
    follower.style.transform = 'translate(-50%,-50%) scale(1.5)';
    follower.style.borderColor = 'rgba(245,166,35,0.6)';
  }).on('mouseleave', () => {
    cursor.style.transform = 'translate(-50%,-50%) scale(1)';
    follower.style.transform = 'translate(-50%,-50%) scale(1)';
    follower.style.borderColor = 'rgba(245,166,35,0.4)';
  });

  /* ===== Sticky Header ===== */
  $(window).on('scroll', function () {
    if ($(this).scrollTop() > 60) {
      $('.header-area').addClass('scrolled');
    } else {
      $('.header-area').removeClass('scrolled');
    }
    updateActiveNav();
    revealOnScroll();
  });

  /* ===== Smooth Scroll ===== */
  function smoothScroll(target) {
    if (target === '#home') {
      $('html, body').animate({ scrollTop: 0 }, 600, 'swing');
    } else {
      const offset = $(target).offset().top - 80;
      $('html, body').animate({ scrollTop: offset }, 600, 'swing');
    }
  }

  $('.nav-link, .mobile-link').on('click', function (e) {
    e.preventDefault();
    const target = $(this).attr('href');
    smoothScroll(target);
    closeMobileNav();
  });

  $('[href="#contact"]').on('click', function (e) {
    e.preventDefault();
    smoothScroll('#contact');
  });

  /* ===== Active Nav on Scroll ===== */
  function updateActiveNav() {
    const scrollPos = $(window).scrollTop();

    if (scrollPos < 100) {
      setActive('#home');
      return;
    }

    $('section').each(function () {
      const id = '#' + $(this).attr('id');
      const top = $(this).offset().top - 120;
      const bottom = top + $(this).outerHeight();
      if (scrollPos >= top && scrollPos < bottom) {
        setActive(id);
      }
    });
  }

  function setActive(id) {
    $('.nav-link').removeClass('active');
    $(`.nav-link[href="${id}"]`).addClass('active');
  }

  /* ===== Mobile Nav Toggle ===== */
  $('#menuToggle').on('click', function () {
    $(this).toggleClass('open');
    $('#mobileNav').toggleClass('open');
    $('body').toggleClass('nav-open');
  });

  function closeMobileNav() {
    $('#menuToggle').removeClass('open');
    $('#mobileNav').removeClass('open');
    $('body').removeClass('nav-open');
  }

  // Close on overlay click
  $(document).on('click', function (e) {
    if ($('#mobileNav').hasClass('open') &&
        !$(e.target).closest('#mobileNav, #menuToggle').length) {
      closeMobileNav();
    }
  });

  /* ===== Scroll Reveal ===== */
  function revealOnScroll() {
    const windowBottom = $(window).scrollTop() + $(window).height();
    $('.reveal-left, .reveal-right, .reveal-up').each(function () {
      const elemTop = $(this).offset().top;
      if (windowBottom > elemTop + 60) {
        $(this).addClass('revealed');
      }
    });
  }

  // Initial reveal check
  revealOnScroll();

  /* ===== Hero Typing Effect ===== */
  const roles = ['Full-Stack Developer', 'MERN Specialist', 'React Developer', 'Backend Engineer'];
  let roleIdx = 0;
  let charIdx = 0;
  let isDeleting = false;
  const roleEl = document.querySelector('.hero-role em');

  if (roleEl) {
    function typeRole() {
      const current = roles[roleIdx];
      if (isDeleting) {
        roleEl.textContent = current.substring(0, charIdx - 1);
        charIdx--;
      } else {
        roleEl.textContent = current.substring(0, charIdx + 1);
        charIdx++;
      }

      let speed = isDeleting ? 60 : 100;

      if (!isDeleting && charIdx === current.length) {
        speed = 2000;
        isDeleting = true;
      } else if (isDeleting && charIdx === 0) {
        isDeleting = false;
        roleIdx = (roleIdx + 1) % roles.length;
        speed = 400;
      }

      setTimeout(typeRole, speed);
    }
    setTimeout(typeRole, 1200);
  }

  /* ===== Tilt Effect on Project Cards ===== */
  if (window.innerWidth > 900) {
    $('.project-card').on('mousemove', function (e) {
      const card = $(this);
      const rect = this.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      const rotX = (-y / rect.height) * 8;
      const rotY = (x / rect.width) * 8;
      card.css('transform', `perspective(600px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateY(-8px)`);
    }).on('mouseleave', function () {
      $(this).css('transform', '');
    });
  }

  /* ===== Contact Form ===== */
  const scriptURL = 'https://script.google.com/macros/s/AKfycbzUSaaX3XmlE5m9YLOHOBrRuCh2Ohv49N9bs4bew7xPd1qlgpvXtnudDs5Xhp3jF-Fx/exec';
  const form = document.forms['submitToGoogleSheet'];
  const msg = document.getElementById('msg');

  if (form) {
    form.addEventListener('submit', e => {
      e.preventDefault();
      const btn = form.querySelector('button[type="submit"]');
      btn.innerHTML = '<i class="fa fa-spinner fa-spin"></i> Sending…';
      btn.disabled = true;

      fetch(scriptURL, { method: 'POST', body: new FormData(form) })
        .then(() => {
          msg.innerHTML = '✓ Message sent successfully!';
          setTimeout(() => { msg.innerHTML = ''; }, 5000);
          form.reset();
          btn.innerHTML = 'Send Message <i class="fa fa-paper-plane"></i>';
          btn.disabled = false;
        })
        .catch(err => {
          msg.innerHTML = '✗ Something went wrong. Try again.';
          msg.style.color = '#f87171';
          btn.innerHTML = 'Send Message <i class="fa fa-paper-plane"></i>';
          btn.disabled = false;
          console.error(err);
        });
    });
  }

  /* ===== Parallax bg text ===== */
  $(window).on('scroll', function () {
    const scrolled = $(this).scrollTop();
    $('.hero-bg-text').css('transform', `translate(-50%, calc(-50% + ${scrolled * 0.15}px))`);
  });

  /* ===== Initial hero animation ===== */
  setTimeout(() => {
    $('.hero-badge').addClass('revealed').css('opacity', '1').css('transform', 'none');
  }, 200);
  setTimeout(() => {
    $('.hero-left').addClass('revealed');
  }, 400);

});