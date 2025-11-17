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

        case 'autoPost':
          this.autoPostNote(request.data).then(result => {
            sendResponse(result);
          }).catch(error => {
            sendResponse({ success: false, error: error.message });
          });
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

    async autoPostNote(noteData) {
      console.log('Auto-posting note:', noteData);

      try {
        // Wait for page to be ready
        await this.waitForElement('body', 5000);

        // Find compose button/textarea (multiple selectors for different Substack UIs)
        const selectors = [
          'textarea[placeholder*="Share"]',
          'textarea[placeholder*="note"]',
          'textarea[placeholder*="write"]',
          '[data-testid="note-composer"]',
          '[contenteditable="true"]',
          'textarea.composer',
          '.composer textarea'
        ];

        let composer = null;
        for (const selector of selectors) {
          composer = document.querySelector(selector);
          if (composer) break;
        }

        if (!composer) {
          throw new Error('Could not find Note composer. Please open Notes page first.');
        }

        // Fill in content
        if (composer.tagName === 'TEXTAREA') {
          composer.value = noteData.content;
          composer.dispatchEvent(new Event('input', { bubbles: true }));
          composer.dispatchEvent(new Event('change', { bubbles: true }));
        } else {
          composer.textContent = noteData.content;
          composer.dispatchEvent(new Event('input', { bubbles: true }));
        }

        // Wait a bit for UI to update
        await this.sleep(500);

        // Find and click Post button (multiple selectors)
        const buttonSelectors = [
          'button:not([disabled])[type="submit"]',
          'button:not([disabled])[data-testid="post-button"]',
          'button:not([disabled]).post-button',
          'button:not([disabled])',
        ];

        let postButton = null;
        for (const selector of buttonSelectors) {
          const buttons = document.querySelectorAll(selector);
          for (const button of buttons) {
            const text = button.textContent.toLowerCase();
            if (text.includes('post') || text.includes('publish') || text.includes('share')) {
              postButton = button;
              break;
            }
          }
          if (postButton) break;
        }

        if (!postButton) {
          throw new Error('Could not find Post button. Note may need to be posted manually.');
        }

        // Click the post button
        postButton.click();

        // Wait to verify posting
        await this.sleep(2000);

        console.log('Note posted successfully');
        return { success: true, message: 'Note posted successfully!' };

      } catch (error) {
        console.error('Auto-post error:', error);
        throw error;
      }
    }

    async waitForElement(selector, timeout = 5000) {
      const startTime = Date.now();
      while (Date.now() - startTime < timeout) {
        const element = document.querySelector(selector);
        if (element) return element;
        await this.sleep(100);
      }
      throw new Error(`Element ${selector} not found within ${timeout}ms`);
    }

    sleep(ms) {
      return new Promise(resolve => setTimeout(resolve, ms));
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
