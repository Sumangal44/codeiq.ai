/**
 * CodeIQ.ai Main Application
 * Handles application initialization, component loading, and user interactions
 */

class CodeIQApp {
  constructor() {
    this.isInitialized = false;
    this.components = {};
    this.currentTheme = 'light';
    
    // Bind methods to maintain context
    this.init = this.init.bind(this);
    this.loadComponents = this.loadComponents.bind(this);
    this.setupEventListeners = this.setupEventListeners.bind(this);
    this.loadStats = this.loadStats.bind(this);
  }

  /**
   * Initialize the application
   */
  async init() {
    try {
      console.log('Initializing CodeIQ.ai application...');
      
      // Load user preferences
      this.loadUserPreferences();
      
      // Load components
      await this.loadComponents();
      
      // Setup event listeners
      this.setupEventListeners();
      
      // Load dynamic content
      await this.loadStats();
      
      // Initialize animations
      this.initializeAnimations();
      
      // Mark as initialized
      this.isInitialized = true;
      
      console.log('Application initialized successfully!');
      
      // Track initialization
      if (typeof DataAPI !== 'undefined') {
        DataAPI.trackEvent('app_initialized', {
          timestamp: new Date().toISOString(),
          userAgent: navigator.userAgent
        });
      }
      
    } catch (error) {
      console.error('Failed to initialize application:', error);
      this.showError('Failed to load application. Please refresh the page.');
    }
  }

  /**
   * Load HTML components into their containers
   */
  async loadComponents() {
    const components = [
      { id: 'header-container', file: 'components/header.html' },
      { id: 'footer-container', file: 'components/footer.html' }
    ];

    const loadPromises = components.map(async (component) => {
      try {
        const response = await fetch(component.file);
        if (!response.ok) {
          throw new Error(`Failed to load ${component.file}`);
        }
        
        const html = await response.text();
        const container = document.getElementById(component.id);
        
        if (container) {
          container.innerHTML = html;
          this.components[component.id] = container;
        }
        
      } catch (error) {
        console.error(`Error loading component ${component.file}:`, error);
      }
    });

    await Promise.all(loadPromises);
  }

  /**
   * Setup event listeners for user interactions
   */
  setupEventListeners() {
    // Navigation toggle for mobile
    this.setupMobileNavigation();
    
    // Button interactions
    this.setupButtonHandlers();
    
    // Smooth scrolling for navigation links
    this.setupSmoothScrolling();
    
    // Theme toggle (if implemented)
    this.setupThemeToggle();
    
    // Window resize handler
    this.setupResizeHandler();
    
    // Global error handling
    this.setupErrorHandling();
  }

  /**
   * Setup mobile navigation toggle
   */
  setupMobileNavigation() {
    const toggleBtn = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    
    if (toggleBtn && navMenu) {
      toggleBtn.addEventListener('click', () => {
        navMenu.classList.toggle('nav__menu--active');
        
        // Animate hamburger menu
        const hamburgers = toggleBtn.querySelectorAll('.nav__hamburger');
        hamburgers.forEach(bar => bar.classList.toggle('active'));
        
        // Track interaction
        if (typeof DataAPI !== 'undefined') {
          DataAPI.trackEvent('mobile_menu_toggle', {
            isOpen: navMenu.classList.contains('nav__menu--active')
          });
        }
      });
      
      // Close menu when clicking outside
      document.addEventListener('click', (e) => {
        if (!toggleBtn.contains(e.target) && !navMenu.contains(e.target)) {
          navMenu.classList.remove('nav__menu--active');
        }
      });
    }
  }

  /**
   * Setup button click handlers
   */
  setupButtonHandlers() {
    // Get Started button
    const getStartedBtn = document.getElementById('getStartedBtn');
    if (getStartedBtn) {
      getStartedBtn.addEventListener('click', () => {
        this.handleGetStarted();
      });
    }
    
    // Learn More button
    const learnMoreBtn = document.getElementById('learnMoreBtn');
    if (learnMoreBtn) {
      learnMoreBtn.addEventListener('click', () => {
        this.handleLearnMore();
      });
    }
  }

