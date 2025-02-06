// get the extension state from the local storage
chrome.storage.local.get(['extensionEnabled'], (result) => {
  // store the state
  const isEnabled = result.extensionEnabled;

  // check if the its enabled
  if (isEnabled) {
    // if enabled, add the 'extension-enabled' class to the body element
    document.body.classList.add('extension-enabled');
  } else {
    // if not, remove the 'extension-enabled' class from the body element
    document.body.classList.remove('extension-enabled');
  }
});
