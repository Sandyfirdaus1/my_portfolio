/* ===================================================================
 * Luther 1.0.0 - Main JS
 *
 * ------------------------------------------------------------------- */

(function (html) {
  "use strict";

  html.className = html.className.replace(/\bno-js\b/g, "") + " js ";

  /* Animations
   * -------------------------------------------------- */
  const tl = anime
    .timeline({
      easing: "easeInOutCubic",
      duration: 800,
      autoplay: false,
    })
    .add({
      targets: "#loader",
      opacity: 0,
      duration: 1000,
      begin: function (anim) {
        window.scrollTo(0, 0);
      },
    })
    .add({
      targets: "#preloader",
      opacity: 0,
      complete: function (anim) {
        document.querySelector("#preloader").style.visibility = "hidden";
        document.querySelector("#preloader").style.display = "none";
      },
    })
    .add(
      {
        targets: ".s-header",
        translateY: [-100, 0],
        opacity: [0, 1],
      },
      "-=200"
    )
    .add({
      targets: [".s-intro .text-pretitle", ".s-intro .text-huge-title"],
      translateX: [100, 0],
      opacity: [0, 1],
      delay: anime.stagger(400),
    })
    .add({
      targets: ".circles span",
      keyframes: [
        { opacity: [0, 0.3], scale: [0.8, 1] },
        {
          opacity: [0.3, 0.1],
          scale: [1, 1.1],
          delay: anime.stagger(100, { direction: "reverse" }),
        },
      ],
      delay: anime.stagger(100, { direction: "reverse" }),
    })
    .add({
      targets: ".circles span",
      rotate: [-180, 0],
      duration: 2000,
      easing: "easeInOutQuad",
    }, "-=1800")
    .add({
      targets: ".intro-social li",
      translateX: [-50, 0],
      opacity: [0, 1],
      delay: anime.stagger(100, { direction: "reverse" }),
    })
    .add(
      {
        targets: ".intro-scrolldown",
        translateY: [100, 0],
        opacity: [0, 1],
      },
      "-=800"
    );

  /* Preloader
   * -------------------------------------------------- */
  const ssPreloader = function () {
    const preloader = document.querySelector("#preloader");
    if (!preloader) return;

    window.addEventListener("load", function () {
      document.querySelector("html").classList.remove("ss-preload");
      document.querySelector("html").classList.add("ss-loaded");

      document.querySelectorAll(".ss-animated").forEach(function (item) {
        item.classList.remove("ss-animated");
      });

      tl.play();
    });

    // force page scroll position to top at page refresh
    // window.addEventListener('beforeunload' , function () {
    //     // window.scrollTo(0, 0);
    // });
  }; // end ssPreloader

  /* Mobile Menu
   * ---------------------------------------------------- */
  const ssMobileMenu = function () {
    const toggleButton = document.querySelector(".mobile-menu-toggle");
    const mainNavWrap = document.querySelector(".main-nav-wrap");
    const siteBody = document.querySelector("body");

    if (!(toggleButton && mainNavWrap)) return;

    toggleButton.addEventListener("click", function (event) {
      event.preventDefault();
      toggleButton.classList.toggle("is-clicked");
      siteBody.classList.toggle("menu-is-open");
    });

    mainNavWrap.querySelectorAll(".main-nav a").forEach(function (link) {
      link.addEventListener("click", function (event) {
        // at 800px and below
        if (window.matchMedia("(max-width: 800px)").matches) {
          toggleButton.classList.toggle("is-clicked");
          siteBody.classList.toggle("menu-is-open");
        }
      });
    });

    window.addEventListener("resize", function () {
      // above 800px
      if (window.matchMedia("(min-width: 801px)").matches) {
        if (siteBody.classList.contains("menu-is-open"))
          siteBody.classList.remove("menu-is-open");
        if (toggleButton.classList.contains("is-clicked"))
          toggleButton.classList.remove("is-clicked");
      }
    });
  }; // end ssMobileMenu

  /* Highlight active menu link on pagescroll
   * ------------------------------------------------------ */
  const ssScrollSpy = function () {
    const sections = document.querySelectorAll(".target-section");

    // Add an event listener listening for scroll
    window.addEventListener("scroll", navHighlight);

    function navHighlight() {
      // Get current scroll position
      let scrollY = window.pageYOffset;

      // Loop through sections to get height(including padding and border),
      // top and ID values for each
      sections.forEach(function (current) {
        const sectionHeight = current.offsetHeight;
        const sectionTop = current.offsetTop - 50;
        const sectionId = current.getAttribute("id");

        /* If our current scroll position enters the space where current section
         * on screen is, add .current class to parent element(li) of the thecorresponding
         * navigation link, else remove it. To know which link is active, we use
         * sectionId variable we are getting while looping through sections as
         * an selector
         */
        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
          document
            .querySelector(".main-nav a[href*=" + sectionId + "]")
            .parentNode.classList.add("current");
        } else {
          document
            .querySelector(".main-nav a[href*=" + sectionId + "]")
            .parentNode.classList.remove("current");
        }
      });
    }
  }; // end ssScrollSpy

  /* Animate elements if in viewport
   * ------------------------------------------------------ */
  const ssViewAnimate = function () {
    const blocks = document.querySelectorAll("[data-animate-block]");

    window.addEventListener("scroll", viewportAnimation);

    function viewportAnimation() {
      let scrollY = window.pageYOffset;

      blocks.forEach(function (current) {
        const viewportHeight = window.innerHeight;
        const triggerTop =
          current.offsetTop + viewportHeight * 0.2 - viewportHeight;
        const blockHeight = current.offsetHeight;
        const blockSpace = triggerTop + blockHeight;
        const inView = scrollY > triggerTop && scrollY <= blockSpace;
        const isAnimated = current.classList.contains("ss-animated");

        if (inView && !isAnimated) {
          anime({
            targets: current.querySelectorAll("[data-animate-el]"),
            opacity: [0, 1],
            translateY: [100, 0],
            translateX: [-30, 0],
            delay: anime.stagger(200, { start: 100 }),
            duration: 1000,
            easing: "easeOutExpo",
            begin: function (anim) {
              current.classList.add("ss-animated");
            },
          });
        }
      });
    }
  }; // end ssViewAnimate

  /* Swiper
   * ------------------------------------------------------ */
  const ssSwiper = function () {
    const containers = document.querySelectorAll(".swiper-container");
    if (window.Swiper && containers.length) {
      containers.forEach(function (container) {
        if (container.dataset.swiperInitialized) return;
        new Swiper(container, {
          slidesPerView: 1,
          pagination: false,
          navigation: {
            nextEl: container.querySelector(".swiper-button-next"),
            prevEl: container.querySelector(".swiper-button-prev"),
          },
          allowTouchMove: false,
          simulateTouch: false,
          loop: true,
          observer: true,
          observeParents: true,
          // disable breakpoints so it always 1 per view
        });
        container.dataset.swiperInitialized = "true";
      });
    }
  }; // end ssSwiper

  /* Lightbox
   * ------------------------------------------------------ */
  const ssLightbox = function () {
    const folioLinks = document.querySelectorAll(".folio-list__item-link");
    const modals = [];

    folioLinks.forEach(function (link) {
      let modalbox = link.getAttribute("href");
      let instance = basicLightbox.create(document.querySelector(modalbox), {
        onShow: function (instance) {
          //detect Escape key press
          document.addEventListener("keydown", function (event) {
            event = event || window.event;
            if (event.keyCode === 27) {
              instance.close();
            }
          });

          // initialize Swiper inside the opened modal (if not yet)
          if (window.Swiper) {
            instance
              .element()
              .querySelectorAll(".swiper-container")
              .forEach(function (container) {
                if (!container.dataset.swiperInitialized) {
                  var swiper = new Swiper(container, {
                    slidesPerView: 1,
                    pagination: false,
                    navigation: {
                      nextEl: container.querySelector(".swiper-button-next"),
                      prevEl: container.querySelector(".swiper-button-prev"),
                    },
                    allowTouchMove: false,
                    simulateTouch: false,
                    loop: true,
                    observer: true,
                    observeParents: true,
                  });
                  container.dataset.swiperInitialized = "true";
                  setTimeout(function () {
                    swiper.update();
                  }, 50);
                }
              });
          }
        },
      });
      modals.push(instance);
    });

    folioLinks.forEach(function (link, index) {
      link.addEventListener("click", function (event) {
        event.preventDefault();
        modals[index].show();
      });
    });
  }; // end ssLightbox

  /* Alert boxes
   * ------------------------------------------------------ */
  const ssAlertBoxes = function () {
    const boxes = document.querySelectorAll(".alert-box");

    boxes.forEach(function (box) {
      box.addEventListener("click", function (event) {
        if (event.target.matches(".alert-box__close")) {
          event.stopPropagation();
          event.target.parentElement.classList.add("hideit");

          setTimeout(function () {
            box.style.display = "none";
          }, 500);
        }
      });
    });
  }; // end ssAlertBoxes

  /* Smoothscroll
   * ------------------------------------------------------ */
  const ssMoveTo = function () {
    const easeFunctions = {
      easeInQuad: function (t, b, c, d) {
        t /= d;
        return c * t * t + b;
      },
      easeOutQuad: function (t, b, c, d) {
        t /= d;
        return -c * t * (t - 2) + b;
      },
      easeInOutQuad: function (t, b, c, d) {
        t /= d / 2;
        if (t < 1) return (c / 2) * t * t + b;
        t--;
        return (-c / 2) * (t * (t - 2) - 1) + b;
      },
      easeInOutCubic: function (t, b, c, d) {
        t /= d / 2;
        if (t < 1) return (c / 2) * t * t * t + b;
        t -= 2;
        return (c / 2) * (t * t * t + 2) + b;
      },
    };

    const triggers = document.querySelectorAll(".smoothscroll");

    const moveTo = new MoveTo(
      {
        tolerance: 0,
        duration: 1200,
        easing: "easeInOutCubic",
        container: window,
      },
      easeFunctions
    );

    triggers.forEach(function (trigger) {
      moveTo.registerTrigger(trigger);
    });
  }; // end ssMoveTo

  /* Parallax effect on scroll
   * ------------------------------------------------------ */
  const ssParallax = function () {
    const circles = document.querySelector(".circles");
    if (!circles) return;

    window.addEventListener("scroll", function () {
      const scrollY = window.pageYOffset;
      circles.style.transform = `translateY(${scrollY * 0.3}px) rotate(${scrollY * 0.05}deg)`;
    });
  }; // end ssParallax

  /* Mouse move effect for intro
   * ------------------------------------------------------ */
  const ssMouseMove = function () {
    const intro = document.querySelector(".s-intro");
    if (!intro) return;

    intro.addEventListener("mousemove", function (e) {
      const x = (e.clientX / window.innerWidth - 0.5) * 2;
      const y = (e.clientY / window.innerHeight - 0.5) * 2;
      
      anime({
        targets: ".circles span",
        translateX: x * 30,
        translateY: y * 30,
        rotate: x * 10,
        duration: 800,
        easing: "easeOutQuad",
      });
    });

    // Reset on mouse leave
    intro.addEventListener("mouseleave", function () {
      anime({
        targets: ".circles span",
        translateX: 0,
        translateY: 0,
        rotate: 0,
        duration: 1000,
        easing: "easeOutQuad",
      });
    });
  }; // end ssMouseMove

  /* Typing effect for intro title
   * ------------------------------------------------------ */
  const ssTyping = function () {
    const title = document.querySelector(".text-huge-title");
    if (!title) return;

    const text = title.innerHTML;
    title.innerHTML = "";
    
    anime({
      targets: title,
      innerHTML: [0, text.length],
      round: 1,
      easing: "easeInOutQuad",
      duration: 2000,
      update: function (anim) {
        title.innerHTML = text.substring(0, Math.round(anim.animations[0].currentValue));
      },
    });
  }; // end ssTyping

  /* Magnetic button effect
   * ------------------------------------------------------ */
  const ssMagnetic = function () {
    const buttons = document.querySelectorAll(".btn");
    
    buttons.forEach(function (btn) {
      btn.addEventListener("mousemove", function (e) {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        
        btn.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`;
      });
      
      btn.addEventListener("mouseleave", function () {
        btn.style.transform = "translate(0, 0)";
      });
    });
  }; // end ssMagnetic

  /* Glowing cursor trail effect
   * ------------------------------------------------------ */
  const ssCursorTrail = function () {
    const trail = document.createElement("div");
    trail.style.cssText = `
      position: fixed;
      width: 20px;
      height: 20px;
      border-radius: 50%;
      background: radial-gradient(circle, var(--color-1) 0%, transparent 70%);
      pointer-events: none;
      z-index: 9998;
      opacity: 0;
      transition: opacity 0.3s ease;
    `;
    document.body.appendChild(trail);

    document.addEventListener("mousemove", function (e) {
      trail.style.left = e.clientX - 10 + "px";
      trail.style.top = e.clientY - 10 + "px";
      trail.style.opacity = "0.5";
    });

    document.addEventListener("mouseleave", function () {
      trail.style.opacity = "0";
    });
  }; // end ssCursorTrail

  /* Initialize
   * ------------------------------------------------------ */
  (function ssInit() {
    ssPreloader();
    ssMobileMenu();
    ssScrollSpy();
    ssViewAnimate();
    ssSwiper();
    ssLightbox();
    ssAlertBoxes();
    ssMoveTo();
    ssParallax();
    ssMouseMove();
    ssMagnetic();
    ssCursorTrail();
    // ssTyping(); // Uncomment for typing effect
  })();
})(document.documentElement);
