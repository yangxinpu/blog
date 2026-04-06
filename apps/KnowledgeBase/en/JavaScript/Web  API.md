# Utility APIs

## ASCII Code API

### Get Character Code: charCodeAt()

Parameter is character's index in string, returns encoding value of character at specified position

```js
let str = "A";

console.log(str.charCodeAt(0)); 
```

### String.fromCharCode()

Used to convert numeric ASCII code to character

```js
String.fromCharCode(65) // 'A'
console.log(String.fromCharCode(72, 101, 108, 108, 111)); // Hello
```

## Math API

### Max: `max()`

```js
let arr = [1, 2, 3];
Math.max(...arr) // Result is 3, array must use spread operator
Math.max(1, 2, 3, 4, 5, 6); // Result is 6
```

### Min: `min()`

Same as max

### Absolute Value: `abs()`

```js
let a = -100;
Math.abs(a); // Result is 100
```

### Round: `round()`

```js
let a = 3.5;
Math.round(a); // Result is 4
```

### Random: `random()`

```js
Math.random(); // Returns decimal between 0~1
```

Get decimal between max and min:

```js
Math.floor(Math.random() * (max - min + 1) + min);
```

### Floor: `floor()`

Rounds down, returns largest integer not greater than x, 4.9 => 4, -3.1 => -4

```js
Math.floor();
```

### Ceil: `ceil()`

```js
Math.ceil()
```

---

## Date API

```js
let date = new Date();
```

### Return Year, Month, Day, Week, Hour, Minute, Second Separately:

```js
let date = new Date();
date.getFullYear();   // Year
date.getMonth();      // Only returns 0~11, i.e., month - 1
date.getDate();       // Day
date.getDay();        // Week, returns 0~6 numbers, can use array to convert to uppercase
date.getHours();
date.getMinutes();
date.getSeconds();
```

### Get Local Time: `toLocaleString()`

```js
let date = new Date();
date.toLocaleString();
```

### Timestamp:

Total milliseconds since 1970.1.1

```js
let date = new Date();
date.getTime(); // Get timestamp
```

Static method: Get timestamp directly

```js
let time = Date.now();
```

Timestamp to current day's hour, minute, second algorithm:

```js
let time = Date.now() / 1000; // Convert milliseconds to seconds
let hour = time / 60 / 60 % 24; // First 60 converts to minutes, second 60 converts to hours, then modulo 24 to get hours
let minute = time / 60 % 60;
let second = time % 60;
```

---

## Intersection Observer API

Used to asynchronously detect whether target element intersects with root element (i.e., target element enters/leaves viewport, or overlaps with root element to specified ratio);

Create intersection observer using IntersectionObserver constructor, first parameter is callback triggered when intersection state changes, second parameter is intersection observer config object;

**Callback Function**:

First parameter entries: Array containing observed element's intersection change state objects, containing properties:

target: Observed element;

isIntersecting: Whether target element intersects with root element (enters/reaches threshold);

intersectionRatio: Intersection ratio (0~1), equals intersectionRect area / target element boundingRect area;

intersectionRect: Provides specific position and size of intersection area;

time: Timestamp when intersection state occurred;

Second parameter observer: IntersectionObserver instance object itself, has: `observe()` method (add observed DOM element), `unobserve()` method (stop observing certain DOM element), `disconnect()` method (stop observing all elements);

**Config Object**:

root: Used to specify viewport element, null means root element, viewport element must be scrollable element;

rootMargin: Expand/shrink observation area;

threshold: Multi-trigger point config, like `threshold: [0, 0.5, 1]` means trigger callback when target element just enters (0%), overlaps 50%, fully enters (100%);

delay: Delay time for triggering callback when intersection occurs (milliseconds);

**Instance Properties and Methods**

root: Observed root element;

rootMargin: Root element's margin (expanded or shrunk range);

thresholds: Array of thresholds for triggering callback;

delay: Delay time

observe(target): Start observing target element;

unobserve(target): Stop observing element;

disconnect(): Stop all observations;

```js
const lazyImg = document.querySelector('.lazyImg');
// Callback function
function callback(entries, observer) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            console.log(entry, 'entered');
        } else {
            // What happens when element leaves
        }
    })
}
// Config
const option = {
    root: null,        // Set root element, null means viewport
    rootMargin: '10px', // Whether to trigger early, here means trigger 10px early
}
const observer = new IntersectionObserver(callback, option);

observer.observe(lazyImg); // Set object to observe
```

---

## EyeDropper API

EyeDropper, call open method, returns a Promise, Promise object after success carries `{sRGBHex}` object, sRGBHex is the color value;

```js
const btn = document.querySelector('button');
const color = document.querySelector('#color');
const dropper = new EyeDropper();
console.log(dropper)

btn.addEventListener('click', async () => {
    const {sRGBHex} = await dropper.open()
    color.style.backgroundColor = sRGBHex
})
```

---

## Picture-in-Picture API

Picture-in-Picture (PiP) allows web content to play in an independent floating window, detached from browser tab, such as video players, online meetings, widgets (timer/stocks/chat), etc.;

