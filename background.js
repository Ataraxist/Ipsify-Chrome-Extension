// add an event listener to the toolbar icon
chrome.action.onClicked.addListener((tab) => {
  // when the icon is clicked, get the extension enabled property from local storage
  chrome.storage.local.get(['extensionEnabled'], (result) => {
    // store the current state in a variable
    const isEnabled = result.extensionEnabled;
    // toggle the state and save it back to local storage
    chrome.storage.local.set({ extensionEnabled: !isEnabled }, () => {
      // execute the toggle.js script to update the state on the current tab
      chrome.scripting.executeScript(
        {
          target: { tabId: tab.id },
          files: ['toggle.js'],
        },
        () => {
          // refresh that shit
          chrome.tabs.reload(tab.id);
        }
      );
      // set the icon based on the new state
      const iconPath = isEnabled
        ? {
            16: 'disabled16.png',
            48: 'disabled48.png',
            128: 'disabled128.png',
          }
        : {
            16: 'enabled16.png',
            48: 'enabled48.png',
            128: 'enabled128.png',
          };

      chrome.action.setIcon({ path: iconPath });
    });
  });
});
