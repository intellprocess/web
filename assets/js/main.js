/* ============================================================
   IntellProcess Group — site behaviour
   ============================================================ */
(function () {
  'use strict';

  /* ── Locale ────────────────────────────────────────────── */
  var isFA = /^fa/i.test(document.documentElement.lang || 'en');
  var T = isFA
    ? { enquire: 'درخواست مشاوره درباره این ', service: 'خدمت', course: 'دوره' }
    : { enquire: 'Enquire about this ', service: 'service', course: 'course' };

  function localizeNumber(n) {
    var s = String(n);
    return isFA ? s.replace(/\d/g, function (d) { return '۰۱۲۳۴۵۶۷۸۹'[d]; }) : s;
  }

  /* ── Mobile navigation ─────────────────────────────────── */
  var nav = document.getElementById('nav');
  var toggle = document.getElementById('navToggle');

  function closeNav() {
    nav.classList.remove('is-open');
    toggle.setAttribute('aria-expanded', 'false');
  }

  toggle.addEventListener('click', function () {
    var open = nav.classList.toggle('is-open');
    toggle.setAttribute('aria-expanded', String(open));
  });

  nav.addEventListener('click', function (e) {
    if (e.target.tagName === 'A') closeNav();
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeNav();
  });

  /* ── Header shadow on scroll ───────────────────────────── */
  var header = document.querySelector('.header');
  function onScroll() {
    header.classList.toggle('is-stuck', window.scrollY > 8);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ── Reveal on scroll ──────────────────────────────────── */
  var reveals = document.querySelectorAll('.reveal');

  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry, i) {
        if (!entry.isIntersecting) return;
        var el = entry.target;
        // stagger siblings a little so grids cascade
        setTimeout(function () { el.classList.add('is-in'); }, Math.min(i * 70, 280));
        io.unobserve(el);
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });

    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add('is-in'); });
  }

  /* ── Course filtering ──────────────────────────────────── */
  var filterBar = document.getElementById('filters');
  var courses = Array.prototype.slice.call(
    document.querySelectorAll('#courseGrid .course')
  );

  filterBar.addEventListener('click', function (e) {
    var chip = e.target.closest('.chip');
    if (!chip) return;

    filterBar.querySelectorAll('.chip').forEach(function (c) { c.classList.remove('is-active'); });
    chip.classList.add('is-active');

    var filter = chip.dataset.filter;
    courses.forEach(function (card) {
      var show = filter === 'all' || card.dataset.cat === filter;
      card.classList.toggle('is-hidden', !show);
    });
  });

  /* ── Course + service detail modal ─────────────────────── */
  var modal = document.getElementById('modal');
  var modalContent = document.getElementById('modalContent');
  var lastFocused = null;

  function openModal(card) {
    lastFocused = document.activeElement;

    var head = card.querySelector('.course__head').cloneNode(true);
    var meta = card.querySelector('.course__meta').cloneNode(true);
    var body = card.querySelector('.course__body').cloneNode(true);
    var extras = card.querySelectorAll('.apps');

    var html = '';
    html += '<div class="course__head">' + head.innerHTML + '</div>';
    html += '<div class="course__meta">' + meta.innerHTML + '</div>';
    html += '<div class="course__body">' + body.innerHTML + '</div>';
    extras.forEach(function (x) { html += x.outerHTML; });

    var kind = card.dataset.kind === 'service' ? T.service : T.course;
    html += '<p style="margin-top:26px"><a class="btn btn--primary" href="#contact" data-close>' + T.enquire + kind + '</a></p>';

    modalContent.innerHTML = html;
    modal.hidden = false;
    document.body.style.overflow = 'hidden';
    modal.querySelector('.modal__close').focus();
  }

  function closeModal() {
    modal.hidden = true;
    modalContent.innerHTML = '';
    document.body.style.overflow = '';
    if (lastFocused) lastFocused.focus();
  }

  var detailCards = document.querySelectorAll('#courseGrid .course, #serviceGrid .course');

  detailCards.forEach(function (card) {
    var btn = card.querySelector('.course__more');
    if (btn) btn.addEventListener('click', function () { openModal(card); });
  });

  modal.addEventListener('click', function (e) {
    var closer = e.target.closest('[data-close]');
    if (!closer) return;
    // the "enquire" link closes the modal but must still navigate to #contact
    if (closer.tagName === 'A') { closeModal(); return; }
    e.preventDefault();
    closeModal();
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && !modal.hidden) closeModal();
  });

  /* ── Footer year ───────────────────────────────────────── */
  var yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = localizeNumber(new Date().getFullYear());
})();
