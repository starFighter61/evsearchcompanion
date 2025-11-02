/**
 * West LA EV Life - Main JavaScript
 * Handles dark mode, navigation, forms, and interactive features
 */

// ===========================
// Dark Mode Functionality
// ===========================

class ThemeManager {
    constructor() {
        this.theme = localStorage.getItem('theme') || 'light';
        this.init();
    }

    init() {
        // Set initial theme
        this.applyTheme(this.theme);

        // Desktop toggle button
        const themeToggle = document.getElementById('theme-toggle');
        if (themeToggle) {
            themeToggle.addEventListener('click', () => this.toggleTheme());
        }

        // Mobile toggle button
        const themeToggleMobile = document.getElementById('theme-toggle-mobile');
        if (themeToggleMobile) {
            themeToggleMobile.addEventListener('click', () => this.toggleTheme());
        }

        // Listen for system theme changes
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
            if (!localStorage.getItem('theme')) {
                this.applyTheme(e.matches ? 'dark' : 'light');
            }
        });
    }

    toggleTheme() {
        this.theme = this.theme === 'light' ? 'dark' : 'light';
        this.applyTheme(this.theme);
        localStorage.setItem('theme', this.theme);
    }

    applyTheme(theme) {
        const html = document.documentElement;
        if (theme === 'dark') {
            html.classList.add('dark');
        } else {
            html.classList.remove('dark');
        }
    }
}

// ===========================
// Mobile Navigation
// ===========================

class MobileNavigation {
    constructor() {
        this.mobileMenuBtn = document.getElementById('mobile-menu-btn');
        this.mobileMenu = document.getElementById('mobile-menu');
        this.init();
    }

    init() {
        if (this.mobileMenuBtn && this.mobileMenu) {
            this.mobileMenuBtn.addEventListener('click', () => this.toggleMenu());

            // Close menu when clicking on links
            const menuLinks = this.mobileMenu.querySelectorAll('a');
            menuLinks.forEach(link => {
                link.addEventListener('click', () => this.closeMenu());
            });

            // Close menu when clicking outside
            document.addEventListener('click', (e) => {
                if (!this.mobileMenu.contains(e.target) && !this.mobileMenuBtn.contains(e.target)) {
                    this.closeMenu();
                }
            });
        }
    }

    toggleMenu() {
        this.mobileMenu.classList.toggle('hidden');
        this.mobileMenu.classList.toggle('show');
    }

    closeMenu() {
        this.mobileMenu.classList.add('hidden');
        this.mobileMenu.classList.remove('show');
    }
}

// ===========================
// Navigation Scroll Effect
// ===========================

class NavigationScroll {
    constructor() {
        this.nav = document.querySelector('nav');
        this.init();
    }

    init() {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                this.nav.classList.add('scrolled');
            } else {
                this.nav.classList.remove('scrolled');
            }
        });
    }
}

// ===========================
// Smooth Scrolling for Anchor Links
// ===========================

class SmoothScroll {
    constructor() {
        this.init();
    }

