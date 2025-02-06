// this is breaking something:
// Inline speculation rules cannot currently be modified after they are processed.
// Instead, a new <script> element must be inserted.
chrome.storage.local.get(['extensionEnabled'], (result) => {
  if (!result.extensionEnabled) return;

  // start with a huge lorem ipsum text string saved as a string variable
  const ipsumText = `Sed ut perspiciatis, unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam eaque ipsa, quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt, explicabo. Nemo enim ipsam voluptatem, quia voluptas sit, aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos, qui ratione voluptatem sequi nesciunt, neque porro quisquam est, qui dolorem ipsum, quia dolor sit amet consectetur adipiscing velit, sed quia non numquam do eius modi tempora incididunt, ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrumd exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? D'Quis autem vel eum irure reprehenderit, qui in ea voluptate velit esse, quam nihil molestiae consequatur, vel illum, qui dolorem eum fugiat, quo voluptas nulla pariatur? At vero eos et accusamus et iusto odio dignissimos ducimus, qui blanditiis praesentium voluptatum deleniti atque corrupti, quos dolores et quas molestias excepturi sint, obcaecati cupiditate non provident, similique sunt in culpa, qui officia deserunt mollitia animi, id est laborum et dolorum fuga. Et harum quidem rerudum facilis est ert expedita distinctio. Nam libero tempore, cum soluta nobis est eligendi optio, cumque nihil impedit, quo minus id, quod maxime placeat facere possimus, omnis voluptas assumenda est, omnis dolor repellendaus. Temporibus autem quibusdam et aut officiis debitis aut rerum necessitatibus saepe eveniet, ut et voluptates repudiandae sint et molestiae non recusandae. Itaque earum rerum hic tenetur a sapiente delectus, ut aut reiciendis voluptatibus maiores alias consequatur aut perferendis doloribus asperiores repellat.`;

  // declare a function to get a length of replacement text
  function getLorem(word) {
    // split the ipsum text into words using regex i dont understand
    const ipsumWords = ipsumText.split(/\s+/);
    // generate a random index to select a word
    const randomIndex = Math.floor(Math.random() * ipsumWords.length);
    // get the lorem word
    let loremWord = ipsumWords[randomIndex];

    // if the input word was capitalized
    if (word === word.toUpperCase()) {
      // , capitalize the replacement word
      loremWord = loremWord.toUpperCase();
      // if the first letter of the word is capitalized,
    } else if (word[0] === word[0].toUpperCase()) {
      // capitalize the first letter of the replacement (append the first letter to the rest)
      loremWord =
        loremWord.charAt(0).toUpperCase() + loremWord.slice(1).toLowerCase();
      // otherwise
    } else {
      // replace the lowercase word with a lowercase replacment word
      loremWord = loremWord.toLowerCase();
    }
    // truncate the replacement word to match the length of the source word if its too long (for buttons and stuff)
    if (loremWord.length > word.length) {
      // +1 because there are no 1 letter lorem words... seems to work ok this way.
      loremWord = loremWord.substring(0, word.length + 1);
    }
    // return the replaced word
    return loremWord;
  }

  // make a function to replace text nodes
  function replaceText() {
    console.log('replaceText function invoked!');
    // assign the body element to the body constant
    const body = document.body;
    // create an empty queue object
    const queue = [];
    // check if the body object contains child nodes
    if (body.childNodes) {
      // for each child node in the body
      console.log('Child node found!');
      body.childNodes.forEach((child) => {
        // push them to the queue
        queue.push(child);
      });
    }
    // while the queue is not empty
    while (queue.length > 0) {
      // set the current node to process to the first node, and remove it from the queue
      const node = queue.shift();
      // aight, so first we ignore hidden nodes
      if (node.hidden != true) {
        if (
          // then we only get valid nodes, notably node type 3 and TEXT_NODE for old browsers
          node.nodeType === 3 ||
          node.nodeType === Node.TEXT_NODE
        ) {
          node.textContent = node.textContent.replace(
            // this regex is alien to me, i cheated to get this, who the fuck knows what it is doing
            /\b(?!\d)\w+\b/g,
            // anyhow, if we find a match, swap it with a lorem word
            getLorem
          );
        }
      }
      // check to see if there are child nodes
      if (node.hasChildNodes()) {
        // for each child
        for (const child of node.childNodes) {
          // slam it in the queue
          queue.push(child);
        }
      }
    }
  }
  // without this line, there is no initial execution
  replaceText();
});
// Will this get us points?
// uses a queue data structure to process nodes from outside in
// uses tree traversal to find the nodes to replace text in
// uses DOM manipulation to replace strings
// is legitimatly useful if you want to quickly hide real-data for demo purposes

// Future considerations after MVP is built:
// we could always replace titles with the classic "Lorem ipsum set dolor" text
// potential for other modes, like gen-z slang insertion, or klingon, etc
// long input words are being replaced by tiny lorem words. we could probably match similar length words