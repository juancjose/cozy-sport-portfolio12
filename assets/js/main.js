/* Cozy Sport · v12 interactiva — escenas con scroll, carrusel, selector de deporte (vanilla, sin dependencias) */

/* ================================================================
   VENDEDORES · WhatsApp del formulario de contacto
   ⚠️ ACÁ VAN LOS NÚMEROS REALES. Los de abajo son placeholders falsos.
   Formato wa.me: 549 + código de área sin el 0 + número sin el 15.
   Ej.: 011 15 1234-5678  →  '5491112345678'
   ================================================================ */
const VENDEDORES = [
  { nombre: 'Yesi',   tel: '5491100000001' },
  { nombre: 'Moni',   tel: '5491100000002' },
  { nombre: 'Cami',   tel: '5491100000003' },
  { nombre: 'Cintia', tel: '5491100000004' },
  { nombre: 'Maca',   tel: '5491100000005' },
];
const VENDEDORES_ROL = 'Asesora de ventas';
(() => {
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fine = matchMedia('(hover: hover) and (pointer: fine)').matches;
  const root = document.documentElement;
  // Cada bloque corre aislado: si uno falla (p. ej. falta un elemento), los demás siguen funcionando.
  const safe = (name, fn) => { try { fn(); } catch (err) { console.warn('[cozy] ' + name + ':', err); } };
  const last = a => a[a.length - 1];

  const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
  const ease = t => 1 - Math.pow(1 - t, 3);
  const desk = matchMedia('(min-width:1000px)');
  const motion = !reduce;
  if (fine && motion) root.classList.add('has-cursor');

  /* ---------- Preloader ---------- */
  safe('preloader', () => {
    const pre = $('.preloader'); if (!pre) return root.classList.add('ready');
    const hide = () => { pre.classList.add('done'); root.classList.add('ready'); };
    if (reduce) return hide();
    addEventListener('load', () => setTimeout(hide, 200)); setTimeout(hide, 1600);
  });

  /* ---------- Aparición al entrar en pantalla ---------- */
  safe('reveal', () => {
    const els = $$('.rv'), show = el => el.classList.add('in');
    if (!('IntersectionObserver' in window)) return els.forEach(show);
    const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { show(e.target); io.unobserve(e.target); } }), { rootMargin: '0px 0px -6% 0px' });
    els.forEach(el => io.observe(el));
    addEventListener('scroll', () => els.forEach(el => !el.classList.contains('in') && el.getBoundingClientRect().bottom < 0 && show(el)), { passive: true });
  });

  /* ---------- Menú móvil ---------- */
  const hdr = $('.hdr'), burger = $('.burger');
  const closeMenu = () => { document.body.classList.remove('menu-open'); document.body.style.overflow = ''; if (burger) { burger.setAttribute('aria-expanded', 'false'); burger.setAttribute('aria-label', 'Abrir menú'); } };
  safe('menu', () => {
    if (!burger) return;
    burger.addEventListener('click', () => {
      const open = document.body.classList.toggle('menu-open');
      burger.setAttribute('aria-expanded', String(open));
      burger.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
      document.body.style.overflow = open ? 'hidden' : '';
    });
    $$('.mnav a').forEach(a => a.addEventListener('click', closeMenu));
    addEventListener('keydown', e => { if (e.key === 'Escape' && document.body.classList.contains('menu-open')) closeMenu(); });
  });

  /* ---------- Sección activa: links del menú + puntos laterales ---------- */
  safe('activo', () => {
    const links = [...$$('.nav a'), ...$$('.dots a')];
    const ids = [...new Set(links.map(a => a.getAttribute('href')))].filter(h => h && h.length > 1);
    const io = new IntersectionObserver(es => es.forEach(e => {
      if (!e.isIntersecting) return;
      links.forEach(a => { const on = a.getAttribute('href') === '#' + e.target.id; a.classList.toggle(a.closest('.dots') ? 'on' : 'active', on); });
    }), { rootMargin: '-48% 0px -50% 0px' });
    ids.forEach(h => { const s = $(h); s && io.observe(s); });
  });

  /* ---------- Manifiesto: separar en palabras ---------- */
  const mani = $('#manifesto');
  let maniWords = [];
  safe('manifiesto', () => {
    if (!mani || reduce) return;
    const walk = node => [...node.childNodes].forEach(n => {
      if (n.nodeType === 3) {
        const frag = document.createDocumentFragment();
        n.textContent.split(/(\s+)/).forEach(t => {
          if (!t) return;
          if (/^\s+$/.test(t)) frag.appendChild(document.createTextNode(t));
          else { const s = document.createElement('span'); s.className = 'w'; s.textContent = t; frag.appendChild(s); }
        });
        n.replaceWith(frag);
      } else if (n.nodeType === 1) walk(n);
    });
    walk(mani);
    maniWords = $$('.w', mani);
  });

  /* ---------- Deportes: carrusel con flechas, arrastre y deslizar ---------- */
  const sView = $('#sportsView'), sTrack = $('#sportsTrack'), smNum = $('#smNum'), smBar = $('#smBar');
  const spPrev = $('#spPrev'), spNext = $('#spNext');
  let smIdx = -1;
  const setMeter = () => {
    if (!sView || !sTrack) return;
    const m = sView.scrollWidth - sView.clientWidth, p = m > 0 ? clamp(sView.scrollLeft / m) : 0;
    const n = sTrack.children.length;
    const i = Math.min(n - 1, Math.round(p * (n - 1)));
    if (smBar) smBar.style.transform = `scaleX(${(1 / n + (1 - 1 / n) * p).toFixed(4)})`;
    if (i !== smIdx && smNum) { smIdx = i; smNum.textContent = String(i + 1).padStart(2, '0'); }
    if (spPrev) spPrev.disabled = sView.scrollLeft < 4;
    if (spNext) spNext.disabled = sView.scrollLeft > m - 4;
  };
  safe('carrusel', () => {
    if (!sView || !sTrack) return;
    sView.addEventListener('scroll', setMeter, { passive: true });
    addEventListener('resize', setMeter);
    const step = dir => {
      const card = sTrack.children[0];
      const w = card ? card.getBoundingClientRect().width + 14 : sView.clientWidth * .8;
      sView.scrollBy({ left: dir * w, behavior: reduce ? 'auto' : 'smooth' });
    };
    spPrev && spPrev.addEventListener('click', () => step(-1));
    spNext && spNext.addEventListener('click', () => step(1));
    // PC: arrastrar con el mouse
    let down = false, sx = 0, sl = 0, moved = false;
    sView.addEventListener('pointerdown', e => { if (e.pointerType !== 'mouse' || e.button !== 0) return; down = true; moved = false; sx = e.clientX; sl = sView.scrollLeft; });
    addEventListener('pointermove', e => {
      if (!down) return; const dx = e.clientX - sx;
      if (!moved && Math.abs(dx) > 5) { moved = true; sView.classList.add('drag'); }
      if (moved) sView.scrollLeft = sl - dx;
    });
    addEventListener('pointerup', () => {
      if (!down) return; down = false;
      if (moved) {
        sView.classList.remove('drag');
        const card = sTrack.children[0], w = card ? card.getBoundingClientRect().width + 14 : 1;
        sView.scrollTo({ left: Math.round(sView.scrollLeft / w) * w, behavior: reduce ? 'auto' : 'smooth' });
      }
    });
    sView.addEventListener('click', e => { if (moved) { e.preventDefault(); e.stopPropagation(); moved = false; } }, true);
    sView.addEventListener('dragstart', e => e.preventDefault());
    setMeter();
  });

  const sprog = $('#sprog'), shopBg = $('#shopBg'), shop = $('#tienda');

  const frame = () => {
    const y = scrollY, vh = innerHeight;
    if (hdr) hdr.classList.toggle('scrolled', y > 30);
    if (sprog) { const m = document.documentElement.scrollHeight - vh; sprog.style.transform = `scaleX(${m > 0 ? (y / m).toFixed(4) : 0})`; }

    // Manifiesto: las palabras se encienden mientras el texto cruza la pantalla (no agrega scroll)
    if (maniWords.length) {
      const r = mani.getBoundingClientRect();
      const p = clamp((vh * .9 - r.top) / (r.height + vh * .3));
      const n = Math.round(p * maniWords.length);
      maniWords.forEach((w, i) => w.classList.toggle('on', i < n));
    }

    // Tienda: la foto se mueve apenas detrás del texto
    if (shopBg && shop && motion) {
      const r = shop.getBoundingClientRect();
      if (r.top < vh && r.bottom > 0) {
        const p = clamp((vh - r.top) / (vh + r.height));
        shopBg.style.transform = `scale(${(1.12 - .12 * p).toFixed(4)}) translate3d(0,${((p - .5) * -24).toFixed(1)}px,0)`;
      }
    }
  };
  let ticking = false;
  const tick = () => { ticking = false; try { frame(); } catch (err) { console.warn('[cozy] frame:', err); } };
  addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(tick); } }, { passive: true });
  addEventListener('resize', tick);
  addEventListener('load', () => { tick(); setMeter(); });
  tick();

  /* ---------- Marquesina: sigue la velocidad y dirección del scroll ---------- */
  safe('marquesina', () => {
    const mq = $('#mq'); if (!mq || reduce) return;
    let x = 0, v = 0, dir = 1, lastY = scrollY, on = false, raf = 0;
    const loop = () => {
      const dy = scrollY - lastY; lastY = scrollY;
      if (dy) dir = dy > 0 ? 1 : -1;
      v += (Math.min(18, Math.abs(dy)) - v) * .08;
      const half = mq.scrollWidth / 2;
      x -= (.45 + v * .35) * dir;
      if (x <= -half) x += half; if (x > 0) x -= half;
      mq.style.transform = `translate3d(${x.toFixed(1)}px,0,0)`;
      raf = on ? requestAnimationFrame(loop) : 0;
    };
    new IntersectionObserver(([e]) => { on = e.isIntersecting; if (on && !raf) { lastY = scrollY; raf = requestAnimationFrame(loop); } }).observe(mq.parentElement);
  });

  /* ---------- Contadores ---------- */
  safe('contadores', () => {
    const els = $$('[data-count]');
    const yrs = new Date().getFullYear() - 1983;
    els.forEach(el => { if (el.dataset.count === 'years') el.dataset.count = String(yrs); el.textContent = el.dataset.count; });
    if (reduce || !('IntersectionObserver' in window)) return;
    const run = el => {
      const to = +el.dataset.count, from = +(el.dataset.from || 0), t0 = performance.now(), D = 1600;
      const step = now => { const k = ease(clamp((now - t0) / D)); el.textContent = Math.round(from + (to - from) * k); if (k < 1) requestAnimationFrame(step); };
      requestAnimationFrame(step);
    };
    const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { io.unobserve(e.target); run(e.target); } }), { threshold: .6 });
    els.forEach(el => { if (el.getBoundingClientRect().top > innerHeight) { el.textContent = el.dataset.from || '0'; io.observe(el); } });
  });

  /* ---------- Tu kit: elegí tu deporte ---------- */
  const KITS = [
    { key: 'ciclismo', nombre: 'Ciclismo', linea: 'Kits a medida para tu grupo de ruta, tu equipo de MTB o tu evento.', items: ['Maillots', 'Culottes', 'Chalecos', 'Kits de grupo', 'MTB'], tienda: 'https://www.tiendacozy.com/deportes/ciclismo-y-triatlon/', form: 'Ciclismo' },
    { key: 'running', nombre: 'Running', linea: 'Remeras técnicas y kits para equipos, grupos de entrenamiento y carreras.', items: ['Remeras', 'Musculosas', 'Shorts', 'Calzas', 'Tops'], tienda: 'https://www.tiendacozy.com/deportes/running/', form: 'Running' },
    { key: 'triatlon', nombre: 'Triatlón', linea: 'Trajes y prendas para nadar, pedalear y correr.', items: ['Trisuit', 'Tritop', 'Trishort'], tienda: 'https://www.tiendacozy.com/deportes/triatlon/', form: 'Triatlón' },
    { key: 'aguas', nombre: 'Aguas abiertas', linea: 'Prendas para entrenar y competir en el agua.', items: ['Diseño a medida', 'Para tu equipo o evento'], tienda: 'https://tiendacozy.com/', form: 'Aguas abiertas' },
    { key: 'futbol', nombre: 'Fútbol', linea: 'Camisetas, shorts y conjuntos para tu club o tu equipo de amigos.', items: ['Camisetas', 'Shorts', 'Conjuntos'], tienda: 'https://www.tiendacozy.com/deportes/futbol/', form: 'Fútbol' },
    { key: 'footgolf', nombre: 'Footgolf', linea: 'Vestimos a campeones argentinos y mundiales.', items: ['Diseño a medida', 'Para tu equipo o evento'], tienda: 'https://tiendacozy.com/', form: 'Footgolf' },
  ];
  let pickSport = () => {};
  safe('kit', () => {
    const tabs = $('#kitTabs'), info = $('#kitPanel'), imgs = $$('#kitStage img');
    if (!tabs || !info) return;
    const name = $('#kitName'), line = $('#kitLine'), items = $('#kitItems'), idx = $('#kitIdx'), shopA = $('#kitShop'), shopT = $('#kitShopTxt'), quote = $('#kitQuote'), sel = $('#f-sport');
    let cur = -1, tSwap = 0;
    const btns = KITS.map((k, i) => {
      const b = document.createElement('button');
      b.type = 'button'; b.className = 'kit-tab'; b.textContent = k.nombre; b.id = 'tab-' + k.key;
      b.setAttribute('role', 'tab'); b.setAttribute('aria-controls', 'kitPanel');
      b.addEventListener('click', () => set(i));
      tabs.appendChild(b); return b;
    });
    const fill = k => {
      name.textContent = k.nombre; line.textContent = k.linea;
      items.innerHTML = k.items.map(t => '<li>' + t + '</li>').join('');
      shopA.href = k.tienda;
      shopT.textContent = k.tienda.includes('/deportes/') ? 'Ver ' + k.nombre.toLowerCase() + ' en la tienda' : 'Ir a la tienda online';
    };
    const set = (i, focus) => {
      if (i === cur) return;
      const k = KITS[i]; cur = i;
      btns.forEach((b, j) => { b.setAttribute('aria-selected', String(j === i)); b.tabIndex = j === i ? 0 : -1; });
      info.setAttribute('aria-labelledby', btns[i].id);
      imgs.forEach((im, j) => im.classList.toggle('on', j === i));
      if (idx) idx.textContent = String(i + 1).padStart(2, '0');
      if (focus) btns[i].focus();
      // que la pestaña elegida quede a la vista en celu (sin mover la página)
      const b = btns[i], tl = tabs.scrollLeft, bl = b.offsetLeft - tabs.offsetLeft;
      if (bl < tl || bl + b.offsetWidth > tl + tabs.clientWidth) tabs.scrollTo({ left: bl - 20, behavior: reduce ? 'auto' : 'smooth' });
      if (reduce || !info.dataset.ready) { fill(k); info.dataset.ready = '1'; return; }
      clearTimeout(tSwap); info.classList.add('swap');
      tSwap = setTimeout(() => { fill(k); requestAnimationFrame(() => info.classList.remove('swap')); }, 260);
    };
    tabs.addEventListener('keydown', e => {
      const go = { ArrowRight: cur + 1, ArrowLeft: cur - 1, Home: 0, End: KITS.length - 1 }[e.key];
      if (go !== undefined) { e.preventDefault(); set((go + KITS.length) % KITS.length, true); }
    });
    if (quote && sel) quote.addEventListener('click', () => { const k = KITS[cur]; if (k) sel.value = k.form; });
    set(0);
    pickSport = key => { const i = KITS.findIndex(k => k.key === key); if (i >= 0) set(i); };
  });
  // Tocar una disciplina del carrusel la elige en "Tu kit" y baja hasta ahí
  safe('carrusel-elegir', () => $$('.sp').forEach(li => $('.sp-in', li).addEventListener('click', () => {
    pickSport(li.dataset.sport);
    const k = $('#kit'); if (k) k.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
  })));

  /* ---------- Botones magnéticos (solo mouse) ---------- */
  if (fine && motion) safe('magneticos', () => {
    $$('[data-magnetic]').forEach(el => {
      const k = parseFloat(el.dataset.magnetic) || .22;
      el.addEventListener('pointermove', e => {
        const r = el.getBoundingClientRect();
        const x = e.clientX - (r.left + r.width / 2), y = e.clientY - (r.top + r.height / 2);
        el.style.transform = `translate3d(${(x * k).toFixed(1)}px,${(y * k).toFixed(1)}px,0)`;
      });
      el.addEventListener('pointerleave', () => { el.style.transform = ''; });
    });
  });

  /* ---------- Cursor que acompaña (solo mouse) ---------- */
  if (fine && motion) safe('cursor', () => {
    const c = $('.cursor'), lab = $('.cursor-label'); if (!c) return;
    let x = innerWidth / 2, y = innerHeight / 2, cx = x, cy = y, raf = 0;
    const loop = () => {
      cx += (x - cx) * .2; cy += (y - cy) * .2;
      c.style.transform = `translate3d(${cx.toFixed(1)}px,${cy.toFixed(1)}px,0)`;
      raf = Math.abs(x - cx) + Math.abs(y - cy) > .3 ? requestAnimationFrame(loop) : 0;
    };
    addEventListener('pointermove', e => {
      if (e.pointerType !== 'mouse') return;
      x = e.clientX; y = e.clientY; c.classList.add('on');
      if (!raf) raf = requestAnimationFrame(loop);
    }, { passive: true });
    document.addEventListener('pointerleave', () => c.classList.remove('on'));
    document.addEventListener('pointerover', e => {
      const t = e.target.closest('[data-cursor]');
      const h = !t && e.target.closest('a,button,summary,label,input,select,textarea');
      c.classList.toggle('lab', !!t); c.classList.toggle('hov', !!h);
      if (t && lab) lab.textContent = t.dataset.cursor;
    });
    addEventListener('pointerdown', () => c.classList.add('down'));
    addEventListener('pointerup', () => c.classList.remove('down'));
  });

  /* ---------- Formulario → WhatsApp: "Hablá con nuestras vendedoras" + medialuna de burbujas ---------- */
  // El cliente elige con quién hablar. Nombres y números salen solo de VENDEDORES (arriba de todo).
  safe('form', () => {
  const form = $('#contactForm'), talk = $('#talk'), btn = $('#talkBtn'), arc = $('#talkArc');
  if (!form || !talk || !btn || !arc) return;
  const note = $('#formNote') || { style: {} };
  const team = VENDEDORES, N = team.length;
  const store = { get: k => { try { return localStorage.getItem(k); } catch (_) { return null; } },
                  set: (k, v) => { try { localStorage.setItem(k, v); } catch (_) {} } };
  let last = parseInt(store.get('cozy-vendedor'), 10);
  if (!(last >= 0 && last < N)) last = -1;

  const cap = document.createElement('p');
  cap.className = 'talk-cap'; cap.setAttribute('aria-hidden', 'true');
  cap.innerHTML = 'Elegí con quién hablar<small>' + VENDEDORES_ROL.replace(/^(\S+)/, '$1s') + '</small>';
  arc.appendChild(cap);
  arc.setAttribute('aria-label', 'Elegí con quién hablar por WhatsApp');
  // Ángulos repartidos en media luna, de izquierda a derecha (5 → 162°, 126°, 90°, 54°, 18°)
  const bubs = team.map((v, i) => {
    const b = document.createElement('button');
    b.type = 'button'; b.className = 'bub'; b.tabIndex = -1;
    b.style.setProperty('--a', (180 - (180 / N) * (i + .5)) + 'deg');
    b.style.setProperty('--d', (i * 45) + 'ms');
    b.setAttribute('aria-label', 'Escribirle a ' + v.nombre + ' por WhatsApp');
    b.innerHTML = '<svg aria-hidden="true"><use href="#i-user"/></svg><span class="bub-name" aria-hidden="true">' + v.nombre + '</span>';
    b.addEventListener('click', () => send(i));
    arc.appendChild(b);
    return b;
  });
  const mark = () => bubs.forEach((b, i) => { b.classList.toggle('last', i === last); });
  mark();

  let isOpen = false, tClose = 0, hold = false;
  const toBtn = () => { hold = true; btn.focus(); hold = false; };
  const setOpen = v => {
    clearTimeout(tClose);
    if (v === isOpen) return;
    isOpen = v; talk.classList.toggle('open', v); btn.setAttribute('aria-expanded', String(v));
    if (!v && arc.contains(document.activeElement)) toBtn();
  };
  const start = () => (last >= 0 ? last : Math.floor(N / 2));
  const focusBub = i => { const k = (i + N) % N; bubs.forEach((b, j) => { b.tabIndex = j === k ? 0 : -1; }); bubs[k].focus(); };
  bubs[start()].tabIndex = 0;

  // Mouse: se abre al pasar por encima; un puente invisible y una demora corta lo mantienen abierto hasta las burbujas
  if (fine) {
    talk.addEventListener('mouseenter', () => setOpen(true));
    talk.addEventListener('mouseleave', () => {
      clearTimeout(tClose);
      tClose = setTimeout(() => { const a = document.activeElement; if (!(arc.contains(a) && a.matches(':focus-visible'))) setOpen(false); }, 280);
    });
  }
  // Teclado: al enfocar el botón se abre; flechas para recorrer la medialuna
  btn.addEventListener('focus', () => { if (!hold && btn.matches(':focus-visible')) setOpen(true); });
  btn.addEventListener('click', e => {
    if (e.detail === 0) { setOpen(true); focusBub(start()); }   // Enter / Espacio
    else if (fine) setOpen(true);
    else setOpen(!isOpen);                                        // táctil: toca para abrir y cerrar
  });
  btn.addEventListener('keydown', e => {
    if (e.key === 'ArrowUp' || e.key === 'ArrowDown') { e.preventDefault(); setOpen(true); focusBub(start()); }
  });
  arc.addEventListener('keydown', e => {
    const i = bubs.indexOf(document.activeElement); if (i < 0) return;
    const go = { ArrowRight: i + 1, ArrowDown: i + 1, ArrowLeft: i - 1, ArrowUp: i - 1, Home: 0, End: N - 1 }[e.key];
    if (go !== undefined) { e.preventDefault(); focusBub(go); }
  });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && isOpen) { const inside = talk.contains(document.activeElement); setOpen(false); if (inside) toBtn(); }
  });
  document.addEventListener('pointerdown', e => { if (isOpen && !talk.contains(e.target)) setOpen(false); });
  talk.addEventListener('focusout', () => setTimeout(() => {
    if (isOpen && !talk.contains(document.activeElement) && !(fine && talk.matches(':hover'))) setOpen(false);
  }, 0));

  const check = () => {
    const bad = [...form.querySelectorAll('[required]')].find(el => !String(el.value || '').trim())
      || [...form.elements].find(el => el.willValidate && !el.checkValidity());
    if (!bad) return true;
    setOpen(false);
    note.textContent = String(bad.value || '').trim()
      ? 'Revisá que el email esté bien escrito para poder enviarte una respuesta.'
      : 'Completá nombre, email y tu idea para poder enviarte una respuesta.';
    note.style.color = '#ff8f80';
    bad.focus();
    return false;
  };

  const send = i => {
    if (!check()) return;
    const fd = new FormData(form);
    const v = (k) => String(fd.get(k) || '').trim() || '—';
    const text = [
      'Hola! Te escribo desde la web de Cozy Sport.',
      '',
      '*Nombre:* ' + v('nombre'),
      '*Email:* ' + v('email'),
      '*Teléfono:* ' + v('telefono'),
      '*Equipo/Club:* ' + v('equipo'),
      '*Disciplina:* ' + v('disciplina'),
      '*Cantidad:* ' + v('cantidad'),
      '',
      '*Idea:*',
      v('mensaje'),
    ].join('\n');
    const seller = team[i];
    last = i; store.set('cozy-vendedor', String(i)); mark();
    setOpen(false);
    const url = 'https://wa.me/' + seller.tel + '?text=' + encodeURIComponent(text);
    const w = window.open(url, '_blank');
    if (w) { try { w.opener = null; } catch (_) {} } else location.href = url;
    note.style.color = ''; note.textContent = '¡Listo! Se abrió WhatsApp para escribirle a ' + seller.nombre + '. Si no se abrió, revisá que tu navegador permita ventanas emergentes.';
  };

  // Enter dentro del formulario: valida y abre la medialuna para elegir
  form.addEventListener('submit', e => { e.preventDefault(); if (check()) { setOpen(true); focusBub(start()); } });
  });

  const yr = $('#yr'); if (yr) yr.textContent = new Date().getFullYear();
})();

/* Logo: vuelve arriba de todo */
document.querySelectorAll('a.logo').forEach(a => a.addEventListener('click', e => {
  e.preventDefault();
  if (document.body.classList.contains('menu-open')) { document.body.classList.remove('menu-open'); document.body.style.overflow = ''; const b = document.querySelector('.burger'); if (b) { b.setAttribute('aria-expanded', 'false'); b.setAttribute('aria-label', 'Abrir menú'); } }
  const rm = matchMedia('(prefers-reduced-motion: reduce)').matches;
  window.scrollTo({ top: 0, behavior: rm ? 'auto' : 'smooth' });
  if (location.hash) history.replaceState(null, '', location.pathname + location.search);
}));
