let isActive = true;
let blockedDomains = [];

// Initialize on install
chrome.runtime.onInstalled.addListener(async () => {
  const stored = await chrome.storage.local.get(['blockedDomains', 'isActive']);
  blockedDomains = stored.blockedDomains || [];
  isActive = stored.isActive !== undefined ? stored.isActive : true;

  updateBlockingRules();
});

// Load state on startup
chrome.runtime.onStartup.addListener(async () => {
  const stored = await chrome.storage.local.get(['blockedDomains', 'isActive']);
  blockedDomains = stored.blockedDomains || [];
  isActive = stored.isActive !== undefined ? stored.isActive : true;

  updateBlockingRules();
});

// Listen for messages from popup
chrome.runtime.onMessage.addListener((request, _sender, sendResponse) => {
  if (request.action === 'updateDomains') {
    blockedDomains = request.domains;
    updateBlockingRules();
  } else if (request.action === 'toggleBlocking') {
    isActive = request.isActive;
    updateBlockingRules();
  }
  sendResponse({ success: true });
});

// Update blocking rules
async function updateBlockingRules() {
  // Remove all existing rules
  const existingRules = await chrome.declarativeNetRequest.getDynamicRules();
  const ruleIds = existingRules.map(rule => rule.id);

  if (ruleIds.length > 0) {
    await chrome.declarativeNetRequest.updateDynamicRules({
      removeRuleIds: ruleIds,
    });
  }

  // If blocking is inactive, don't add any rules
  if (!isActive || blockedDomains.length === 0) {
    return;
  }

  // Create new rules for each domain
  const rules = blockedDomains.map((domain, index) => ({
    id: index + 1,
    priority: 1,
    action: {
      type: 'block',
    },
    condition: {
      urlFilter: `||${domain}^`,
      resourceTypes: [
        'main_frame',
        'sub_frame',
        'stylesheet',
        'script',
        'image',
        'font',
        'object',
        'xmlhttprequest',
        'ping',
        'csp_report',
        'media',
        'websocket',
        'other',
      ],
    },
  }));

  // Add new rules
  if (rules.length > 0) {
    await chrome.declarativeNetRequest.updateDynamicRules({
      addRules: rules,
    });
  }
}

// Handle storage changes (in case storage is modified from other sources)
chrome.storage.onChanged.addListener((changes, namespace) => {
  if (namespace === 'local') {
    if (changes.blockedDomains) {
      blockedDomains = changes.blockedDomains.newValue || [];
      updateBlockingRules();
    }
    if (changes.isActive) {
      isActive = changes.isActive.newValue;
      updateBlockingRules();
    }
  }
});