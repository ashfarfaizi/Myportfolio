/* ==========================================================================
   Ashfar Faizi — Portfolio · UI interactions
   ========================================================================== */

(() => {
    'use strict';

    const EMAIL = 'ashfar657@gmail.com';
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

    document.body.classList.add('is-loading');

    /* ----------------------------------------------------------------------
       Loader
       ---------------------------------------------------------------------- */
    const loader = document.getElementById('loader');
    const loaderCount = document.getElementById('loader-count');
    const loaderBar = document.getElementById('loader-bar');
    let progress = 0;
    let pageLoaded = false;

    const tick = () => {
        const target = pageLoaded ? 100 : 86;
        progress += (target - progress) * (pageLoaded ? 0.18 : 0.04) + 0.3;
        progress = Math.min(progress, target);
        loaderCount.textContent = Math.floor(progress);
        loaderBar.style.width = progress + '%';
        if (progress >= 100) return finishLoading();
        requestAnimationFrame(tick);
    };

    const finishLoading = () => {
        loader.classList.add('done');
        document.body.classList.remove('is-loading');
        setTimeout(() => document.body.classList.add('is-ready'), 250);
        setTimeout(revealInView, 450);
    };

    window.addEventListener('load', () => { pageLoaded = true; });
    // Never block for more than 4s (slow CDN / fonts)
    setTimeout(() => { pageLoaded = true; }, 4000);
    requestAnimationFrame(tick);

    /* ----------------------------------------------------------------------
       Custom cursor
       ---------------------------------------------------------------------- */
    if (finePointer) {
        const cursor = document.querySelector('.cursor');
        const dot = cursor.querySelector('.cursor-dot');
        const ring = cursor.querySelector('.cursor-ring');
        let mx = innerWidth / 2, my = innerHeight / 2, rx = mx, ry = my;

        window.addEventListener('mousemove', (e) => {
            mx = e.clientX; my = e.clientY;
            dot.style.transform = `translate(${mx}px, ${my}px) translate(-50%, -50%)`;
        });
        document.addEventListener('mouseleave', () => cursor.classList.add('is-hidden'));
        document.addEventListener('mouseenter', () => cursor.classList.remove('is-hidden'));

        const loop = () => {
            rx += (mx - rx) * 0.16;
            ry += (my - ry) * 0.16;
            ring.style.transform = `translate(${rx}px, ${ry}px) translate(-50%, -50%)`;
            requestAnimationFrame(loop);
        };
        loop();

        document.querySelectorAll('a, button, .project, .portrait, input, textarea').forEach((el) => {
            el.addEventListener('mouseenter', () => cursor.classList.add('is-hover'));
            el.addEventListener('mouseleave', () => cursor.classList.remove('is-hover'));
        });
    }

    /* ----------------------------------------------------------------------
       Navigation: scroll state, active link, mobile menu
       ---------------------------------------------------------------------- */
    const nav = document.getElementById('nav');
    const navLinks = document.getElementById('nav-links');
    const navToggle = document.getElementById('nav-toggle');

    const onScroll = () => nav.classList.toggle('is-scrolled', scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    navToggle.addEventListener('click', () => {
        const open = navLinks.classList.toggle('is-open');
        navToggle.setAttribute('aria-expanded', String(open));
        navToggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    });
    navLinks.querySelectorAll('a').forEach((a) => a.addEventListener('click', () => {
        navLinks.classList.remove('is-open');
        navToggle.setAttribute('aria-expanded', 'false');
    }));

    const sections = [...document.querySelectorAll('main section[id]')];
    const linkFor = (id) => navLinks.querySelector(`a[href="#${id}"]`);
    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            const link = linkFor(entry.target.id);
            if (link && entry.isIntersecting) {
                navLinks.querySelectorAll('a').forEach((a) => a.classList.remove('is-active'));
                link.classList.add('is-active');
            }
        });
    }, { rootMargin: '-45% 0px -50% 0px' });
    sections.forEach((s) => sectionObserver.observe(s));

    /* ----------------------------------------------------------------------
       Reveal on scroll + counters
       ---------------------------------------------------------------------- */
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            entry.target.classList.add('is-visible');
            entry.target.querySelectorAll('[data-count]').forEach(runCounter);
            revealObserver.unobserve(entry.target);
        });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    function revealInView() {
        document.querySelectorAll('.reveal').forEach((el) => {
            // small stagger for siblings in the same parent
            const idx = [...el.parentElement.children].filter((c) => c.classList.contains('reveal')).indexOf(el);
            el.style.transitionDelay = `${Math.min(idx, 5) * 0.08}s`;
            revealObserver.observe(el);
        });
    }

    function runCounter(el) {
        const end = parseInt(el.dataset.count, 10);
        const suffix = el.dataset.suffix || '';
        if (reduceMotion) { el.textContent = end + suffix; return; }
        const start = performance.now();
        const dur = 1400;
        const step = (now) => {
            const t = Math.min((now - start) / dur, 1);
            const eased = 1 - Math.pow(1 - t, 3);
            el.textContent = Math.round(end * eased) + (t === 1 ? suffix : '');
            if (t < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
    }

    /* ----------------------------------------------------------------------
       3D tilt (project cards + portrait)
       ---------------------------------------------------------------------- */
    if (finePointer && !reduceMotion) {
        document.querySelectorAll('.tilt').forEach((el) => {
            const max = parseFloat(el.dataset.tilt) || 8;
            el.addEventListener('mousemove', (e) => {
                const r = el.getBoundingClientRect();
                const px = (e.clientX - r.left) / r.width;
                const py = (e.clientY - r.top) / r.height;
                el.style.transition = 'transform 0.12s linear, border-color 0.4s';
                el.style.transform = `perspective(1100px) rotateX(${(0.5 - py) * max}deg) rotateY(${(px - 0.5) * max}deg) translateZ(0)`;
                el.style.setProperty('--gx', `${px * 100}%`);
                el.style.setProperty('--gy', `${py * 100}%`);
            });
            el.addEventListener('mouseleave', () => {
                el.style.transition = '';
                el.style.transform = '';
            });
        });
    }

    /* ----------------------------------------------------------------------
       Magnetic buttons
       ---------------------------------------------------------------------- */
    if (finePointer && !reduceMotion) {
        document.querySelectorAll('.magnetic').forEach((el) => {
            el.addEventListener('mousemove', (e) => {
                const r = el.getBoundingClientRect();
                const x = e.clientX - (r.left + r.width / 2);
                const y = e.clientY - (r.top + r.height / 2);
                el.style.transform = `translate(${x * 0.22}px, ${y * 0.3}px)`;
            });
            el.addEventListener('mouseleave', () => { el.style.transform = ''; });
        });
    }

    /* ----------------------------------------------------------------------
       3D skills sphere
       ---------------------------------------------------------------------- */
    const sphere = document.getElementById('sphere');
    if (sphere) {
        const skills = [
            ['LLMs', 1], ['Next.js', 0], ['Node.js', 0], ['Java', 0], ['Redux', 0], ['React', 1],
            ['Tailwind', 0], ['Three.js', 0], ['GSAP', 0], ['Django', 0], ['Python', 1], ['GraphQL', 0],
            ['PostgreSQL', 0], ['MongoDB', 0], ['MySQL', 0], ['Google Cloud', 1], ['Docker', 0], ['CI/CD', 0],
            ['Cloud Run', 0], ['Firestore', 0], ['RLHF', 1], ['Vercel', 0], ['OpenAI SDK', 0], ['Embeddings', 0],
            ['Vector Search', 0], ['TypeScript', 1], ['Prompt Eng.', 0], ['Figma', 0], ['UI/UX', 0], ['Git', 0],
            ['Vertex AI', 1], ['Testing', 0], ['IAM', 0], ['VPC', 0], ['JavaScript', 0], ['HTML/CSS', 0],
        ];

        const n = skills.length;
        const golden = Math.PI * (3 - Math.sqrt(5));
        const points = skills.map(([label, hl], i) => {
            const y = 1 - (i / (n - 1)) * 2;
            const radius = Math.sqrt(1 - y * y);
            const theta = golden * i;
            const span = document.createElement('span');
            span.textContent = label;
            if (hl) span.className = 'hl';
            sphere.appendChild(span);
            return { x: Math.cos(theta) * radius, y, z: Math.sin(theta) * radius, el: span };
        });

        let ax = 0.0018, ay = 0.0032;          // current angular velocity
        let tx = ax, ty = ay;                   // target velocity
        let visible = false;

        new IntersectionObserver(([e]) => { visible = e.isIntersecting; }, { threshold: 0 }).observe(sphere);

        sphere.parentElement.addEventListener('mousemove', (e) => {
            const r = sphere.getBoundingClientRect();
            const dx = (e.clientX - (r.left + r.width / 2)) / r.width;
            const dy = (e.clientY - (r.top + r.height / 2)) / r.height;
            ty = dx * 0.03;
            tx = -dy * 0.03;
        });
        sphere.parentElement.addEventListener('mouseleave', () => { tx = 0.0018; ty = 0.0032; });

        const rotate = () => {
            if (visible) {
                ax += (tx - ax) * 0.05;
                ay += (ty - ay) * 0.05;
                const speed = reduceMotion ? 0.15 : 1;
                const cx = Math.cos(ax * speed), sx = Math.sin(ax * speed);
                const cy = Math.cos(ay * speed), sy = Math.sin(ay * speed);
                const R = sphere.clientWidth * 0.42;

                for (const p of points) {
                    // rotate around X
                    let y1 = p.y * cx - p.z * sx;
                    let z1 = p.y * sx + p.z * cx;
                    // rotate around Y
                    let x2 = p.x * cy + z1 * sy;
                    let z2 = -p.x * sy + z1 * cy;
                    p.x = x2; p.y = y1; p.z = z2;

                    const depth = (z2 + 1) / 2;                 // 0 (back) → 1 (front)
                    const scale = 0.6 + depth * 0.6;
                    p.el.style.transform = `translate(-50%, -50%) translate3d(${x2 * R}px, ${y1 * R}px, 0) scale(${scale})`;
                    p.el.style.opacity = (0.15 + depth * 0.85).toFixed(3);
                    p.el.style.zIndex = Math.round(depth * 100);
                    p.el.style.filter = depth < 0.35 ? `blur(${(0.35 - depth) * 4}px)` : 'none';
                }
            }
            requestAnimationFrame(rotate);
        };
        rotate();
    }

    /* ----------------------------------------------------------------------
       Gmail links — Gmail web compose on desktop, native mail app on mobile
       ---------------------------------------------------------------------- */
    if (isMobile) {
        document.querySelectorAll('.gmail-link').forEach((a) => {
            a.href = `mailto:${EMAIL}?subject=${encodeURIComponent('Hello Ashfar')}`;
            a.removeAttribute('target');
        });
    }

    const gmailCompose = (subject, body) =>
        `https://mail.google.com/mail/?view=cm&fs=1&to=${EMAIL}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

    /* ----------------------------------------------------------------------
       Contact form → delivered to Gmail (ashfar657@gmail.com) via FormSubmit
       Falls back to opening a pre-filled Gmail draft if delivery fails.
       ---------------------------------------------------------------------- */
    const form = document.getElementById('contact-form');
    const note = document.getElementById('form-note');
    const submitBtn = document.getElementById('f-submit');
    const submitLabel = submitBtn.querySelector('.btn-label');

    const setNote = (html, type = '') => { note.innerHTML = html; note.className = `form-note ${type}`; };

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        let valid = true;
        form.querySelectorAll('input, textarea').forEach((f) => {
            const ok = f.value.trim() !== '' && (f.type !== 'email' || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.value.trim()));
            f.parentElement.classList.toggle('is-invalid', !ok);
            if (!ok) valid = false;
        });
        if (!valid) { setNote('Please fill in every field with a valid email.', 'err'); return; }

        const data = {
            name: document.getElementById('f-name').value.trim(),
            email: document.getElementById('f-email').value.trim(),
            subject: document.getElementById('f-subject').value.trim(),
            message: document.getElementById('f-message').value.trim(),
        };
        const fallbackBody = `${data.message}\n\n— ${data.name} (${data.email})`;

        submitBtn.disabled = true;
        submitLabel.textContent = 'Sending…';
        setNote('');

        try {
            const res = await fetch(`https://formsubmit.co/ajax/${EMAIL}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
                body: JSON.stringify({
                    ...data,
                    _subject: `Portfolio: ${data.subject}`,
                    _replyto: data.email,
                    _template: 'table',
                    _captcha: 'false',
                }),
            });
            const json = await res.json().catch(() => ({}));
            if (!res.ok || String(json.success) !== 'true') throw new Error(json.message || 'Delivery failed');

            form.reset();
            submitLabel.textContent = 'Message sent ✓';
            setNote('Thank you — your message is on its way. I\'ll reply soon.', 'ok');
        } catch (err) {
            submitLabel.textContent = 'Send message';
            const link = gmailCompose(data.subject, fallbackBody);
            setNote(`Couldn't send directly. <a href="${link}" target="_blank" rel="noopener">Open it in Gmail instead ↗</a>`, 'err');
        } finally {
            submitBtn.disabled = false;
            setTimeout(() => { submitLabel.textContent = 'Send message'; }, 4000);
        }
    });

    form.querySelectorAll('input, textarea').forEach((f) =>
        f.addEventListener('input', () => f.parentElement.classList.remove('is-invalid')));

    /* ---------------------------------------------------------------------- */
    document.getElementById('year').textContent = new Date().getFullYear();
})();
