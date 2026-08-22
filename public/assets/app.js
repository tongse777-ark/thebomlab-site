/* 더봄교육디자인연구소 — 인터랙션 */
(function () {
  'use strict';

  var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* 올해 연도 */
  var yr = document.getElementById('yr');
  if (yr) yr.textContent = new Date().getFullYear();

  /* 헤더 그림자 */
  var nav = document.getElementById('nav');
  function onScroll() {
    nav.classList.toggle('is-stuck', window.scrollY > 8);
  }
  addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* 모바일 메뉴 */
  var burger = document.getElementById('burger');
  var mobile = document.getElementById('mobile');
  function closeMenu() {
    mobile.hidden = true;
    burger.setAttribute('aria-expanded', 'false');
    burger.setAttribute('aria-label', '메뉴 열기');
  }
  burger.addEventListener('click', function () {
    var open = burger.getAttribute('aria-expanded') === 'true';
    if (open) return closeMenu();
    mobile.hidden = false;
    burger.setAttribute('aria-expanded', 'true');
    burger.setAttribute('aria-label', '메뉴 닫기');
  });
  mobile.addEventListener('click', function (e) {
    if (e.target.tagName === 'A') closeMenu();
  });
  addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeMenu();
  });

  /* 프로그램 필터 */
  var chips = [].slice.call(document.querySelectorAll('.chip'));
  var cards = [].slice.call(document.querySelectorAll('.card'));
  var empty = document.getElementById('empty');

  chips.forEach(function (chip) {
    chip.addEventListener('click', function () {
      var key = chip.dataset.filter;

      chips.forEach(function (c) {
        var on = c === chip;
        c.classList.toggle('is-on', on);
        c.setAttribute('aria-selected', on ? 'true' : 'false');
      });

      var shown = 0;
      cards.forEach(function (card) {
        var cats = (card.dataset.cat || '').split(/\s+/);
        var hit = key === 'all' || cats.indexOf(key) !== -1;
        card.classList.toggle('is-hidden', !hit);
        if (hit) shown++;
      });
      empty.hidden = shown > 0;
    });
  });

  /* 스크롤 등장 */
  var targets = [].slice.call(document.querySelectorAll('.reveal'));
  if (reduce || !('IntersectionObserver' in window)) {
    targets.forEach(function (el) { el.classList.add('is-in'); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        en.target.classList.add('is-in');
        io.unobserve(en.target);
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });

    targets.forEach(function (el, i) {
      el.style.transitionDelay = Math.min(i % 6, 5) * 60 + 'ms';
      io.observe(el);
    });

    /* 안전장치 — 관찰이 어떤 이유로든 안 걸리면 내용이 영영 안 보이므로 */
    setTimeout(function () {
      targets.forEach(function (el) { el.classList.add('is-in'); });
    }, 1600);
  }

  /* 숫자 카운트업 */
  var nums = [].slice.call(document.querySelectorAll('[data-count]'));
  function runCount(el) {
    var end = parseInt(el.dataset.count, 10);
    if (reduce) { el.textContent = end.toLocaleString('ko-KR'); return; }
    var dur = 1100, t0 = null;
    function step(ts) {
      if (t0 === null) t0 = ts;
      var p = Math.min((ts - t0) / dur, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(end * eased).toLocaleString('ko-KR');
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }
  if ('IntersectionObserver' in window) {
    var io2 = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        runCount(en.target);
        io2.unobserve(en.target);
      });
    }, { threshold: 0.5 });
    nums.forEach(function (el) { io2.observe(el); });
  } else {
    nums.forEach(runCount);
  }
})();
