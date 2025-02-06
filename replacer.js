// start with a huge lorem ipsum text string saved as a string variable

const ipsumText = `Sed ut perspiciatis, unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam eaque ipsa, quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt, explicabo. Nemo enim ipsam voluptatem, quia voluptas sit, aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos, qui ratione voluptatem sequi nesciunt, neque porro quisquam est, qui dolorem ipsum, quia dolor sit amet consectetur adipiscing velit, sed quia non numquam do eius modi tempora incididunt, ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrumd exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? D'Quis autem vel eum irure reprehenderit, qui in ea voluptate velit esse, quam nihil molestiae consequatur, vel illum, qui dolorem eum fugiat, quo voluptas nulla pariatur? At vero eos et accusamus et iusto odio dignissimos ducimus, qui blanditiis praesentium voluptatum deleniti atque corrupti, quos dolores et quas molestias excepturi sint, obcaecati cupiditate non provident, similique sunt in culpa, qui officia deserunt mollitia animi, id est laborum et dolorum fuga. Et harum quidem rerudum facilis est ert expedita distinctio. Nam libero tempore, cum soluta nobis est eligendi optio, cumque nihil impedit, quo minus id, quod maxime placeat facere possimus, omnis voluptas assumenda est, omnis dolor repellendaus. Temporibus autem quibusdam et aut officiis debitis aut rerum necessitatibus saepe eveniet, ut et voluptates repudiandae sint et molestiae non recusandae. Itaque earum rerum hic tenetur a sapiente delectus, ut aut reiciendis voluptatibus maiores alias consequatur aut perferendis doloribus asperiores repellat.`;

// declare a function to get a length of replacement text
function getLorem(string) {
  // get the length of the input text
  let length = string.length;
  // return a length of lorem text to replace it with
  return ipsumText.substring(0, length);
}

// make a function to replace text nodes
function replaceText() {
  // create an empty queue object
  const queue = [];
  // assign the body element to the body constant
  const body = document.getElementsByTagName('body');
  // check if the body object contains chil nodes
  if (body[0].childNodes) {
    // for each child node in the body
    body[0].childNodes.forEach((child) => {
      // push them to the queue
      queue.push(child);
    });
  }
  // while the queue is not empty
  while (queue.length > 0) {
    // set the current node to process to the first node, and remove it from the queue
    const node = queue.shift();
    // if the node is a text node
    //node.nodeType === Node.TEXT_NODE
    if (node.innerText) {
      console.log('Entered the conditional!');
      // assign the node's text value to the evaluated result of the get lorum function
      node.innerText = getLorem(node.innerText);
    }
    //if node has children, add them to queue
    if (node.childNodes) {
      node.childNodes.forEach((child) => {
        queue.push(child);
      });
    }
  }
}

// Will this get us points?
// uses a queue data structure to process nodes from outside in
// uses tree traversal to find the nodes to replace text in
// uses DOM manipulation to replace strings
// is legitimatly useful if you want to quickly hide real-data for demo purposes

// Future considerations after MVP is built:
// what happens if we are replacing more text than we have stored in ipsumText
// we should probably capitalize the first letter of the replacement text
// we could adhead to the capitalization rules of the existing text
// we could end the substring at the next space insted of cutting off in the middle of words to make it look nicer
// we could always replace titles with the classic "Lorem ipsum set dolor" text
// some nodes could have invisible text, and we should probably acocunt for that (use node.nodeValue.trim() !== "" to dodge invisible text nodes?)
// there might be a larger source for ipsum text we could use
// potential for other modes, like gen-z slang insertion, or klingon, etc
// way to toggle on and off

// use an event listener to make sure the dom loads first
document.addEventListener('DOMContentLoaded', replaceText);
