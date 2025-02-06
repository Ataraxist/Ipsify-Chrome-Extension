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
    });
  });
});
