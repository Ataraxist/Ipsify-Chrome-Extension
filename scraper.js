// this is breaking something:
// Inline speculation rules cannot currently be modified after they are processed.
// Instead, a new <script> element must be inserted.
chrome.storage.local.get(['extensionEnabled'], (result) => {
  if (!result.extensionEnabled) return;

  // make a function to extract image nodes
  function getImages() {
    // assign the body element to the body constant
    const body = document.body;
    // create an empty queue object
    const queue = [];
    // check if the body object contains child nodes
    if (body.childNodes) {
      // for each child node in the body
      body.childNodes.forEach((child) => {
        // push them to the queue
        queue.push(child);
      });
    }
    // while the queue is not empty
    while (queue.length > 0) {
      // set the current node to process to the first node, and remove it from the queue
      const node = queue.shift();
      // check to see if there are child nodes
      if (node.hasChildNodes()) {
        // for each child
        for (const child of node.childNodes) {
          // slam it in the queue
          queue.push(child);
        }
      }
      const images = node.querySelectorAll('img');
      // for each img element, extract the src attribute and add it to the imageUrls array
      images.forEach((img) => {
        imageUrls.push(img.src);
      });
    }
  }
  // without this line, there is no initial execution
  getImages();
});
// Will this get us points?
// uses a queue data structure to process nodes from outside in
// uses tree traversal to find the nodes to replace text in
// uses DOM manipulation to replace strings
// is legitimatly useful if you want to quickly hide real-data for demo purposes

// Future considerations after MVP is built:
// we could always replace titles with the classic "Lorem ipsum set dolor" text
// potential for other modes, like gen-z slang insertion, or klingon, etc
