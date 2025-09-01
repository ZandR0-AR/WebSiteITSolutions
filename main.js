document.addEventListener('DOMContentLoaded', function() {
    
    // Lógica para el Menú Móvil Funcional
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');

    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', () => {
            menuToggle.classList.toggle('active');
            navLinks.classList.toggle('active');
        });

        document.querySelectorAll('.nav-links a').forEach(link => {
            link.addEventListener('click', () => {
                if (navLinks.classList.contains('active')) {
                    menuToggle.classList.remove('active');
                    navLinks.classList.remove('active');
                }
            });
        });
    }

    // --- ANIMACIONES DE SCROLL (PARA TODOS LOS DISPOSITIVOS) ---
    const hiddenElements = document.querySelectorAll('.hidden');
    if (hiddenElements.length > 0) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, { 
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });
        hiddenElements.forEach((el) => observer.observe(el));
    }

    // ==========================================================================
    // EFECTOS SOLO PARA ESCRITORIO (MEJORA DE RENDIMIENTO)
    // ==========================================================================
    
    const isDesktop = window.matchMedia("(min-width: 1024px)").matches;

    if (isDesktop) {
        // --- HERO INTERACTIVO (SPOTLIGHT) ---
        const hero = document.querySelector('.hero');
        if (hero) {
            hero.addEventListener('mousemove', e => {
                const rect = hero.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                document.documentElement.style.setProperty('--mouse-x', `${(x / rect.width) * 100}%`);
                document.documentElement.style.setProperty('--mouse-y', `${(y / rect.height) * 100}%`);
            });
        }

        // --- EFECTO 3D (TILT) EN TARJETAS ---
        const tiltCards = document.querySelectorAll('.card, .tech-card');
        tiltCards.forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                const { width, height } = rect;
                
                const rotateX = (y / height - 0.5) * -14;
                const rotateY = (x / width - 0.5) * 14;

                card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.01)`;
            });

            card.addEventListener('mouseleave', () => {
                card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale(1)';
            });
        });
    
        // --- EFECTO DE CURSOR PERSONALIZADO ---
        const cursorFollower = document.querySelector('.cursor-follower');
        if (cursorFollower) {
            window.addEventListener('mousemove', e => {
                cursorFollower.style.transform = `translate3d(${e.clientX - 15}px, ${e.clientY - 15}px, 0)`;
            });
            document.querySelectorAll('a, .btn, .card, .tech-card, .menu-toggle').forEach(el => {
                el.addEventListener('mouseenter', () => cursorFollower.classList.add('active'));
                el.addEventListener('mouseleave', () => cursorFollower.classList.remove('active'));
            });
        }

    } else {
        const cursorFollower = document.querySelector('.cursor-follower');
        if (cursorFollower) {
            cursorFollower.style.display = 'none';
        }
    }

    // --- EFECTO DE ESCRITURA (se ejecuta en todos los dispositivos) ---
    const typingText = document.querySelector('.typing-text');
    if (typingText) {
        const words = ["Soluciones.", "Innovación.", "Confianza."];
        let wordIndex = 0, charIndex = 0, isDeleting = false;
        
        function type() {
            if (!typingText) return;
            const currentWord = words[wordIndex];
            const displayText = isDeleting 
                ? currentWord.substring(0, charIndex - 1) 
                : currentWord.substring(0, charIndex + 1);
            
            typingText.textContent = displayText;
            let typeSpeed = isDeleting ? 90 : 180;

            if (!isDeleting && charIndex === currentWord.length) {
                typeSpeed = 2000;
                isDeleting = true;
            } else if (isDeleting && charIndex === 0) {
                isDeleting = false;
                wordIndex = (wordIndex + 1) % words.length;
                typeSpeed = 400;
            }
            
            charIndex = isDeleting ? charIndex - 1 : charIndex + 1;
            setTimeout(type, typeSpeed);
        }
        type();
    }

    // --- NAVEGACIÓN ACTIVA AL HACER SCROLL (se ejecuta en todos los dispositivos) ---
    const sections = document.querySelectorAll('section[id]');
    if (sections.length > 0) {
        const navLinksObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const id = entry.target.getAttribute('id');
                    document.querySelectorAll('.nav-links a').forEach(a => {
                        a.classList.remove('active');
                        if (a.getAttribute('href') === `#${id}`) {
                            a.classList.add('active');
                        }
                    });
                }
            });
        }, { 
            rootMargin: '-50% 0px -50% 0px'
        });
        sections.forEach(section => navLinksObserver.observe(section));
    }

    //splish screen
      const SPLASH_CONFIG = {
        duration: 3000,        // Duración total en milisegundos (3 segundos)
        fadeDuration: 1000,    // Duración del fade out (1 segundo)
        minDisplayTime: 1500,  // Tiempo mínimo visible (1.5 segundos)
        autoHide: true,        // Auto-ocultar después del tiempo especificado
        clickToSkip: true,     // Permitir click para saltar
        hideOnLoad: true       // Ocultar cuando la página termine de cargar
    };

    let splashScreen = null;
    let splashTimer = null;
    let isHidingSplash = false;
    let splashStartTime = Date.now();

    function initSplashScreen() {
        splashScreen = document.getElementById('splash-screen');
        
        if (!splashScreen) {
            console.warn('Elemento #splash-screen no encontrado');
            return;
        }

        // Asegurar que esté visible al inicio
        splashScreen.style.display = 'flex';
        splashScreen.style.opacity = '1';
        splashScreen.classList.remove('fade-out');

        // Configurar eventos del splash
        setupSplashEvents();
        
        // Iniciar timer de auto-hide si está habilitado
        if (SPLASH_CONFIG.autoHide) {
            splashTimer = setTimeout(() => {
                hideSplashScreen();
            }, SPLASH_CONFIG.duration);
        }

        // Agregar indicador visual de que es clickeable
        splashScreen.setAttribute('title', 'Click para continuar');
        splashScreen.setAttribute('tabindex', '0'); // Para navegación por teclado

        console.log('Splash screen inicializado correctamente');
    }

    function setupSplashEvents() {
        if (!splashScreen) return;

        // Click para saltar (si está habilitado)
        if (SPLASH_CONFIG.clickToSkip) {
            splashScreen.addEventListener('click', handleSplashClick);
        }

        // Teclas para saltar
        document.addEventListener('keydown', handleSplashKeyPress);

        // Foco en el splash para navegación por teclado
        splashScreen.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handleSplashClick();
            }
        });

        // Prevenir scroll mientras el splash está visible
        document.body.style.overflow = 'hidden';

        // Manejo de errores de carga de imagen
        const splashImg = splashScreen.querySelector('img');
        if (splashImg) {
            splashImg.addEventListener('error', () => {
                console.error('Error cargando el logo del splash screen');
                setTimeout(() => hideSplashScreen(), 500);
            });
            
            splashImg.addEventListener('load', () => {
                console.log('Logo del splash screen cargado correctamente');
            });

            // Si la imagen ya está cargada (cache)
            if (splashImg.complete && splashImg.naturalHeight !== 0) {
                console.log('Logo del splash screen ya estaba cargado');
            }
        }
    }

    function handleSplashClick(event) {
        if (event) {
            event.preventDefault();
            event.stopPropagation();
        }
        
        // Agregar efecto visual de click
        if (splashScreen) {
            splashScreen.classList.add('manual-fade');
        }
        
        setTimeout(() => {
            hideSplashScreen();
        }, 100); // Pequeño delay para mostrar el efecto
    }

    function handleSplashKeyPress(event) {
        if (splashScreen && !isHidingSplash) {
            if (event.key === 'Escape' || event.key === 'Enter') {
                event.preventDefault();
                handleSplashClick();
            }
        }
    }

    function hideSplashScreen() {
        if (!splashScreen || isHidingSplash) return;
        
        // Verificar tiempo mínimo
        const elapsedTime = Date.now() - splashStartTime;
        if (elapsedTime < SPLASH_CONFIG.minDisplayTime) {
            setTimeout(() => {
                hideSplashScreen();
            }, SPLASH_CONFIG.minDisplayTime - elapsedTime);
            return;
        }
        
        isHidingSplash = true;
        
        // Limpiar timer si existe
        if (splashTimer) {
            clearTimeout(splashTimer);
            splashTimer = null;
        }
        
        // Aplicar múltiples métodos para asegurar el fade out
        splashScreen.classList.add('fade-out');
        splashScreen.style.opacity = '0';
        
        console.log('Iniciando fade out del splash screen...');
        
        // Remover completamente después del fade out
        setTimeout(() => {
            removeSplashScreen();
        }, SPLASH_CONFIG.fadeDuration);
    }

    function removeSplashScreen() {
        if (!splashScreen) return;
        
        console.log('Removiendo splash screen del DOM...');
        
        // Remover eventos
        if (SPLASH_CONFIG.clickToSkip) {
            splashScreen.removeEventListener('click', handleSplashClick);
        }
        document.removeEventListener('keydown', handleSplashKeyPress);
        
        // Restaurar scroll del body
        document.body.style.overflow = '';
        
        // Remover elemento del DOM de múltiples formas
        splashScreen.style.display = 'none';
        splashScreen.style.visibility = 'hidden';
        
        // Remover después de un pequeño delay adicional
        setTimeout(() => {
            if (splashScreen && splashScreen.parentNode) {
                splashScreen.parentNode.removeChild(splashScreen);
            }
            splashScreen = null;
            
            // Ejecutar callback de finalización
            onSplashComplete();
        }, 100);
    }

    function onSplashComplete() {
        console.log('Splash screen completado - Aplicación lista');
        
        // Disparar evento personalizado
        document.dispatchEvent(new CustomEvent('splashComplete', {
            detail: {
                timestamp: Date.now(),
                duration: Date.now() - splashStartTime,
                config: SPLASH_CONFIG
            }
        }));

        // Foco en el contenido principal después del splash
        const mainContent = document.querySelector('main') || document.querySelector('.hero') || document.body;
        if (mainContent) {
            mainContent.focus();
        }
    }

    // Función pública para ocultar manualmente
    function forceSplashHide() {
        if (splashScreen && !isHidingSplash) {
            hideSplashScreen();
        }
    }

    // Función pública para verificar estado
    function isSplashVisible() {
        return splashScreen && !isHidingSplash && splashScreen.style.display !== 'none';
    }

    // Inicializar splash screen inmediatamente
    initSplashScreen();

    // Manejo del evento load de la ventana
    window.addEventListener('load', () => {
        console.log('Página completamente cargada');
        if (SPLASH_CONFIG.hideOnLoad && splashScreen && !isHidingSplash) {
            // Esperar tiempo mínimo antes de ocultar
            const elapsedTime = Date.now() - splashStartTime;
            const remainingTime = Math.max(0, SPLASH_CONFIG.minDisplayTime - elapsedTime);
            
            setTimeout(() => {
                hideSplashScreen();
            }, remainingTime);
        }
    });

    // Exponer API pública
    window.SplashScreen = {
        hide: forceSplashHide,
        isVisible: isSplashVisible,
        config: SPLASH_CONFIG,
        element: () => splashScreen
    };

    // Debug: Log del estado cada segundo (solo en desarrollo)
    if (typeof console !== 'undefined' && console.log) {
        const debugInterval = setInterval(() => {
            if (!splashScreen) {
                clearInterval(debugInterval);
                return;
            }
            console.log('Splash status:', {
                visible: isSplashVisible(),
                hiding: isHidingSplash,
                opacity: splashScreen.style.opacity,
                display: splashScreen.style.display,
                classList: Array.from(splashScreen.classList)
            });
        }, 1000);
        
        // Limpiar debug después de 10 segundos
        setTimeout(() => clearInterval(debugInterval), 10000);
    }

});