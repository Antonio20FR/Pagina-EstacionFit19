/**
 * =============================================================
 * ESTACIÓN FIT 19 — main.js
 * =============================================================
 * Funcionalidades:
 * 01. Menú de navegación móvil.
 * 02. Cierre del menú y resaltado de la sección visible.
 * 03. Carrusel automático de imágenes en el inicio.
 * 04. Carrusel de instalaciones (flechas, puntos y gestos táctiles).
 *
 * No requiere librerías externas.
 * Todas las funciones se inicializan cuando el DOM está listo.
 * =============================================================
 */

"use strict";

document.addEventListener("DOMContentLoaded", () => {
    /* =========================================================
       01. NAVEGACIÓN Y MENÚ MÓVIL
    ========================================================= */
    const menuButton = document.getElementById("menu-toggle");
    const menu = document.getElementById("nav-links");
    const navLinks = document.querySelectorAll(".nav-links a");
    const sections = document.querySelectorAll("section[id]");

    /** Abre o cierra el menú y sincroniza el ícono y aria-expanded. */
    function setMenuOpen(isOpen) {
        if (!menu || !menuButton) return;

        menu.classList.toggle("active", isOpen);
        menuButton.setAttribute("aria-expanded", String(isOpen));

        const icon = menuButton.querySelector("i");
        if (icon) {
            icon.classList.toggle("fa-bars", !isOpen);
            icon.classList.toggle("fa-xmark", isOpen);
        }
    }

    /** Cierra el menú cuando se navega a otra sección. */
    function closeMenu() {
        setMenuOpen(false);
    }

    if (menu && menuButton) {
        menuButton.addEventListener("click", () => {
            setMenuOpen(!menu.classList.contains("active"));
        });

        navLinks.forEach(link => link.addEventListener("click", closeMenu));

        // Cierra el menú al hacer clic fuera del área de navegación.
        document.addEventListener("click", event => {
            if (!menu.contains(event.target) &&
                !menuButton.contains(event.target)) {
                closeMenu();
            }
        });

        // Al pasar a escritorio, evita que el menú móvil siga abierto.
        window.addEventListener("resize", () => {
            if (window.innerWidth > 900) closeMenu();
        });
    }

    /* =========================================================
       02. ENLACE ACTIVO SEGÚN LA POSICIÓN DE DESPLAZAMIENTO
    ========================================================= */

    /** Resalta en la navegación la última sección alcanzada. */
    function updateActiveSection() {
        let activeId = "inicio";

        sections.forEach(section => {
            if (window.scrollY >= section.offsetTop - 160) {
                activeId = section.id;
            }
        });

        navLinks.forEach(link => {
            link.classList.toggle(
                "active",
                link.getAttribute("href") === `#${activeId}`
            );
        });
    }

    window.addEventListener("scroll", updateActiveSection, { passive: true });
    updateActiveSection();

    /* =========================================================
       03. CARRUSEL AUTOMÁTICO DE LA PORTADA
    ========================================================= */
    const heroSlides = [...document.querySelectorAll("#inicio .hero-slide-bg")];
    const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    ).matches;

    let currentHeroIndex = 0;

    /** Activa una fotografía y oculta las demás en el inicio. */
    function showHeroSlide(index) {
        if (!heroSlides.length) return;

        currentHeroIndex = (index + heroSlides.length) % heroSlides.length;
        heroSlides.forEach((slide, i) => {
            slide.classList.toggle("active", i === currentHeroIndex);
        });
    }

    if (heroSlides.length) showHeroSlide(0);

    if (heroSlides.length > 1 && !prefersReducedMotion) {
        window.setInterval(() => {
            showHeroSlide(currentHeroIndex + 1);
        }, 5000);
    }

    /* =========================================================
       04. CARRUSEL DE INSTALACIONES
    ========================================================= */
    const carousel = document.getElementById("gym-carousel");
    if (!carousel) return;

    const slides = [...carousel.querySelectorAll(".carousel-slide")];
    const dots = [...carousel.querySelectorAll(".carousel-dot")];
    const previousButton = carousel.querySelector("#carousel-prev");
    const nextButton = carousel.querySelector("#carousel-next");
    const counter = carousel.querySelector("#carousel-current");

    if (!slides.length) return;

    let currentSlideIndex = 0;
    let autoplayTimer = null;
    let touchStartX = 0;

    /** Muestra una fotografía, actualiza indicadores y contador. */
    function showSlide(index) {
        currentSlideIndex = (index + slides.length) % slides.length;

        slides.forEach((slide, i) => {
            slide.classList.toggle("active", i === currentSlideIndex);
        });

        dots.forEach((dot, i) => {
            const selected = i === currentSlideIndex;
            dot.classList.toggle("active", selected);
            dot.setAttribute("aria-current", String(selected));
        });

        if (counter) {
            counter.textContent = String(currentSlideIndex + 1).padStart(2, "0");
        }
    }

    /** Detiene el cambio automático para evitar temporizadores duplicados. */
    function stopAutoplay() {
        if (autoplayTimer !== null) {
            window.clearInterval(autoplayTimer);
            autoplayTimer = null;
        }
    }

    /** Inicia el cambio de imágenes cada cinco segundos. */
    function startAutoplay() {
        stopAutoplay();

        if (slides.length < 2 || prefersReducedMotion) return;

        autoplayTimer = window.setInterval(() => {
            showSlide(currentSlideIndex + 1);
        }, 5000);
    }

    /** Avanza o retrocede una fotografía y reinicia el temporizador. */
    function moveSlide(direction) {
        showSlide(currentSlideIndex + direction);
        startAutoplay();
    }

    // Flechas de navegación.
    if (nextButton) {
        nextButton.addEventListener("click", () => moveSlide(1));
    }

    if (previousButton) {
        previousButton.addEventListener("click", () => moveSlide(-1));
    }

    // Indicadores inferiores (puntos).
    dots.forEach((dot, i) => {
        dot.addEventListener("click", () => {
            showSlide(i);
            startAutoplay();
        });
    });

    // En computadora, se detiene al pasar el cursor por encima.
    carousel.addEventListener("mouseenter", stopAutoplay);
    carousel.addEventListener("mouseleave", startAutoplay);

    // Deslizar con el dedo en celulares y tablets.
    carousel.addEventListener("touchstart", event => {
        touchStartX = event.changedTouches[0].screenX;
    }, { passive: true });

    carousel.addEventListener("touchend", event => {
        const touchEndX = event.changedTouches[0].screenX;
        const difference = touchStartX - touchEndX;

        // Ignora gestos demasiado pequeños.
        if (Math.abs(difference) < 50) return;

        moveSlide(difference > 0 ? 1 : -1);
    }, { passive: true });

    // Estado inicial del carrusel de instalaciones.
    showSlide(0);
    startAutoplay();
});
