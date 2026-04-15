document.addEventListener('DOMContentLoaded', () => {
  const header = document.getElementById('header');
  const menuToggle = document.getElementById('menuToggle');
  const mobileNav = document.getElementById('mobileNav');
  const mobileOverlay = document.getElementById('mobileOverlay');
  const navLinks = Array.from(document.querySelectorAll('.nav-link'));
  const mobileLinks = Array.from(document.querySelectorAll('.mobile-link'));
  const allNavLinks = [...navLinks, ...mobileLinks];
  const sections = Array.from(document.querySelectorAll('section[id]'));
  const revealItems = Array.from(document.querySelectorAll('.reveal-left, .reveal-right, .reveal-up'));
  const roleTarget = document.getElementById('typeTarget');
  const form = document.forms.submitToGoogleSheet;
  const msg = document.getElementById('msg');
  const animatedBars = Array.from(document.querySelectorAll('.sbar-fill, .sl-fill'));
  let barsRevealed = false;

  const closeMobileNav = () => {
    menuToggle?.classList.remove('open');
    menuToggle?.setAttribute('aria-expanded', 'false');
    mobileNav?.classList.remove('open');
    mobileOverlay?.classList.remove('show');
    document.body.classList.remove('nav-open');
  };

  const openMobileNav = () => {
    menuToggle?.classList.add('open');
    menuToggle?.setAttribute('aria-expanded', 'true');
    mobileNav?.classList.add('open');
    mobileOverlay?.classList.add('show');
    document.body.classList.add('nav-open');
  };

  const updateHeader = () => {
    header?.classList.toggle('scrolled', window.scrollY > 40);
  };

  const updateActiveNav = () => {
    const scrollPoint = window.scrollY + 140;
    let currentId = '#home';

    sections.forEach((section) => {
      const top = section.offsetTop;
      const bottom = top + section.offsetHeight;
      if (scrollPoint >= top && scrollPoint < bottom) {
        currentId = `#${section.id}`;
      }
    });

    navLinks.forEach((link) => {
      link.classList.toggle('active', link.getAttribute('href') === currentId);
    });
  };

  const revealOnScroll = () => {
    const threshold = window.innerHeight * 0.9;
    revealItems.forEach((item) => {
      if (item.getBoundingClientRect().top < threshold) {
        item.classList.add('revealed');
      }
    });
  };

  const animateBars = () => {
    if (barsRevealed) return;

    const trigger = window.scrollY + window.innerHeight;
    const aboutTop = document.getElementById('about')?.offsetTop ?? Infinity;
    const skillsTop = document.getElementById('skills')?.offsetTop ?? Infinity;

    if (trigger > aboutTop + 120 || trigger > skillsTop + 80) {
      barsRevealed = true;
      animatedBars.forEach((bar) => bar.classList.add('animated'));
    }
  };

  allNavLinks.forEach((link) => {
    link.addEventListener('click', (event) => {
      const href = link.getAttribute('href');
      if (!href?.startsWith('#')) return;

      const target = document.querySelector(href);
      if (!target) return;

      event.preventDefault();
      const offset = target.id === 'home' ? 0 : target.offsetTop - 80;
      window.scrollTo({ top: offset, behavior: 'smooth' });
      closeMobileNav();
    });
  });

  menuToggle?.addEventListener('click', () => {
    const isOpen = mobileNav?.classList.contains('open');
    if (isOpen) closeMobileNav();
    else openMobileNav();
  });

  mobileOverlay?.addEventListener('click', closeMobileNav);

  window.addEventListener('resize', () => {
    if (window.innerWidth > 860) closeMobileNav();
  });

  const roles = [
    'Full-Stack Developer',
    'MERN Stack Developer',
    'React Frontend Developer',
    'Backend API Builder',
  ];

  if (roleTarget) {
    let roleIndex = 0;
    let charIndex = 0;
    let deleting = false;

    const type = () => {
      const current = roles[roleIndex];
      roleTarget.textContent = deleting
        ? current.slice(0, charIndex--)
        : current.slice(0, charIndex++);

      let delay = deleting ? 55 : 95;

      if (!deleting && charIndex > current.length) {
        deleting = true;
        charIndex = current.length;
        delay = 1400;
      } else if (deleting && charIndex < 0) {
        deleting = false;
        roleIndex = (roleIndex + 1) % roles.length;
        charIndex = 0;
        delay = 320;
      }

      window.setTimeout(type, delay);
    };

    window.setTimeout(type, 700);
  }

  if (form && msg) {
    const scriptURL = 'https://script.google.com/macros/s/AKfycbzUSaaX3XmlE5m9YLOHOBrRuCh2Ohv49N9bs4bew7xPd1qlgpvXtnudDs5Xhp3jF-Fx/exec';

    form.addEventListener('submit', async (event) => {
      event.preventDefault();

      const submitButton = form.querySelector('button[type="submit"]');
      if (submitButton) {
        submitButton.disabled = true;
        submitButton.innerHTML = '<i class="fa fa-spinner fa-spin"></i> Sending...';
      }

      msg.textContent = '';

      try {
        await fetch(scriptURL, {
          method: 'POST',
          body: new FormData(form),
        });

        msg.textContent = 'Message sent successfully.';
        msg.style.color = '';
        form.reset();
      } catch (error) {
        msg.textContent = 'Something went wrong. Please try again.';
        msg.style.color = 'var(--danger)';
        console.error(error);
      } finally {
        if (submitButton) {
          submitButton.disabled = false;
          submitButton.innerHTML = 'Send Message <i class="fa fa-paper-plane"></i>';
        }
      }
    });
  }

  const onScroll = () => {
    updateHeader();
    updateActiveNav();
    revealOnScroll();
    animateBars();
  };

  updateHeader();
  updateActiveNav();
  revealOnScroll();
  animateBars();

  window.addEventListener('scroll', onScroll, { passive: true });
});