    init() {
        // Select all anchor links that start with #
        const links = document.querySelectorAll('a[href^="#"]');
        
        links.forEach(link => {
            link.addEventListener('click', (e) => {
                const href = link.getAttribute('href');
                
                // Ignore empty or just # links
                if (href === '#' || href === '') return;
                
                const target = document.querySelector(href);
                
                if (target) {
                    e.preventDefault();
                    const offsetTop = target.offsetTop - 80; // Account for fixed nav
                    
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }
}

// ===========================
// Rebate Calculator Form
// ===========================

class RebateCalculator {
    constructor() {
        this.form = document.getElementById('rebate-form');
        this.results = document.getElementById('calculator-results');
        this.init();
    }

    init() {
        if (this.form) {
            console.log('Rebate calculator form found and initialized');
            
            // Handle form submit (for Enter key)
            this.form.addEventListener('submit', (e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log('Form submit event triggered');
                this.calculate();
                return false;
            });
            
            // Handle button click directly
            const button = document.getElementById('calculate-btn');
            if (button) {
                button.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    console.log('Calculate button clicked directly');
                    this.calculate();
                    return false;
                });
            }
        } else {
            console.error('Rebate form not found!');
        }
    }

    calculate() {
        try {
            console.log('Calculate button clicked');
            
            // Get form values
            const zipCode = document.getElementById('zip-code').value;
            const evModel = document.getElementById('ev-model').value;
            const incomeRange = document.getElementById('income-range').value;

            console.log('Form values:', { zipCode, evModel, incomeRange });

            // Validate inputs
            if (!zipCode || !evModel || !incomeRange) {
                this.showError('Please fill in all fields');
                return;
            }

            // Show loading state
            this.showLoading();

            // Calculate locally (no API call)
            setTimeout(() => {
                this.displayResults(zipCode, evModel, incomeRange);
            }, 1000);
        } catch (error) {
            console.error('Calculator error:', error);
            this.showError('An error occurred. Please try again.');
        }
    }

    showLoading() {
        const button = document.getElementById('calculate-btn');
        if (button) {
            button.classList.add('loading');
            button.disabled = true;
            button.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i> Calculating...';
        }
    }

    displayResults(zipCode, evModel, incomeRange) {
        // Calculate California and LA incentives based on income range
        // Federal tax credit expired Sept 30, 2025
        
        let cvrpRebate = 2000; // CA Clean Vehicle Rebate Program base
        let ladwpChargerRebate = 1000; // LADWP Level 2 charger rebate
        let driveCleanAssistance = 0; // CA Drive Clean Assistance (income-qualified)

        // Adjust based on income range
        if (incomeRange === 'under-50k') {
            cvrpRebate = 7500; // Maximum for lowest income
            driveCleanAssistance = 9500; // Additional assistance
        } else if (incomeRange === '50k-75k') {
            cvrpRebate = 7500; // High rebate for moderate-low income
            driveCleanAssistance = 5000; // Additional assistance
        } else if (incomeRange === '75k-100k') {
            cvrpRebate = 4500; // Medium rebate
            driveCleanAssistance = 0;
        } else if (incomeRange === '100k-150k') {
            cvrpRebate = 2000; // Standard rebate
            driveCleanAssistance = 0;
        } else {
            cvrpRebate = 2000; // Standard rebate for higher income
            driveCleanAssistance = 0;
        }

        // Show results
        if (this.results) {
            // Update the amounts in the results section
            const cvrpElement = document.getElementById('cvrp-amount');
            const ladwpElement = document.getElementById('ladwp-amount');
            const driveCleanElement = document.getElementById('drive-clean-amount');
            const totalElement = document.getElementById('total-savings');

            if (cvrpElement) cvrpElement.textContent = `$${cvrpRebate.toLocaleString()}`;
            if (ladwpElement) ladwpElement.textContent = `$${ladwpChargerRebate.toLocaleString()}`;
            if (driveCleanElement) driveCleanElement.textContent = driveCleanAssistance > 0 ? `$${driveCleanAssistance.toLocaleString()}` : '$0';
            
            const total = cvrpRebate + ladwpChargerRebate + driveCleanAssistance;
            if (totalElement) totalElement.textContent = `$${total.toLocaleString()}`;

            this.results.classList.remove('hidden');
            
            // Scroll to results
            setTimeout(() => {
                this.results.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            }, 100);
        }

        // Reset button
        const button = document.getElementById('calculate-btn');
        if (button) {
            button.classList.remove('loading');
            button.disabled = false;
            button.innerHTML = '<i class="fas fa-calculator mr-2"></i> Calculate My California Incentives';
        }
    }

    showError(message) {
        alert(message); // Simple alert for now, can be enhanced with custom modal
    }
}

// ===========================
// Scroll Reveal Animations
// ===========================

class ScrollReveal {
    constructor() {
        this.elements = document.querySelectorAll('.scroll-reveal');
        this.init();
    }

    init() {
        if (this.elements.length === 0) return;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('revealed');
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        this.elements.forEach(element => {
            observer.observe(element);
        });
    }
}

// ===========================
// Contact Form Handling (Future)
// ===========================

class ContactForm {
    constructor() {
        this.form = document.getElementById('contact-form');
        this.init();
    }

    init() {
        if (this.form) {
            this.form.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleSubmit();
            });
        }
    }

    async handleSubmit() {
        // Get form data
        const formData = new FormData(this.form);
        const data = Object.fromEntries(formData);

        // Show loading state
        const button = this.form.querySelector('button[type="submit"]');
        button.classList.add('loading');
        button.disabled = true;

        try {
            // TODO: Integrate with backend API
            console.log('Form data:', data);
            
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            this.showSuccess('Thank you! We\'ll get back to you soon.');
            this.form.reset();
        } catch (error) {
            this.showError('Something went wrong. Please try again.');
        } finally {
            button.classList.remove('loading');
            button.disabled = false;
        }
    }

    showSuccess(message) {
        this.showMessage(message, 'success');
    }

    showError(message) {
        this.showMessage(message, 'error');
    }

    showMessage(message, type) {
        const alertClass = type === 'success' ? 'alert-success' : 'alert-error';
        const alertDiv = document.createElement('div');
        alertDiv.className = `alert ${alertClass}`;
        alertDiv.textContent = message;

        this.form.insertAdjacentElement('beforebegin', alertDiv);

        setTimeout(() => {
            alertDiv.remove();
        }, 5000);
    }
}

// ===========================
// FAQ Accordion (Future)
// ===========================

class Accordion {
    constructor() {
        this.accordionItems = document.querySelectorAll('.accordion-item');
        this.init();
    }

