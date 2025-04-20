import 'webextension-polyfill';

console.log('Background loaded');
console.log("Edit 'chrome-extension/src/background/index.ts' and save to reload.");

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'toggleElementScan') {
    chrome.tabs.query({}, tabs => {
      for (const tab of tabs) {
        if (tab.id) {
          chrome.tabs.sendMessage(tab.id, {
            action: 'toggleElementScan',
            value: message.value,
          });
        }
      }
    });

    sendResponse({ success: true });
  }

  if (message.action === 'toggleElementScanButtonVisible') {
    chrome.tabs.query({}, tabs => {
      for (const tab of tabs) {
        if (tab.id) {
          chrome.tabs.sendMessage(tab.id, {
            action: 'toggleElementScanButtonVisible',
            value: message.value,
          });
        }
      }
    });

    sendResponse({ success: true });
  }
});
