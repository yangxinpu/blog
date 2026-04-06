# DOM

DOM (Document Object Model) is an interface that presents HTML documents as a **tree structure** composed of nodes and objects, for manipulation using JS;

### Getting Elements

Get element objects through methods provided by document;

**By Id**

No need to add #;

```js
document.getElementById('id');
```

**By Tag Name**

Returns a pseudo-array of obtained elements; can access elements via array index

```js
let ul = document.getElementsByTagName('ul'); // Get ul pseudo-array
```

**By Class Name**

No need to add .; Returns a pseudo-array of elements with same class name (even if only one element, it's an array);

```js
document.getElementsByClassName('class');
```

**By Selector**

Get elements via CSS selectors; class name needs . and id needs #;

querySelector: Returns the first found element;

querySelectorAll: Returns a pseudo-array of all found elements (when handling thousands of DOM nodes: pseudo-array memory usage is 40% less than real array, Live Collection feature reduces 98% of repaint calculations);

```js
document.querySelector('.class'); // By class selector
document.querySelector('[type]'); // By attribute selector

document.querySelectorAll('#id');
```

**html and body**

```js
document.body; // Get body element
document.documentElement; // Get html root element
```

### Node Operations

Node types: including element node (1), text node (3), comment node (8), etc.;

Can return corresponding number through nodeType method on element to determine node type;

#### Getting Nodes

**Get Parent Node**

parentNode: Gets nearest parent node of all types;

parentElement: Gets nearest parent element node;

```js
li.parentNode;
li.parentElement;
```

**Get Child Nodes**

childNodes: Gets pseudo-array of all types of nodes, returns NodeList;

children: Gets pseudo-array of only child element nodes, returns HTMLCollection;

firstElementChild: Gets first child element node;

lastElementChild: Gets last child element node;

removeChild: Deletes child node, parameter is child element to delete (can get via selector or node);

```js
ul.children;
ul.childNodes;
ul.firstElementChild;
ul.lastElementChild;
ul.removeChild(ul.children[0]);
```

**Get Sibling Nodes**

Get next sibling node: nextSibling (all types), nextElementSibling (element type);

Get previous sibling node: previousSibling (all types), previousElementSibling (element type);

```js
div.nextSibling;
div.nextElementSibling;

div.previousSibling;
div.previousElementSibling;
```

#### Creating and Adding Nodes

Create nodes via document.createElement method, parameter is node type to create; created nodes can be added to DOM via appendChild or insertBefore methods on parent element;

```js
let li = document.createElement('li');
let uls = querySelector('ul');

uls.appendChild(li); // Add child node at end
uls.insertBefore(li, ul.children[0]); // Insert element before first child node
```

#### Copying and Adding Nodes

Copy element via cloneNode method on element, parameter true means deep copy (including child nodes), false means shallow copy (not including child nodes); cloned nodes can be added to DOM via appendChild or insertBefore methods on parent element;

```js
let li = uls.children[0].cloneNode(true);

uls.appendChild(li);
```

### DOM Elements

#### Basic Element Properties

##### Node Related:

nodeType: Node's type;

nodeName: Node name, like DIV, #text, etc.;

children: Pseudo-array of child element nodes;

parentNode: Parent node;

nextElementSibling / previousElementSibling: Returns next / previous sibling element node;

innerHTML: HTML content inside element (including tags);

innerText: Text content inside element;

##### Style Related:

**style**: Element's inline style object, uses camelCase naming, can only get inline styles;

```js
let div = document.querySelector('div');
div.style.backgroundColor = 'red';
div.style.display = 'none';
```

**className**: Element's class name string, can add multiple class names via space;

```js
// In CSS:
.class1 {
    font-family: 'SimSun';
}
.class2 {
    background-color: red;
    color: black;
    font-size: 14px;
}

// In JS:
let div = document.querySelector('div');
div.className = 'class1';              // Change div's class name to modify style
div.className = 'class1 class2'
```

**classList**: Represents the element's class name list; can perform operations;

`classList.add('style1');` Add new style

`classList.remove('style1');` Delete style

`classList.toggle('style2');` Toggle style, deletes if class name exists, adds if not

`classList.contains('style1');` Check if has certain class, returns bool value

```css
.style1 {
  font-family: 'SimSun';
}
.style2 {
  background-color: red;
  color: black;
  font-size: 14px;
}
```

```js
// In JS:
let div = document.querySelector('div');

div.classList.add('style1'); // Add new style
```

**setProperty**: Dynamically sets inline CSS variables; after modification, reflects in real-time to styles using that variable; first parameter is variable name, second is variable value;

```js
const app = document.getElementById('app');
app.style.setProperty('background-color', 'blue');
```

**removeProperty**: Removes set inline CSS (restores to default value at definition)

```js
const app = document.getElementById('app');
app.style.setProperty('border-radius', '50%');
app.style.removeProperty('border-radius');
```

##### Size and Position:

offsetTop / offsetLeft: Element's top / left offset relative to positioned ancestor element (pixels);

offsetWidth / offsetHeight: Element's width / height (including content, padding, border, excluding margin);

clientWidth / clientHeight: Element's visible width / height (including content, padding, excluding border and scrollbar);

scrollWidth / scrollHeight: Element content's total width / height (including scrolled hidden parts);

scrollTop / scrollLeft: Element's internal scrollbar's vertical / horizontal scroll distance;

#### Attribute Operations

For attributes on element tags;

hasAttribute(): Determines if element has specified attribute;

getAttribute(): Gets element's attribute;

setAttribute(): Sets element's attribute;

removeAttribute(): Removes element's specified attribute;

```js
let div = document.querySelector('div');

console.log(div.hasAttribute("class"));
div.getAttribute("class")
div.setAttribute("class", "class1");
div.removeAttribute("class")

// Theme switching
// css
:root[data-theme="light"] {
  --bg-color: #fff;
  --text-color: #333;
}
:root[data-theme="dark"] {
  --bg-color: #121212;
  --text-color: #eee;
}
body {
  background: var(--bg-color);
  color: var(--text-color);
  transition: all 0.3s;
}

// js operation
const root = document.documentElement;
root.dataset.theme = 'light' ? 'dark' : 'light';
```

#### Basic Element Methods

##### getBoundingClientRect

Used to get element's width, height, and position info relative to viewport; this info depends on latest layout calculation results; if browser has unprocessed layout updates, to return accurate info, **browser forces a reflow**;

```js
const app = document.getElementById('app');
const info = app.getBoundingClientRect();
console.log(info);

// Output
bottom: 31.13636302947998;
height: 23.14049530029297;
left: 7.995867729187012;
right: 1389.0289487838745;
top: 7.995867729187012;
width: 1381.0330810546875;
x: 7.995867729187012;
y: 7.995867729187012;
```

##### animate

Used to create and run keyframe animations for DOM elements directly through JavaScript; animations defined by `animate()` are preferentially handled by browser's compositing thread (independent thread responsible for layer compositing), avoiding occupying main thread resources;

First parameter is keyframe array (can specify frame position via offset, value 0-1), second parameter is animation config (duration, iteration count, easing function, etc.); returns an Animation object containing:

`play()`: Play animation (continues from current state);

`pause()`: Pause animation (retains current progress);

`reverse()`: Play animation in reverse;

`cancel()`: Cancel animation (resets element to initial state);

`finish()`: Jump directly to animation end state;

`playState`: Current state (`'idle'` not started, `'running'` running, `'paused'` paused, `'finished'` ended);

`currentTime`: Current animation progress (ms), can be modified directly (like `animation.currentTime = 1000` jumps to 1 second);

`effect`: Animation effect (can modify keyframes or config);

```js
const box = document.querySelector('#box');
const btn = document.querySelector('button');
let animateObj = box.animate(
  [
    { transform: 'translateX(0px)', offset: 0.2 },
    { transform: 'translateX(200px)', offset: 1 },
  ],
  {
    duration: 1000,
    iterations: 1,
  }
);
btn.addEventListener('click', () => {
  animateObj.play();
});
```

#### Form Elements

##### Properties:

name: Form element's name;

value: Form element's input value;

type: Form element's type;

checked: Whether selector is selected;

disabled: Whether disabled;

readonly: Whether read-only;

autofocus: Whether automatically gets focus on page load;

tabindex: Controls element's focus order when pressing `Tab` key (smaller number focuses first, negative value means can't focus via `Tab`);

accept: Limits selectable file types (like `accept="image/*"` only allows images);

multiple: Boolean value; when type is file, indicates whether multiple files can be selected; in select, indicates whether multi-select is supported;

##### Methods

focus(): Form element gets focus;

blur(): Form element loses focus;

click(): Simulates click (like triggering button click, checkbox selection);

reset(): Resets form element input;

#### img Element

src: Image's URL address;

width / height: Image's display width and height (in pixels, can be modified directly)

```js
img.width = 300; // Set width to 300px
img.height = 200; // Set height to 200px
```

naturalWidth / naturalHeight: Image's original dimensions (unscaled width and height, read-only);

complete: Whether image has fully loaded;

#### Link Elements

##### Properties:

href: Link's target URL;

target: Specifies link's target opening location; `_self`: Open in current window (default); `_blank`: Open in new window / tab;

download: When this attribute is set, clicking link downloads target resource (instead of navigating), value is optional filename;

disabled: Whether link is disabled;

##### Methods

click(): Simulates clicking link;
