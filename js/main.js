/* PLUMBING_V 4 — Bespoke Studio · meccanica invisibile canonica.
   ────────────────────────────────────────────────────────────────
   CONFINE (inviolabile): questo file contiene SOLO plumbing — la meccanica
   che il visitatore non percepisce come design. NIENTE markup di sezioni,
   NIENTE stile, NIENTE struttura: concept, griglia, tipografia, hero e
   animazioni-firma si progettano DA ZERO per ogni cliente (GATE #3).
   Se qui dentro scivola del layout, questo diventa il nuovo scheletro
   condiviso — cioè il difetto "copia-incolla" che il metodo combatte.

   Come si usa: si COPIA nella cartella js/ del sito e si adatta la sola
   costante SITE. Le animazioni-firma del sito si scrivono nel proprio
   main.js DOPO questo file (o in coda a questo file, sotto il marcatore).
   Ogni bug nuovo si corregge QUI (bump PLUMBING_V + changelog nel README)
   e poi nel sito: mai il contrario.

   Fix già incorporati (non rimuovere):
   - ScrollTrigger registrato SUBITO allo script load, MAI dentro l'intro
     o un setTimeout (bug APF #5 del 16/7: race col watchdog → sezioni
     che sparivano allo scroll).
   - Reveal con once:true (niente re-animazioni da zero ri-scorrendo).
   - Watchdog 1,5s che forza visibile e UCCIDE i trigger non scattati.
   - Lightbox su [hidden] + override CSS !important (bug: display:flex
     batteva [hidden] e la lightbox restava visibile).
   - Foto-contenuto MAI lazy (regola workflow §8): il plumbing non tocca
     il loading, ma il lint lo verifica.
   - Orari Europe/Rome con finestre multiple e scavalco di mezzanotte
     (pattern Il Cavallante 18:00–00:30). */

