# JavaScript Basics

### script Tag

Attributes of the script tag:

- **src**: Specifies the path to an external JS file; when used, code inside the tag is ignored;
- **type**: Defines the script type, defaults to `text/javascript`; when set to `module`, it executes as an ES module;
- **defer**: Script loads asynchronously and executes after HTML parsing completes, before `DOMContentLoaded` fires (suitable for scripts that manipulate the DOM);
- **async**: Browser downloads the script while continuing to parse HTML, and executes immediately after loading (suitable for scripts that don't manipulate the DOM);

### Data Types & Variables

- `undefined == null` is `true` due to a special provision in the ECMAScript specification;
- `typeof(null)` returns `object`, which is a historical JavaScript bug. In early implementations, type tags used the first three binary bits; `null`'s value is all zeros, incorrectly identified as an object (object type's first three bits are zeros);
- **NaN**: Produced by mathematical operation errors or failed type conversions; it's a Number type and not equal to any value, including itself;

```js
typeof age; // Result is undefined, won't throw an undefined variable error
```

#### Symbol

- Symbol is a primitive type used to represent globally unique identifiers;
- Created via `Symbol(description)`, each call generates a brand new value; description is only for debugging and doesn't affect uniqueness;
- Symbol can be used as an object key to avoid property name conflicts;
- During object traversal, Symbols are not captured by conventional traversal; use `Object.getOwnPropertySymbols(obj)` to retrieve them;
- Symbol cannot be serialized by `JSON.stringify`; when used as a key, the property is ignored; when used as a value, it's treated as `undefined` and ignored;

```js
const a = Symbol('a');
const b = Symbol('b');

const obj = {
  [a]: 'value for a',
  [b]: 'value for b',
  [Symbol('c')]: 'c',
};

console.log(obj[Symbol('c')]); // undefined
```

- `Symbol.for()` method: Creates global symbols; checks the global runtime registry; if no symbol exists for the string, creates and adds it to the registry; if one exists, returns that symbol;

```js
const a = Symbol.for('123');
const b = Symbol.for('123');
console.log(a === b);
```

- `Symbol.keyFor()` method: Takes a symbol as parameter to query the corresponding string in the global registry; can only query global symbols, otherwise returns `undefined`;

#### BigInt

Used to represent integers of arbitrary precision (including those exceeding `Number.MAX_SAFE_INTEGER`). JS engines no longer use IEEE754 format for BigInt storage, but use arbitrary precision big integer structures (similar to arrays/linked lists storing digits) in registers;

- Cannot mix BigInt and Number types in arithmetic operations, but can compare them;
- Does not support Math functions;
- BigInt doesn't support JSON serialization, but can use JSON's replacer and reviver parameters for serialization;

```js
// Creation methods
let a = BigInt(1234);
let a = 1234n;

// Serialization and deserialization
JSON.stringify({ a: 1n }, (key, value) =>
  typeof value === 'bigint' ? value.toString() : value
);
JSON.parse('{"a":"1"}', (key, value) =>
  typeof value === 'string' && /^\d+$/.test(value) ? BigInt(value) : value
);
```

#### Floating Point Precision Issues

JS uses 64-bit double-precision floating point numbers to represent all numbers. Decimals like 0.1, 0.2, 0.3 have infinite binary representations, and computers can only store finite digits, causing truncation and precision loss;

When performing operations on these imprecise decimals, the system approximates the results, but if the deviation is too large, no approximation is applied, e.g., `0.3 - 0.2`;

**decimal.js high-precision library:**

Install: `npm i decimal.js`

```js
let a = new Decimal(0.3);

let b = a.plus(0.2); // Addition
let b = a.minus(0.2); // Subtraction
let b = a.times(0.2); // Multiplication
let b = a.div(0.2); // Division
let b = a.mod(0.2); // Modulo
```

#### Infinity

