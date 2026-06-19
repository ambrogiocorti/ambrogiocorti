/**
 * Template Name: SnapFolio
 * Template URL: https://bootstrapmade.com/snapfolio-bootstrap-portfolio-template/
 * Updated: Jul 21 2025 with Bootstrap v5.3.7
 * Author: BootstrapMade.com
 * License: https://bootstrapmade.com/license/
 */

(function() {
  "use strict";

  /**
   * Apply .scrolled class to the body as the page is scrolled down
   */
  function select(el, all = false) {
    el = el.trim()
    if (all) {
      return [...document.querySelectorAll(el)]
    } else {
      return document.querySelector(el)
    }
  }

  /**
   * Easy event listener function
   */
  const on = (type, el, listener, all = false) => {
    let selectEl = select(el, all)
    if (selectEl) {
      if (all) {
        selectEl.forEach(e => e.addEventListener(type, listener))
      } else {
        selectEl.addEventListener(type, listener)
      }
    }
  }

  /**
   * Preloader
   */
  const preloader = select('#preloader');
  if (preloader) {
    window.addEventListener('load', () => {
      preloader.remove();
    });
  }

  /**
   * Scroll top button
   */
  const scrollTop = select('#scroll-top');
  if (scrollTop) {
    const scrollTopScrolled = () => {
      if (window.scrollY > 100) {
        scrollTop.classList.add('active');
      } else {
        scrollTop.classList.remove('active');
      }
    }
    window.addEventListener('load', scrollTopScrolled);
    document.addEventListener('scroll', scrollTopScrolled);
    scrollTop.addEventListener('click', (e) => {
      e.preventDefault();
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  /**
   * Mobile nav toggle
   */
  on('click', '.header-toggle', function(e) {
    select('body').classList.toggle('header-show');
  });

  /**
   * Hide mobile nav on same-page/hash links
   */
  on('click', '#navmenu a', function(e) {
    if (select('body').classList.contains('header-show')) {
      select('body').classList.remove('header-show');
    }
  }, true);

  /**
   * Toggle mobile nav dropdowns
   */
  on('click', '.navmenu .toggle-dropdown', function(e) {
    e.preventDefault();
    this.parentNode.classList.toggle('active');
    this.parentNode.nextElementSibling.classList.toggle('dropdown-active');
  }, true);

  /**
   * Correct scrolling position upon page load for URLs containing a hash link.
   */
  window.addEventListener('load', function(e) {
    if (window.location.hash) {
      if (select(window.location.hash)) {
        setTimeout(() => {
          let section = select(window.location.hash);
          let scrollMarginTop = getComputedStyle(section).scrollMarginTop;
          window.scrollTo({
            top: section.offsetTop - parseInt(scrollMarginTop),
            behavior: 'smooth'
          });
        }, 100);
      }
    }
  });

  /**
   * Navmenu active state on scroll
   */
  let navmenulinks = select('#navmenu a', true);

  function navmenu_active() {
    navmenulinks.forEach(navmenulink => {
      if (!navmenulink.hash) return;
      let section = select(navmenulink.hash);
      if (!section) return;
      let position = window.scrollY + 200;
      if (position >= section.offsetTop && position <= (section.offsetTop + section.offsetHeight)) {
        navmenulink.classList.add('active');
      } else {
        navmenulink.classList.remove('active');
      }
    })
  }
  window.addEventListener('load', navmenu_active);
  document.addEventListener('scroll', navmenu_active);

  /**
   * Init typed.js
   */
  const typed = select('.typed');
  if (typed) {
    let typed_strings = typed.getAttribute('data-typed-items');
    typed_strings = typed_strings.split(',');
    new Typed('.typed', {
      strings: typed_strings,
      loop: true,
      typeSpeed: 100,
      backSpeed: 50,
      backDelay: 2000
    });
  }

  /**
   * Animate the skills items on reveal
   */
  let skilsContent = select('.skills-content');
  if (skilsContent) {
    new Waypoint({
      element: skilsContent,
      offset: '80%',
      handler: function(direction) {
        let progress = select('.progress .progress-bar', true);
        progress.forEach((el) => {
          el.style.width = el.getAttribute('aria-valuenow') + '%'
        });
      }
    })
  }

  /**
   * Animation on scroll function and init
   */
  function aos_init() {
    AOS.init({
      duration: 1000,
      easing: 'ease-in-out',
      once: true,
      mirror: false
    });
  }
  window.addEventListener('load', () => {
    aos_init();
  });

  /**
   * Projects Modal Logic
   */
  const projectsModal = document.getElementById('projectsModal');
  if (projectsModal) {
    projectsModal.addEventListener('show.bs.modal', async () => {
      const projectsListContainer = document.getElementById('projectsList');
      const projectsLoading = document.getElementById('projectsLoading');

      // Show loader and clear previous content
      if (projectsLoading) projectsLoading.style.display = 'block';
      if (projectsListContainer) projectsListContainer.innerHTML = '';

      const githubRawUrl = '../assets/js/projects.json';

      try {
        const response = await fetch(githubRawUrl);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const projects = await response.json();

        if (projectsListContainer) {
          if (projects.length === 0) {
            projectsListContainer.innerHTML = '<p class="text-center">No projects found.</p>';
          } else {
            projects.forEach(project => {
              const projectCard = `
                <div class="col">
                    <a href="${project.url}" target="_blank" class="project-card-link">
                        <div class="project-card h-100">
                            <div class="d-flex align-items-center mb-2">
                                <i class="bi ${project.icon || 'bi-link-45deg'} me-2 fs-4 text-primary"></i>
                                <h5 class="card-title mb-0">${project.name}</h5>
                            </div>
                            <p class="card-text small">${project.description}</p>
                        </div>
                    </a>
                </div>
              `;
              projectsListContainer.innerHTML += projectCard;
            });
          }
        }
      } catch (error) {
        console.error('Error loading projects:', error);
        if (projectsListContainer) {
          projectsListContainer.innerHTML = `<div class="col-12"><div class="alert alert-danger" role="alert">Failed to load projects. Please try again later.</div></div>`;
        }
      } finally {
        // Hide loader
        if (projectsLoading) projectsLoading.style.display = 'none';
      }
    });
  }

})();