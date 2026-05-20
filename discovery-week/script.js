// Discovery Week 2026 — Site Navigation & Interactions

// ─── PAGE ROUTING ───────────────────────────────────────
function showPage(pageId) {
  // Hide all pages
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  // Show target page
  const target = document.getElementById('page-' + pageId);
  if (target) {
    target.classList.add('active');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
  // Update nav active state
  document.querySelectorAll('.nav-item').forEach(n => {
    n.classList.toggle('active', n.dataset.page === pageId);
  });
  // Close mobile menu
  document.getElementById('nav-links').classList.remove('open');
}

// ─── MOBILE HAMBURGER ───────────────────────────────────
function toggleMenu() {
  document.getElementById('nav-links').classList.toggle('open');
}

// Close mobile menu on outside click
document.addEventListener('click', (e) => {
  const nav = document.getElementById('nav-links');
  const burger = document.getElementById('hamburger');
  if (!nav.contains(e.target) && !burger.contains(e.target)) {
    nav.classList.remove('open');
  }
});

// ─── TOOL TABS ───────────────────────────────────────────
function showToolTab(tabId) {
  // Deactivate all tab content
  document.querySelectorAll('.tool-tab-content').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
  // Activate selected
  const content = document.getElementById('tab-' + tabId);
  if (content) content.classList.add('active');
  // Activate button
  event.currentTarget.classList.add('active');
}

// ─── CHECKLIST INTERACTIVITY ─────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  // Make checklist items toggleable
  document.querySelectorAll('.check-item, .station-item').forEach(item => {
    item.addEventListener('click', () => {
      item.classList.toggle('checked');
      if (item.classList.contains('checked')) {
        item.style.borderColor = 'var(--green)';
        item.style.color = 'var(--green)';
        item.style.background = 'rgba(57,255,20,0.06)';
        const text = item.textContent.replace('☐', '').replace('☑', '').trim();
        item.textContent = '☑ ' + text;
      } else {
        item.style.borderColor = '';
        item.style.color = '';
        item.style.background = '';
        const text = item.textContent.replace('☑', '').replace('☐', '').trim();
        item.textContent = '☐ ' + text;
      }
    });
    item.style.cursor = 'pointer';
    item.title = 'Click to check off';
  });

  // Animate day cards on home page hover
  document.querySelectorAll('.day-card').forEach(card => {
    card.addEventListener('mouseenter', () => {
      card.querySelector('.day-icon').style.transform = 'scale(1.2)';
      card.querySelector('.day-icon').style.transition = 'transform 0.2s';
    });
    card.addEventListener('mouseleave', () => {
      card.querySelector('.day-icon').style.transform = 'scale(1)';
    });
  });

  // Keyboard nav: press 1–5 to jump to days, T for tools, A for AI, S for success criteria, D for downloads
  document.addEventListener('keydown', (e) => {
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
    const map = {
      '1': 'monday', '2': 'tuesday', '3': 'wednesday',
      '4': 'thursday', '5': 'friday',
      't': 'tools', 'T': 'tools',
      'a': 'ai', 'A': 'ai',
      's': 'criteria', 'S': 'criteria',
      'd': 'downloads', 'D': 'downloads',
      'h': 'home', 'H': 'home',
      'Escape': 'home'
    };
    if (map[e.key]) showPage(map[e.key]);
  });

  // Pixel char random gentle drift on home page
  const chars = document.querySelectorAll('.pixel-char');
  chars.forEach(char => {
    const speed = 6 + Math.random() * 6;
    const offset = Math.random() * 3;
    char.style.animationDuration = speed + 's';
    char.style.animationDelay = offset + 's';
  });

  // Add entrance animation to rubric cards when criteria page becomes visible
  const observer = new MutationObserver((mutations) => {
    mutations.forEach(mutation => {
      if (mutation.target.id === 'page-criteria' && mutation.target.classList.contains('active')) {
        const cards = mutation.target.querySelectorAll('.rubric-card');
        cards.forEach((card, i) => {
          card.style.opacity = '0';
          card.style.transform = 'translateY(20px)';
          setTimeout(() => {
            card.style.transition = 'all 0.4s ease';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, i * 80);
        });
      }
    });
  });
  document.querySelectorAll('.page').forEach(p => {
    observer.observe(p, { attributes: true, attributeFilter: ['class'] });
  });
});

// ─── NAVBAR SCROLL EFFECT ────────────────────────────────
window.addEventListener('scroll', () => {
  const nav = document.getElementById('navbar');
  if (window.scrollY > 40) {
    nav.style.background = 'rgba(8,8,20,0.98)';
  } else {
    nav.style.background = 'rgba(10,10,26,0.95)';
  }
});

// ─── WEEK DROPDOWN ACTIVATION ────────────────────────────
document.querySelectorAll('.nav-dropdown > .nav-item').forEach(item => {
  item.addEventListener('click', () => {
    const dropdown = item.parentElement.querySelector('.dropdown');
    if (dropdown) {
      const isOpen = dropdown.style.display === 'block';
      dropdown.style.display = isOpen ? 'none' : 'block';
    }
  });
});