`Infinity` is a special JS value representing positive infinity, type is Number. In ES, you can get the maximum and minimum representable values via `Number.MAX_VALUE` / `Number.MIN_VALUE`; exceeding these values converts to the special `Infinity` value;

- Use `isFinite()` to check if a value is finite; if it's `Infinity`, returns `false`;

```js
let a = Infinity;
let b = -Infinity;
console.log(1 / 0); // Can also generate infinity
console.log(-1 / 0);

// Special usage
console.log(a + 1 === a); // true
console.log(10 < Infinity); // Always true
console.log(1 / Infinity); // 0
```

#### Object Boxing & Unboxing

**Boxing**

When performing property access or method calls on primitive types, JavaScript performs ToObject conversion, temporarily converting the primitive type to its corresponding wrapper object, then calling methods from its prototype chain, returning the result and destroying the wrapper object (semantic representation);

- However, actual JS engines use tagged representation (representing "type + value") and inline cache (caching access paths) to avoid creating temporary wrapper objects in most cases, achieving near-zero allocation access;

```js
let str = 'aaa';
console.log(str.length);

// Automatic boxing operation
let tempStr = new String(str);
let result = tempStr.length; // Get result
tempStr = null;
return result;
```

**Unboxing**

The process of converting complex data types to primitive values, performing ToPrimitive abstract operation:

- First calls `obj[Symbol.toPrimitive](hint)`;
- If not present, determines call order based on hint:
  1. number/default: `valueOf` → `toString`
  2. string: `toString` → `valueOf`
- If no primitive value is returned, throws `TypeError`;

**Symbol.toPrimitive**:

Most ordinary objects don't implement `Symbol.toPrimitive`, but some built-in objects (like Date) provide default implementations;

The hint parameter of `Symbol.toPrimitive` is automatically determined by the JS engine based on operators and context:

- string context: `String(obj)`, `${obj}`, either side of `+` is a string;
- number context: `Number(obj)`, `obj - 0`, `obj > otherobj`, both sides of `+` are numbers, booleans, or null;
- default context: `obj + obj`, `obj == otherobj`;

```js
// Configure custom obj's Symbol.toPrimitive method
let obj = {
  [Symbol.toPrimitive](hint) {
    if (hint === 'string') {
      return 'Hello Yang';
    }
    if (hint === 'number') {
      return 42;
    }
    if (hint === 'boolean') {
      return true;
    }
  },
};
```

**valueOf**

`valueOf` returns the "primitive value representation" of an object;

- By default (Object / Array / Function), returns the object (this) itself;
- Wrapper objects (Number / String / Boolean) override `valueOf` to return the corresponding primitive value;
- Date's `valueOf` returns a timestamp (number);

```js
let num = new Number(10);
console.log(num.valueOf()); // Primitive value

let str = new String('Hello');
console.log(str.valueOf()); // Primitive value
```

**toString**

`toString` returns the string representation of an object; `Object.prototype.toString` returns "[object Type]" format string;

- Different built-in objects override this method:
  - Primitive Object returns `[object Object]`
  - Array: Returns element-joined string
  - Function: Returns function source code
  - Number / Boolean / String: Returns string of corresponding primitive value
  - Date: Returns readable time string
  - RegExp: Returns regex literal string
- `undefined` and `null` have no `toString` method; calling directly throws an error;
- For `String(undefined/null)` conversion, it uses the ToString abstract operation, not calling the `toString` method;
- `.toString()` essentially calls the object prototype method; `String()` executes the ToString abstract operation;

```js
let fn = function () {
  console.log('Hello Yang');
};
console.log(fn.toString()); // Function's string format

let arr = [1, 2, 3, 4, 5];
console.log(arr.toString()); // Outputs "1,2,3,4,5"
```

#### Type Conversion

##### ToNumber

Triggered when "numeric operation" or "relational operation with non-string comparison" is needed, such as `Number()`, `+ - * /`;

