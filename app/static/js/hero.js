/* =========================================
   HOMIX HERO SLIDER
========================================= */

document.addEventListener("DOMContentLoaded", () => {

    const slider = document.getElementById("home");

    if (!slider) return;


    const slides = slider.querySelectorAll(".hero-slide");

    const prevButton = document.getElementById("heroPrev");

    const nextButton = document.getElementById("heroNext");

    const dotsContainer = document.getElementById("heroDots");

    const progressBar = document.getElementById("heroProgress");


    /* =========================================
       SETTINGS
    ========================================= */

    const AUTOPLAY_TIME = 5000;

    let currentSlide = 0;

    let autoplayTimer;

    let progressTimer;

    let isPaused = false;


    /* =========================================
       CREATE DOTS
    ========================================= */

    slides.forEach((slide, index) => {

        const dot = document.createElement("button");

        dot.classList.add("hero-dot");

        dot.setAttribute(
            "aria-label",
            `رفتن به اسلاید ${index + 1}`
        );

        if (index === 0) {
            dot.classList.add("active");
        }

        dot.addEventListener("click", () => {

            goToSlide(index);

            restartAutoplay();

        });

        dotsContainer.appendChild(dot);

    });


    const dots = dotsContainer.querySelectorAll(".hero-dot");


    /* =========================================
       SHOW SLIDE
    ========================================= */

    function goToSlide(index) {

        if (index < 0) {
            index = slides.length - 1;
        }

        if (index >= slides.length) {
            index = 0;
        }


        slides.forEach((slide) => {
            slide.classList.remove("active");
        });


        dots.forEach((dot) => {
            dot.classList.remove("active");
        });


        slides[index].classList.add("active");

        dots[index].classList.add("active");


        currentSlide = index;


        startProgress();

    }


    /* =========================================
       NEXT
    ========================================= */

    function nextSlide() {

        goToSlide(currentSlide + 1);

    }


    /* =========================================
       PREVIOUS
    ========================================= */

    function previousSlide() {

        goToSlide(currentSlide - 1);

    }


    /* =========================================
       BUTTON EVENTS
    ========================================= */

    nextButton.addEventListener(
        "click",
        () => {

            nextSlide();

            restartAutoplay();

        }
    );


    prevButton.addEventListener(
        "click",
        () => {

            previousSlide();

            restartAutoplay();

        }
    );


    /* =========================================
       AUTOPLAY
    ========================================= */

    function startAutoplay() {

        clearInterval(autoplayTimer);

        autoplayTimer = setInterval(() => {

            if (!isPaused) {
                nextSlide();
            }

        }, AUTOPLAY_TIME);

    }


    function restartAutoplay() {

        clearInterval(autoplayTimer);

        startAutoplay();

    }


    /* =========================================
       PROGRESS BAR
    ========================================= */

    function startProgress() {

        progressBar.style.transition = "none";

        progressBar.style.width = "0%";


        requestAnimationFrame(() => {

            requestAnimationFrame(() => {

                progressBar.style.transition =
                    `width ${AUTOPLAY_TIME}ms linear`;

                progressBar.style.width = "100%";

            });

        });

    }


    /* =========================================
       PAUSE ON HOVER
    ========================================= */

    slider.addEventListener(
        "mouseenter",
        () => {

            isPaused = true;

        }
    );


    slider.addEventListener(
        "mouseleave",
        () => {

            isPaused = false;

        }
    );


    /* =========================================
       KEYBOARD CONTROL
    ========================================= */

    slider.addEventListener(
        "keydown",
        (event) => {

            if (event.key === "ArrowRight") {

                previousSlide();

                restartAutoplay();

            }


            if (event.key === "ArrowLeft") {

                nextSlide();

                restartAutoplay();

            }

        }
    );


    slider.setAttribute(
        "tabindex",
        "0"
    );


    /* =========================================
       TOUCH / SWIPE
    ========================================= */

    let touchStartX = 0;

    let touchEndX = 0;


    slider.addEventListener(
        "touchstart",
        (event) => {

            touchStartX =
                event.changedTouches[0].screenX;

        },
        { passive: true }
    );


    slider.addEventListener(
        "touchend",
        (event) => {

            touchEndX =
                event.changedTouches[0].screenX;

            handleSwipe();

        },
        { passive: true }
    );


    function handleSwipe() {

        const swipeDistance =
            touchStartX - touchEndX;


        if (Math.abs(swipeDistance) < 50) {
            return;
        }


        /*
         * چون سایت RTL است:
         */

        if (swipeDistance > 0) {

            nextSlide();

        } else {

            previousSlide();

        }


        restartAutoplay();

    }


    /* =========================================
       INITIALIZE
    ========================================= */

    goToSlide(0);

    startAutoplay();

});