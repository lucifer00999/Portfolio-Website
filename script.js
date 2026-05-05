/* ============================================================
   PREMIUM PORTFOLIO — script.js
   GSAP + ScrollTrigger animations, custom cursor, particles,
   3D tilt, magnetic buttons, testimonial slider, lightbox,
   and Service Exploration Modal
   ============================================================ */

function initAll() {
  if (window.ScrollTrigger) {
    gsap.registerPlugin(ScrollTrigger);
  }

  // PRELOADER
  const preloader = document.getElementById('preloader');
  const initSite = () => {
    preloader.classList.add('done');
    document.body.style.overflow = '';
    animateHero();
  };

  document.body.style.overflow = 'hidden';
  setTimeout(initSite, 1800);

  // CUSTOM CURSOR
  const cursor   = document.getElementById('cursor');
  const follower = document.getElementById('cursorFollower');
  const cText    = document.getElementById('cursorText');
  let mx = 0, my = 0;
  let fx = 0, fy = 0;

  document.addEventListener('mousemove', (e) => {
    mx = e.clientX;
    my = e.clientY;
    if (cursor) {
      cursor.style.left = mx + 'px';
      cursor.style.top  = my + 'px';
    }
  });

  function tickFollower() {
    fx += (mx - fx) * 0.12;
    fy += (my - fy) * 0.12;
    if (follower) {
      follower.style.left = fx + 'px';
      follower.style.top  = fy + 'px';
    }
    requestAnimationFrame(tickFollower);
  }
  tickFollower();

  document.querySelectorAll('a, button, .design-item, .service-card, .project-card, .tool-card, .cs-img-wrap').forEach(el => {
    el.addEventListener('mouseenter', () => {
      if(follower) follower.classList.add('active');
      if (el.dataset.cursor && cText) cText.textContent = el.dataset.cursor;
    });
    el.addEventListener('mouseleave', () => {
      if(follower) follower.classList.remove('active');
      if(cText) cText.textContent = '';
    });
  });

  // NAVBAR
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    if(navbar) navbar.classList.toggle('scrolled', window.scrollY > 60);
  }, { passive: true });

  const hamburger = document.getElementById('hamburger');
  const navLinks  = document.getElementById('navLinks');
  if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
      const open = navLinks.classList.toggle('open');
      hamburger.classList.toggle('open', open);
      document.body.style.overflow = open ? 'hidden' : '';
    });
  }

  document.querySelectorAll('.nav-link, .nav-cta').forEach(link => {
    link.addEventListener('click', () => {
      if(navLinks) navLinks.classList.remove('open');
      if(hamburger) hamburger.classList.remove('open');
      document.body.style.overflow = '';
    });
  });

  // PARTICLES
  const particlesEl = document.getElementById('particles');
  if (particlesEl) {
    const count = window.innerWidth < 768 ? 12 : 28;
    for (let i = 0; i < count; i++) {
      const p = document.createElement('div');
      p.className = 'particle';
      const size = Math.random() * 2.5 + 0.5;
      p.style.cssText = `width:${size}px; height:${size}px; left:${Math.random() * 100}%; animation-duration:${Math.random() * 18 + 12}s; animation-delay:${Math.random() * 12}s; opacity:0;`;
      particlesEl.appendChild(p);
    }
  }

  // PARALLAX ORBS
  window.addEventListener('mousemove', (e) => {
    const xRatio = (e.clientX / window.innerWidth - 0.5);
    const yRatio = (e.clientY / window.innerHeight - 0.5);
    document.querySelectorAll('.orb').forEach((orb, i) => {
      const f = (i + 1) * 14;
      orb.style.transform = `translate(${xRatio * f}px, ${yRatio * f}px)`;
    });
  }, { passive: true });

  // 3D TILT
  document.querySelectorAll('[data-tilt]').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const r = card.getBoundingClientRect();
      const x = e.clientX - r.left;
      const y = e.clientY - r.top;
      const cx = r.width / 2;
      const cy = r.height / 2;
      const rx = ((y - cy) / cy) * -7;
      const ry = ((x - cx) / cx) * 7;
      card.style.transform = `perspective(1200px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-6px) scale(1.01)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1200px) rotateX(0) rotateY(0) translateY(0) scale(1)';
    });
  });

  // MAGNETIC BUTTONS
  document.querySelectorAll('.magnetic').forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
      const r  = btn.getBoundingClientRect();
      const bx = r.left + r.width  / 2;
      const by = r.top  + r.height / 2;
      const dx = (e.clientX - bx) * 0.3;
      const dy = (e.clientY - by) * 0.3;
      btn.style.transform = `translate(${dx}px, ${dy}px) translateY(-3px)`;
    });
    btn.addEventListener('mouseleave', () => {
      btn.style.transform = '';
    });
  });

  // COUNTER ANIMATION
  function animateCounter(counter) {
    if (counter.dataset.animated) return;
    counter.dataset.animated = 'true';
    const target    = parseFloat(counter.dataset.target);
    const isDecimal = counter.dataset.decimal === 'true';
    const duration  = 2200;
    const startTime = performance.now();

    function update(now) {
      const progress = Math.min((now - startTime) / duration, 1);
      const eased    = 1 - Math.pow(1 - progress, 3);
      const value    = target * eased;
      counter.textContent = isDecimal ? value.toFixed(1) : Math.floor(value).toLocaleString();
      if (progress < 1) requestAnimationFrame(update);
    }
    requestAnimationFrame(update);
  }

  // HERO ANIMATION (GSAP)
  function animateHero() {
    if (!window.gsap) {
      document.querySelectorAll('.hero-content > *').forEach((el, i) => {
        el.style.opacity = '1';
        el.style.transform = 'none';
        el.style.transition = `opacity 0.8s ${i * 0.12}s, transform 0.8s ${i * 0.12}s`;
      });
      return;
    }

    const tl = gsap.timeline();
    tl.from('.hero-eyebrow', { y: 20, opacity: 0, duration: 0.7, ease: 'power3.out' })
      .from('.title-line', { y: 60, opacity: 0, duration: 0.8, stagger: 0.15, ease: 'power3.out' }, '-=0.3')
      .from('.hero-subtitle', { y: 24, opacity: 0, duration: 0.7, ease: 'power3.out' }, '-=0.4')
      .from('.hero-actions', { y: 20, opacity: 0, duration: 0.6, ease: 'power3.out' }, '-=0.4')
      .from('.hero-stat', { y: 20, opacity: 0, duration: 0.6, stagger: 0.1, ease: 'power3.out' }, '-=0.3')
      .from('.float-card', { x: 60, opacity: 0, duration: 0.8, stagger: 0.15, ease: 'power3.out' }, '-=0.8')
      .from('.scroll-hint', { y: 12, opacity: 0, duration: 0.6, ease: 'power3.out' }, '-=0.3');

    document.querySelectorAll('.hero-stats .counter').forEach(animateCounter);
  }

  // SCROLLTRIGGER ANIMATIONS
  if (window.gsap && window.ScrollTrigger) {
    document.querySelectorAll('.gsap-reveal').forEach(el => {
      gsap.to(el, {
        y: 0, opacity: 1, duration: 0.85, ease: 'power3.out',
        scrollTrigger: {
          trigger: el, start: 'top 88%', toggleActions: 'play none none none',
          onEnter: () => {
            el.querySelectorAll('.sb-fill').forEach(bar => { bar.style.width = bar.dataset.width + '%'; });
            el.querySelectorAll('.counter').forEach(animateCounter);
          }
        }
      });
    });

    document.querySelectorAll('.gsap-card').forEach((el, index) => {
      const parent   = el.parentElement;
      const siblings = Array.from(parent.children).filter(c => c.classList.contains('gsap-card'));
      const i        = siblings.indexOf(el);
      gsap.to(el, { y: 0, opacity: 1, duration: 0.85, delay: i * 0.1, ease: 'power3.out', scrollTrigger: { trigger: parent, start: 'top 85%', toggleActions: 'play none none none' } });
    });

    document.querySelectorAll('.sb-fill').forEach(bar => {
      ScrollTrigger.create({ trigger: bar, start: 'top 90%', onEnter: () => { bar.style.width = bar.dataset.width + '%'; } });
    });

    document.querySelectorAll('.result-card .counter').forEach(counter => {
      ScrollTrigger.create({ trigger: counter, start: 'top 88%', onEnter: () => animateCounter(counter) });
    });

    document.querySelectorAll('.section-title').forEach(title => {
      gsap.from(title, { y: 30, opacity: 0, duration: 0.9, ease: 'power3.out', scrollTrigger: { trigger: title, start: 'top 88%', toggleActions: 'play none none none' } });
    });

    gsap.to('.hero-card-float', { y: -60, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: 1.5 } });
  } else {
    document.querySelectorAll('.gsap-reveal, .gsap-card').forEach(el => { el.style.opacity = '1'; el.style.transform = 'none'; });
    document.querySelectorAll('.sb-fill').forEach(bar => { bar.style.width = bar.dataset.width + '%'; });
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.querySelectorAll('.counter').forEach(animateCounter);
        io.unobserve(entry.target);
      });
    }, { threshold: 0.2 });
    document.querySelectorAll('.hero-stats, .results-grid').forEach(el => io.observe(el));
  }

  // TESTIMONIAL SLIDER
  const track    = document.getElementById('testimonialTrack');
  const prevBtn  = document.getElementById('prevBtn');
  const nextBtn  = document.getElementById('nextBtn');
  const dotsWrap = document.getElementById('sliderDots');

  if (track && prevBtn && nextBtn) {
    let current    = 0;
    const slides   = track.children.length;
    const dots     = dotsWrap ? Array.from(dotsWrap.querySelectorAll('.dot')) : [];
    let autoTimer  = null;

    function goTo(idx) {
      current = (idx + slides) % slides;
      track.style.transform = `translateX(-${current * 100}%)`;
      dots.forEach((d, i) => d.classList.toggle('active', i === current));
    }
    function startAuto() { stopAuto(); autoTimer = setInterval(() => goTo(current + 1), 5500); }
    function stopAuto() { if (autoTimer) clearInterval(autoTimer); }

    prevBtn.addEventListener('click', () => { goTo(current - 1); startAuto(); });
    nextBtn.addEventListener('click', () => { goTo(current + 1); startAuto(); });
    dots.forEach((d, i) => d.addEventListener('click', () => { goTo(i); startAuto(); }));

    let touchStartX = 0;
    track.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
    track.addEventListener('touchend', e => {
      const dx = e.changedTouches[0].clientX - touchStartX;
      if (Math.abs(dx) > 40) { goTo(dx < 0 ? current + 1 : current - 1); startAuto(); }
    }, { passive: true });

    startAuto();
  }

  // LIGHTBOX (Images & Case Studies)
  const lightbox      = document.getElementById('lightbox');
  const lightboxImg   = document.getElementById('lightboxImg');
  const lightboxClose = document.getElementById('lightboxClose');

  if (lightbox) {
    document.querySelectorAll('.design-item').forEach(item => {
      item.addEventListener('click', () => {
        lightboxImg.src = item.dataset.img;
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
      });
    });
    const closeLightbox = () => { lightbox.classList.remove('active'); document.body.style.overflow = ''; };
    lightboxClose.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', e => { if (e.target === lightbox) closeLightbox(); });
    document.addEventListener('keydown', e => { if (e.key === 'Escape') closeLightbox(); });
  }

  // ============ SERVICE MODAL LOGIC ============
  const serviceData = {
    'google-ads': {
      title: 'Google Ads', icon: '<i class="fab fa-google"></i>', color: 'var(--gold)',
      desc: 'I create high-intent search and display campaigns designed to capture users exactly when they are looking for your services, ensuring maximum ROI and lower acquisition costs.',
      process: ['1. Keyword & Competitor Research', '2. Compelling Ad Copywriting', '3. Conversion Tracking Setup', '4. Continuous Bid Optimization'],
      deliverables: ['Custom Campaign Strategy', 'A/B Tested Ad Creatives', 'Negative Keyword Management', 'Monthly Performance Reports']
    },
    'meta-ads': {
      title: 'Meta Ads', icon: '<i class="fab fa-meta"></i>', color: '#4a8eff',
      desc: 'Scale your brand by reaching cold audiences and converting them into loyal customers using highly targeted Facebook and Instagram funnels.',
      process: ['1. Audience Mining & Targeting', '2. Scroll-stopping Creatives', '3. Pixel & Event Tracking', '4. Retargeting Funnel Setup'],
      deliverables: ['Multiple Ad Variations', 'Lookalike Audience Creation', 'Daily Budget Optimization', 'Lower Cost-Per-Lead (CPL)']
    },
    'web-dev': {
      title: 'Website Development', icon: '<i class="fas fa-code"></i>', color: 'var(--green)',
      desc: 'I build premium, fast, and mobile-responsive websites using HTML, CSS, PHP, and WordPress. Designed not just to look good, but to convert visitors into clients.',
      process: ['1. UI/UX Wireframing', '2. Custom Theme Development', '3. Mobile & Speed Optimization', '4. Launch & Basic SEO Setup'],
      deliverables: ['Fully Responsive Design', 'Lead Capture Forms Integration', 'Fast Load Times', 'Secure SSL & Hosting Setup']
    },
    'design': {
      title: 'Graphic & Video Design', icon: '<i class="fas fa-palette"></i>', color: '#ff8090',
      desc: 'Elevate your brand with eye-catching social media creatives, UI design, and high-quality promotional videos edited seamlessly in Premiere Pro.',
      process: ['1. Brand Visual Audit', '2. Storyboarding & Concept', '3. Graphic/Video Production', '4. Revisions & Final Export'],
      deliverables: ['Social Media Post Kits', 'Ad Banners & Posters', 'Engaging Reels & Video Ads', 'Source Files Provided']
    },
    'landing-pages': {
      title: 'Landing Pages', icon: '<i class="fas fa-rocket"></i>', color: '#c090ff',
      desc: 'A dedicated, distraction-free page engineered for one purpose: turning your paid ad traffic into qualified leads and sales.',
      process: ['1. Persuasive Copywriting', '2. High-Conversion Layout Design', '3. Trust Badges & Social Proof', '4. Form & CRM Integration'],
      deliverables: ['Distraction-Free UI', 'Mobile-First Architecture', 'A/B Testing Framework', 'Automated Email Triggers']
    }
  };

  const serviceModal = document.getElementById('serviceModal');
  const smIcon = document.getElementById('smIcon');
  const smTitle = document.getElementById('smTitle');
  const smDesc = document.getElementById('smDesc');
  const smProcess = document.getElementById('smProcess');
  const smDeliverables = document.getElementById('smDeliverables');
  const smClose = document.getElementById('serviceModalClose');

  if (serviceModal) {
    document.querySelectorAll('.open-service-modal').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const serviceKey = btn.getAttribute('data-service');
        const data = serviceData[serviceKey];
        
        if(data) {
          smIcon.innerHTML = data.icon;
          smIcon.style.color = data.color;
          smTitle.textContent = data.title;
          smDesc.textContent = data.desc;
          
          smProcess.innerHTML = data.process.map(item => `<li>${item}</li>`).join('');
          smDeliverables.innerHTML = data.deliverables.map(item => `<li>${item}</li>`).join('');
          
          serviceModal.classList.add('active');
          document.body.style.overflow = 'hidden';
        }
      });
    });

    const closeSModal = () => {
      serviceModal.classList.remove('active');
      document.body.style.overflow = '';
    };

    smClose.addEventListener('click', closeSModal);
    serviceModal.addEventListener('click', e => { if (e.target === serviceModal) closeSModal(); });
    document.addEventListener('keydown', e => { if (e.key === 'Escape' && serviceModal.classList.contains('active')) closeSModal(); });
  }
// ============ PROJECT TAB SWITCH WITH SMOOTH ANIMATION ============
document.querySelectorAll('.tab-btn').forEach(btn => {
  btn.addEventListener('click', function(e) {
    e.preventDefault();
    
    // Remove active from all buttons
    document.querySelectorAll('.tab-btn').forEach(b => {
      b.classList.remove('active');
    });
    
    // Add active to clicked button with animation
    this.classList.add('active');
    
    // Get the tab id
    const tab = this.dataset.tab;
    
    // Remove active from all panes
    document.querySelectorAll('.tab-pane').forEach(p => {
      p.classList.remove('active');
    });
    
    // Add active to corresponding pane
    const activePane = document.getElementById(tab);
    if (activePane) {
      activePane.classList.add('active');
      
      // Add staggered animation to company cards
      const cards = activePane.querySelectorAll('.company-card');
      cards.forEach((card, index) => {
        card.style.animationDelay = (index * 0.05) + 's';
      });
    }
  });
});

// ============ COMPANY CARD CLICK INTERACTION ============
document.querySelectorAll('.company-card').forEach(card => {
  card.addEventListener('click', function(e) {
    e.preventDefault();
    
    // Get company name
    const companyName = this.querySelector('h4')?.textContent || 'Project Files';
    
    // Show notification (or you can open a modal/download files)
    showCompanyDetails(companyName);
  });
  
  // Add hover sound/effect
  card.addEventListener('mouseenter', function() {
    this.style.borderColor = 'var(--gold-light)';
  });
  
  card.addEventListener('mouseleave', function() {
    this.style.borderColor = 'var(--glass-border)';
  });
});

// Function to show company details
function showCompanyDetails(companyName) {
  // You can customize this to:
  // 1. Open a modal with project files
  // 2. Download files
  // 3. Show a notification
  // 4. Navigate to a detail page
  
  // Example: Show alert (replace with your custom logic)
  console.log('Clicked on: ' + companyName);
  
  // Optional: You can add a custom toast/notification here
  // For now, just provide feedback to user
}
  // CONTACT FORM
  const form = document.getElementById('contactForm');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const btn = form.querySelector('button[type="submit"]');
      const originalHTML = btn.innerHTML;

      btn.innerHTML = '<span>Sending...</span> <i class="fas fa-circle-notch fa-spin"></i>';
      btn.disabled = true;

      setTimeout(() => {
        btn.innerHTML = '<span>Message Sent!</span> <i class="fas fa-check"></i>';
        btn.style.background = 'linear-gradient(135deg, #3ecf72, #22a05a)';
        form.reset();

        setTimeout(() => {
          btn.innerHTML = originalHTML;
          btn.style.background = '';
          btn.disabled = false;
        }, 3000);
      }, 1800);
    });
  }

  // SMOOTH SCROLL
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target && !anchor.classList.contains('sm-cta')) { // Ignore if it's inside the modal
        e.preventDefault();
        window.scrollTo({ top: target.offsetTop - 70, behavior: 'smooth' });
      }
    });
  });

  // ACTIVE NAV LINK ON SCROLL
  const sections = document.querySelectorAll('section[id]');
  const navLinksAll = document.querySelectorAll('.nav-link');
  const activateLink = () => {
    let current = '';
    sections.forEach(section => {
      if (window.scrollY >= section.offsetTop - 140) current = section.getAttribute('id');
    });
    navLinksAll.forEach(link => {
      link.style.color = link.getAttribute('href') === `#${current}` ? 'var(--gold-light)' : '';
    });
  };
  window.addEventListener('scroll', activateLink, { passive: true });
}

// BOOT
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => { setTimeout(initAll, 50); });
} else {
  setTimeout(initAll, 50);
}