- Undefined → NaN;
- Null → 0;
- Boolean: true → 1, false → 0;
- String: Pure numeric strings and other base strings convert to corresponding numbers; empty strings (including whitespace-only) → 0; non-pure-numeric strings → NaN; Infinity string → Infinity;
- Symbol: Throws error directly;
- Object: ToPrimitive operation, calls `valueOf()`, if not primitive → calls `toString()`, then Number conversion; e.g., `[]` → 0, `{}` → NaN;

##### ToBoolean

Triggered when JS needs "truthiness judgment", such as if, while, !, &&, ||, ternary operator;

- falsy values: false, 0, -0, 0n, NaN, "", null, undefined;
- All other values are truthy (including "0", "false", {}, [], etc.);

##### ToString

Such as `String(x)`, `x.toString()`, string concatenation (when either operand is a string);

- Number, Boolean, null / undefined convert to string of corresponding value;
- Symbol can be explicitly converted to string via `String()`, but cannot trigger ToString via `+` concatenation (throws error);
- Object: First `ToPrimitive(hint=string)`, then ToString;

##### Relational Operators

- `< > <= >=`: Objects first ToPrimitive; if both sides are strings, compare lexicographically; if either side is not string, ToNumber;
- Equality operator `==`:
  - Same type: compare directly; different types: implicit type conversion;
  - If either side is number type, ToNumber then compare;
  - Special case: `null == undefined` is `true`, but `null == 0` and `undefined == 0` are both `false`;

```js
false == []:
- false → 0
- [] → "" (ToPrimitive) → 0 (ToNumber)
- 0 == 0 → true

false == ![]:
- ![] → false
- false == false → true (no type conversion)
```

### Variables & Operations

#### Hoisting

- `let` and `const` have block scope:
  1. Variables declared in `{}` are only valid within that block;
  2. Cannot redeclare the same variable name in the same block scope, otherwise throws syntax error;
  3. `let` and `const` declarations are hoisted but not initialized; in Temporal Dead Zone (TDZ) before declaration executes, accessing the variable throws `ReferenceError`;
- `var` doesn't have block scope but has function scope:
  1. Declared in a function can only be used within that function;
  2. If same name appears, later `var` overrides earlier `var`;
  3. `var` declaration is hoisted to the top of the function, but variable initialization stays in place;
- `function` declared functions don't have block scope but have function scope:
  1. Function hoisting takes precedence over variable hoisting;
  2. Function declaration is hoisted entirely, including the function body; but in block scope, only the declaration is hoisted, not the body;

```js
console.log(a); // Outputs function body
function a() {
  console.log('function');
}
var a = 0;
console.log(a); // Outputs 0
console.log(a()); // Error, because a is not a function
```

#### Logical Operators

`||`: Returns the first truthy value immediately; if all operands are falsy, returns the last operand;

`??`: Returns the right side value when left side is `null` or `undefined`;

`&&`: Returns the first falsy value immediately; if all operands are truthy, returns the last operand;

```js
let a = 0 || 10;   // a is 10
let b = 10 || 20;  // a is 10

true && a = 100;
```

#### Deep Copy

**Recursive Function:**

```js
let obj = {
  name: 'aaa',
  age: 18,
  hobby: ['basketball', 'pingpong'],
  family: {
    father: 'bbb',
    mother: 'ccc',
  },
  [Symbol('key')]: '1',
};

function deepCopy(obj, weakmap = new WeakMap()) {
  // Primitive type handling
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }

  // Complex type handling

  // Handle circular reference; if object already copied, return stored copy
  if (weakmap.has(obj)) {
    return weakmap.get(obj);
  }

  let result = Array.isArray(obj) ? [] : {}; // Initialize new object

  weakmap.set(obj, result); // Key indicates object has been copied, value is copy result storage
  for (let k in obj) {
    if (obj.hasOwnProperty(k)) {
      // Only copy properties on the object itself, not prototype chain
      result[k] = deepCopy(obj[k], weakmap); // Recursively copy reference properties
    }
  }
  let symbolArr = Object.getOwnPropertySymbols(obj); // Get non-iterable Symbol properties
  for (let k of symbolArr) {
    result[k] = deepCopy(obj[k]);
  }
  return result; // Return the copied object
}
let newobj = deepCopy(obj);
console.log(newobj);
```

