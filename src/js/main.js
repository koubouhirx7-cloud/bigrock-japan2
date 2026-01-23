document.addEventListener('DOMContentLoaded', () => {
    // Header Scroll Effect
    const header = document.getElementById('header');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.style.background = 'rgba(10, 10, 10, 0.9)';
            header.style.boxShadow = '0 2px 10px rgba(0,0,0,0.3)';
        } else {
            header.style.background = 'rgba(10, 10, 10, 0.5)'; // More transparent at top
            header.style.boxShadow = 'none';
        }
    });

    // Mobile Menu Toggle
    const mobileBtn = document.querySelector('.mobile-menu-btn');
    const navMenu = document.querySelector('.nav-menu');

    if (mobileBtn) {
        mobileBtn.addEventListener('click', () => {
            mobileBtn.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
    }

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (navMenu.classList.contains('active') &&
            !navMenu.contains(e.target) &&
            !mobileBtn.contains(e.target)) {
            mobileBtn.classList.remove('active');
            navMenu.classList.remove('active');
        }
    });

    // Product Filtering
    const filterBtns = document.querySelectorAll('.filter-btn');
    const products = document.querySelectorAll('.product-card');

    function filterProducts(category) {
        // Update Active Button
        filterBtns.forEach(btn => {
            if (btn.getAttribute('data-filter') === category) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });

        // Filter Elements
        products.forEach(product => {
            const productCategory = product.getAttribute('data-category');

            if (category === 'all' || category === productCategory) {
                product.style.display = 'block';
                // Reset animation
                product.style.opacity = '0';
                product.style.transform = 'translateY(10px)';

                // Trigger reflow (removed, using setTimeout instead for reliability)
                // void product.offsetWidth;

                // Animate in with delay to ensure display:block is applied
                setTimeout(() => {
                    product.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
                    product.style.opacity = '1';
                    product.style.transform = 'translateY(0)';
                }, 50);
            } else {
                product.style.display = 'none';
            }
        });
    }

    if (filterBtns.length > 0) {
        filterBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const filterValue = btn.getAttribute('data-filter');
                console.log('Filter clicked:', filterValue);
                filterProducts(filterValue);
            });
        });
    }

    // Intersection Observer for Scroll Animations
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    // Check if IntersectionObserver is supported
    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        const animatedElements = document.querySelectorAll('.card, .section h2, .section p, .animate-on-scroll');
        animatedElements.forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(20px)';
            el.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
            observer.observe(el);
        });
    }

    // Hash-based Filtering (Auto-select category based on URL hash)
    function handleHashFilter() {
        const hash = window.location.hash.replace('#', '').toLowerCase();
        // Check if hash corresponds to a valid filter category
        const validCategories = Array.from(filterBtns).map(btn => btn.getAttribute('data-filter'));

        if (hash && validCategories.includes(hash)) {
            filterProducts(hash);
            const filterBar = document.querySelector('.filter-bar');
            if (filterBar) {
                setTimeout(() => {
                    filterBar.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }, 100);
            }
        }
    }

    // Run on load
    handleHashFilter();

    // Also attach to window load to be safe
    window.addEventListener('load', handleHashFilter);
    window.addEventListener('hashchange', handleHashFilter);
});