  /**
   * Setup smooth scrolling for navigation links
   */
  setupSmoothScrolling() {
    const navLinks = document.querySelectorAll('a[href^="#"]');
    
    navLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        
        const targetId = link.getAttribute('href').substring(1);
        const targetElement = document.getElementById(targetId);
        
        if (targetElement) {
          targetElement.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
          
          // Update active navigation link
          this.updateActiveNavLink(link);
          
          // Track navigation
          if (typeof DataAPI !== 'undefined') {
            DataAPI.trackEvent('navigation_click', {
              target: targetId,
              source: 'nav_link'
            });
          }
        }
      });
    });
  }

  /**
   * Setup theme toggle functionality
   */
  setupThemeToggle() {
    // Implementation for future theme switching
    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
      themeToggle.addEventListener('click', () => {
        this.toggleTheme();
      });
    }
  }

  /**
   * Setup window resize handler
   */
  setupResizeHandler() {
    let resizeTimeout;
    
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        this.handleResize();
      }, 250);
    });
  }

  /**
   * Setup global error handling
   */
  setupErrorHandling() {
    window.addEventListener('error', (e) => {
      console.error('Global error caught:', e.error);
      
      // Track error
      if (typeof DataAPI !== 'undefined') {
        DataAPI.trackEvent('javascript_error', {
          message: e.error?.message || 'Unknown error',
          filename: e.filename,
          lineno: e.lineno,
          colno: e.colno
        });
      }
    });
  }

  /**
   * Load and display statistics
   */
  async loadStats() {
    const statsGrid = document.getElementById('stats-grid');
    if (!statsGrid) return;

    try {
      // Show loading state
      statsGrid.innerHTML = '<div class="loading"></div>';
      
      // Fetch stats data
      const response = await DataAPI.getStats();
      
      if (response.success) {
        this.renderStats(response.data, statsGrid);
      } else {
        throw new Error(response.error || 'Failed to load statistics');
      }
      
    } catch (error) {
      console.error('Error loading stats:', error);
      statsGrid.innerHTML = '<p>Failed to load statistics. Please try again later.</p>';
    }
  }

  /**
   * Render statistics to the DOM
   * @param {Array} stats - Statistics data
   * @param {HTMLElement} container - Container element
   */
  renderStats(stats, container) {
    const statsHTML = stats.map(stat => `
      <div class="stat-card fade-in">
        <div class="stat-card__number">${stat.number}</div>
        <div class="stat-card__label">${stat.label}</div>
      </div>
    `).join('');
    
    container.innerHTML = statsHTML;
    
    // Trigger animations
    setTimeout(() => {
      const statCards = container.querySelectorAll('.stat-card');
      statCards.forEach((card, index) => {
        setTimeout(() => {
          card.classList.add('visible');
        }, index * 100);
      });
    }, 100);
  }

  /**
   * Initialize scroll-triggered animations
   */
  initializeAnimations() {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, observerOptions);

    // Observe elements with fade-in class
    const animatedElements = document.querySelectorAll('.fade-in');
    animatedElements.forEach(el => observer.observe(el));
  }

  /**
   * Handle Get Started button click
   */
  handleGetStarted() {
    // Track interaction
    if (typeof DataAPI !== 'undefined') {
      DataAPI.trackEvent('get_started_click', {
        source: 'hero_section'
      });
    }
    
    // Implement get started logic
    this.showNotification('Get Started functionality coming soon!', 'info');
  }

  /**
   * Handle Learn More button click
   */
  handleLearnMore() {
    // Track interaction
    if (typeof DataAPI !== 'undefined') {
      DataAPI.trackEvent('learn_more_click', {
        source: 'hero_section'
      });
    }
    
    // Scroll to features section
    const featuresSection = document.querySelector('.features');
    if (featuresSection) {
      featuresSection.scrollIntoView({ behavior: 'smooth' });
    }
  }

  /**
   * Update active navigation link
   * @param {HTMLElement} activeLink - Currently active link
   */
  updateActiveNavLink(activeLink) {
    // Remove active class from all nav links
    const navLinks = document.querySelectorAll('.nav__link');
    navLinks.forEach(link => link.classList.remove('nav__link--active'));
    
    // Add active class to current link
    activeLink.classList.add('nav__link--active');
  }

  /**
   * Toggle application theme
   */
  toggleTheme() {
    this.currentTheme = this.currentTheme === 'light' ? 'dark' : 'light';
    document.body.setAttribute('data-theme', this.currentTheme);
    
    // Save preference
    LocalStorage.save('theme', this.currentTheme);
    
    // Track theme change
    if (typeof DataAPI !== 'undefined') {
      DataAPI.trackEvent('theme_toggle', {
        newTheme: this.currentTheme
      });
    }
  }

  /**
   * Handle window resize events
   */
  handleResize() {
    // Close mobile menu on resize to desktop
    if (window.innerWidth > 768) {
      const navMenu = document.getElementById('nav-menu');
      if (navMenu) {
        navMenu.classList.remove('nav__menu--active');
      }
    }
  }

  /**
   * Load user preferences from localStorage
   */
  loadUserPreferences() {
    const savedTheme = LocalStorage.load('theme', 'light');
    this.currentTheme = savedTheme;
    document.body.setAttribute('data-theme', this.currentTheme);
  }

  /**
   * Show notification to user
   * @param {string} message - Notification message
   * @param {string} type - Notification type (info, success, warning, error)
   */
  showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification--${type}`;
    notification.textContent = message;
    
    // Add to DOM
    document.body.appendChild(notification);
    
    // Show with animation
    setTimeout(() => notification.classList.add('show'), 100);
    
    // Remove after delay
    setTimeout(() => {
      notification.classList.remove('show');
      setTimeout(() => notification.remove(), 300);
    }, 3000);
  }

  /**
   * Show error message to user
   * @param {string} message - Error message
   */
  showError(message) {
    this.showNotification(message, 'error');
  }

  /**
   * Get application status
   * @returns {Object} Application status information
   */
  getStatus() {
    return {
      initialized: this.isInitialized,
      theme: this.currentTheme,
      components: Object.keys(this.components),
      timestamp: new Date().toISOString()
    };
  }
}

// Initialize application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  // Create global app instance
  window.codeiqApp = new CodeIQApp();
  
  // Initialize the application
  window.codeiqApp.init().catch(error => {
    console.error('Failed to initialize CodeIQ.ai application:', error);
  });
});

// Export for testing or module usage
if (typeof module !== 'undefined' && module.exports) {
  module.exports = CodeIQApp;
}