**structuredClone**

Built-in JS deep copy method

```js
let obj = {
  name: 'aaa',
  age: 18,
  hobby: ['basketball', 'pingpong'],
  family: {
    father: 'bbb',
    mother: 'ccc',
  },
};
let newObj = structuredClone(obj);
```

**JSON**

A lightweight data exchange format, essentially a string, commonly used for frontend-backend data transmission:

- Serialization: `JSON.stringify()`, converts JS object → JSON string;
- Deserialization: `JSON.parse()`, converts JSON string → JS object

Limitations:

- Doesn't support function, undefined, Symbol; these types are ignored;
- NaN, Infinity are converted to null;
- Map, Set become empty objects;
- BigInt throws error directly;
- JSON only cares about object data values; serialization then deserialization causes prototype chain loss;
- Only enumerable properties can be serialized; non-enumerable properties (`enumerable: false`) are ignored;
- JSON is tree structure; circular reference is graph structure; `JSON.stringify()` throws error directly (TypeError);

```js
let obj = {
  name: 'aaa',
  age: 18,
  hobby: ['basketball', 'pingpong'],
  family: {
    father: 'bbb',
    mother: 'ccc',
  },
};
let newobj = JSON.parse(JSON.stringify(obj));
```

### Statements

#### for in

Used to iterate over enumerable property keys of an object; for arrays, iterates over indices;

- Iterates over own and prototype chain properties; can use `hasOwnProperty()` method to only iterate object's own properties;
- Doesn't iterate over Symbol properties;
- Iteration order: integer keys ascending first, then string keys in insertion order;

```js
const obj = {
  3: 'three',
  b: 'B',
  1: 'one',
  a: 'A',
};
for (let key in obj) {
  console.log(key, obj[key]);
}
```

#### for of

Used to iterate over iterable values;

