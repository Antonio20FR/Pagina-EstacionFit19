/* =========================================================
   ESTACIÓN FIT 19
   main.js
========================================================= */


const menuToggle =
    document.getElementById("menu-toggle");

const navLinks =
    document.getElementById("nav-links");

const navItems =
    document.querySelectorAll(".nav-links a");

const sections =
    document.querySelectorAll("section[id]");


/* =========================================================
   ABRIR / CERRAR MENÚ MÓVIL
========================================================= */

menuToggle.addEventListener("click", () => {

    navLinks.classList.toggle("active");

    const icon =
        menuToggle.querySelector("i");


    if (navLinks.classList.contains("active")) {

        icon.classList.remove("fa-bars");

        icon.classList.add("fa-xmark");

    } else {

        icon.classList.remove("fa-xmark");

        icon.classList.add("fa-bars");

    }

});


/* =========================================================
   FUNCIÓN PARA CERRAR MENÚ
========================================================= */

function closeMenu() {

    navLinks.classList.remove("active");

    const icon =
        menuToggle.querySelector("i");

    icon.classList.remove("fa-xmark");

    icon.classList.add("fa-bars");

}


/* =========================================================
   CERRAR MENÚ AL SELECCIONAR UNA OPCIÓN
========================================================= */

navItems.forEach(link => {

    link.addEventListener("click", () => {

        closeMenu();

    });

});


/* =========================================================
   CERRAR MENÚ AL HACER CLIC FUERA
========================================================= */

document.addEventListener("click", (event) => {

    const clickedInsideMenu =
        navLinks.contains(event.target);

    const clickedMenuButton =
        menuToggle.contains(event.target);


    if (
        navLinks.classList.contains("active") &&
        !clickedInsideMenu &&
        !clickedMenuButton
    ) {

        closeMenu();

    }

});


/* =========================================================
   CERRAR MENÚ AL VOLVER A ESCRITORIO
========================================================= */

window.addEventListener("resize", () => {

    if (window.innerWidth > 900) {

        closeMenu();

    }

});


/* =========================================================
   MARCAR SECCIÓN ACTIVA
========================================================= */

function updateActiveSection() {

    let currentSection = "";


    sections.forEach(section => {

        const sectionTop =
            section.offsetTop - 160;

        const sectionHeight =
            section.offsetHeight;


        if (
            window.scrollY >= sectionTop &&
            window.scrollY <
            sectionTop + sectionHeight
        ) {

            currentSection =
                section.getAttribute("id");

        }

    });


    navItems.forEach(link => {

        link.classList.remove("active");


        if (
            link.getAttribute("href") ===
            `#${currentSection}`
        ) {

            link.classList.add("active");

        }

    });

}


window.addEventListener(
    "scroll",
    updateActiveSection
);


updateActiveSection();

/* =========================================================
   CARRUSEL DE INSTALACIONES
========================================================= */

const carousel =
    document.getElementById("gym-carousel");

const slides =
    document.querySelectorAll(".carousel-slide");

const dots =
    document.querySelectorAll(".carousel-dot");

const prevButton =
    document.getElementById("carousel-prev");

const nextButton =
    document.getElementById("carousel-next");

const currentCounter =
    document.getElementById("carousel-current");


let currentSlide = 0;

let carouselInterval;


/* =========================================================
   MOSTRAR SLIDE
========================================================= */

function showSlide(index) {

    if (index >= slides.length) {
        currentSlide = 0;
    }

    else if (index < 0) {
        currentSlide = slides.length - 1;
    }

    else {
        currentSlide = index;
    }


    slides.forEach(slide => {

        slide.classList.remove("active");

    });


    dots.forEach(dot => {

        dot.classList.remove("active");

    });


    slides[currentSlide].classList.add("active");

    dots[currentSlide].classList.add("active");


    currentCounter.textContent =
        String(currentSlide + 1).padStart(2, "0");

}


/* =========================================================
   SIGUIENTE
========================================================= */

function nextSlide() {

    showSlide(currentSlide + 1);

}


/* =========================================================
   ANTERIOR
========================================================= */

function previousSlide() {

    showSlide(currentSlide - 1);

}


/* =========================================================
   AUTOPLAY
========================================================= */

function startCarousel() {

    carouselInterval =
        setInterval(() => {

            nextSlide();

        }, 5000);

}


function resetCarousel() {

    clearInterval(carouselInterval);

    startCarousel();

}


/* =========================================================
   BOTONES
========================================================= */

nextButton.addEventListener("click", () => {

    nextSlide();

    resetCarousel();

});


prevButton.addEventListener("click", () => {

    previousSlide();

    resetCarousel();

});


/* =========================================================
   INDICADORES
========================================================= */

dots.forEach((dot, index) => {

    dot.addEventListener("click", () => {

        showSlide(index);

        resetCarousel();

    });

});


/* =========================================================
   PAUSAR CUANDO EL MOUSE ESTÁ SOBRE EL CARRUSEL
========================================================= */

carousel.addEventListener("mouseenter", () => {

    clearInterval(carouselInterval);

});


carousel.addEventListener("mouseleave", () => {

    startCarousel();

});


/* =========================================================
   DESLIZAR CON EL DEDO EN CELULAR
========================================================= */

let touchStartX = 0;

let touchEndX = 0;


carousel.addEventListener(
    "touchstart",
    (event) => {

        touchStartX =
            event.changedTouches[0].screenX;

    },
    { passive: true }
);


carousel.addEventListener(
    "touchend",
    (event) => {

        touchEndX =
            event.changedTouches[0].screenX;


        const difference =
            touchStartX - touchEndX;


        if (Math.abs(difference) < 50) {
            return;
        }


        if (difference > 0) {

            nextSlide();

        }

        else {

            previousSlide();

        }


        resetCarousel();

    },
    { passive: true }
);


/* =========================================================
   INICIAR
========================================================= */

showSlide(0);

startCarousel();