### Traditional Video PiP

Only supports video for picture-in-picture;

- video.requestPictureInPicture(): Enable picture-in-picture mode;
- document.exitPictureInPicture(): Exit picture-in-picture mode;

```html
<video id="video" src="https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4" controls></video>
<button id="btn">Picture-in-Picture</button>

<script>
const video = document.getElementById('video');
const btn = document.getElementById('btn');

btn.onclick = async () => {
  if (document.pictureInPictureElement) {
    await document.exitPictureInPicture();
  } else {
    await video.requestPictureInPicture();
  }
};
</script>
```

**Event Listening**

```js
video.addEventListener('enterpictureinpicture', () => {
  console.log('Entered PiP');
});

video.addEventListener('leavepictureinpicture', () => {
  console.log('Exited PiP');
});
```

### Document PiP

Allows you to put an entire HTML page into a PiP window;

- documentPictureInPicture.requestWindow: Returns a new `Window` object (doesn't inherit main page styles), can perform DOM operations on this `Window` object;

```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <title>Document PiP Demo</title>
  <style>
    body { font-family: sans-serif; }
    button { margin: 8px; }
  </style>
</head>
<body>

<h2>Main Page</h2>
<button id="open">Open PiP</button>
<button id="send">Send Message to PiP</button>

<script>
let pipWindow = null;
const channel = new BroadcastChannel('pip-channel');

document.getElementById('open').onclick = async () => {
  pipWindow = await documentPictureInPicture.requestWindow({
    width: 400,
    height: 300,
  });

  // 1. Write basic HTML
  pipWindow.document.body.innerHTML = `
    <div id="app">
      <h3>PiP Window</h3>
      <p id="msg">Waiting for message...</p>
      <button id="close">Close</button>
    </div>
  `;

  // 2. Style sync (key)
  copyStyles(document, pipWindow.document);

  // 3. Bind events
  pipWindow.document.getElementById('close').onclick = () => {
    pipWindow.close();
  };

  // 4. Receive main page messages
  const pipChannel = new BroadcastChannel('pip-channel');
  pipChannel.onmessage = (e) => {
    pipWindow.document.getElementById('msg').textContent = e.data;
  };

  // 5. Lifecycle
  pipWindow.addEventListener('pagehide', () => {
    console.log('PiP closed');
    pipWindow = null;
  });
};

// Main page sends message
document.getElementById('send').onclick = () => {
  channel.postMessage('Message from main page: ' + Date.now());
};

// Style copy function
function copyStyles(srcDoc, targetDoc) {
  [...srcDoc.styleSheets].forEach(sheet => {
    try {
      const rules = [...sheet.cssRules].map(r => r.cssText).join('');
      const style = document.createElement('style');
      style.textContent = rules;
      targetDoc.head.appendChild(style);
    } catch (e) {
      console.warn('Cannot access cross-origin styles');
    }
  });
}
</script>

</body>
</html>
```

---

# File Handling API

## FormData File API

Used to construct and represent a set of key-value pairs, these key-value pairs can be sent directly as fetch or XMLHttpRequest request body, mainly used for form submission and file upload; essence: JS abstraction of `multipart/form-data` request body;

Native support for file upload, browser automatically handles request headers (Content-Type: multipart/form-data; boundary=..., never manually set Content-Type)

### FormData Instance

append(name, value, filename?): Add field (can repeat, won't overwrite);

```js
formData.append('username', 'Alice');
```

set(name, value, filename?): Set field (overwrites), if same name field exists, deletes old value, only keeps new value

```js
formData.set('username', 'Bob');
```

get(name): Get value by key, if multiple same name fields, only returns first

```js
formData.get('username'); // 'Bob'
```

getAll(name): Get multiple values by key

```js
formData.getAll('hobby'); // ['music', 'game']
```

has(name): Check if key exists

delete(name): Delete key-value pair

### Accepted Values

Doesn't support object types, must serialize first;

| Type | Behavior |
| ---- | -------- |
| `string` | Sent as-is |
| `number` | **Auto-converts to string** |
| `boolean` | `"true"` / `"false"` |
| `File` | Binary file |
| `Blob` | Binary data |

**Form Submission:**

Automatically reads name attribute and form control's current value, disabled fields not included, only collects successful controls

```html
<form id="myForm">
    <input name="username" value="Tom" />
    <input type="file" name="avatar" />
</form>
<script>
    const form = document.getElementById('myForm');
    const formData = new FormData(form);
</script>
```

**File Submission:**

```js
const fileInput = document.querySelector('input[type=file]');
formData.append('file', fileInput.files[0]);
formData.append('file', file, 'custom-name.png'); // Specify filename

fetch('/upload', {
  method: 'POST',
  body: formData
});
```

---

## Blob Binary API

Binary Large Object, is an object for storing immutable binary data, can be used to represent any type of file data in binary (like text, images, audio, video, etc.);

**MIME Type**: Multipurpose Internet Mail Extensions, originally designed to solve early email's limitation of only transmitting plain text, later gradually expanded to entire internet field, becoming standard for identifying file types and defining data transmission formats, like text/plain, text/html, application/json, application/pdf, etc.;

Blob(): First parameter is data array to store, second parameter is optional config object (can configure MIME type);

```js
const blob = new Blob(["Hello World"], { type: "text/plain"});
```

### blob Instance:

**type**: Returns MIME type, if type cannot be determined, returns empty string;

```js
const blob = new Blob(["Hello World"], { type: "text/plain"})
console.log(blob.type);
```

**size**: Returns data's byte count;

```js
const blob = new Blob(["Hello World"], { type: "text/plain"})
console.log(blob.size);
```

**Slice: `slice()`**

Cuts old Blob, returns new Blob; first and second parameters are start and end positions, third parameter is MIME type;

```js
const blob1 = new Blob(["Hello World"], { type: "text/plain;charset=utf-8" });
const blob2 = blob1.slice(0, 5, "text/plain;charset=utf-8");
```

**Read as Text: `text()`**

Returns a Promise object, can get text content via then's parameter;

```js
const blob = new Blob(["<div>aaaa</div>"], { type: "text/html;charset=utf-8" });

blob.text().then((data) => {
    console.log(data);
})
```

**Read as Binary Object: `arrayBuffer()`**

Returns a Promise object; arrayBuffer is a fixed-length raw binary array;

```js
const blob = new Blob(["Hello World"]);
blob.arrayBuffer().then(buffer => {
  console.log(buffer.byteLength); // 11
});
```

---

## File API

File inherits from Blob, has all Blob capabilities, additionally has filename, lastModified, etc. metadata;

```js
const file = new File(["Hello"], "hello.txt", {
  type: "text/plain",
  lastModified: Date.now()
});

console.log(file.name);         // "hello.txt"
console.log(file.lastModified); // Timestamp
```

---

## FileReader API

Used to asynchronously read file contents (File or Blob), converting to usable data formats (text, base64, ArrayBuffer);

**Instance Methods:**

readAsText(file, encoding?): Read as text, default encoding UTF-8;

readAsDataURL(file): Read as Base64 Data URL (commonly used for image preview);

readAsArrayBuffer(file): Read as binary buffer;

readAsBinaryString(file): Read as binary string (deprecated, use ArrayBuffer instead);

abort(): Abort read operation;

**Instance Events:**

onload: Triggered when read succeeds, result is in `reader.result`;

onerror: Triggered when read fails;

onprogress: Triggered during read progress;

onabort: Triggered when read is aborted;

```js
const input = document.querySelector('input[type="file"]');
input.addEventListener('change', (e) => {
  const file = e.target.files[0];
  const reader = new FileReader();

  reader.onload = () => {
    console.log(reader.result); // File content
  };

  reader.readAsText(file); // Read as text
});
```

**Image Preview:**

```js
const input = document.querySelector('input[type="file"]');
const preview = document.querySelector('#preview');

input.addEventListener('change', (e) => {
  const file = e.target.files[0];
  const reader = new FileReader();

  reader.onload = () => {
    preview.src = reader.result; // Base64 image
  };

  reader.readAsDataURL(file);
});
```

---

## URL API

### createObjectURL

Creates a URL representing the given File or Blob object, pointing to file data in browser memory, returns a string starting with `blob:`;

Commonly used for image preview, video preview, file download;

```js
const blob = new Blob(["Hello World"], { type: "text/plain" });
const url = URL.createObjectURL(blob);

console.log(url); // "blob:http://localhost:3000/abc123..."

// Use in img tag
const img = document.createElement('img');
img.src = url;
document.body.appendChild(img);
```

### revokeObjectURL

Releases URL object created by `createObjectURL`, frees memory; after calling, URL is no longer valid;

```js
const blob = new Blob(["Hello World"], { type: "text/plain" });
const url = URL.createObjectURL(blob);

// After use, release memory
URL.revokeObjectURL(url);
```

---

## File Download

### Method 1: a tag download attribute

```js
const blob = new Blob(["Hello World"], { type: "text/plain" });
const url = URL.createObjectURL(blob);

const a = document.createElement('a');
a.href = url;
a.download = "hello.txt";
a.click();

URL.revokeObjectURL(url);
```

### Method 2: Blob + createObjectURL

```js
function downloadFile(content, filename, mimeType = 'text/plain') {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  
  URL.revokeObjectURL(url);
}

// Usage
downloadFile("Hello World", "hello.txt");
downloadFile(JSON.stringify({ name: "Alice" }), "data.json", "application/json");
```

### Method 3: fetch download

```js
async function downloadFromUrl(url, filename) {
  const response = await fetch(url);
  const blob = await response.blob();
  
  const downloadUrl = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = downloadUrl;
  a.download = filename;
  a.click();
  
  URL.revokeObjectURL(downloadUrl);
}

// Usage
downloadFromUrl('https://example.com/file.pdf', 'document.pdf');
```