- Doesn't iterate over inherited prototype chain properties;
- Cannot directly iterate over plain objects (plain Object doesn't implement `Symbol.iterator`);
- Can use `break / continue`; forEach cannot;

```js
let obj = [1, 2, 3, 4];
for (let v of obj) {
  v; // Represents array values
}
```

#### try-catch-finally

try attempts code, catch captures error code (including error objects and Promise rejects), finally always executes once; try's return value is temporarily stored, catch's return value overrides try's, finally's return value overrides both try and catch's;

In synchronous functions, try-catch-finally's return value is the function's return value;

In async functions, try-catch-finally's return value is the Promise's then parameter; if await is a reject, catch code is also triggered;

```js
async function fn2() {
  try {
    const res = await Promise.resolve('aaa');
    return res;
  } catch (error) {
    console.log(error);
  }
}

console.log(fn2().then((res) => console.log(res))); // Outputs aaa
```

### Destructuring Assignment

- For primitive types: destructuring gets a copy of the value; for reference types: destructuring gets a copy of the reference (same address);
- Destructured variable names must match property names;
- After destructuring and renaming, original data name cannot be used, otherwise throws error;

```js
let obj = {
  name: 'aaa',
  age: 18,
  address: { city: 'New York', country: 'USA' },
};

let { name, age } = obj;

let { name: myName = 'bbb', age: myAge = 134 } = obj; // Rename destructured data, set default values

let {
  address,
  address: { city, country },
} = obj; // Nested destructuring, destructure both nested object and values

let { address } = structuredClone(obj); // Deep copy then destructure, solves reference sharing issue
```

### Spread Operator

Used to expand a set of elements and place them into a new structure;

- For iterable objects, expands elements in order based on iterator protocol;
- For plain objects, copies own enumerable properties (OwnEnumerableProperties), shallow copy, doesn't include prototype chain and non-enumerable properties;

```js
// Merge arrays
const arr1 = [1, 2];
const arr2 = [3, 4];
const merged = [...arr1, ...arr2]; // [1, 2, 3, 4]

// Convert string to single character array
[...'abc'];

// Convert pseudo-array to real array
const arr = [...document.querySelectorAll('p')];

// String deduplication
const unique = [...new Set('abacabx')].join('');
```

### Promise Object

Promise wraps an async operation and provides an object to get the async operation's result; core is unified async result state management + chain call mechanism;

- executor executes synchronously;
- resolve: Called when async operation succeeds; changes Promise's `Pending` state to `Fulfilled`;
- reject: Called when async operation fails; changes Promise's `Pending` state to `Rejected`;
- then: Gets async result:
  1. First parameter is success callback
  2. Second parameter is failure callback
  3. Callback parameters are values passed by resolve or reject
- catch: Specifically handles async failures (like throw errors, reject calls), equivalent to `promise.then(null, fn)`;
- finally: Executes regardless of success or failure, receives no parameters;

```js
let promise = new Promise((resolve, reject) => {
  // executor
});

promise.then(onFulfilled, onRejected);
```

Chain Call Mechanism:

then/catch/finally all return a new Promise, can continue using then/catch/finally on the new Promise:

then/catch return a new Promise whose state is determined by the callback function's execution result: (return value becomes input for next Promise)

- Return ordinary value → equivalent to `Promise.resolve(value)`
- Return Promise / thenable → new Promise follows its state;
- Throw exception → equivalent to `Promise.reject(error)`;
- No return → equivalent to `Promise.resolve(undefined)`
- If then/catch has no callback, value penetration occurs (when then parameter is missing, callback defaults to `(value => value / throw error)`)

`finally` itself returns a new Promise, but its callback's return value doesn't affect chain results; only throwing error / returning reject affects chain results:

```js
Promise.resolve(1)
  .finally(() => 999)
  .then((res) => console.log(res)); // 👉 1

Promise.resolve(1)
  .finally(() => Promise.resolve(999))
  .then((res) => console.log(res)); // 👉 1

Promise.resolve(1)
  .finally(() => {
    throw new Error('err');
  })
  .catch((e) => console.log(e.message)); // 👉 "err"
```

#### Promise Static Methods

`resolve()` directly generates a resolved Promise object

```js
Promise.resolve('aaa').then((value) => {
  console.log(value); // Outputs aaa
});
```

`reject()` directly generates a rejected Promise object

```js
Promise.reject('aaa').then((value) => {
  console.log(value); // Outputs aaa
});
```

`all([])` takes a Promise array as parameter; when every Promise in the array succeeds, returns a successful Promise; otherwise returns a failed Promise;

```js
const p1 = new Promise((resolve) => {
  resolve(1);
});
const p2 = new Promise((resolve) => {
  resolve(1);
});
const p3 = Promise.resolve('ok');

// If all Promises succeed, result is an array containing 3 results
// If one fails, result is the failed Promise's value
const result = Promise.all([p1, p2, p3]);
```

`allSettled([])` takes a Promise array as parameter; waits for all Promises to complete (regardless of success or failure) then returns a successful Promise; its then callback parameter is an array of each Promise's result data;

```js
const p1 = Promise.resolve(1);
const p2 = Promise.reject(-1);
Promise.allSettled([p1, p2]).then((res) => {
  console.log(res);
});
// Output:
/*
   [
    { status: 'fulfilled', value: 1 },
    { status: 'rejected', reason: -1 }
   ]
*/
```

`any([])` takes a Promise array as parameter; when any Promise in the array succeeds, returns a successful Promise; only when all Promises are rejected does the returned instance become rejected;

```js
const p1 = new Promise((resolve, reject) => {
  reject(1);
});
const p2 = new Promise((resolve, reject) => {
  reject(2);
});
const p3 = Promise.resolve('ok');

Promise.any([p1, p2, p3]).then(
  console.log(r) // Outputs 'ok'
);
```
