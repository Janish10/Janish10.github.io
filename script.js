// -- Navbar scroll state --
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 40);
}, { passive: true });

// -- Mobile menu --
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobile-menu');
hamburger.addEventListener('click', () => {
  mobileMenu.classList.toggle('open');
});
mobileMenu.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => mobileMenu.classList.remove('open'));
});

// -- Scroll reveal --
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      const siblings = Array.from(entry.target.parentElement.querySelectorAll('.reveal'));
      const idx = siblings.indexOf(entry.target);
      const delay = Math.min(idx * 60, 300);
      setTimeout(() => entry.target.classList.add('in-view'), delay);
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

// -- Active nav link highlighting --
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a');

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navLinks.forEach(link => {
        link.style.color = link.getAttribute('href') === `#${entry.target.id}`
          ? 'var(--text)'
          : '';
      });
    }
  });
}, { threshold: 0.4 });
sections.forEach(s => sectionObserver.observe(s));

// -- Contact form -> Web3Forms --
const form = document.getElementById('contact-form');
if (form) {
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = form.querySelector('button[type="submit"]');
    btn.textContent = 'Sending…';
    btn.disabled = true;

    const data = new FormData(form);
    const json = JSON.stringify(Object.fromEntries(data));

    try {
      const res = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: json,
      });
      const result = await res.json();
      if (result.success) {
        form.innerHTML = `
          <div style="text-align:center;padding:40px 20px">
            <div style="font-size:2rem;margin-bottom:12px;color:var(--accent)">&#10003;</div>
            <p style="color:var(--accent);font-weight:700;font-size:1.1rem;margin-bottom:8px">Message sent!</p>
            <p style="color:var(--text-muted);font-size:0.9rem">Thanks for reaching out — I'll get back to you soon.</p>
          </div>`;
      } else {
        throw new Error();
      }
    } catch {
      btn.textContent = 'Send Message';
      btn.disabled = false;
      alert('Something went wrong. Please email me directly at janishandrin75@gmail.com');
    }
  });
}

// -- Terminal cursor blink on hero tagline --
const typed = document.querySelector('.typed-text');
if (typed) {
  const cursor = document.createElement('span');
  cursor.textContent = '_';
  cursor.style.cssText = 'color: var(--accent); animation: cursor-blink 1.1s step-end infinite; margin-left: 2px;';
  typed.after(cursor);
}

if (!document.getElementById('cursor-style')) {
  const style = document.createElement('style');
  style.id = 'cursor-style';
  style.textContent = '@keyframes cursor-blink { 0%,100%{opacity:1} 50%{opacity:0} }';
  document.head.appendChild(style);
}

// -- Blog posts from posts.json --
const blogGrid = document.getElementById('blog-grid');
if (blogGrid) {
  fetch('blog/posts.json')
    .then(res => {
      if (!res.ok) throw new Error('No posts');
      return res.json();
    })
    .then(posts => {
      if (!posts.length) return;
      blogGrid.innerHTML = '';
      const tagClassMap = {
        writeup: 'blog-card-tag--writeup',
        blog: 'blog-card-tag--blog',
        research: 'blog-card-tag--research',
      };
      posts.slice(0, 6).forEach(post => {
        const tagClass = tagClassMap[post.tag] || 'blog-card-tag--blog';
        const card = document.createElement('a');
        card.href = post.url;
        card.className = 'blog-card reveal in-view';
        card.innerHTML = `
          <span class="blog-card-tag ${tagClass}">${post.tag}</span>
          <h3 class="blog-card-title">${post.title}</h3>
          <p class="blog-card-excerpt">${post.excerpt}</p>
          <div style="display:flex;align-items:center;justify-content:space-between;margin-top:auto">
            <span class="blog-card-date">${post.date}</span>
            <span class="blog-card-link">Read &rarr;</span>
          </div>`;
        blogGrid.appendChild(card);
      });
    })
    .catch(() => {});
}
