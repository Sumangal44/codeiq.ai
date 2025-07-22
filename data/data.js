/**
 * Data management and API simulation for CodeIQ.ai
 * This module handles data operations and provides mock API functionality
 */

// Mock data for the application
const appData = {
  stats: [
    {
      id: 1,
      number: '50K+',
      label: 'Active Developers',
      description: 'Developers using CodeIQ.ai platform'
    },
    {
      id: 2,
      number: '1M+',
      label: 'Lines of Code',
      description: 'Lines of code analyzed and improved'
    },
    {
      id: 3,
      number: '99.9%',
      label: 'Uptime',
      description: 'Platform reliability and availability'
    },
    {
      id: 4,
      number: '24/7',
      label: 'Support',
      description: 'Round-the-clock customer support'
    }
  ],
  
  features: [
    {
      id: 1,
      icon: '🤖',
      title: 'AI-Powered Assistance',
      description: 'Get intelligent code suggestions and automated code reviews',
      category: 'ai'
    },
    {
      id: 2,
      icon: '⚡',
      title: 'Fast Development',
      description: 'Accelerate your development workflow with smart tools',
      category: 'performance'
    },
    {
      id: 3,
      icon: '🔒',
      title: 'Secure Platform',
      description: 'Enterprise-grade security for your code and data',
      category: 'security'
    }
  ],
  
  user: {
    name: 'Guest User',
    preferences: {
      theme: 'light',
      language: 'en',
      notifications: true
    }
  }
};

/**
 * Data API Class
 * Simulates API calls with promises and realistic delays
 */
class DataAPI {
  /**
   * Simulates network delay
   * @param {number} ms - Delay in milliseconds
   * @returns {Promise} Promise that resolves after delay
   */
  static delay(ms = 500) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Get platform statistics
   * @returns {Promise<Array>} Promise resolving to stats array
   */
  static async getStats() {
    await this.delay(300);
    
    try {
      // Simulate potential API failure (5% chance)
      if (Math.random() < 0.05) {
        throw new Error('Failed to fetch statistics');
      }
      
      return {
        success: true,
        data: appData.stats,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        data: []
      };
    }
  }

  /**
   * Get feature information
   * @param {string} category - Optional category filter
   * @returns {Promise<Array>} Promise resolving to features array
   */
  static async getFeatures(category = null) {
    await this.delay(200);
    
    try {
      let features = appData.features;
      
      if (category) {
        features = features.filter(feature => feature.category === category);
      }
      
      return {
        success: true,
        data: features,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        data: []
      };
    }
  }

  /**
   * Get user information
   * @returns {Promise<Object>} Promise resolving to user object
   */
  static async getUser() {
    await this.delay(100);
    
    try {
      return {
        success: true,
        data: appData.user,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        data: null
      };
    }
  }

  /**
   * Update user preferences
   * @param {Object} preferences - New preferences object
   * @returns {Promise<Object>} Promise resolving to updated user
   */
  static async updateUserPreferences(preferences) {
    await this.delay(400);
    
    try {
      // Merge new preferences with existing ones
      appData.user.preferences = {
        ...appData.user.preferences,
        ...preferences
      };
      
      return {
        success: true,
        data: appData.user,
        message: 'Preferences updated successfully',
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        data: null
      };
    }
  }

  /**
   * Simulate analytics tracking
   * @param {string} event - Event name
   * @param {Object} data - Event data
   * @returns {Promise<Object>} Promise resolving to tracking result
   */
  static async trackEvent(event, data = {}) {
    await this.delay(50);
    
    try {
      const eventData = {
        event,
        data,
        timestamp: new Date().toISOString(),
        sessionId: this.generateSessionId()
      };
      
      // In a real app, this would send to analytics service
      console.log('Analytics Event:', eventData);
      
      return {
        success: true,
        message: 'Event tracked successfully'
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Generate a simple session ID
   * @returns {string} Generated session ID
   */
  static generateSessionId() {
    return Math.random().toString(36).substr(2, 9);
  }
}

/**
 * Local Storage Helper
 * Provides methods for local data persistence
 */
class LocalStorage {
  /**
   * Save data to localStorage
   * @param {string} key - Storage key
   * @param {*} data - Data to store
   * @returns {boolean} Success status
   */
  static save(key, data) {
    try {
      localStorage.setItem(key, JSON.stringify(data));
      return true;
    } catch (error) {
      console.error('Failed to save to localStorage:', error);
      return false;
    }
  }

  /**
   * Load data from localStorage
   * @param {string} key - Storage key
   * @param {*} defaultValue - Default value if key doesn't exist
   * @returns {*} Stored data or default value
   */
  static load(key, defaultValue = null) {
    try {
      const stored = localStorage.getItem(key);
      return stored ? JSON.parse(stored) : defaultValue;
    } catch (error) {
      console.error('Failed to load from localStorage:', error);
      return defaultValue;
    }
  }

  /**
   * Remove data from localStorage
   * @param {string} key - Storage key
   * @returns {boolean} Success status
   */
  static remove(key) {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error('Failed to remove from localStorage:', error);
      return false;
    }
  }

  /**
   * Clear all localStorage data
   * @returns {boolean} Success status
   */
  static clear() {
    try {
      localStorage.clear();
      return true;
    } catch (error) {
      console.error('Failed to clear localStorage:', error);
      return false;
    }
  }
}

/**
 * Event Bus for component communication
 */
class EventBus {
  constructor() {
    this.events = {};
  }

  /**
   * Subscribe to an event
   * @param {string} event - Event name
   * @param {Function} callback - Callback function
   */
  on(event, callback) {
    if (!this.events[event]) {
      this.events[event] = [];
    }
    this.events[event].push(callback);
  }

  /**
   * Unsubscribe from an event
   * @param {string} event - Event name
   * @param {Function} callback - Callback function to remove
   */
  off(event, callback) {
    if (!this.events[event]) return;
    
    this.events[event] = this.events[event].filter(cb => cb !== callback);
  }

  /**
   * Emit an event
   * @param {string} event - Event name
   * @param {*} data - Event data
   */
  emit(event, data) {
    if (!this.events[event]) return;
    
    this.events[event].forEach(callback => {
      try {
        callback(data);
      } catch (error) {
        console.error(`Error in event handler for ${event}:`, error);
      }
    });
  }
}

// Create global event bus instance
const eventBus = new EventBus();

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { DataAPI, LocalStorage, EventBus, eventBus, appData };
}
