// Substack Studio - Background Service Worker
// Handles scheduling, alarms, and data sync

console.log('Substack Studio: Service worker loaded');

// Web dashboard URL (can be localhost for development or deployed URL)
const DASHBOARD_URL = 'http://localhost:3000';

// Listen for extension installation
chrome.runtime.onInstalled.addListener((details) => {
  console.log('Substack Studio installed:', details.reason);

  if (details.reason === 'install') {
    // Set up initial storage
    chrome.storage.local.set({
      scheduledNotes: [],
      analyticsHistory: [],
      settings: {
        dashboardUrl: DASHBOARD_URL,
        syncEnabled: true
      }
    });

    // Open welcome page
    chrome.tabs.create({
      url: `${DASHBOARD_URL}?welcome=true`
    });
  }
});

// Listen for messages from content scripts and popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  handleMessage(request, sender, sendResponse);
  return true; // Keep channel open for async response
});

function handleMessage(request, sender, sendResponse) {
  switch (request.action) {
    case 'openDashboard':
      openDashboard();
      sendResponse({ success: true });
      break;

    case 'scheduleAlarm':
      scheduleNoteAlarm(request.data);
      sendResponse({ success: true });
      break;

    case 'getScheduledNotes':
      getScheduledNotes(sendResponse);
      break;

    case 'syncData':
      syncDataToDashboard(sendResponse);
      break;

    case 'clearData':
      clearAllData(sendResponse);
      break;

    default:
      sendResponse({ success: false, error: 'Unknown action' });
  }
}

function openDashboard() {
  chrome.storage.local.get(['settings'], (result) => {
    const dashboardUrl = result.settings?.dashboardUrl || DASHBOARD_URL;

    console.log('Opening dashboard at:', dashboardUrl);

    // Try to find existing dashboard tab
    chrome.tabs.query({}, (tabs) => {
      if (chrome.runtime.lastError) {
        console.error('Error querying tabs:', chrome.runtime.lastError);
        // Fallback: just open new tab
        chrome.tabs.create({ url: dashboardUrl });
        return;
      }

      const dashboardTab = tabs.find(tab =>
        tab.url && tab.url.startsWith(dashboardUrl)
      );

      if (dashboardTab) {
        // Focus existing tab
        console.log('Focusing existing dashboard tab');
        chrome.tabs.update(dashboardTab.id, { active: true });
        chrome.windows.update(dashboardTab.windowId, { focused: true });
      } else {
        // Open new tab
        console.log('Creating new dashboard tab');
        chrome.tabs.create({ url: dashboardUrl }, (tab) => {
          if (chrome.runtime.lastError) {
            console.error('Error creating tab:', chrome.runtime.lastError);
          } else {
            console.log('Dashboard tab created:', tab.id);
          }
        });
      }
    });
  });
}

function scheduleNoteAlarm(noteData) {
  const scheduledTime = new Date(noteData.scheduledDate);
  scheduledTime.setHours(
    parseInt(noteData.scheduledTime.split(':')[0]),
    parseInt(noteData.scheduledTime.split(':')[1])
  );

  const alarmName = `note-${Date.now()}`;

  // Create alarm
  chrome.alarms.create(alarmName, {
    when: scheduledTime.getTime()
  });

  console.log(`Scheduled alarm ${alarmName} for ${scheduledTime}`);

  // Store alarm reference
  chrome.storage.local.get(['alarms'], (result) => {
    const alarms = result.alarms || {};
    alarms[alarmName] = {
      noteData,
      scheduledTime: scheduledTime.toISOString()
    };
    chrome.storage.local.set({ alarms });
  });
}

// Listen for alarms
chrome.alarms.onAlarm.addListener((alarm) => {
  console.log('Alarm triggered:', alarm.name);

  chrome.storage.local.get(['alarms'], (result) => {
    const alarmData = result.alarms?.[alarm.name];

    if (alarmData) {
      // Show notification
      chrome.notifications.create({
        type: 'basic',
        iconUrl: '../icons/icon128.png',
        title: 'Substack Studio - Time to Post!',
        message: `It's time to publish: "${alarmData.noteData.content}"`,
        priority: 2,
        buttons: [
          { title: 'Open Substack' },
          { title: 'Dismiss' }
        ]
      });

      // Open Substack in new tab
      chrome.tabs.create({
        url: 'https://substack.com/publish'
      });

      // Clean up alarm
      const alarms = result.alarms;
      delete alarms[alarm.name];
      chrome.storage.local.set({ alarms });
    }
  });
});

function getScheduledNotes(sendResponse) {
  chrome.storage.local.get(['scheduledNotes'], (result) => {
    sendResponse({
      success: true,
      notes: result.scheduledNotes || []
    });
  });
}

function syncDataToDashboard(sendResponse) {
  chrome.storage.local.get(null, (allData) => {
    // Prepare data for dashboard
    const syncData = {
      notes: allData.scheduledNotes || [],
      analytics: allData.analyticsHistory || [],
      latestAnalytics: allData.latestAnalytics,
      timestamp: new Date().toISOString()
    };

    // Store in a way that dashboard can access
    chrome.storage.local.set({
      dashboardSync: syncData
    });

    sendResponse({
      success: true,
      data: syncData
    });
  });
}

function clearAllData(sendResponse) {
  chrome.storage.local.clear(() => {
    // Reset to defaults
    chrome.storage.local.set({
      scheduledNotes: [],
      analyticsHistory: [],
      settings: {
        dashboardUrl: DASHBOARD_URL,
        syncEnabled: true
      }
    });

    sendResponse({ success: true });
  });
}

// Periodic sync to dashboard (every 5 minutes)
chrome.alarms.create('periodicSync', {
  periodInMinutes: 5
});

chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === 'periodicSync') {
    chrome.storage.local.get(['settings'], (result) => {
      if (result.settings?.syncEnabled) {
        syncDataToDashboard(() => {
          console.log('Periodic sync completed');
        });
      }
    });
  }
});
