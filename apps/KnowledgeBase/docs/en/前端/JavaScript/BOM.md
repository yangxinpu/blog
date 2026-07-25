# BOM (Browser Object Model)

Browser Object Model; covers all objects and functions related to browser window operations, including navigator, location, document, history, screen, alert(), console and other APIs. All BOM operations are accessed and called through the window object; window can be omitted when calling; Node.js doesn't have window object, uses global object instead, so alert() dialog doesn't work;

### window Object

Top-level object in browser environment, represents browser window; all global variables and functions are properties of window object; window object also has built-in methods and properties;

**Viewport Size** (only includes UI page, equals 100vh/100vw): `window.innerHeight` and `window.innerWidth`;

**Entire Browser Window Size** (includes address bar, tab bar): `window.outerHeight` and `window.outerWidth`;

### Timers

Timer callback functions are async tasks, won't block file execution; timer returns its unique numeric identifier, can use this identifier to delete timer;

**Interval Function: setInterval**

Interval function must be cleared;

```js
let n = setInterval(function () {
  console.log('Hello World');
}, 1000); // Prints once per second

// setInterval returns a numeric sequence number to distinguish different interval functions

clearInterval(n); // Stop interval function
```

**Delay Function: setTimeout**

```js
let n = setTimeout(function () {
  console.log('Hello World');
}, 1000); // Outputs after one second, executes only once

clearTimeout(n); // Stop delay function
```

### location Object

It splits and saves each component of the current browser URL address;

```js
location.href = 'URL'; // Browser directly navigates to URL
```

```js
location.search; // Returns parameters carried in address, the part after ?
```

```js
location.hash; // Returns the part after #
```

```js
location.reload(); // Refresh page
location.reload(true); // Force refresh
```

### navigator Object

Browser-related information object;

#### clipboard API

Clipboard operations are async, need to wait for user authorization to read clipboard content;

**Read clipboard content:**

`navigator.clipboard.readText()` reads clipboard text, returns a Promise object; if authorized, Promise succeeds, parameter passed to then is the clipboard string;

`navigator.clipboard.read()` reads any type of data (like images)

```js
navigator.clipboard.readText().then((text) => {
  console.log(text);
});

navigator.clipboard.read().then((clip) => {
  console.log(clip);
});
```

**Write clipboard content:**

`navigator.clipboard.writeText()` returns a Promise object, no parameter passed to then;

`navigator.clipboard.write()` same;

```js
navigator.clipboard.writeText('hello world');
```

**ClipboardItem**

Clipboard data object, allows content for `navigator.clipboard.read()` and `navigator.clipboard.write()`; parameter is an object with MIME type as key and Blob type as data;

```js
const textItem = new ClipboardItem({
  'text/plain': new Blob(['Hello, world!'], { type: 'text/plain' }),
});
navigator.clipboard.write([textItem]);
```

#### geolocation API

`navigator.geolocation`: Gets user location information based on GPS, Wi-Fi, base station positioning, IP (requires user authorization); but due to no GPS on desktop, dirty Wi-Fi database, proxies, etc., obtained location information may be inaccurate;

**getCurrentPosition**: One-time get current location, including latitude, longitude, altitude, speed, heading, etc.;

```js
navigator.geolocation.getCurrentPosition(
  successCallback,
  errorCallback?,
  options?
);

// Usage
const loc = navigator.geolocation.getCurrentPosition(
(pos) => {
    const { latitude, longitude } = pos.coords;
    console.log(latitude, longitude);
    fetch(`https://restapi.amap.com/v3/geocode/regeo?location=${longitude},${latitude}&key=d129a4960217b3400a20c0eaa51bbc8a`)
    .then((res) => res.json())
    .then((data) => {
        console.log(data);
    })
},
() => {
    console.log("Failed to get location");
},
{
    enableHighAccuracy: true, // Request higher accuracy
});
```

**watchPosition**: Continuously tracks and gets current location information; can use `navigator.geolocation.clearWatch` to stop getting location

```js
const id = navigator.geolocation.watchPosition(success, error, options);

// Stop
navigator.geolocation.clearWatch(id);
```

### history Object

Mainly manages history, corresponds to browser address bar operations like forward, backward, history, etc.

```js
history.back(); // Go back one step
history.forward(); // Go forward one step
history.go(param); // Parameter 1 goes forward one step, -1 goes back one step
```

### Browser Data Storage

#### Web Local Storage

A mechanism for users to store data in browser, stored in local folders

**localStorage:**

Permanently stores data on user's computer; unless manually deleted, data persists even after closing browser

Local storage can only store strings; stored values are automatically converted to strings

Can find stored values in browser's Application tab

```js
localStorage.setItem('key', value); // Store a value for key, can also modify key's value
localStorage.getItem('key'); // Find corresponding value by key
localStorage.removeItem('key'); // Delete
```

**sessionStorage:** Data is deleted when current browser page is closed;

Usage is same as localStorage

**Storing Complex Data Types:**

Need to convert complex data types to JSON strings, then convert back to objects when reading

JSON (JavaScript Object Notation) is a lightweight data exchange format

```js
localStorage.setItem('key', JSON.stringify(obj)); // Convert obj to string for storage
localStorage.getItem('key'); // Print obj object's string
JSON.parse(localStorage.getItem('key')); // JSON.parse converts string to object
```

#### Cookie

A very small text file stored locally in browser, used to store common data like login info, preferences, theme settings, etc.;

Internally stores information as key-value pairs (can view in browser's Application);

- **name**: Name, a uniquely determined cookie name; cookie name must be URL encoded;
- **value**: Value, string value stored in cookie; value must be URL encoded;
- **Domain**: Domain, indicates which domain the cookie is valid for; all requests sent to that domain will include this info;
- **path**: Path, for which path in specified domain should send cookie to server;
- **Expires/Max-Age**: Validity period, indicates cookie's validity;
- **HttpOnly**: If this value is set to true, cannot get cookie value through JS script; can effectively prevent XSS attacks;
- **Secure**: Security flag, when specified, cookie only sent to server when using SSL connection;

On first website visit, browser sends request, after server responds, adds a Set-Cookie in response header, and puts Cookie in response request; Web server provides an encrypted Cookie to browser

```js
document.cookie = 'username=json;expires=Thu'; // Set cookie
console.log(document.cookie); // Read cookie
```
