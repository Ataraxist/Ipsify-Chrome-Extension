// this is breaking something:
// Inline speculation rules cannot currently be modified after they are processed.
// Instead, a new <script> element must be inserted.
chrome.storage.local.get(['extensionEnabled'], (result) => {
  if (!result.extensionEnabled) return;

  // so my idea is instead of using a random index of lorem for the replacement words, I could use an object and pick a random replacement word of the same lendth
  const uniqueIpsum = {
    1: ['a'],
    2: [
      'ut',
      'ab',
      'id',
      'et',
      'do',
      'Ut',
      'ad',
      'ex',
      'ea',
      'in',
      'At',
      'id',
      'Et',
    ],
    3: [
      'Sed',
      'sit',
      'rem',
      'aut',
      'sed',
      'qui',
      'non',
      'vel',
      'eum',
      'quo',
      'eos',
      'est',
      'ert',
      'Nam',
      'cum',
      'hic',
      'sit',
      'eos',
      'est',
    ],
    4: [
      'unde',
      'iste',
      'quae',
      'illo',
      'Nemo',
      'enim',
      'quia',
      'odit',
      'amet',
      'eius',
      'modi',
      'quis',
      'nisi',
      'quam',
      'vero',
      'odio',
      'quos',
      'quas',
      'sunt',
      'quod',
      'sint',
      'ipsa',
      'sunt',
      'esse',
      'sint',
      'fuga',
    ],
    5: [
      'omnis',
      'lorem',
      'natus',
      'error',
      'totam',
      'eaque',
      'quasi',
      'vitae',
      'dicta',
      'ipsam',
      'magni',
      'sequi',
      'neque',
      'porro',
      'dolor',
      'ullam',
      'autem',
      'irure',
      'velit',
      'nihil',
      'nulla',
      'iusto',
      'atque',
      'harum',
      'nobis',
      'minus',
      'rerum',
      'saepe',
      'earum',
      'alias',
      'fugit',
      'ipsum',
      'velit',
      'illum',
      'animi',
      'optio',
      'culpa',
    ],
    6: [
      'beatae',
      'labore',
      'dolore',
      'magnam',
      'minima',
      "D'Quis",
      'quidem',
      'libero',
      'soluta',
      'cumque',
      'maxime',
      'facere',
      'Itaque',
      'veniam',
      'fugiat',
    ],
    7: [
      'aperiam',
      'dolores',
      'ratione',
      'dolorem',
      'numquam',
      'tempora',
      'aliquam',
      'quaerat',
      'aliquid',
      'commodi',
      'officia',
      'laborum',
      'dolorum',
      'rerudum',
      'facilis',
      'placeat',
      'debitis',
      'tenetur',
      'maiores',
      'ducimus',
      'tempore',
      'impedit',
      'eveniet',
    ],
    8: [
      'voluptas',
      'quisquam',
      'nostrumd',
      'corporis',
      'suscipit',
      'deleniti',
      'deserunt',
      'mollitia',
      'expedita',
      'eligendi',
      'officiis',
      'sapiente',
      'nesciunt',
      'pariatur',
      'corrupti',
      'possimus',
      'delectus',
      'repellat',
    ],
    9: [
      'inventore',
      'veritatis',
      'voluptate',
      'molestiae',
      'accusamus',
      'molestias',
      'excepturi',
      'obcaecati',
      'similique',
      'assumenda',
      'quibusdam',
      'doloribus',
      'explicabo',
    ],
    10: [
      'voluptatem',
      'doloremque',
      'architecto',
      'aspernatur',
      'adipiscing',
      'blanditiis',
      'voluptatum',
      'cupiditate',
      'provident,',
      'Temporibus',
      'voluptates',
      'reiciendis',
      'laudantium',
      'voluptatem',
      'distinctio',
      'recusandae',
      'incididunt',
      'voluptatem',
      'laboriosam',
      'asperiores',
    ],
    11: [
      'accusantium',
      'consectetur',
      'dignissimos',
      'praesentium',
      'repudiandae',
      'consequatur',
      'consequatur',
      'perferendis',
      'consequatur',
    ],
    12: ['perspiciatis', 'consequuntur', 'voluptatibus', 'repellendaus'],
    13: ['reprehenderit'],
    14: ['exercitationem', 'necessitatibus'],
  };
  // declare a function to get a length of replacement text
  function getLorem(word) {
    // start with tin input words length, i am shortening words longer than 14 to 14
    const inputLength = word.length > 14 ? 14 : word.length;
    // get the array containing words that are the same length
    // (index length starts at 0, but string length starts at 1)
    let sameLength = uniqueIpsum[inputLength] || [];
    // get the array containing words that are the same length + 1
    let oneLonger = uniqueIpsum[inputLength + 1] || [];
    // get the array containing words that are the same length - 1
    let oneShorter = uniqueIpsum[inputLength - 1] || [];
    // concatenate the 3 arrays
    let replacementWords = sameLength.concat(oneLonger).concat(oneShorter);
    // get a random index from 1 to array length
    const randomIndex = Math.floor(Math.random() * replacementWords.length);
    // pull the random word out of the replacemnt word array
    let loremWord = replacementWords[randomIndex];

    // if the input word was capitalized
    if (word === word.toUpperCase()) {
      // if the first word is capitalized, capitalize the replacement word
      loremWord = loremWord.toUpperCase();
      // if the first letter of the word is capitalized,
    } else if (word[0] === word[0].toUpperCase()) {
      // capitalize the first letter of the replacement (append the first letter to the rest)
      loremWord = loremWord[0].toUpperCase() + loremWord.slice(1).toLowerCase();
      // otherwise
    } else {
      // replace the lowercase word with a lowercase replacment word
      loremWord = loremWord.toLowerCase();
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
            // \b – Word boundary (ensures it's a standalone word).
            // [a-zA-Z]+ – Matches only letters, avoiding digits.
            // \b – Another word boundary.
            /\b[a-zA-Z]+\b/g,
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
