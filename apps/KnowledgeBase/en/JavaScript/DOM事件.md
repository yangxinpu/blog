# DOM Events

## DOM Events

Operations that trigger JS responses; every element in a webpage can produce certain events that trigger JS

### Event Types

#### Mouse Events

`click`: Triggered by left mouse button click;

`dblclick`: Triggered by mouse double-click;

`focus`: Triggered when getting cursor;

`blur`: Triggered when no cursor;

`mouseover`: Triggered when mouse enters;

`mouseout`: Triggered when mouse leaves;

`mousemove`: Triggered when mouse moves, generally used with `document.addEventListen()`;

`contextmenu`: Right-click event, triggers menu bar display by default;

`selectstart`: Triggered when left-clicking to select text, triggers text selection by default;

`copy`: Triggered when user performs copy operation (including Ctrl+C), copies content to system clipboard by default; similar events include cut, paste;

```js
document.addEventListener('copy', (event) => {
  console.log('Copy operation triggered');
  event.preventDefault(); // Prevent copying currently selected content to system clipboard
  event.clipboardData.setData('text/plain', 'plain text'); // Set clipboard content
});
```

#### Keyboard Events

`keyup`: Triggered when key is released;

`keydown`: Triggered when key is pressed;

`keypress`: Triggered when pressed, but doesn't recognize function keys like Ctrl, Alt; execution order is down → press → up;

#### Form Events

`input`: Triggered when user has input;

`submit`: Triggered when form is clicked to submit;

`change`: Triggered when form element's value changes and loses focus;

#### Load Events

`DOMContentLoaded`: Triggered when page HTML document is fully loaded and parsed, without waiting for CSS files, images, and sub-frames to load;

```js
window.addEventListener('DOMContentLoaded', function () {
  console.log('DOMContentLoaded');
});
```

`load`: Triggered after waiting for all page resources (like images, videos, JS files, CSS files) to finish loading;

```js
window.addEventListener('load', function () {
  console.log('All page resources loaded');
});
```

#### Scroll Events

Triggered when scrollbar scrolls, generally added to window; no default behavior, can't prevent scrolling through this;

```js
window.addEventListener('scroll', function () {
  document.documentElement.scrollTop; // Get entire page scroll distance
  document.documentElement.scrollTop = 800; // Scroll directly to 800px, no unit needed
});
```

#### Page Resize Events

Triggered when browser window size changes;

```js
window.addEventListener('resize', function () {
  console.log('Page size changed');
});
```

#### Drag Events

Elements can be made draggable by setting draggable attribute on them; `<img>` and `<a>` tags are draggable by default; most elements like `<div>`, `<p>` are not draggable by default;

```html
<!-- html -->
<div draggable="true" class="drag"></div>
<div class="target"></div>
```

```js
// js code
const dragDiv = document.querySelector('.drag');
const targetDiv = document.querySelector('.target');
// Dragged box events
dragDiv.addEventListener('dragstart', (event) => {
  console.log('Box started being dragged');
  event.preventDefault(); // Prevent initializing drag operation, create semi-transparent copy of dragged element following mouse
  event.dataTransfer.setData('text/plain', dragDiv.outerHTML); // Set transfer data string
});

dragDiv.addEventListener('drag', () => {
  console.log('Box is being dragged');
});

// Dragged box enters target box event
targetDiv.addEventListener('dragover', (event) => {
  console.log('Dragged box hovering over target box');
  event.preventDefault(); // Prevent rejecting box placement, otherwise drop event won't trigger
});

targetDiv.addEventListener('drop', (event) => {
  console.log('Dragged box dropped on target box');
  event.preventDefault(); // Prevent rejecting box content placement
  targetDiv.innerHTML += event.dataTransfer.getData('text/plain');
});
```

#### DOMContentLoaded

Used to listen for HTML document being fully loaded and parsed (DOM tree construction complete), without waiting for external resources (like stylesheets, images, scripts, iframes, etc.) to finish loading;

```js
document.addEventListener('DOMContentLoaded', () => {
  console.log('DOMContentLoaded');
});
```

#### load

Triggered only after all page resources (including HTML, CSS, JavaScript, images, videos, fonts, etc.) are fully loaded

```js
window.addEventListener('load', function () {
  console.log('All resources loaded!');
});
```

### event Object

A collection of event-related data, like mouse click coordinates, or which keyboard key

#### Basic Event Object

```js
btn.onclick = function (event) {
  console.log(event);
};
```

`event.target`: Returns the clicked element (not necessarily the element with event attached);

`event.currentTarget`: The element with event attached;

`event.type`: Returns the event type;

`event.preventDefault()`: Prevents default behavior, like link not navigating, form not submitting;

`event.stopPropagation()`: Stops event flow propagation;

#### Mouse Event Object

Can get mouse coordinate values, all without units, need to add px yourself;

```js
divs.addEventListener('click', function (event) {
  event.clientX; // Returns mouse's x coordinate relative to viewport
  event.clientY;
  event.pageX; // Returns mouse's x coordinate relative to entire page
  event.pageY;
  event.screenX; // Returns mouse's x coordinate relative to computer screen
  event.screenY;
});
```

#### Keyboard Event Object

```js
divs.addEventListener('keydown', function (event) {
  event.keyCode; // Returns ASCII value of pressed key; keyup and keydown don't distinguish case, like a and A are both 65; keypress distinguishes
  event.key; // Returns string of pressed key like Enter, Space, ArrowLeft
});
```

### Registering Events

#### Traditional Event Registration

Same event can only bind one handler function; later bound ones override earlier ones;

```js
btn.onclick = function () {
  console.log('Element clicked');
};
```

#### Listener Event Registration

Format: `element.addEventListener(event type, event callback function, event flow);`

```js
btn.addEventListener('click', function () {
  alert('hi');
});

btn.addEventListener('click', function () {
  alert('aaaaa');
});
// This will pop up two alerts consecutively
```

**Event Flow**

A boolean value, true for capture, false for bubble

When event is triggered, capture phase starts first, traversing window, document, parent box, child box... in order; if target object with true setting is found, event is triggered; then bubble phase starts, traversing from child box to window in order; if target object with false setting (or no true setting) is found, event is triggered.

**Removing Events:**

```js
// Traditional method:
btn.onclick = function () {
  alert('aa');
  btn.onclick = null;
};
```

```js
// Listener method:
function fn() {
  alert('a');
}
btn.addEventListener('click', fn);
btn.removeEventListener('click', fn);
```

#### Event Delegation

Set event listener on parent node, then use bubbling principle to affect child nodes

```js
uls.addEventListener('click', function(event) {
   event.target.style...
})
```
