// Substack Studio - Popup Script

document.addEventListener('DOMContentLoaded', () => {
  initializePopup();
  loadStats();
  loadUpcomingNotes();
  setupEventListeners();
});

function initializePopup() {
  console.log('Popup initialized');

  // Set default date/time for quick schedule
  const now = new Date();
  const today = now.toISOString().split('T')[0];
  const time = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

  document.getElementById('scheduleDate').value = today;
  document.getElementById('scheduleTime').value = time;
}

function setupEventListeners() {
  // Open Dashboard button
  document.getElementById('openDashboard').addEventListener('click', () => {
    chrome.runtime.sendMessage({ action: 'openDashboard' });
  });

  // Sync Data button
  document.getElementById('syncData').addEventListener('click', () => {
    syncData();
  });

  // Quick Schedule Form
  document.getElementById('quickScheduleForm').addEventListener('submit', (e) => {
    e.preventDefault();
    scheduleNote();
  });

  // Settings button
  document.getElementById('settings').addEventListener('click', () => {
    // Open settings page (to be implemented)
    alert('Settings coming soon!');
  });
}

function loadStats() {
  chrome.storage.local.get(['scheduledNotes', 'latestAnalytics'], (result) => {
    // Update scheduled notes count
    const notesCount = result.scheduledNotes?.length || 0;
    document.getElementById('totalNotes').textContent = notesCount;

    // Update subscribers count
    const subscribers = result.latestAnalytics?.data?.subscribers || '-';
    document.getElementById('subscribers').textContent =
      typeof subscribers === 'number' ? formatNumber(subscribers) : subscribers;
  });
}

function loadUpcomingNotes() {
  chrome.storage.local.get(['scheduledNotes'], (result) => {
    const notes = result.scheduledNotes || [];
    const notesList = document.getElementById('notesList');

    if (notes.length === 0) {
      notesList.innerHTML = '<p class="empty-state">No scheduled notes</p>';
      return;
    }

    // Sort by date
    const sortedNotes = notes.sort((a, b) => {
      const dateA = new Date(`${a.scheduledDate} ${a.scheduledTime}`);
      const dateB = new Date(`${b.scheduledDate} ${b.scheduledTime}`);
      return dateA - dateB;
    });

    // Show only next 3 upcoming notes
    const upcomingNotes = sortedNotes.slice(0, 3);

    notesList.innerHTML = upcomingNotes.map(note => {
      const scheduledDate = new Date(`${note.scheduledDate} ${note.scheduledTime}`);
      const formattedDate = formatDate(scheduledDate);

      return `
        <div class="note-item">
          <div class="note-content">${escapeHtml(note.content)}</div>
          <div class="note-time">${formattedDate}</div>
        </div>
      `;
    }).join('');
  });
}

function scheduleNote() {
  const content = document.getElementById('noteContent').value.trim();
  const date = document.getElementById('scheduleDate').value;
  const time = document.getElementById('scheduleTime').value;

  if (!content || !date || !time) {
    alert('Please fill in all fields');
    return;
  }

  const noteData = {
    content,
    scheduledDate: date,
    scheduledTime: time,
    status: 'scheduled'
  };

  // Save to storage
  chrome.storage.local.get(['scheduledNotes'], (result) => {
    const notes = result.scheduledNotes || [];
    notes.push({
      ...noteData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    });

    chrome.storage.local.set({ scheduledNotes: notes }, () => {
      // Send to background for alarm
      chrome.runtime.sendMessage({
        action: 'scheduleAlarm',
        data: noteData
      });

      // Clear form
      document.getElementById('noteContent').value = '';

      // Reload stats and notes
      loadStats();
      loadUpcomingNotes();

      // Show success feedback
      showNotification('Note scheduled successfully!');
    });
  });
}

function syncData() {
  const syncBtn = document.getElementById('syncData');
  const originalText = syncBtn.innerHTML;

  syncBtn.innerHTML = '<span class="icon">⏳</span> Syncing...';
  syncBtn.disabled = true;

  chrome.runtime.sendMessage({ action: 'syncData' }, (response) => {
    if (response.success) {
      showNotification('Data synced successfully!');
    } else {
      showNotification('Sync failed. Please try again.');
    }

    syncBtn.innerHTML = originalText;
    syncBtn.disabled = false;
  });
}

function showNotification(message) {
  // Simple notification (could be enhanced with a toast component)
  const notification = document.createElement('div');
  notification.textContent = message;
  notification.style.cssText = `
    position: fixed;
    top: 16px;
    left: 50%;
    transform: translateX(-50%);
    background: #fff;
    color: #000;
    padding: 12px 20px;
    border-radius: 6px;
    font-size: 13px;
    z-index: 1000;
    box-shadow: 0 2px 8px rgba(0,0,0,0.3);
  `;

  document.body.appendChild(notification);

  setTimeout(() => {
    notification.remove();
  }, 2000);
}

function formatNumber(num) {
  return num.toLocaleString('en-US');
}

function formatDate(date) {
  const now = new Date();
  const diff = date - now;
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));

  if (days === 0) {
    return `Today at ${date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}`;
  } else if (days === 1) {
    return `Tomorrow at ${date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}`;
  } else if (days < 7) {
    return date.toLocaleDateString('en-US', { weekday: 'short', hour: 'numeric', minute: '2-digit' });
  } else {
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' });
  }
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}
