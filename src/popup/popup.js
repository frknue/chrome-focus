document.addEventListener('DOMContentLoaded', async () => {
  const toggleBlocking = document.getElementById('toggleBlocking');
  const status = document.getElementById('status');
  const domainInput = document.getElementById('domainInput');
  const addButton = document.getElementById('addButton');
  const domainList = document.getElementById('domainList');

  // Load saved state
  const { blockedDomains = [], isActive = true } = await chrome.storage.local.get([
    'blockedDomains',
    'isActive',
  ]);

  toggleBlocking.checked = isActive;
  updateStatus(isActive);
  renderDomainList(blockedDomains);

  // Toggle blocking
  toggleBlocking.addEventListener('change', async () => {
    const isActive = toggleBlocking.checked;
    await chrome.storage.local.set({ isActive });
    updateStatus(isActive);

    // Send message to background script
    chrome.runtime.sendMessage({ action: 'toggleBlocking', isActive });
  });

  // Add domain
  addButton.addEventListener('click', addDomain);
  domainInput.addEventListener('keypress', e => {
    if (e.key === 'Enter') {
      addDomain();
    }
  });

  async function addDomain() {
    const domain = domainInput.value.trim().toLowerCase();
    if (!domain) {
      return;
    }

    // Basic domain validation
    const domainRegex = /^([a-z0-9]+(-[a-z0-9]+)*\.)+[a-z]{2,}$/;
    if (!domainRegex.test(domain)) {
      alert('Please enter a valid domain (e.g., example.com)');
      return;
    }

    const { blockedDomains = [] } = await chrome.storage.local.get('blockedDomains');

    if (blockedDomains.includes(domain)) {
      alert('Domain already blocked');
      return;
    }

    blockedDomains.push(domain);
    await chrome.storage.local.set({ blockedDomains });

    // Update UI
    domainInput.value = '';
    renderDomainList(blockedDomains);

    // Update background script
    chrome.runtime.sendMessage({ action: 'updateDomains', domains: blockedDomains });
  }

  async function removeDomain(domain) {
    const { blockedDomains = [] } = await chrome.storage.local.get('blockedDomains');
    const updatedDomains = blockedDomains.filter(d => d !== domain);

    await chrome.storage.local.set({ blockedDomains: updatedDomains });
    renderDomainList(updatedDomains);

    // Update background script
    chrome.runtime.sendMessage({ action: 'updateDomains', domains: updatedDomains });
  }

  function renderDomainList(domains) {
    domainList.innerHTML = '';

    domains.forEach(domain => {
      const item = document.createElement('div');
      item.className = 'domain-item';

      const name = document.createElement('span');
      name.className = 'domain-name';
      name.textContent = domain;

      const removeBtn = document.createElement('button');
      removeBtn.className = 'remove-button';
      removeBtn.textContent = 'Remove';
      removeBtn.addEventListener('click', () => removeDomain(domain));

      item.appendChild(name);
      item.appendChild(removeBtn);
      domainList.appendChild(item);
    });
  }

  function updateStatus(isActive) {
    status.textContent = isActive ? 'Active' : 'Inactive';
    status.className = isActive ? '' : 'inactive';
  }
});