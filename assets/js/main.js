/* =========================================================================
   Dra. Michelle Sousa — main.js
   Navegação avançada, microinterações e inicialização de bibliotecas
   ========================================================================= */
(function () {
  "use strict";

  document.addEventListener("DOMContentLoaded", init);

  function init() {
    setYear();
    initAOS();
    initSwiper();
    initHeaderScroll();
    initScrollProgress();
    initMobileMenu();
    initScrollSpy();
    initSmoothAnchors();
    initCounters();
    initMagneticButtons();
    initCustomCursor();
    initBackToTop();
    initScrollCue();
  }

  /* -------- Ano do rodapé -------- */
  function setYear() {
    var el = document.getElementById("year");
    if (el) el.textContent = new Date().getFullYear();
  }

  /* -------- AOS (Animate On Scroll) -------- */
  function initAOS() {
    if (window.AOS) {
      window.AOS.init({
        duration: 700,
        easing: "ease-out-cubic",
        once: true,
        offset: 60,
      });
    }
  }

  /* -------- Swiper (carrossel da galeria) -------- */
  function initSwiper() {
    if (window.Swiper) {
      new window.Swiper(".gallerySwiper", {
        slidesPerView: 1.15,
        spaceBetween: 22,
        centeredSlides: false,
        loop: true,
        autoplay: { delay: 4200, disableOnInteraction: false },
        pagination: { el: ".swiper-pagination", clickable: true },
        navigation: { nextEl: ".swiper-button-next", prevEl: ".swiper-button-prev" },
        breakpoints: {
          640: { slidesPerView: 2.2, spaceBetween: 24 },
          1000: { slidesPerView: 3.2, spaceBetween: 28 },
        },
      });
    }
  }

  /* -------- Header muda de estado ao rolar -------- */
  function initHeaderScroll() {
    var header = document.getElementById("siteHeader");
    if (!header) return;
    var onScroll = function () {
      if (window.scrollY > 60) header.classList.add("is-scrolled");
      else header.classList.remove("is-scrolled");
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  /* -------- Barra de progresso de leitura -------- */
  function initScrollProgress() {
    var bar = document.getElementById("scrollProgressBar");
    if (!bar) return;
    var update = function () {
      var doc = document.documentElement;
      var scrollTop = doc.scrollTop || document.body.scrollTop;
      var height = doc.scrollHeight - doc.clientHeight;
      var pct = height > 0 ? (scrollTop / height) * 100 : 0;
      bar.style.width = pct + "%";
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
  }

  /* -------- Menu mobile fullscreen -------- */
  function initMobileMenu() {
    var btn = document.getElementById("hamburgerBtn");
    var menu = document.getElementById("mobileMenu");
    var overlay = document.getElementById("mobileOverlay");
    var closeBtn = document.getElementById("mobileMenuClose");
    if (!btn || !menu || !overlay) return;

    function open() {
      menu.classList.add("is-open");
      overlay.classList.add("is-open");
      btn.setAttribute("aria-expanded", "true");
      document.body.style.overflow = "hidden";
    }
    function close() {
      menu.classList.remove("is-open");
      overlay.classList.remove("is-open");
      btn.setAttribute("aria-expanded", "false");
      document.body.style.overflow = "";
    }

    btn.addEventListener("click", function () {
      menu.classList.contains("is-open") ? close() : open();
    });
    closeBtn && closeBtn.addEventListener("click", close);
    overlay.addEventListener("click", close);
    menu.querySelectorAll(".mobile-link").forEach(function (link) {
      link.addEventListener("click", close);
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") close();
    });
  }

  /* -------- Scrollspy: nav principal + rail lateral -------- */
  function initScrollSpy() {
    var sections = Array.prototype.slice.call(document.querySelectorAll("main section[id], header, #hero"));
    var ids = ["inicio", "sobre", "tratamentos", "sorrisos", "depoimentos", "contato"];
    var targets = ids
      .map(function (id) { return document.getElementById(id); })
      .filter(Boolean);

    var navLinks = document.querySelectorAll(".nav-link");
    var railDots = document.querySelectorAll(".rail-dot");

    if (!targets.length) return;

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            var id = entry.target.getAttribute("id");
            setActive(id);
          }
        });
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: 0 }
    );

    targets.forEach(function (t) { observer.observe(t); });

    function setActive(id) {
      navLinks.forEach(function (l) {
        l.classList.toggle("active", l.dataset.section === id);
      });
      railDots.forEach(function (d) {
        d.classList.toggle("active", d.dataset.target === id);
      });
    }

    railDots.forEach(function (dot) {
      dot.addEventListener("click", function () {
        var target = document.getElementById(dot.dataset.target);
        if (target) scrollToEl(target);
      });
    });
  }

  /* -------- Scroll suave para âncoras -------- */
  function initSmoothAnchors() {
    document.querySelectorAll('a[href^="#"]').forEach(function (link) {
      link.addEventListener("click", function (e) {
        var hash = link.getAttribute("href");
        if (!hash || hash === "#") return;
        var target = document.querySelector(hash);
        if (!target) return;
        e.preventDefault();
        scrollToEl(target);
      });
    });
  }

  function scrollToEl(target) {
    var headerOffset = 88;
    var y = target.getBoundingClientRect().top + window.pageYOffset - headerOffset;
    window.scrollTo({ top: y, behavior: "smooth" });
  }

  /* -------- Contadores animados (estatísticas do hero) -------- */
  function initCounters() {
    var counters = document.querySelectorAll(".stat__num");
    if (!counters.length) return;

    var animate = function (el) {
      var target = parseInt(el.getAttribute("data-count"), 10) || 0;
      var duration = 1600;
      var start = null;

      function step(ts) {
        if (!start) start = ts;
        var progress = Math.min((ts - start) / duration, 1);
        var eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.floor(eased * target);
        if (progress < 1) requestAnimationFrame(step);
        else el.textContent = target;
      }
      requestAnimationFrame(step);
    };

    var observer = new IntersectionObserver(
      function (entries, obs) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            animate(entry.target);
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.6 }
    );
    counters.forEach(function (c) { observer.observe(c); });
  }

  /* -------- Botões magnéticos -------- */
  function initMagneticButtons() {
    var buttons = document.querySelectorAll(".magnetic");
    if (!buttons.length || matchMedia("(pointer: coarse)").matches) return;

    buttons.forEach(function (btn) {
      btn.addEventListener("mousemove", function (e) {
        var rect = btn.getBoundingClientRect();
        var x = e.clientX - rect.left - rect.width / 2;
        var y = e.clientY - rect.top - rect.height / 2;
        btn.style.transform = "translate(" + x * 0.22 + "px," + y * 0.35 + "px)";
      });
      btn.addEventListener("mouseleave", function () {
        btn.style.transform = "translate(0,0)";
      });
    });
  }

  /* -------- Cursor customizado -------- */
  function initCustomCursor() {
    if (matchMedia("(pointer: coarse)").matches) return;
    var dot = document.getElementById("cursorDot");
    var ring = document.getElementById("cursorRing");
    if (!dot || !ring) return;

    var mouseX = 0, mouseY = 0, ringX = 0, ringY = 0;

    window.addEventListener("mousemove", function (e) {
      mouseX = e.clientX;
      mouseY = e.clientY;
      dot.style.left = mouseX + "px";
      dot.style.top = mouseY + "px";
    });

    (function loop() {
      ringX += (mouseX - ringX) * 0.16;
      ringY += (mouseY - ringY) * 0.16;
      ring.style.left = ringX + "px";
      ring.style.top = ringY + "px";
      requestAnimationFrame(loop);
    })();

    document.querySelectorAll("a, button").forEach(function (el) {
      el.addEventListener("mouseenter", function () { ring.classList.add("is-active"); });
      el.addEventListener("mouseleave", function () { ring.classList.remove("is-active"); });
    });
  }

  /* -------- Botão voltar ao topo -------- */
  function initBackToTop() {
    var btn = document.getElementById("backToTop");
    if (!btn) return;
    window.addEventListener(
      "scroll",
      function () {
        btn.classList.toggle("is-visible", window.scrollY > 700);
      },
      { passive: true }
    );
    btn.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  /* -------- Indicador de rolar (hero) -------- */
  function initScrollCue() {
    var cue = document.getElementById("scrollCue");
    if (!cue) return;
    cue.addEventListener("click", function () {
      var about = document.getElementById("sobre");
      if (about) scrollToEl(about);
    });
  }
})();
