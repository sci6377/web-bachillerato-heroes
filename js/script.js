document.addEventListener('DOMContentLoaded', function() {

    // --- 1. DECLARACIÓN DE CONSTANTES Y VARIABLES GLOBALES DEL SCRIPT ---
    
    const preloader = document.getElementById('preloader');
    const header = document.querySelector('header');
    const backToTopButton = document.querySelector('.back-to-top') || document.getElementById('btn-ir-arriba');
    const currentYearSpan = document.getElementById('currentYear');

    // Componentes Interactivos Web
    const animatedElements = document.querySelectorAll('.animate-on-scroll');
    let observer;
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabPanes = document.querySelectorAll('.tab-pane');
    const accordionHeaders = document.querySelectorAll('.accordion-header');
    const leerMasButtons = document.querySelectorAll('.btn-leer-mas');

    // Modales (Generales y Organigrama)
    const openModalButtons = document.querySelectorAll('.open-modal-btn');
    const modals = document.querySelectorAll('.modal:not(.org-info-popup)');
    const generalCloseButtons = document.querySelectorAll('.modal:not(.org-info-popup) .close-button, .modal:not(.org-info-popup) .close-popup-btn');
    let activeModal = null;
    // orgCards, orgPopupOverlay, activeOrgPopup, orgClosePopupButtons se declaran dentro de su bloque de lógica

    const pwaContainer = document.getElementById('pwa-container');
    const pwaTabBarItems = document.querySelectorAll('.pwa-tab-item');
    const pwaVistas = document.querySelectorAll('.pwa-vista');
    const pwaMasLinks = document.querySelectorAll('.pwa-mas-link');
    const pwaBackButtons = document.querySelectorAll('.pwa-back-button');
    const contactForm = document.getElementById('contactForm');
    const egresadosForm = document.getElementById('egresadosForm');
    const quejasForm = document.getElementById('quejasForm');

    // --- LÓGICA DE LA UI PRINCIPAL ---

    if (preloader) {
        window.addEventListener('load', () => {
            setTimeout(() => { 
                if (preloader) {
                    preloader.style.transition = 'opacity 0.5s ease';
                    preloader.style.opacity = '0';
                    setTimeout(() => { preloader.style.display = 'none'; }, 500);
                }
            }, 300);
        });
    }

    if (header) { 
        window.addEventListener('scroll', () => { 
            if (window.scrollY > 50) { 
                header.classList.add('scrolled'); 
            } else { 
                header.classList.remove('scrolled'); 
            }
        }); 
    }

    if (backToTopButton) { 
        window.addEventListener('scroll', () => { 
            if (window.scrollY > 300) { 
                backToTopButton.classList.add('visible'); 
            }
        }); 
        backToTopButton.addEventListener('click', (e) => { 
            e.preventDefault(); 
            window.scrollTo({ top: 0, behavior: 'smooth' }); 
        }); 
    }
    
    if (currentYearSpan) { 
        currentYearSpan.textContent = new Date().getFullYear(); 
    }

    if (animatedElements.length > 0) { 
        observer = new IntersectionObserver((entries) => { 
            entries.forEach(entry => { 
                if (entry.isIntersecting) { 
                    entry.target.classList.add('is-visible'); 
                } 
            }); 
        }, { threshold: 0.1 }); 
        animatedElements.forEach(element => { 
            observer.observe(element); 
        }); 
    }

    if (tabButtons.length > 0 && tabPanes.length > 0) { 
        tabButtons.forEach(button => { 
            button.addEventListener('click', () => { 
                const targetTab = button.getAttribute('data-tab'); 
                tabButtons.forEach(btn => btn.classList.remove('active')); 
                button.classList.add('active'); 
                tabPanes.forEach(pane => { 
                    pane.classList.toggle('active', pane.id === targetTab); 
                }); 
            }); 
        }); 
    }

    if (accordionHeaders.length > 0) { 
        accordionHeaders.forEach(header => { 
            header.addEventListener('click', () => { 
                const accordionContent = header.nextElementSibling;
                header.classList.toggle('active'); 
                if (accordionContent) { 
                    if (header.classList.contains('active')) { 
                        accordionContent.style.maxHeight = accordionContent.scrollHeight + "px"; 
                    } else { 
                        accordionContent.style.maxHeight = null; 
                    }
                }
            }); 
        }); 
    }

    function closeModal(modalToClose) {
        if (modalToClose && modalToClose.style.display === 'block') {
            modalToClose.style.display = "none";
            const iframe = modalToClose.querySelector('iframe');
            if (iframe) { 
                const iframeSrc = iframe.src;
                iframe.src = iframeSrc;
            }
            if (modalToClose === activeModal) activeModal = null;
            document.body.style.overflow = 'auto';
        }
    }

    if (openModalButtons.length > 0) {
        openModalButtons.forEach(button => {
            button.addEventListener('click', () => {
                const modalId = button.getAttribute('data-modal-id');
                const targetModal = document.getElementById(modalId);
                if (targetModal) {
                    activeModal = targetModal; 
                    activeModal.style.display = "block";
                    document.body.style.overflow = 'hidden'; 
                }
            });
        });
    }

    if (generalCloseButtons.length > 0) {
        generalCloseButtons.forEach(button => {
            button.addEventListener('click', () => { 
                closeModal(button.closest('.modal')); 
            });
        });
    }
    
    window.addEventListener('click', (event) => { 
        if (activeModal && event.target === activeModal) { 
            closeModal(activeModal); 
        } 
    });

    window.addEventListener('keydown', (event) => { 
        if (event.key === 'Escape') { 
            if (activeModal) { 
                closeModal(activeModal); 
            } 
        }
    });

    // Lógica del organigrama
    const orgCards = document.querySelectorAll('.org-card');
    const orgPopupOverlay = document.querySelector('.org-popup-overlay');
    let activeOrgPopup = null; // Se mantiene aquí ya que es parte del estado del popup

    if (orgCards.length > 0 && orgPopupOverlay) {
        const orgClosePopupButtons = document.querySelectorAll('.org-info-popup .close-popup-btn');
        orgCards.forEach(card => {
            card.addEventListener('click', (e) => {
                e.stopPropagation();
                const personId = card.getAttribute('data-person-id');
                const infoPopup = document.getElementById(`info-${personId}`);
                if (infoPopup) {
                    activeOrgPopup = infoPopup;
                    infoPopup.classList.add('active');
                    orgPopupOverlay.classList.add('active');
                    document.body.style.overflow = 'hidden';
                }
            });
        });

        const closePopup = () => {
            if (activeOrgPopup) {
                activeOrgPopup.classList.remove('active');
                orgPopupOverlay.classList.remove('active');
                activeOrgPopup = null;
                document.body.style.overflow = 'auto';
            }
        };

        orgClosePopupButtons.forEach(button => button.addEventListener('click', closePopup));
        orgPopupOverlay.addEventListener('click', closePopup);
    }

    // Lógica de testimonios y otros carruseles
    function initializeCarousel(carouselSelector, intervalTime = 5000) {
        const carousel = document.querySelector(carouselSelector);
        if (!carousel) return;

        let indicatorsContainer = carousel.querySelector('.carousel-indicators-container');
        const parentWrapper = carousel.closest('.carousel-wrapper');
        if (parentWrapper && parentWrapper.querySelector('.carousel-indicators-container')) {
            indicatorsContainer = parentWrapper.querySelector('.carousel-indicators-container');
        }

        const slides = Array.from(carousel.querySelectorAll('.carousel-slide'));
        if (slides.length === 0) return;

        const prevButton = carousel.querySelector('.carousel-control.prev');
        const nextButton = carousel.querySelector('.carousel-control.next');
        let indicators = []; 
        let currentIndex = 0; 
        let slideInterval;

        if (indicatorsContainer && slides.length > 1) {
            indicatorsContainer.innerHTML = ''; 
            slides.forEach((_, index) => {
                const indicator = document.createElement('button');
                indicator.classList.add('carousel-indicator');
                indicator.setAttribute('aria-label', `Ir a imagen ${index + 1}`);
                indicator.addEventListener('click', () => { 
                    goToSlide(index); 
                    if (slides.length > 1) resetIntervalFn(); 
                });
                indicatorsContainer.appendChild(indicator); 
                indicators.push(indicator);
            });
        }

        function updateIndicators() { 
            if (indicators.length > 0) { 
                indicators.forEach((indicator, index) => { 
                    indicator.classList.toggle('active', index === currentIndex); 
                }); 
            }
        }

        function showSlide(index) { 
            slides.forEach((slide) => { slide.classList.remove('active'); }); 
            if(slides[index]) slides[index].classList.add('active'); 
            updateIndicators(); 
        }

        function goToSlide(index) { 
            currentIndex = index; 
            showSlide(currentIndex); 
        }

        function nextSlideFn() { 
            currentIndex = (currentIndex + 1) % slides.length; 
            showSlide(currentIndex); 
        }

        function prevSlideFn() { 
            currentIndex = (currentIndex - 1 + slides.length) % slides.length; 
            showSlide(currentIndex); 
        }

        showSlide(currentIndex);

        if (slides.length > 1) {
            if (prevButton && nextButton) { 
                prevButton.addEventListener('click', () => { prevSlideFn(); resetIntervalFn(); }); 
                nextButton.addEventListener('click', () => { nextSlideFn(); resetIntervalFn(); }); 
            }
            const startIntervalFn = () => { 
                clearInterval(slideInterval); 
                slideInterval = setInterval(nextSlideFn, intervalTime); 
            };
            const resetIntervalFn = () => { 
                clearInterval(slideInterval); 
                startIntervalFn(); 
            };
            startIntervalFn(); 
            carousel.addEventListener('mouseenter', () => clearInterval(slideInterval));
            carousel.addEventListener('mouseleave', startIntervalFn);
        } else { 
            if (prevButton) prevButton.style.display = 'none'; 
            if (nextButton) nextButton.style.display = 'none';
            if (indicatorsContainer) indicatorsContainer.style.display = 'none'; 
        }
    }

    if (document.querySelector('.hero-carousel')) initializeCarousel('.hero-carousel', 7000); 
    if (document.querySelector('.event-carousel')) initializeCarousel('.event-carousel', 5000);

    // --- CARGA DEL CARRUSEL DE TESTIMONIOS ---
    function initializeTestimoniosCarousel() {
        const track = document.querySelector('.testimonios-track');
        const prevButton = document.querySelector('.testimonio-control.prev');
        const nextButton = document.querySelector('.testimonio-control.next');
        const indicatorsContainer = document.querySelector('.testimonios-indicators-container');
        if (!track || !prevButton || !nextButton || !indicatorsContainer) return;
        let testimoniosData = [];
        let currentIndex = 0;
        let cardWidth = 0;
        let intervalId;
        function fetchTestimonios() {
            fetch('data/testimonios.json')
                .then(response => {
                    if (!response.ok) throw new Error('Network response was not ok ' + response.statusText);
                    return response.json();
                })
                .then(data => {
                    testimoniosData = data;
                    if (testimoniosData.length > 0) {
                        renderTestimonios();
                        setupCarousel();
                    } else {
                        track.innerHTML = '<p>No hay testimonios disponibles en este momento.</p>';
                    }
                })
                .catch(error => {
                    console.error('Error al cargar los testimonios:', error);
                    track.innerHTML = '<p>Error al cargar testimonios. Intente más tarde.</p>';
                });
        }
        function renderTestimonios() {
            track.innerHTML = '';
            indicatorsContainer.innerHTML = '';
            testimoniosData.forEach((testimonio, index) => {
                const cardWrapper = document.createElement('div');
                cardWrapper.classList.add('testimonio-card-wrapper');
                const card = document.createElement('div');
                card.classList.add('testimonio-card', 'card-hover');
                card.innerHTML = `
                    <img src="${testimonio.imagen}" alt="Foto de ${testimonio.nombre}" class="testimonio-img">
                    <p class="testimonio-texto">"${testimonio.texto}"</p>
                    <p class="testimonio-autor">- ${testimonio.nombre}</p>
                    ${testimonio.infoExtra ? `<p class="testimonio-info">${testimonio.infoExtra}</p>` : ''}
                `;
                cardWrapper.appendChild(card);
                track.appendChild(cardWrapper);
                if (testimoniosData.length > getVisibleCardsCount()) {
                    const indicator = document.createElement('button');
                    indicator.classList.add('carousel-indicator');
                    indicator.setAttribute('aria-label', `Ir al testimonio ${index + 1}`);
                    indicator.addEventListener('click', () => { 
                    goToSlide(index); 
                    });
                    indicatorsContainer.appendChild(indicator);

                }
            });
            updateCardWidth();
        }
        function getVisibleCardsCount() {
            if (window.innerWidth <= 600) return 1;
            if (window.innerWidth <= 992) return 2;
            return 3;
        }
        function updateCardWidth() {
            const firstCardWrapper = track.querySelector('.testimonio-card-wrapper');
            if (firstCardWrapper) cardWidth = firstCardWrapper.offsetWidth;
        }
        function updateCarouselPosition() {
            if (cardWidth > 0) track.style.transform = `translateX(-${currentIndex * cardWidth}px)`;
            updateIndicators();
        }
        function updateIndicators() {
            if (!indicatorsContainer) return;
        const indicators = indicatorsContainer.querySelectorAll('.carousel-indicator'); // Seleccionar los indicadores creados
        if (indicators.length === 0) return;
            indicators.forEach((indicator, index) => {
                const currentGroupStartIndex = Math.floor(currentIndex / getVisibleCardsCount()) * getVisibleCardsCount();
                indicator.classList.toggle('active', index === currentIndex);
            });
        }
        function nextSlide() {
            const numVisible = getVisibleCardsCount();
            if (currentIndex < testimoniosData.length - numVisible) {
                currentIndex += 1;
            }
            updateCarouselPosition();
        }
        function prevSlide() {
            if (currentIndex > 0) {
                currentIndex -= 1;
            }
            updateCarouselPosition();
        }
        function goToSlide(index) {
            const numVisible = getVisibleCardsCount();
            if (index > testimoniosData.length - numVisible) 
            index = Math.max(0, testimoniosData.length - numVisible);
            if (index < 0) index = 0;
            currentIndex = index;
            updateCarouselPosition();
            resetAutoPlay();
        }
        function startAutoPlay() {
            if (testimoniosData.length > getVisibleCardsCount()) intervalId = setInterval(nextSlide, 60000);
        }
        function resetAutoPlay() {
            clearInterval(intervalId);
            startAutoPlay();
        }
        function setupCarousel() {
            if (testimoniosData.length <= getVisibleCardsCount()) {
                prevButton.style.display = 'none';
                nextButton.style.display = 'none';
                indicatorsContainer.style.display = 'none';
                return;
            }
            prevButton.addEventListener('click', () => { prevSlide(); resetAutoPlay(); });
            nextButton.addEventListener('click', () => { nextSlide(); resetAutoPlay(); });
            window.addEventListener('resize', () => {
                updateCardWidth();
                const numVisible = getVisibleCardsCount();
                if (currentIndex > testimoniosData.length - numVisible) {
                    currentIndex = Math.max(0, testimoniosData.length - numVisible);
                }
                updateCarouselPosition();
                resetAutoPlay();
            });
            updateCardWidth();
            updateCarouselPosition();
            startAutoPlay();
        }
        fetchTestimonios();
    }
    initializeTestimoniosCarousel();

    // --- 13. FUNCIONALIDAD "LEER MÁS" PARA NOTICIAS ---
    if (leerMasButtons.length > 0) { 
        leerMasButtons.forEach(button => { 
            button.addEventListener('click', function() { 
                const noticiaItem = this.closest('.noticia-item'); 
                const contenidoCompleto = noticiaItem.querySelector('.noticia-completa'); 
                this.classList.toggle('active'); 
                if (contenidoCompleto) { 
                    contenidoCompleto.classList.toggle('visible'); 
                    if (contenidoCompleto.classList.contains('visible')) { 
                        this.innerHTML = 'Leer menos <i class="fas fa-chevron-up"></i>'; 
                    } else { 
                        this.innerHTML = 'Leer más <i class="fas fa-chevron-down"></i>';
                    }
                }
            });
        });
    }

    

    // --- 15. LÓGICA DE NAVEGACIÓN DE LA PWA Y FUNCIONES DE VISTAS PWA ---
    if (pwaContainer) {
        function mostrarPwaVista(idVistaAMostrar) {
            localStorage.setItem('pwaUltimaVista', idVistaAMostrar);
            pwaVistas.forEach(vista => vista.classList.toggle('active', vista.id === idVistaAMostrar));
            pwaTabBarItems.forEach(tab => tab.classList.toggle('active', tab.getAttribute('data-target-view') === idVistaAMostrar));
            
            const vistaActiva = document.getElementById(idVistaAMostrar);
            if (vistaActiva) {
                const contentArea = vistaActiva.closest('.pwa-content-area');
                if (contentArea) contentArea.scrollTop = 0;

                // Aquí iría la lógica específica para cargar datos de cada vista PWA
            }
        }

        pwaTabBarItems.forEach(item => item.addEventListener('click', () => mostrarPwaVista(item.getAttribute('data-target-view'))));
        pwaMasLinks.forEach(link => link.addEventListener('click', (e) => { e.preventDefault(); mostrarPwaVista(link.getAttribute('data-target-view')); }));
        pwaBackButtons.forEach(button => button.addEventListener('click', () => mostrarPwaVista(button.getAttribute('data-target-view'))));

        function activarInterfazPWA() {
            const isStandalone = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true;
            if (isStandalone) {
                if (window.location.hash) {
                    history.replaceState(null, '', window.location.pathname + window.location.search);
                }
                pwaContainer.classList.add('active');
                document.body.classList.add('pwa-active-body');
                
                let ultimaVista = localStorage.getItem('pwaUltimaVista');
                if (ultimaVista && document.getElementById(ultimaVista)) {
                    mostrarPwaVista(ultimaVista);
                }
            }
        }

        activarInterfazPWA();
        setTimeout(activarInterfazPWA, 300);
        document.addEventListener('visibilitychange', () => {
            if (document.visibilityState === 'visible' && window.matchMedia('(display-mode: standalone)').matches) {
                activarInterfazPWA();
            }
        });

        if ('serviceWorker' in navigator) {
            window.addEventListener('load', () => {
                navigator.serviceWorker.register('/sw.js')
                    .then(registration => console.log('SW registrado:', registration.scope))
                    .catch(error => console.error('SW registro fallido:', error));
            });
        }
    }

    // --- 16. MANEJO DE FORMULARIOS (Formspree) ---
    if (egresadosForm && egresadosForm.action.includes('formspree.io')) {
        const egresadosFormMessages = document.getElementById('egresados-form-messages');
        if (egresadosFormMessages) {
            egresadosForm.addEventListener('submit', async function(event) {
                event.preventDefault();
                const formData = new FormData(egresadosForm);
                egresadosFormMessages.textContent = 'Enviando información...';
                egresadosFormMessages.style.color = 'var(--secondary-color)';
                try {
                    const response = await fetch(egresadosForm.action, {
                        method: egresadosForm.method,
                        body: formData,
                        headers: { 'Accept': 'application/json' }
                    });
                    if (response.ok) {
                        egresadosFormMessages.textContent = '¡Información enviada con éxito! Gracias por mantenerte en contacto.';
                        egresadosFormMessages.style.color = 'var(--accent-color-green)';
                        egresadosForm.reset();
                    } else {
                        let errorData = { errors: [{ message: "Error desconocido." }] };
                        try { errorData = await response.json(); } catch (e) { /* ignore */ }
                        egresadosFormMessages.textContent = errorData.errors.map(e => e.message).join(", ");
                        egresadosFormMessages.style.color = 'var(--accent-color-red)';
                    }
                } catch (error) {
                     egresadosFormMessages.textContent = 'Hubo un problema al enviar tu información. Revisa tu conexión.';
                     egresadosFormMessages.style.color = 'var(--accent-color-red)';
                }
                setTimeout(() => { egresadosFormMessages.textContent = ''; }, 8000);
            });
        }
    }

});