(function () {
  'use strict';
  var root = document.documentElement;
  root.classList.add('js');
  var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reducedMotion) root.classList.add('reduced-motion');

  /* ══════════ CONFIG PER-SITO — l'unica parte da adattare ══════════ */
  var SITE = {
    slug: 'forno-ambrosiano',
    whatsapp: {
      number: '', // WhatsApp non dichiarato: si chiama (02 817584)
      message: '',
      ids: [],
    },
    /* Google (28/9/2026): lunedì 7–13:30; da martedì a venerdì 7–13:30 e 16–19; sabato 7–13:30 e 16–19:30; domenica chiuso */
    hours: {
      0: [],
      1: [['07:00', '13:30']],
      2: [['07:00', '13:30'], ['16:00', '19:00']],
      3: [['07:00', '13:30'], ['16:00', '19:00']],
      4: [['07:00', '13:30'], ['16:00', '19:00']],
      5: [['07:00', '13:30'], ['16:00', '19:00']],
      6: [['07:00', '13:30'], ['16:00', '19:30']],
    },
    hoursStatusId: 'orarioStato',
    hoursTableSelector: '[data-day]',
    todayClass: 'is-today',
    introId: 'intro',
    introDuration: 1800,
    revealSelector: '.reveal',
    inViewClass: 'in-view',
    breakpointMenu: 1180,
    EN: {
      "m.salta": "Skip to the almanac",
      "m.top": "Forno Ambrosiano, back to the top",
      "m.nav": "The sections of the almanac",
      "m.lingua": "Language",
      "m.menu": "Open the menu",
      "m.rubriche": "The sections",
      "m.ingrandisci": "Enlarge the photo",
      "m.lightbox": "Enlarged photo",
      "m.chiudi": "Close",
      "n.lunario": "Hours",
      "n.pane": "Bread",
      "n.focacce": "Focaccia",
      "n.calendario": "Calendar",
      "n.dolci": "Pastries",
      "n.dicono": "Reviews",
      "n.dove": "Where",
      "t.chiama": "Call",
      "c1.t": "The lunar calendar",
      "c1.s": "The bakery’s hours",
      "c2.t": "The bread",
      "c2.s": "Every day’s harvest",
      "c3.t": "Focaccia and pizzette",
      "c3.s": "The morning trays",
      "c4.t": "The calendar",
      "c4.s": "Feast days, in red",
      "c5.t": "The pastries",
      "c5.s": "Cakes, tartlets and trays",
      "c6.t": "What people say",
      "c6.s": "The reviews",
      "c7.t": "Where and when",
      "c7.s": "Address, hours, questions",
      "h.testata": "The Forno Ambrosiano almanac",
      "h.sotto": "for every day of the year",
      "h.titolo": "In step with the times.",
      "h.sommario": "Bread, focaccia and pastries made here since the late nineties, with “quality ingredients and techniques always in step with the times”. The bakery opens at 7 in the morning and bakes morning and afternoon.",
      "h.indice": "In this almanac",
      "h.effemeridi": "Ephemerides",
      "h.e1": "Opens",
      "h.e1v": "at 7, Monday to Saturday",
      "h.e2": "Break",
      "h.e2v": "from 1:30 to 4 pm",
      "h.e3": "Closes",
      "h.e3v": "at 7 pm, Saturday 7:30 pm",
      "h.e4": "Monday",
      "h.e4v": "mornings only",
      "h.e5": "Sunday",
      "h.e5v": "closed",
      "h.e6": "Rating",
      "h.e6v": "on Google, 491 reviews",
      "h.chiama": "Call",
      "h.orari": "Opening hours",
      "h.dove": "Where we are",
      "f.titolo": "A freshly baked loaf, engraved like the vignette of an almanac",
      "f.desc": "Inside a medallion with lettering around the edge, a round loaf on a board between two ears of wheat. The blade scores a cross on the raw dough, in the oven the loaf rises, the cuts open, the crust takes colour and the engraving is printed, light shadows first and dark ones after; at the end the crust crackles and steam rises.",
      "f.giro": "FORNO AMBROSIANO · VIA BIELLA 28 · MILAN · BREAD · FOCACCIA · PASTRIES · BAKED MORNING AND AFTERNOON ·",
      "f.pronto": "Fresh out of the oven.",
      "f.rifai": "Bake another",
      "c1.p1": "The bakery opens at 7 in the morning, Monday to Saturday. It closes at 1:30 pm and reopens at 4 pm, until 7 pm; on Saturdays until 7:30 pm. On Monday afternoons and on Sundays the oven rests.",
      "c1.lune": "The week in seven moons",
      "g.lun": "Monday",
      "g.mar": "Tuesday",
      "g.mer": "Wednesday",
      "g.gio": "Thursday",
      "g.ven": "Friday",
      "g.sab": "Saturday",
      "g.dom": "Sunday",
      "g.riposo": "closed",
      "g.chiuso": "closed",
      "c1.legenda": "The left half is the morning, the right half the afternoon: full from Tuesday to Saturday, half on Monday, new on Sunday.",
      "c1.p2": "The ovens are emptied early in the morning and again in the afternoon. At busy times and on Saturdays there is a queue: you take a number and wait to be called, as the sign on the window says.",
      "c1.cap": "On the window: “Take a number · Wait to be called”.",
      "a.vetrina": "The shop window under the Forno Ambrosiano sign, with handwritten notes: take a number, wait to be called.",
      "c2.cap1": "Loaves with the cross, just out of the oven.",
      "a.croce": "Round floured loaves with the cross opened by the bake, on the oven rack.",
      "c2.raccolto": "Every day’s harvest",
      "c2.r1": "Round loaves",
      "c2.r1v": "floured, with the cross",
      "c2.r2": "Altamura style",
      "c2.r2v": "durum wheat semolina, from Apulia",
      "c2.r3": "Black bread",
      "c2.r3v": "with seeds",
      "c2.r4": "Multigrain",
      "c2.r4v": "with sourdough",
      "c2.r5": "With raisins",
      "c2.r5v": "also in the sweet braid",
      "c2.r6": "Tuscan",
      "c2.r6v": "salt-free, to order",
      "c2.r7": "Baguettes and michette",
      "c2.r7v": "the michetta is Milan’s own bread roll",
      "c2.r8": "Grissini",
      "c2.r8v": "with sesame, with olives",
      "c2.cit": "«È il classico prestinaio milanese.» <span class=\"cit-tr\">— “It’s the classic Milanese baker.”</span>",
      "r.google": "on Google",
      "a.pagnotte": "Three dark floured loaves with a cracked crust.",
      "c2.cap2": "The floured crust",
      "a.mollica": "A loaf cut in half, held in a hand: the white crumb full of holes and the golden crust.",
      "c2.cap3": "The crumb",
      "a.baguette": "Four golden scored baguettes on a perforated tray.",
      "c2.cap4": "Baguettes",
      "a.michette": "A basket of golden michette on a red checked cloth.",
      "c2.cap5": "Michette",
      "a.grissini": "A tray of grissini covered in sesame seeds, just baked.",
      "c2.cap6": "Sesame grissini",
      "c3.p1": "Roman focaccia with cherry tomatoes, Genoese focaccia, focaccia from Recco, focaccia alla pala, buckwheat and spelt focaccia; and then pizzette and little focaccine, to take away while they are still warm.",
      "a.cruda": "Two raw focacce, white and glossy with oil, with a few cherry tomatoes, in the black tray.",
      "c3.prima": "Before the oven",
      "a.cotta": "The same two focacce baked, golden, covered in cherry tomatoes.",
      "c3.dopo": "After",
      "a.recco": "On the counter a handwritten board, Focaccia di Recco, next to the tray of cheese focaccia.",
      "c3.cap1": "Today, focaccia from Recco.",
      "a.pizzette": "Trays of tomato and mozzarella pizzette and olive focaccine on the counter.",
      "c3.cap2": "Pizzette and olive focaccine.",
      "a.saraceno": "A tray of dark buckwheat and spelt focaccia, cut.",
      "c3.cap3": "Buckwheat and spelt.",
      "c4.p1": "In almanacs the feast days are printed in red, and at the bakery every feast has its sweet. In Milan Carnival also lasts longer: under the Ambrosian rite it ends on the Saturday, not on the Tuesday.",
      "c4.f1m": "February",
      "c4.f1": "Valentine’s Day",
      "c4.f1p": "Tartlets with chocolate hearts and little cups of cream with raspberries and blueberries.",
      "a.valentino": "Golden tartlets with a red chocolate heart and cream.",
      "c4.f2m": "February or March",
      "c4.f2g": "Fat Saturday",
      "c4.f2": "Ambrosian Carnival",
      "c4.f2p": "Tortelli and chiacchiere, until the Saturday: in Milan Carnival ends four days later.",
      "c4.f3m": "March",
      "c4.f3": "Women’s Day",
      "c4.f3p": "Mimosa cake and tartlets, with a yellow sugar rose.",
      "a.mimosa": "Yellow mimosa tartlets covered in sponge cubes, with a yellow sugar rose.",
      "c4.f4m": "March",
      "c4.f4": "Saint Joseph",
      "c4.f4p": "Zeppole, with custard and a sour cherry, for Father’s Day.",
      "a.zeppole": "Saint Joseph’s zeppole dusted with icing sugar, with yellow custard and a sour cherry on top.",
      "c4.f5m": "March or April",
      "c4.f5g": "Sunday",
      "c4.f5": "Easter",
      "c4.f5p": "The colomba, the Easter dove cake, also with chocolate. “We’re already fine-tuning the recipe,” the bakery replied to someone waiting for it.",
      "c4.f6m": "December",
      "c4.f6": "Christmas",
      "c4.f6p": "Panettone, “one of our strong points”, also with pistachio and raspberries; pandoro in the star-shaped tin; Christmas trees of brioche.",
      "a.panettoni": "Panettoni rising in aluminium tins, on the bakery rack.",
      "a.coppette": "Green cups of cream with raspberries, blueberries, petals and little sugar hearts.",
      "c4.cap1": "Valentine’s Day: the cups.",
      "a.pandoro": "Yellow pandoro dough rising in star-shaped tins.",
      "c4.cap2": "Christmas: pandoro in the star-shaped tin.",
      "a.albero": "A glossy brioche Christmas tree made of little balls, with pearl sugar.",
      "c4.cap3": "Christmas: the brioche tree.",
      "c5.p1": "Apple and cinnamon tartlets, cakes with cream puffs, custard brioche, ciambellone, fruit tartlets. And for the office, trays of filled mini croissants.",
      "a.mela": "Apple tartlets with caramelised sugar, in red paper cases.",
      "c5.cap1": "Apple and cinnamon tartlets",
      "a.bigne": "A cake decorated with cream puffs, swirls of cream, yellow and chocolate custard, and white chocolate curls.",
      "c5.cap2": "The cream puff cake",
      "a.croissant": "A tray of mini croissants filled with ham and lettuce, each with a toothpick.",
      "c5.cap3": "Filled mini croissants",
      "a.crostatina": "A slice of sweet raisin braid and a tartlet with custard, figs, grapes and raspberries.",
      "c5.cap4": "The raisin braid and the fruit tartlet",
      "r.voto": "on Google, 491 reviews",
      "a.negozio": "The shop window and door under the two Forno Ambrosiano signs, with the cream awning.",
      "r.risposta": "And the bakery, when it replies (“words like yours repay the effort we put into our work”):",
      "r.nota": "From the Google reviews, as they were written (in Italian).",
      "c7.mezzi": "In the Barona district, twenty metres from Piazza Miani, where buses 47, 71, 74, 95 and 98 stop, and the NM2 at night. The M2 metro at Famagosta is one kilometre away. Parking in the area is not easy.",
      "c7.orari": "Opening hours",
      "c7.mattina": "Morning",
      "c7.pomeriggio": "Afternoon",
      "c7.tel": "Phone",
      "c7.strada": "Directions",
      "c7.mappa": "Map: Forno Ambrosiano, Via Biella 28, Milan",
      "q.t": "Questions",
      "q.1": "Monday afternoon?",
      "q.1r": "On Mondays the bakery is open in the morning only, from 7 am to 1:30 pm. From Tuesday to Saturday it reopens at 4 pm.",
      "q.2": "Can I order bread?",
      "q.2r": "The salt-free Tuscan bread is made to order. For anything else, call the bakery: +39 02 817584.",
      "q.3": "How does the queue work?",
      "q.3r": "You take a number and wait to be called.",
      "q.4": "Where can I park?",
      "q.4r": "On the street, but it is not easy around here: better the bus, which stops twenty metres away, in Piazza Miani.",
      "q.5": "On Sundays?",
      "q.5r": "On Sundays the bakery is closed. Monday to Saturday it opens at 7 am.",
      "z.cred": "Demo website made by <a href=\"https://bespokestud.io\" rel=\"noopener\">Bespoke Studio</a> · photos from the Google listing (by the bakery and by customers), reviews from Google, their words from Google (September 2026). The vignette of the loaf is drawn.",
      "z.su": "Back to the top ↑"
    },
    LANGS: null,
    RTL: ['ar', 'he', 'fa', 'ur'],
    HOURS_I18N: null,
  };
  /* normalizzazione: EN storico -> LANGS */
  if (!SITE.LANGS) SITE.LANGS = SITE.EN && Object.keys(SITE.EN).length ? { en: SITE.EN } : {};
  var LANG_CODES = Object.keys(SITE.LANGS);   // senza 'it', che è il DOM
  /* ═════════════════════════════════════════════════════════════════ */

  /* ---------- WhatsApp wiring ---------- */
  if (SITE.whatsapp.number) {
    var waHref = 'https://wa.me/' + SITE.whatsapp.number + '?text=' +
      encodeURIComponent(SITE.whatsapp.message);
    SITE.whatsapp.ids.forEach(function (id) {
      var el = document.getElementById(id);
      if (el) { el.href = waHref; el.target = '_blank'; el.rel = 'noopener'; }
    });
  }

  /* ---------- GSAP: registrazione IMMEDIATA + reveal + watchdog ---------- */
  var hasGsap = typeof gsap !== 'undefined';
  var hasST = hasGsap && typeof ScrollTrigger !== 'undefined';
  if (hasST) gsap.registerPlugin(ScrollTrigger);

  function showAllReveals() {
    var els = document.querySelectorAll(SITE.revealSelector);
    els.forEach(function (el) { el.classList.add(SITE.inViewClass); });
    if (hasGsap) {
      if (hasST) {
        els.forEach(function (el) {
          ScrollTrigger.getAll().forEach(function (st) {
            if (st.trigger === el && !st.progress) st.kill();
          });
        });
      }
      gsap.set(els, { opacity: 1, y: 0, x: 0 });
    }
  }
  // FIX FOUC (18/7): il watchdog è SOLO un fallback se GSAP non c'è (o reduced-motion).
  // Rivelare in anticipo tutti i .reveal mentre gli scroll-trigger sono attivi causava il
  // flash (scompaiono/ricompaiono) sotto la piega. Con GSAP attivo, rivelano gli ScrollTrigger.
  setTimeout(function () { if (!hasGsap || reducedMotion) showAllReveals(); }, 1500);

  if (hasGsap && !reducedMotion) {
    // reveal generico: le animazioni-FIRMA del sito vanno oltre questo,
    // ma si registrano ANCHE LORO subito, mai dopo l'intro.
    // ⚠️ REGOLA ANTI-FLASH (18/7): un elemento .reveal deve avere UNA SOLA animazione che
    // ne porta l'opacità a 1. Se un elemento ha una FIRMA che ne anima l'opacità (stagger,
    // timeline, ecc.), ESCLUDILO da qui via SITE.revealSelector (es. '.reveal:not(.mondo)'),
    // altrimenti il reveal generico + la firma si sovrappongono e l'elemento FLASHA.
    // immediateRender:false → lo stato "from" (opacity:0) NON viene ri-applicato ad ogni
    // ScrollTrigger.refresh() (che scatta al window.load mentre scrolli) → niente flash su refresh.
    gsap.utils.toArray(SITE.revealSelector).forEach(function (el) {
      gsap.fromTo(el, { opacity: 0, y: 28 }, {
        opacity: 1, y: 0, duration: 0.7, ease: 'power2.out', immediateRender: false,
        scrollTrigger: { trigger: el, start: 'top 88%', once: true },
      });
    });
  } else {
    // fallback senza GSAP: IntersectionObserver + classe
    if ('IntersectionObserver' in window && !reducedMotion) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) { e.target.classList.add(SITE.inViewClass); io.unobserve(e.target); }
        });
      }, { threshold: 0.12 });
      document.querySelectorAll(SITE.revealSelector).forEach(function (el) { io.observe(el); });
    } else {
      showAllReveals();
    }
  }

  /* ---------- intro skippabile (NON gate-a nulla) ---------- */
  var intro = document.getElementById(SITE.introId);
  /* ⚠️ L'hook si legge AL MOMENTO DELLA CHIAMATA, mai catturato per valore
     qui. Il codice-firma vive sotto il marcatore di fine plumbing — cioè
     gira DOPO questa riga — quindi `window.bespokeHeroEntrance ||
     function(){}` congelava la funzione vuota e l'entrata dell'hero non
     partiva più: titolo a opacity 0 per sempre, hero vuota sul live.
     (20/7/2026, riprodotto a schermo su Benessere Futuro #159.) */
  function heroEntrance() {
    if (typeof window.bespokeHeroEntrance === 'function') window.bespokeHeroEntrance();
  }
  function hideIntro() {
    if (!intro) return;
    var el = intro; intro = null;
    el.classList.add('hide');
    setTimeout(function () { el.remove(); }, 700);
    heroEntrance();
  }
  // rimozione IMMEDIATA (niente fade): serve quando qualcosa deve stare sopra
  // l'intro subito, es. l'apertura del menu. Durante il fade l'intro resta
  // hit-testable e i link del drawer non sono cliccabili.
  function killIntroNow() {
    if (!intro) return;
    var el = intro; intro = null;
    el.remove();
    heroEntrance();
  }
  if (reducedMotion || !intro) {
    if (intro) { intro.remove(); intro = null; }
    /* ⚠️ setTimeout 0 NON è decorativo: senza intro questo ramo gira in modo
       SINCRONO, cioè PRIMA che il codice-firma — che sta sotto il marcatore
       di fine plumbing, dentro questa stessa IIFE — abbia assegnato
       `window.bespokeHeroEntrance`. Il risultato è un'entrata dell'hero MUTA:
       nessun errore, elementi visibili, animazione semplicemente mai partita.
       Rimandando di un tick la IIFE è conclusa e l'hook esiste.
       (14/8/2026, A.S.FA. Sicilia: misurato h1 a opacity 1 già al load.)
       Cugino del bug `hero-hook-congelato` del 20/7: lì l'hook era catturato
       troppo presto, qui è CHIAMATO troppo presto. */
    setTimeout(heroEntrance, 0);
  } else {
    setTimeout(hideIntro, SITE.introDuration);
    setTimeout(hideIntro, 6000); // safety net: l'intro non può incastrarsi
    intro.addEventListener('click', hideIntro);
  }

  /* ---------- burger menu (inert + focus + Escape + resize) ---------- */
  var burger = document.getElementById('burger');
  /* 26/7/2026 (Il Papiro #168) — IL PANNELLO SI RISOLVE DA `aria-controls`.
     Il canone apriva sempre `#mainNav`, dando per scontato che la nav
     desktop FOSSE anche il drawer. Molti siti invece hanno un drawer
     separato (`#mobile-menu`) con `hidden`, mentre `#mainNav` su mobile è
     `display:none`: il burger aggiungeva `nav-open` a un elemento nascosto
     e il menu non si apriva. È la stessa decisione già presa il 20/7 per
     qa-motion — «è lì che il markup accessibile dice qual è il pannello» —
     che però non era mai rientrata qui. */
  var nav = (function () {
    var byAria = burger && burger.getAttribute('aria-controls');
    return (byAria && document.getElementById(byAria)) || document.getElementById('mainNav');
  })();
  if (burger && nav) {
    var navUsaHidden = nav.hasAttribute('hidden');
    var lastFocus = null;
    var closeNav = function () {
      nav.classList.remove('nav-open');
      if (navUsaHidden) nav.hidden = true;
      burger.setAttribute('aria-expanded', 'false');
      if (lastFocus) { lastFocus.focus(); lastFocus = null; }
    };
    var openNav = function () {
      // L'intro ha z-index alto ed è figlia del body: se è ancora a schermo
      // copre il drawer (che vive nello stacking context dell'header) e i link
      // risultano non cliccabili. Aprire il menu chiude l'intro.
      // (bug trovato da qa-motion su Linea Uomo, 19/7/2026 → PLUMBING_V 2)
      if (typeof killIntroNow === 'function') killIntroNow();
      lastFocus = document.activeElement;
      if (navUsaHidden) nav.hidden = false;
      nav.classList.add('nav-open');
      burger.setAttribute('aria-expanded', 'true');
      var first = nav.querySelector('a, button');
      if (first) first.focus();
    };
    burger.addEventListener('click', function () {
      nav.classList.contains('nav-open') ? closeNav() : openNav();
    });
    nav.querySelectorAll('a').forEach(function (a) { a.addEventListener('click', closeNav); });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && nav.classList.contains('nav-open')) closeNav();
    });
    window.addEventListener('resize', function () {
      if (window.innerWidth > SITE.breakpointMenu) closeNav();
    });
  }

  /* ---------- lightbox accessibile ---------- */
  var lightbox = document.getElementById('lightbox');
  var lightboxImg = document.getElementById('lightboxImg');
  var lightboxClose = document.getElementById('lightboxClose');
  if (lightbox && lightboxImg) {
    var opener = null;
    var openLb = function (src, alt) {
      lightboxImg.src = src; lightboxImg.alt = alt || '';
      lightbox.hidden = false;
      document.body.style.overflow = 'hidden';
      if (lightboxClose) lightboxClose.focus();
    };
    var closeLb = function () {
      lightbox.hidden = true; lightboxImg.src = '';
      document.body.style.overflow = '';
      if (opener) { opener.focus(); opener = null; }
    };
    document.querySelectorAll('[data-full]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        opener = btn;
        var img = btn.querySelector('img');
        openLb(btn.getAttribute('data-full'), img ? img.alt : '');
      });
    });
    if (lightboxClose) lightboxClose.addEventListener('click', closeLb);
    lightbox.addEventListener('click', function (e) { if (e.target === lightbox) closeLb(); });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && !lightbox.hidden) closeLb();
    });
  }

  /* ---------- orari dinamici Europe/Rome (finestre multiple + scavalco) ---------- */
  function romeNow() {
    try {
      var f = new Intl.DateTimeFormat('en-GB', {
        timeZone: 'Europe/Rome', weekday: 'short', hour: '2-digit', minute: '2-digit', hour12: false,
      });
      var p = f.formatToParts(new Date());
      var map = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };
      var get = function (t) { return p.find(function (x) { return x.type === t; }).value; };
      return { day: map[get('weekday')], mins: parseInt(get('hour'), 10) * 60 + parseInt(get('minute'), 10) };
    } catch (e) {
      var d = new Date();
      return { day: d.getDay(), mins: d.getHours() * 60 + d.getMinutes() };
    }
  }
  var toMin = function (hm) {
    var a = hm.split(':');
    return parseInt(a[0], 10) * 60 + parseInt(a[1], 10);
  };
  var fmt = function (m) {
    m = m % 1440;
    return ('0' + Math.floor(m / 60)).slice(-2) + ':' + ('0' + (m % 60)).slice(-2);
  };
  var DAYS_IT = ['domenica', 'lunedì', 'martedì', 'mercoledì', 'giovedì', 'venerdì', 'sabato'];
  var DAYS_EN = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  var HOURS_BASE = {
    it: { open: 'Aperto ora', closesAt: 'chiude alle ', opensToday: 'Chiuso · apre oggi alle ',
          opensOn: 'Chiuso · apre {day} alle ', closed: 'Chiuso', days: DAYS_IT },
    en: { open: 'Open now', closesAt: 'closes at ', opensToday: 'Closed · opens today at ',
          opensOn: 'Closed · opens {day} at ', closed: 'Closed', days: DAYS_EN },
  };
  /* risolve le etichette orari per la lingua richiesta, con fallback en -> it */
  function strings(lang) {
    var custom = (SITE.HOURS_I18N && SITE.HOURS_I18N[lang]) || null;
    var base = HOURS_BASE[lang] || HOURS_BASE.en;
    if (!custom) return base;
    var outp = {};
    Object.keys(HOURS_BASE.it).forEach(function (k) {
      outp[k] = custom[k] !== undefined ? custom[k] : base[k];
    });
    return outp;
  }

  function hoursState() {
    var now = romeNow();
    // finestra del giorno corrente
    var wins = SITE.hours[now.day] || [];
    for (var i = 0; i < wins.length; i++) {
      var s = toMin(wins[i][0]), e = toMin(wins[i][1]);
      if (now.mins >= s && now.mins < Math.min(e, 1440)) {
        return { open: true, day: now.day, closesAt: fmt(e) };
      }
    }
    // coda dopo mezzanotte della sera PRIMA
    var prev = (now.day + 6) % 7;
    var pw = SITE.hours[prev] || [];
    for (var j = 0; j < pw.length; j++) {
      var pe = toMin(pw[j][1]);
      if (pe > 1440 && now.mins < pe - 1440) {
        return { open: true, day: prev, closesAt: fmt(pe) };
      }
    }
    // chiuso: prossima apertura (oggi o nei prossimi 7 giorni)
    for (var k = 0; k < wins.length; k++) {
      if (now.mins < toMin(wins[k][0])) {
        return { open: false, day: now.day, opensToday: fmt(toMin(wins[k][0])) };
      }
    }
    for (var d = 1; d <= 7; d++) {
      var nd = (now.day + d) % 7;
      var nw = SITE.hours[nd] || [];
      if (nw.length) return { open: false, day: now.day, opensDay: nd, opensAt: fmt(toMin(nw[0][0])) };
    }
    return { open: false, day: now.day };
  }

  function renderHours() {
    var el = document.getElementById(SITE.hoursStatusId);
    var st = hoursState();
    document.querySelectorAll(SITE.hoursTableSelector).forEach(function (row) {
      row.classList.toggle(SITE.todayClass,
        parseInt(row.getAttribute('data-day'), 10) === st.day);
    });
    if (!el) return;
    /* V4: le etichette si risolvono per lingua corrente, non con un booleano
       en/it. Fallback a catena lingua -> en -> it, così un sito con AR o FR
       che non traduce lo stato orari resta comunque leggibile. */
    var L = strings(root.lang);
    var txt;
    if (st.open) {
      txt = L.open + ' · ' + L.closesAt + st.closesAt;
    } else if (st.opensToday) {
      txt = L.opensToday + st.opensToday;
    } else if (st.opensAt !== undefined) {
      txt = L.opensOn.replace('{day}', L.days[st.opensDay]) + st.opensAt;
    } else {
      txt = L.closed;
    }
    el.textContent = txt;
  }
  renderHours();
  setInterval(renderHours, 60000);

  /* ---------- i18n overlay (EN sopra l'IT del DOM) ---------- */
  var originals = {}; // attr -> key -> testo IT
  var I18N_ATTRS = [
    ['data-i18n', null],
    ['data-i18n-aria', 'aria-label'],
    ['data-i18n-alt', 'alt'],
    ['data-i18n-placeholder', 'placeholder'],
    ['data-i18n-title', 'title'],
  ];
  function setLang(lang) {
    /* V4: qualunque lingua dichiarata in SITE.LANGS, non più solo 'en'.
       'it' resta la lingua del DOM: nessun dizionario, nessuna sostituzione.
       Una lingua sconosciuta ricade su 'it' invece di rompere la pagina. */
    root.lang = (lang === 'it' || LANG_CODES.indexOf(lang) !== -1) ? lang : 'it';
    root.dir = SITE.RTL.indexOf(root.lang) !== -1 ? 'rtl' : 'ltr';
    var dict = SITE.LANGS[root.lang] || null;
    I18N_ATTRS.forEach(function (pair) {
      var dattr = pair[0], target = pair[1];
      if (!originals[dattr]) originals[dattr] = {};
      document.querySelectorAll('[' + dattr + ']').forEach(function (el) {
        var key = el.getAttribute(dattr);
        var store = originals[dattr];
        /* innerHTML, NON textContent: gli elementi tradotti contengono
           quasi sempre markup (<strong>, <br>) e con textContent il primo
           passaggio a EN lo appiattisce — tornando in italiano il grassetto
           non torna più. I valori del dizionario sono statici e scritti da
           noi. (20/7/2026: la flotta era già così, il boilerplate no.) */
        if (!(key in store)) store[key] = target ? el.getAttribute(target) : el.innerHTML;
        var val = dict && dict[key] !== undefined ? dict[key] : store[key];
        if (target) el.setAttribute(target, val); else el.innerHTML = val;
      });
    });
    renderHours();
    /* stato visivo della coppia di bottoni lingua, se il sito la usa */
    document.querySelectorAll('[data-lang]').forEach(function (b) {
      var on = b.getAttribute('data-lang') === root.lang;
      b.classList.toggle('is-on', on);
      if (b.tagName === 'BUTTON') b.setAttribute('aria-pressed', on ? 'true' : 'false');
    });
    try { localStorage.setItem(SITE.slug + '-lang', lang); } catch (e) {}
  }
  /* 26/7/2026 (Il Papiro #168) — SI CABLANO ENTRAMBE LE FORME DI SELETTORE.
     Il canone conosceva solo il toggle singolo `#langToggle`, ma nella
     flotta esiste da tempo anche la COPPIA di bottoni `[data-lang]`
     (Warsa, Mido…): `i18n-roundtrip` era già stato insegnato a riconoscerle
     il 20/7, il plumbing no. Chi copiava il boilerplate e usava la coppia
     si ritrovava il cambio lingua MORTO, e nessun lint statico se ne
     accorgeva (lo becca solo qa-motion, a runtime). */
  var langToggle = document.getElementById('langToggle');
  if (langToggle) {
    /* V4: il toggle singolo CICLA sull'anello ['it', ...LANG_CODES].
       Con due lingue il comportamento è identico a prima (it <-> en). */
    var RING = ['it'].concat(LANG_CODES);
    langToggle.addEventListener('click', function () {
      var i = RING.indexOf(root.lang);
      setLang(RING[(i + 1) % RING.length]);
    });
  }
  document.querySelectorAll('[data-lang]').forEach(function (b) {
    b.addEventListener('click', function () { setLang(b.getAttribute('data-lang')); });
  });
  try {
    var saved = localStorage.getItem(SITE.slug + '-lang');
    if (saved && saved !== 'it' && LANG_CODES.indexOf(saved) !== -1) setLang(saved);
  } catch (e) {}

  /* ---------- action-bar mobile (opzionale: #actionBar) ---------- */
  var actionBar = document.getElementById('actionBar');
  if (actionBar) {
    var onScroll = function () {
      actionBar.classList.toggle('is-visible', window.scrollY > window.innerHeight * 0.6);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ══════════ FINE PLUMBING — da qui in giù SOLO il codice-firma
     del sito (animazioni e interazioni uniche del cliente), che si
     registra comunque SUBITO, mai dentro setTimeout/intro. ══════════ */

  /* ══════════ FORNO AMBROSIANO — «Al passo con i tempi.» ══════════
     La pagina è l'almanacco del forno, impaginato come il Barbanera: frontespizio, lunario, rubriche, calendario delle
     feste in rosso.
     la FIRMA — la vignetta del frontespizio: una pagnotta incisa come una xilografia d'almanacco. Sulla pasta cruda la
     lama incide la croce (prima il taglio A, poi il B); in forno la pagnotta si alza, i tagli si aprono a lente con
     l'orecchio scuro, la crosta si colora e il tratteggio dell'incisione si stampa a strati (prima le ombre leggere, poi
     le scure, poi il tratteggio incrociato); alla fine la crosta si crepa e sale il vapore.
     Stato finale = l'HTML/SVG. Senza JS e con reduced-motion: lo stato finale. L'attesa è la classe firma-attesa
     dell'head (pasta cruda, via CSS), tolta dall'head dopo 2,5 s se il codice non arriva. Un rAF a tempo: la firma non
     dipende da GSAP. I dati vengono da _fam_pagnotta.mjs. */
  var DATI = {"tagli":{"A":{"punti":[{"x":178,"y":306,"nx":0.621,"ny":0.784,"w":0},{"x":184,"y":301.8,"nx":0.535,"ny":0.845,"w":5.5},{"x":190.8,"y":297.9,"nx":0.459,"ny":0.888,"w":9.2},{"x":198.3,"y":294.4,"nx":0.393,"ny":0.92,"w":12.4},{"x":206.5,"y":291.2,"nx":0.335,"ny":0.942,"w":15.2},{"x":215.4,"y":288.3,"nx":0.284,"ny":0.959,"w":17.7},{"x":224.7,"y":285.8,"nx":0.238,"ny":0.971,"w":19.8},{"x":234.6,"y":283.6,"nx":0.197,"ny":0.98,"w":21.7},{"x":244.9,"y":281.7,"nx":0.159,"ny":0.987,"w":23.3},{"x":255.5,"y":280.2,"nx":0.124,"ny":0.992,"w":24.6},{"x":266.4,"y":279,"nx":0.092,"ny":0.996,"w":25.7},{"x":277.5,"y":278.2,"nx":0.06,"ny":0.998,"w":26.4},{"x":288.7,"y":277.7,"nx":0.03,"ny":1,"w":26.9},{"x":300,"y":277.5,"nx":0,"ny":1,"w":27},{"x":311.3,"y":277.7,"nx":-0.03,"ny":1,"w":26.9},{"x":322.5,"y":278.2,"nx":-0.06,"ny":0.998,"w":26.4},{"x":333.6,"y":279,"nx":-0.092,"ny":0.996,"w":25.7},{"x":344.5,"y":280.2,"nx":-0.124,"ny":0.992,"w":24.6},{"x":355.1,"y":281.7,"nx":-0.159,"ny":0.987,"w":23.3},{"x":365.4,"y":283.6,"nx":-0.197,"ny":0.98,"w":21.7},{"x":375.3,"y":285.8,"nx":-0.238,"ny":0.971,"w":19.8},{"x":384.6,"y":288.3,"nx":-0.284,"ny":0.959,"w":17.7},{"x":393.5,"y":291.2,"nx":-0.335,"ny":0.942,"w":15.2},{"x":401.7,"y":294.4,"nx":-0.393,"ny":0.92,"w":12.4},{"x":409.2,"y":297.9,"nx":-0.459,"ny":0.888,"w":9.2},{"x":416,"y":301.8,"nx":-0.535,"ny":0.845,"w":5.5},{"x":422,"y":306,"nx":-0.621,"ny":0.784,"w":0}],"lato":0.38},"B":{"punti":[{"x":303,"y":226,"nx":-0.992,"ny":-0.124,"w":0},{"x":302.4,"y":230.7,"nx":-0.993,"ny":-0.118,"w":4.7},{"x":301.9,"y":235.5,"nx":-0.994,"ny":-0.112,"w":7.9},{"x":301.3,"y":240.5,"nx":-0.994,"ny":-0.105,"w":10.6},{"x":300.8,"y":245.7,"nx":-0.995,"ny":-0.099,"w":12.9},{"x":300.3,"y":250.9,"nx":-0.996,"ny":-0.092,"w":15},{"x":299.8,"y":256.3,"nx":-0.996,"ny":-0.085,"w":16.9},{"x":299.4,"y":261.9,"nx":-0.997,"ny":-0.078,"w":18.5},{"x":298.9,"y":267.5,"nx":-0.997,"ny":-0.071,"w":19.9},{"x":298.5,"y":273.3,"nx":-0.998,"ny":-0.064,"w":21},{"x":298.2,"y":279.1,"nx":-0.998,"ny":-0.057,"w":21.9},{"x":297.9,"y":285.1,"nx":-0.999,"ny":-0.049,"w":22.5},{"x":297.6,"y":291.1,"nx":-0.999,"ny":-0.041,"w":22.9},{"x":297.4,"y":297.3,"nx":-0.999,"ny":-0.033,"w":23},{"x":297.2,"y":303.5,"nx":-1,"ny":-0.024,"w":22.9},{"x":297.1,"y":309.7,"nx":-1,"ny":-0.016,"w":22.5},{"x":297,"y":316.1,"nx":-1,"ny":-0.007,"w":21.9},{"x":297,"y":322.5,"nx":-1,"ny":0.003,"w":21},{"x":297,"y":329,"nx":-1,"ny":0.012,"w":19.9},{"x":297.2,"y":335.5,"nx":-1,"ny":0.022,"w":18.5},{"x":297.3,"y":342.1,"nx":-0.999,"ny":0.033,"w":16.9},{"x":297.6,"y":348.7,"nx":-0.999,"ny":0.043,"w":15},{"x":297.9,"y":355.3,"nx":-0.999,"ny":0.054,"w":12.9},{"x":298.3,"y":362,"nx":-0.998,"ny":0.066,"w":10.6},{"x":298.8,"y":368.6,"nx":-0.997,"ny":0.078,"w":7.9},{"x":299.4,"y":375.3,"nx":-0.996,"ny":0.09,"w":4.7},{"x":300,"y":382,"nx":-0.995,"ny":0.103,"w":0}],"lato":0.4}},"lievita":{"cx":300,"cy":436,"sx":1.06,"sy":0.78},"tempi":{"taglioA":[250,750],"taglioB":[800,1300],"lamaVia":[1300,1500],"lievita":[1450,2700],"apre":[1600,2800],"cuoce":[1600,3000],"stampa1":[2300,3100],"stampa2":[2800,3600],"stampa3":[3300,4100],"tratto":360,"crepe":[3900,4400],"vapore":[4000,5100],"fine":5200}};
  var figuraV = document.getElementById('vignetta');
  var svgV = figuraV && figuraV.querySelector('.vignetta__svg');
  var pagnotta = svgV && svgV.querySelector('#pagnotta');
  var cotta = svgV && svgV.querySelector('#pagnottaCotta');
  var lama = svgV && svgV.querySelector('#lama');
  var rifai = document.getElementById('rifaiInfornata');
  var TP = DATI.tempi, LV = DATI.lievita;
  var TG = {};
  ['A', 'B'].forEach(function (k) {
    var q = function (id) { return svgV && svgV.querySelector('#' + id); };
    TG[k] = { crudo: q('taglio' + k + 'crudo'), cotto: q('taglio' + k + 'cotto'), orecchio: q('taglio' + k + 'orecchio'), incisione: q('incisione' + k), dati: DATI.tagli[k] };
    if (TG[k].crudo && TG[k].orecchio) { TG[k].d = TG[k].crudo.getAttribute('d'); TG[k].dOrecchio = TG[k].orecchio.getAttribute('d'); }
  });
  var strati = [1, 2, 3].map(function (n) { return svgV ? [].slice.call(svgV.querySelectorAll('.strato--' + n + ' .tratto')) : []; });
  var crepeEl = svgV ? [].slice.call(svgV.querySelectorAll('.tratto--crepa')) : [];
  var vaporeEl = svgV ? [].slice.call(svgV.querySelectorAll('.tratto--vapore')) : [];
  var tuttiTratti = svgV ? [].slice.call(svgV.querySelectorAll('.tratto')) : [];
  var trasfLama = lama ? lama.getAttribute('transform') : '';
  var faseV = 'fatta', rafV = 0, guardiaV = 0, larghezzaAvvio = 0, corse = 0, ultimoKO = -1;
  var c01 = function (t) { return Math.max(0, Math.min(1, t)); };
  var esce = function (t) { return 1 - Math.pow(1 - t, 3); };
  var dolce = function (t) { return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; };
  var r1 = function (n) { return Math.round(n * 10) / 10; };
  /* la guardia: se i fotogrammi smettono di arrivare per 1,5 s (scheda in background) la pagina va allo stato finale;
     si riarma a ogni fotogramma (#229) */
  function sorveglia() { clearTimeout(guardiaV); guardiaV = setTimeout(chiudiInfornata, 1500); }
  /* un tratto disegnato fino a p (0–1): il trattino parte mezzo punto prima dell'inizio, niente puntino a p = 0 */
  function segna(el, p) {
    if (el.__p === p) return;
    el.__p = p;
    el.style.strokeDasharray = '100 101';
    el.style.strokeDashoffset = (100.5 * (1 - p)).toFixed(2);
  }
  /* la lente di un taglio aperta di k: la stessa formula del generatore */
  function lente(t, k) {
    var su = [], giu = [];
    t.punti.forEach(function (p) {
      su.push([p.x + p.nx * p.w * t.lato * k, p.y + p.ny * p.w * t.lato * k]);
      giu.push([p.x - p.nx * p.w * (1 - t.lato) * k, p.y - p.ny * p.w * (1 - t.lato) * k]);
    });
    var f = function (q) { return r1(q[0]) + ' ' + r1(q[1]); };
    return { d: 'M' + su.map(f).join('L') + 'L' + giu.reverse().map(f).join('L') + 'Z', orecchio: 'M' + su.map(f).join('L') };
  }
  function lievitata(k) {
    var sx = LV.sx + (1 - LV.sx) * k, sy = LV.sy + (1 - LV.sy) * k;
    return 'translate(' + LV.cx + 'px,' + LV.cy + 'px) scale(' + (Math.round(sx * 1000) / 1000) + ',' + (Math.round(sy * 1000) / 1000) + ') translate(' + (-LV.cx) + 'px,' + (-LV.cy) + 'px)';
  }
  /* il punto del taglio k a p (0–1) sulla pasta ancora cruda (il gruppo è schiacciato: il punto si trasforma uguale) */
  function puntoLama(k, p) {
    var el = TG[k].incisione, L = el.getTotalLength(), d = L * p;
    var q = el.getPointAtLength(d), a = el.getPointAtLength(Math.max(0, d - 1)), b = el.getPointAtLength(Math.min(L, d + 1));
    var tx = function (x) { return LV.cx + (x - LV.cx) * LV.sx; }, ty = function (y) { return LV.cy + (y - LV.cy) * LV.sy; };
    return { x: tx(q.x), y: ty(q.y), ang: Math.atan2(ty(b.y) - ty(a.y), tx(b.x) - tx(a.x)) * 180 / Math.PI };
  }
  function mettiLama(t) {
    var A = TP.taglioA, B = TP.taglioB, pos, op = 1, su = 0;
    if (t < A[0]) { pos = puntoLama('A', 0); op = c01((t - (A[0] - 180)) / 180); }
    else if (t <= A[1]) pos = puntoLama('A', dolce(c01((t - A[0]) / (A[1] - A[0]))));
    else if (t < B[0]) {
      var e = puntoLama('A', 1), s0 = puntoLama('B', 0), u = (t - A[1]) / (B[0] - A[1]);
      pos = { x: e.x + (s0.x - e.x) * u, y: e.y + (s0.y - e.y) * u, ang: e.ang + (s0.ang - e.ang) * u };
      su = Math.sin(Math.PI * u) * 16;
    }
    else if (t <= B[1]) pos = puntoLama('B', dolce(c01((t - B[0]) / (B[1] - B[0]))));
    else { pos = puntoLama('B', 1); var v = c01((t - TP.lamaVia[0]) / (TP.lamaVia[1] - TP.lamaVia[0])); op = 1 - v; su = v * 26; }
    /* la punta del ferro (11 px avanti) sta sul taglio */
    var rad = pos.ang * Math.PI / 180;
    lama.setAttribute('transform', 'translate(' + (pos.x - Math.cos(rad) * 11).toFixed(1) + ' ' + (pos.y - Math.sin(rad) * 11 - su).toFixed(1) + ') rotate(' + pos.ang.toFixed(1) + ')');
    lama.style.opacity = op.toFixed(3);
  }
  function mettiTagli(t) {
    var A = TP.taglioA, B = TP.taglioB;
    segna(TG.A.incisione, dolce(c01((t - A[0]) / (A[1] - A[0]))));
    segna(TG.B.incisione, dolce(c01((t - B[0]) / (B[1] - B[0]))));
    var kO = dolce(c01((t - TP.apre[0]) / (TP.apre[1] - TP.apre[0])));
    var kC = c01((t - TP.cuoce[0]) / (TP.cuoce[1] - TP.cuoce[0]));
    kC = kC * kC * (3 - 2 * kC);
    if (kO !== ultimoKO) {
      ultimoKO = kO;
      ['A', 'B'].forEach(function (k) {
        var l = lente(TG[k].dati, kO);
        TG[k].crudo.setAttribute('d', l.d); TG[k].cotto.setAttribute('d', l.d); TG[k].orecchio.setAttribute('d', l.orecchio);
        TG[k].crudo.style.opacity = kO > 0 ? '1' : '0';
        TG[k].orecchio.style.opacity = kO.toFixed(3);
      });
    }
    ['A', 'B'].forEach(function (k) { TG[k].cotto.style.opacity = kC.toFixed(3); });
    cotta.style.opacity = kC.toFixed(3);
    pagnotta.style.transform = lievitata(esce(c01((t - TP.lievita[0]) / (TP.lievita[1] - TP.lievita[0]))));
  }
  /* l'incisione a strati: ogni tratto si disegna in TP.tratto ms, gli inizi scalati dentro la finestra dello strato */
  function stampa(els, fin, dur, t) {
    var n = els.length;
    for (var i = 0; i < n; i++) {
      var s0 = fin[0] + (n > 1 ? (fin[1] - fin[0] - dur) * i / (n - 1) : 0);
      segna(els[i], c01((t - s0) / dur));
    }
  }
  function chiudiInfornata() {
    cancelAnimationFrame(rafV); rafV = 0;
    clearTimeout(guardiaV);
    tuttiTratti.forEach(function (el) { el.style.removeProperty('stroke-dasharray'); el.style.removeProperty('stroke-dashoffset'); el.__p = undefined; });
    ['A', 'B'].forEach(function (k) {
      if (!TG[k].crudo) return;
      TG[k].crudo.setAttribute('d', TG[k].d); TG[k].cotto.setAttribute('d', TG[k].d); TG[k].orecchio.setAttribute('d', TG[k].dOrecchio);
      [TG[k].crudo, TG[k].cotto, TG[k].orecchio].forEach(function (el) { el.style.removeProperty('opacity'); });
    });
    if (pagnotta) pagnotta.style.removeProperty('transform');
    if (cotta) cotta.style.removeProperty('opacity');
    if (lama) { lama.setAttribute('transform', trasfLama); lama.style.removeProperty('opacity'); }
    ultimoKO = -1;
    if (figuraV) figuraV.setAttribute('data-firma', 'fatta');
    root.classList.remove('firma-attesa');
    faseV = 'fatta';
    if (rifai) rifai.disabled = false;
  }
  function avviaInfornata() {
    /* dalla classe d'attesa agli stili in linea senza cambiare un pixel: pasta cruda, tagli e incisione nascosti */
    tuttiTratti.forEach(function (el) { el.__p = undefined; segna(el, 0); });
    pagnotta.style.transform = lievitata(0);
    cotta.style.opacity = '0';
    ['A', 'B'].forEach(function (k) { [TG[k].crudo, TG[k].cotto, TG[k].orecchio].forEach(function (el) { el.style.opacity = '0'; }); });
    lama.style.opacity = '0';
    ultimoKO = -1;
    root.classList.remove('firma-attesa');
    faseV = 'corre'; figuraV.setAttribute('data-firma', 'corre');
    larghezzaAvvio = window.innerWidth;
    if (rifai) rifai.disabled = true;
    var t0 = null, corsa = ++corse;
    function fotogramma(ts) {
      rafV = 0;
      /* un fotogramma rimasto in coda dopo la chiusura (o di una corsa vecchia) non riapre niente */
      if (faseV !== 'corre' || corsa !== corse) return;
      if (t0 === null) t0 = ts;
      var t = ts - t0;
      mettiLama(t);
      mettiTagli(t);
      stampa(strati[0], TP.stampa1, TP.tratto, t);
      stampa(strati[1], TP.stampa2, TP.tratto, t);
      stampa(strati[2], TP.stampa3, TP.tratto, t);
      stampa(crepeEl, TP.crepe, 220, t);
      stampa(vaporeEl, TP.vapore, 800, t);
      if (t >= TP.fine) { chiudiInfornata(); return; }
      sorveglia();
      rafV = requestAnimationFrame(fotogramma);
    }
    sorveglia();
    rafV = requestAnimationFrame(fotogramma);
  }
  function inVistaVignetta() {
    if (!svgV) return false;
    var r = svgV.getBoundingClientRect(), vh = window.innerHeight || 800;
    return r.top < vh * 0.85 && r.bottom > vh * 0.2;
  }

  /* l'indice della testata segna la rubrica in cui ti trovi */
  var linkIndice = [].slice.call(document.querySelectorAll('#mainNav a'));
  var rubriche = linkIndice.map(function (a) { return document.querySelector(a.getAttribute('href')); });
  function aggiornaIndice() {
    var y = (document.getElementById('testata') || { offsetHeight: 64 }).offsetHeight + 40, ora = -1;
    for (var i = 0; i < rubriche.length; i++) { if (rubriche[i] && rubriche[i].getBoundingClientRect().top <= y) ora = i; }
    linkIndice.forEach(function (a, k) { if (k === ora) a.setAttribute('aria-current', 'true'); else a.removeAttribute('aria-current'); });
  }
  var tickIndice = 0;
  window.addEventListener('scroll', function () {
    if (tickIndice) return;
    tickIndice = requestAnimationFrame(function () { tickIndice = 0; aggiornaIndice(); });
  }, { passive: true });
  aggiornaIndice();

  /* lo stato degli orari anche in «Dove e quando», col pallino verde quando è aperto */
  function copiaStato() {
    var primo = document.getElementById(SITE.hoursStatusId);
    if (!primo) return;
    var aperto = hoursState().open;
    ['orarioStato', 'orarioStato2'].forEach(function (id) {
      var el = document.getElementById(id);
      if (!el) return;
      if (el !== primo) el.textContent = primo.textContent;
      el.classList.toggle('is-aperto', aperto);
    });
  }
  copiaStato();
  setInterval(copiaStato, 60000);
  new MutationObserver(copiaStato).observe(root, { attributes: true, attributeFilter: ['lang'] });

  if (figuraV && svgV && pagnotta && cotta && lama && TG.A.incisione && TG.B.incisione && strati[0].length) {
    try { clearTimeout(window.__attesaInfornata); } catch (e) {}
    window.__infornata = {
      stato: function () { return { fase: faseV, trasformazione: pagnotta.style.transform || '' }; },
      tempi: TP,
    };
    var daFare = !reducedMotion && root.classList.contains('firma-attesa');
    /* la pagina aperta su una rubrica (#pane): il browser ci scorre dopo, la firma non si vedrebbe */
    var ancora = location.hash && location.hash.length > 1 && location.hash !== '#inizio';
    var inVista = inVistaVignetta();
    /* perché la firma è partita o no (lo legge il check) */
    window.__infornata.avvio = { daFare: daFare, ancora: !!ancora, inVista: inVista, top: svgV.getBoundingClientRect().top, vh: window.innerHeight };
    if (!daFare || ancora || !inVista) chiudiInfornata();
    else avviaInfornata();
    /* un resize chiude la firma solo se cambia la LARGHEZZA (sul telefono arrivano resize della sola altezza, #228) */
    window.addEventListener('resize', function () { if (faseV === 'corre' && Math.abs(window.innerWidth - larghezzaAvvio) > 1) chiudiInfornata(); });
    if (rifai) rifai.addEventListener('click', function () { if (faseV === 'fatta' && !reducedMotion) avviaInfornata(); });
  }
})();