    init() {
        this.accordionItems.forEach(item => {
            const header = item.querySelector('.accordion-header');
            if (header) {
                header.addEventListener('click', () => {
                    this.toggleItem(item);
                });
            }
        });
    }

    toggleItem(item) {
        const content = item.querySelector('.accordion-content');
        const isOpen = item.classList.contains('active');

        // Close all items
        this.accordionItems.forEach(i => {
            i.classList.remove('active');
            const c = i.querySelector('.accordion-content');
            if (c) c.style.maxHeight = null;
        });

        // Open clicked item if it was closed
        if (!isOpen) {
            item.classList.add('active');
            if (content) {
                content.style.maxHeight = content.scrollHeight + 'px';
            }
        }
    }
}

// ===========================
// Analytics Event Tracking (Future)
// ===========================

class Analytics {
    static trackEvent(category, action, label) {
        // TODO: Integrate with Google Analytics or other analytics platform
        console.log('Event tracked:', { category, action, label });
    }

    static trackPageView(page) {
        // TODO: Integrate with analytics platform
        console.log('Page view tracked:', page);
    }
}

// ===========================
// Utility Functions
// ===========================

const Utils = {
    // Debounce function for performance optimization
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },

    // Throttle function
    throttle(func, limit) {
        let inThrottle;
        return function(...args) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    },

    // Format currency
    formatCurrency(amount) {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0
        }).format(amount);
    },

    // Validate email
    isValidEmail(email) {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    },

    // Validate ZIP code
    isValidZipCode(zip) {
        const regex = /^\d{5}(-\d{4})?$/;
        return regex.test(zip);
    }
};

// ===========================
// Initialize Everything
// ===========================

document.addEventListener('DOMContentLoaded', () => {
    // Initialize all components
    new ThemeManager();
    new MobileNavigation();
    new NavigationScroll();
    new SmoothScroll();
    new RebateCalculator();
    new ScrollReveal();
    new ContactForm();
    new Accordion();

    // Track page view
    Analytics.trackPageView('homepage');

    // Add event listeners for CTA tracking
    document.querySelectorAll('a[href="#premium"]').forEach(link => {
        link.addEventListener('click', () => {
            Analytics.trackEvent('CTA', 'click', 'Go Premium');
        });
    });

    document.querySelectorAll('a[href="#map"]').forEach(link => {
        link.addEventListener('click', () => {
            Analytics.trackEvent('CTA', 'click', 'Find Charging Stations');
        });
    });

    // Log initialization
    console.log('%c West LA EV Life ', 'background: #004AAD; color: white; font-size: 16px; padding: 10px;');
    console.log('Website initialized successfully! 🚗⚡');
});

// ===========================
// Service Worker Registration (Future PWA Support)
// ===========================

if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        // Uncomment when service worker is ready
        // navigator.serviceWorker.register('/sw.js')
        //     .then(registration => console.log('SW registered:', registration))
        //     .catch(error => console.log('SW registration failed:', error));
    });
}

// ===========================
// Export for Module Usage
// ===========================

// If using ES6 modules in the future
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        ThemeManager,
        RebateCalculator,
        Analytics,
        Utils
    };
}