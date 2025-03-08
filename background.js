// 🌟 This script runs in the background and handles extension interactions and downloads.

// 🎭 Log that the background script is active and waiting for a click event.
console.log('🥸 Waiting for click.');

// 📌 Add an event listener for when the user clicks the extension's toolbar icon.
chrome.action.onClicked.addListener((tab) => {
  console.log('⚠️ Click Detected on tab:', tab);

  // 🚀 Inject `scraper.js` into the active tab to extract image URLs.
  chrome.scripting.executeScript(
    {
      target: { tabId: tab.id }, // Run the script on the currently active tab.
      files: ['scraper.js'], // The script that finds images and sends URLs to the background script.
    },
    (results) => {
      // ❗ Handle any errors that occur while injecting the script.
      if (chrome.runtime.lastError) {
        console.error(
          `❌ Error executing script: ${chrome.runtime.lastError.message}`
        );
      } else if (!results || results.length === 0) {
        console.warn('⚠️ No results returned from executing scraper.js');
      } else {
        console.log('✅ Scraper.js executed successfully:', results);
      }
    }
  );
});

// 📥 Listen for messages from `scraper.js`, which sends image URLs for downloading.
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  // 🏷️ Check if the received message is a request to download images.
  if (message.action === 'download_images') {
    console.log('📥 Received image URLs:', message.imageUrls);

    // 🟢 If no images were found, log a warning and stop further execution.
    if (message.imageUrls.length === 0) {
      console.warn('⚠️ No images to download.');
      return;
    }

    // 🔔 Notify the user BEFORE starting the downloads.
    chrome.notifications.create({
      type: 'basic',
      iconUrl: 'enabled48.png', // Make sure this image exists in your extension folder.
      title: 'Image Scraper',
      message: `📥 Starting download for ${message.imageUrls.length} images...`,
    });

    let downloadsStarted = 0; // Counter for tracking downloads.

    // 🖼️ Loop through each image URL and start downloading.
    message.imageUrls.forEach((imageUrl, index) => {
      chrome.downloads.download(
        {
          url: imageUrl, // 🔗 The direct image URL to download.
          filename: `image_${index + 1}.jpg`, // 📂 Name format for downloaded files.
          saveAs: false, // ⚙️ Prevents a "Save As" prompt; images download automatically.
        },
        () => {
          // ❗ Handle potential errors while downloading.
          if (chrome.runtime.lastError) {
            console.error(
              `❌ Failed to download ${imageUrl}:`,
              chrome.runtime.lastError.message
            );
          } else {
            downloadsStarted++; // ✅ Track successful downloads.
            console.log(`✅ Download started: ${imageUrl}`);
          }

          // 🔔 Once ALL images have started downloading, notify the user.
          if (downloadsStarted === message.imageUrls.length) {
            chrome.notifications.create({
              type: 'basic',
              iconUrl: 'enabled48.png', // Use the extension's icon for notifications.
              title: 'Image Scraper',
              message: `✅ ${downloadsStarted} images downloaded successfully.`,
            });
          }
        }
      );
    });

    // 📩 Send a confirmation response back to `scraper.js` (for debugging/logging).
    sendResponse({ status: `Download started for ${downloadsStarted} images` });
  }
});
