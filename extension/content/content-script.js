// Substack Studio - Content Script
// Injects into Substack pages to extract analytics and enable scheduling

(function() {
  'use strict';

  console.log('Substack Studio: Content script loaded');

  // Check if we're on a Substack page
  const isSubstackPublisher = window.location.hostname.includes('substack.com');

  if (!isSubstackPublisher) return;

  // Initialize Substack Studio integration
  class SubstackStudioIntegration {
    constructor() {
      this.observerInitialized = false;
      this.init();
    }

    init() {
      // Wait for page to load
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => this.setup());
      } else {
        this.setup();
      }
    }

    setup() {
      console.log('Substack Studio: Setting up...');

      // Add Studio button to Substack interface
      this.addStudioButton();

      // Extract analytics data
      this.extractAnalytics();

      // Monitor for new content
      this.observePageChanges();

      // Listen for messages from popup/background
      chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
        this.handleMessage(request, sender, sendResponse);
        return true; // Keep channel open for async response
      });
    }

    addStudioButton() {
      // Find Substack's main navigation
      const nav = document.querySelector('nav, header');
      if (!nav) return;

      // Check if button already exists
      if (document.getElementById('substack-studio-btn')) return;

      // Create Studio button
      const button = document.createElement('button');
      button.id = 'substack-studio-btn';
      button.className = 'substack-studio-button';
      button.innerHTML = '📊 Studio';
      button.style.cssText = `
        background: #000;
        color: #fff;
        border: 1px solid #333;
        padding: 8px 16px;
        border-radius: 6px;
        cursor: pointer;
        font-size: 14px;
        font-weight: 500;
        margin-left: 12px;
      `;

      button.addEventListener('click', () => {
        this.openStudioDashboard();
      });

      // Append to navigation
      const navContent = nav.querySelector('div') || nav;
      navContent.appendChild(button);
    }

    openStudioDashboard() {
      // Send message to open web dashboard
      chrome.runtime.sendMessage({
        action: 'openDashboard'
      });
    }

    extractAnalytics() {
      const analytics = {
        timestamp: new Date().toISOString(),
        url: window.location.href,
        data: {}
      };

      // Extract subscriber count
      const subscriberElements = document.querySelectorAll('[class*="subscriber"], [class*="Subscriber"]');
      subscriberElements.forEach(el => {
        const text = el.textContent;
        const match = text.match(/(\d+(?:,\d+)*)\s*subscriber/i);
        if (match) {
          analytics.data.subscribers = parseInt(match[1].replace(/,/g, ''));
        }
      });

      // Extract post metrics (if on stats page)
      if (window.location.pathname.includes('/stats') || window.location.pathname.includes('/analytics')) {
        // Look for metrics tables
        const tables = document.querySelectorAll('table');
        tables.forEach(table => {
          // Extract data from tables
          const headers = Array.from(table.querySelectorAll('th')).map(th => th.textContent.trim());
          const rows = Array.from(table.querySelectorAll('tr'));

          analytics.data.tableData = rows.map(row => {
            const cells = Array.from(row.querySelectorAll('td'));
            return cells.map(cell => cell.textContent.trim());
          });
        });
      }

      // Store analytics data
      this.saveAnalytics(analytics);
    }

    saveAnalytics(analytics) {
      chrome.storage.local.get(['analyticsHistory'], (result) => {
        const history = result.analyticsHistory || [];
        history.push(analytics);

        // Keep last 100 entries
        if (history.length > 100) {
          history.shift();
        }

        chrome.storage.local.set({
          analyticsHistory: history,
          latestAnalytics: analytics
        });
      });
    }

    observePageChanges() {
      if (this.observerInitialized) return;

      const observer = new MutationObserver((mutations) => {
        // Re-extract analytics when page content changes
        this.extractAnalytics();
      });

      observer.observe(document.body, {
        childList: true,
        subtree: true
      });

      this.observerInitialized = true;
    }

    handleMessage(request, sender, sendResponse) {
      switch (request.action) {
        case 'extractAnalytics':
          this.extractAnalytics();
          chrome.storage.local.get(['latestAnalytics'], (result) => {
            sendResponse({ success: true, data: result.latestAnalytics });
          });
          break;

        case 'scheduleNote':
          this.scheduleNote(request.data);
          sendResponse({ success: true });
          break;

        case 'getPageInfo':
          sendResponse({
            success: true,
            url: window.location.href,
            title: document.title,
            isSubstack: true
          });
          break;

        default:
          sendResponse({ success: false, error: 'Unknown action' });
      }
    }

    scheduleNote(noteData) {
      // Store scheduled note
      chrome.storage.local.get(['scheduledNotes'], (result) => {
        const notes = result.scheduledNotes || [];
        notes.push({
          ...noteData,
          id: Date.now().toString(),
          createdAt: new Date().toISOString()
        });

        chrome.storage.local.set({ scheduledNotes: notes });

        // Send to background for alarm scheduling
        chrome.runtime.sendMessage({
          action: 'scheduleAlarm',
          data: noteData
        });
      });
    }
  }

  // Initialize integration
  new SubstackStudioIntegration();

})();
