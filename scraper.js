// 🟢 This script runs inside the active webpage when the user clicks the extension icon.
console.log('🟢 Scraper.js is running!');

// 📸 Function to find and extract all image URLs from the page
function getImages() {
  // ⭕ Create a Set to store unique image URLs (prevents duplicates)
  console.log('⭕ Creating a New Image Set.');
  const imageUrls = new Set();
  const svgElements = [] // SVGs need to be converted before saving
  const validImageExtensions = [
    '.jpg',
    '.jpeg',
    '.png',
    '.gif',
    '.webp',
    '.bmp',
    '.svg',
  ]; // ✅ List of allowed image types

  // 🔎 Select all <img> elements on the current webpage
  document.querySelectorAll('img').forEach((img) => {
    let imageUrl = img.src; // Default to the standard `src` attribute

    // 🖼️ Check if `srcset` exists (it may contain a higher-resolution version)
    if (img.srcset) {
      const srcsetArray = img.srcset
        .split(',')
        .map((entry) => entry.trim().split(' ')[0]);
      imageUrl = srcsetArray[srcsetArray.length - 1]; // Get the highest-resolution image
      console.log(`🔍 Found high-res in srcset: ${imageUrl}`);
    }

    // 🔎 Check for `data-src` or `data-large-src` (commonly used for lazy loading)
    if (img.dataset.src) {
      imageUrl = img.dataset.src;
      console.log(`🛠️ Found full-size in data-src: ${imageUrl}`);
    }  
    // ⚠️ RISK OF DUPLICATION
    if (img.dataset.largeSrc) {
      imageUrl = img.dataset.largeSrc;
      console.log(`🛠️ Found full-size in data-large-src: ${imageUrl}`);
    }

    // 🔗 If the image is inside an <a> tag that links to a larger version, grab that link
    const parentLink = img.closest('a');
    if (
      parentLink &&
      parentLink.href &&
      !parentLink.href.includes('javascript')
    ) {
      imageUrl = parentLink.href;
      console.log(`🔗 Found full-size image from link: ${imageUrl}`);
    }

    if (
      imageUrl &&
      validImageExtensions.some((ext) =>
        imageUrl.toLocaleLowerCase().includes(ext)
      )
    ) {
      console.log(`🖼️ Found image: ${img.src}`); // Log each image found
      imageUrls.add(imageUrl); // ✅ Add the image URL to the Set (duplicates are ignored)
    } else {
      console.warn(`⚠️ Skipped non-image URL: ${imageUrl}`);
    }
  });

  // 📤 If images were found, send them to the background script for downloading
  if (imageUrls.size > 0) {
    console.log('📨 Sending unique image URLs to background script...');

    chrome.runtime.sendMessage(
      { action: 'download_images', imageUrls: Array.from(imageUrls) }, // Convert Set to Array
      (response) => {
        // ❗ Handle errors when sending the message to `background.js`
        if (chrome.runtime.lastError) {
          console.error(
            '❌ Error sending message to background script:',
            chrome.runtime.lastError.message
          );
        } else {
          console.log('📩 Response from background:', response); // ✅ Log response from background.js
        }
      }
    );
  } else {
    console.warn('⚠️ No images found on this page.'); // 🚨 Alert if no images were found
  }
}

// 🔥 Run the image extraction function immediately when this script is injected into the page
getImages();
