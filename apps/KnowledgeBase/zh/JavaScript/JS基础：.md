# JS基础：

### script标签

script标签的属性

- src：指定外部JS文件的路径，引入后标签内部的代码会被忽略；


- type：定义脚本类型，默认为text/javascript，设置为module时将以ES模块方式执行；

- defer：脚本异步加载，在HTML解析完后，DOMContentLoaded事件触发前序执行（适用于进行DOM操作的脚本）；


- async：浏览器下载脚本的同时，会继续解析 HTML 文档，并且脚本加载完成后立即执行（适用于不进行DOM操作的脚本）；

### 数据类型与变量

- undefined == null 为 true，是因为 ECMAScript 规范中特殊规定；
- `typeof(null)`结果是object，这是 JavaScript 的历史遗留 bug，在早期实现中，类型标签用前三位二进制表示；`null` 的值是全 0，被错误识别为对象（对象类型前三位是全零）；
- NaN：由数学运算错误或者数据类型转换失败产生，是Number类型，不与任何值相等，包括它本身；

```
typeof age //结果为undefined，不会产生变量未定义的错误
```

#### Symbol

- Symbol 是一种原始类型，用于表示全局唯一标识符；
- 通过 Symbol(description) 创建，每次调用都会生成一个全新的值，并且description 仅用于调试，不影响唯一性；
- Symbol 可以作为对象的键，用于避免属性名冲突；
- 在对象遍历中，Symbol 不会被常规遍历拿到，可以通过`Object.getOwnPropertySymbols(obj)`拿到；
- Symbol 不能被 JSON.stringify 序列化；作为对象 key 时，该属性会被忽略，作为值时，会被当作 undefined 处理，从而被忽略；

```
const a =Symbol('a');
const b = Symbol('b');

const obj = {
    [a]: 'value for a',
    [b]: 'value for b',
    [Symbol("c")]:"c",
};

console.log(obj[Symbol("c")])//undefined
```

- Symbol.for()方法：用于创建全局符号，他会检查全局运行时注册表，如果发现不存在字符串对应的符号，则会创建符号并添加到注册表中，若发现存在相同字符串创建的符号则直接返回该符号；


```
const a = Symbol.for("123");
const b = Symbol.for("123");
console.log(a === b);
```

- Symbol.keyFor()方法：接收一个符号为参数，用来查询全局注册表对应的字符串，只能查询全局符号，否则返回undefined；


#### BigInt

用于表示任意精度的整数（包括超过Number.MAX_SAFE_INTEGER的整数）JS引擎对于BigInt不再使用IEEE754格式存储，而是用任意精度的大整数结构（类似数组/链表存位）存储到寄存器中；

- 不能混合使用BigInt和Number类型进行算数运算，但是可以进行比较；
- 不支持Math函数；
- BigInt不支持JSON的序列化，但是可以使用JSON的方法的replacer和reviver参数进行序列化；

```
//创建方式
let a =BigInt(1234);
let a = 1234n;

//序列化和反序列化
JSON.stringify(
  { a: 1n },
  (key, value) =>
    typeof value === "bigint" ? value.toString() : value
);
JSON.parse(
  '{"a":"1"}',
  (key, value) =>
    typeof value === "string" && /^\d+$/.test(value)
      ? BigInt(value)
      : value
);
```

#### 小数精度问题

JS使用64位双精度浮点数表示所有数字，类似0.1，0.2，0.3这样的小数在二进制中是无限位数的，而计算机只能存储有限位数，从而截断后面的位数，这样就导致精度缺失问题；

当你对这些有精度问题的小数进行运算时系统对结果进行近似处理，但是如果结果偏差太大就不会近似处理了，比如0.3-0.2；

**decimal高精度库：**

安装：`npm i decimal.js`

```
let a = new Decimal(0.3);

let b = a.plus(0.2);//加法
let b = a.minus(0.2)//减法
let b = a.times(0.2);//乘法
let b = a.div(0.2);//除法
let b = a.mod(0.2);//取余
```

#### 无限大

Infinity是JS一个表示无限大的正数，类型是Number；在ES中可以通过Number.MAX_VALUE/Number.MIN_VALUE获得能够表示最大和最小数值，超过这个数值则会被转化为特殊的Infinity值；

- 可以通过isFinite()方法判断数值是否为有限的，如果是Infinity则返回false；


```
let a = Infinity;
let b = -Infinity;
console.log(1 / 0);//也可以生成无限大
console.log(-1 / 0);

//特殊用法
console.log(a + 1 === a);//true
console.log(10 <  Infinity);//永远true
console.log( 1/Infinity);//0
```

#### 对象的装箱拆箱

**装箱**

当对基本类型执行属性访问或方法调用时，JavaScript 会进行ToObject 转换，把基本类型临时转换为对应的包装对象，再去其原型链上调用方法，返回结果后销毁包装对象（语义化表示）；

- 但是实际的JS引擎会通过 tagged representation （表示“类型 + 值”）和 inline cache（缓存访问路径）从而在大多数情况下避免创建临时包装对象，实现接近零分配的访问；

```
let str = 'aaa';
console.log(str.length);

//自动装箱操作
let tempStr = new String(str);
let result =tempStr.length;//获得结果
tempStr =null;
return result;
```

**拆箱**

将复杂数据类型转换为原始值的过程， 进行ToPrimitive 抽象操作

- 优先调用 `obj[Symbol.toPrimitive](hint)`；
- 若不存在，则根据 hint 决定调用顺序：
  1. number/default：valueOf → toString
  2. string：toString → valueOf
- 如果最终没有返回原始值，会抛出 TypeError；

**Symbol.toPrimitive**：

大多数普通对象没有实现 Symbol.toPrimitive，但部分内建对象（如 Date）提供了默认实现；

Symbol.toPrimitives的参数hint是JS引擎根据操作符和上下文自动决定的：

- string上下文：`String(obj)`，`${obj}`，+的任意一边为字符串；


- number上下文：`Number(obj)`，`obj - 0`，`obj > otherobj` ，+的两边为数字或bool值或null；


default上下文：`obj + obj`，`obj == otherobj`；

```
//配置自定义obj的Symbol.toPrimitives方法，通过this可以访问对象属性
let obj = {
    [Symbol.toPrimitive](hint) {
        if (hint === "string") {
            return "Hello Yang";
        } 
        if (hint === "number") {
            return 42;
        }
        if (hint === "boolean") {
            return true;
        }
    }
}
```

**valueOf**

valueOf 用于返回对象的“原始值表示”；

- 默认情况下（Object / Array / Function），返回对象（this）本身
- 包装对象（Number / String / Boolean）重写了 valueOf，返回对应的原始值；
- Date 的 valueOf 返回时间戳（number）；

```
let num = new Number(10);
console.log(num.valueOf());//原始值

let str = new String("Hello");
console.log(str.valueOf());//原始值
```

**toString**

toString 用于返回对象的字符串表示；即Object.prototype.toString 返回 "[object Type]" 格式字符串；

- 不同内建对象会重写该方法：
  - 原始Object返回[object Object]
  - Array：返回元素拼接字符串
  - Function：返回函数源码
  - Number / Boolean / String：返回对应原始值的字符串
  - Date：返回可读时间字符串（如Wed Apr 01 2026 08:52:57 GMT+0800 (中国标准时间)）；
  - RegExp：返回正则字面量字符串
- undefined 和 null 没有 toString 方法，直接调用会报错；
- 对于String(undefined/null) 可以转换，是因为走的是 ToString 抽象操作，而不是调用 toString 方法；
- .toString()本质是调用对象原型方法，String()执行 ToString 抽象操作；

```
let fn = function(){
    console.log("Hello Yang");
}
console.log(fn.toString());//函数的字符串格式

let arr = [1, 2, 3, 4, 5];
console.log(arr.toString());//输出 "1,2,3,4,5"
```

#### 类型转化

##### ToNumber

需要“数值运算”或“非字符串比较的关系运算”时触发，就会触发 ToNumber，如`Number()`、`+ - * /` 

- Undefined转化为NaN；
- Null转化为0；
- Boolean类型：true转为1，false转为0；
- String类型：纯数字字符串和其他进制字符串会转为对应数字，空字符串（包括只含有空格的字符串）转为0，非纯数字字符串转为NaN， Infinity字符串会转化为 Infinity；
- Symbol类型：直接报错；
- Object类型：进toPrimitive操作，依次调用 valueOf()，如果不是原始值 → 调用 toString()，再进行 Number 转换；如[ ]会被转化为0，{}会被转化为NaN；

#####  ToBoolean

 JS 需要“判断真假”的地方，就会触发 ToBoolean，如 if、while、!、&&、||、三元运算符

- falsy 值包括：false、0、-0、0n、NaN、""、null、undefined；
- 除上述值外，其余均为 truthy（包括 "0"、"false"、{}、[] 等）；

##### ToString

如String(x)、x.toString()、字符串拼接（任一操作数是字符串 ）

- Number，Boolean，null / undefined都转化为对应值的字符串；
- Symbol 可以通过 String() 显式转换为字符串，但不能通过 + 拼接触发 ToString（会报错）；
- Object：先`ToPrimitive（hint=string）`，再ToString；

##### 关系运算符

- `< > <= >=`：对象先进行 ToPrimitive，如果两边都是字符串按字典序进行比较，只要有一边不是字符串则ToNumber；
- 相等运算符`==`：
  - 同类型直接进行比较，不同类型才会发生隐式类型转化；
  - 只要有一边是数字类型，则 ToNumber 后进行比较；
  - 特例：null == undefined   结果为true，但是null == 0 和undefined == 0 结果都为false

```
false == []：
- false → 0
- [] → ""（ToPrimitive） → 0（ToNumber）
- 0 == 0 → true

false == ![]：
- ![] → false
- false == false → true（无类型转换）
```

### 变量与操作

#### 作用域提升

- `let` 和 `const` 具有块级作用域：
  1. 在 `{}` 中声明的变量只在该块内有效；
  2. 在同一块级作用域中不允许重复声明同名变量，否则会抛出语法错误。
  3.  `let` 和 `const` 的声明会被提升（hoisting），但不会被初始化，在声明执行之前处于暂时性死区（TDZ, Temporal Dead Zone），此时访问变量会抛出 `ReferenceError`
- `var`不具有块级作用域，但具有函数作用域：
  1. 在函数中声明只能在函数中使用；
  2. 如果出现同名，后面的var会覆盖前面的var；
  3. `var` 声明会被提升到函数的顶部，但是变量的初始化会保持在原地；
- `function`声明的函数不具有块级作用域，但具有函数作用域：
  1. 函数提升优先于变量提升；
  2. 函数声明会整体提升，包括函数体；但是在块级作用域中并不会提升函数体，只有声明会被提升；

```
console.log(a);//输出函数体
function a(){
    console.log('函数');
}
var a = 0;
console.log(a);//输出0
console.log(a());//报错，因为a不是个函数
```

#### 逻辑操作符

||：立即返回第一个真值，如果所有操作数都为假值时返回最后一个操作数；

??左侧为null，undefined时返回右边的值；

&&：立即返回第一个假值，如果所有操作数都为真值时返回最后一个操作数；

```
let a = 0 || 10;//a为10
let b = 10 || 20;//a为10

true && a=100;
```

#### 深拷贝

**函数递归：**

```

let obj = {
    name:'aaa',
    age:18,
    hobby:['篮球','乒乓球'],
    family:{
        fahter:'bbb',
        mother:'ccc',
    },
    [Symbol('key')]:'1',
}

function deepCopy(obj,weakmap=new WeakMap()) {
    //基本数据类型处理
    if (obj === null || typeof obj !== 'object') {
        return obj;
    }

    //复杂数据类型处理

    //处理循环引用，如果对象已经被拷贝过了直接返回存储的副本
    if (weakmap.has(obj)) {
        return weakmap.get(obj);
    }

    let result = Array.isArray(obj) ? [] : {};//初始化新对象
    
    weakmap.set(obj, result);//键表明对象已经被拷贝过了，值是拷贝结果存储，虽然是空的，但引用已经存储
    for (let k in obj) {
        if (obj.hasOwnProperty(k)) {//只拷贝本对象上的属性，而不是原型链上的
            result[k] = deepCopy(obj[k],weakmap);//再递归拷贝引用属性,避免创建多个weakmap
        }
    }
    let symbolArr = Object.getOwnPropertySymbols(obj);//获得不可迭代的Symbol属性
    for (let k of symbolArr) {
        result[k] = deepCopy(obj[k]);
    }
    return result;//将拷贝后的对象返回
}
let newobj = deepCopy(obj);
console.log(newobj)
```

**structuredClone**

JS内置的深拷贝方法

```
let obj = {
     name:'aaa',
     age:18,
     hobby:['篮球','乒乓球'],
     family:{
         fahter:'bbb',
         mother:'ccc',
     }
 }
let newObj = structuredClone(obj);
```

**JSON**

是一种轻量级数据交换格式，本质是字符串，常用于前后端数据传输：

- 序列化：`JSON.stringify()`，将 JS 对象 → JSON 字符串；
- 反序列化：`JSON.parse()` ，将JSON 字符串 → JS 对象

局限性：

- 不支持function，undefined，Symbol，这些类型的数据会被忽略；
- NaN，Infinity会被转为null；
- Map，Set会变成空对象；
- BigInt会直接报错；
- JSON只关注对象的数据值，序列化后再反序列化会导致原型链丢失（对象不再继承原构造函数）；
- 只能序列化可枚举属性，不可枚举属性（`enumerable: false`）会被忽略；
- JSON 是树形结构，而循环引用属于图结构， 在 `JSON.stringify()` 时会直接抛出错误（TypeError）；

```
let obj = {
     name:'aaa',
     age:18,
     hobby:['篮球','乒乓球'],
     family:{
         fahter:'bbb',
         mother:'ccc',
     }
 }
 let newobj =JSON.parse(JSON.stringify(obj));
```

### 语句

#### for in

用于遍历对象的可枚举属性的键（key），对于数组遍历的是索引；

- 会遍历自身和原型链上的属性，可以使用`hasOwnProperty()`方法判断，只遍历对象本身的属性；
- 不会遍历 Symbol 属性；
- 遍历顺序是先整数键升序，再字符串键按插入顺序；

```
const obj = {
    '3': '三',
    b: 'B',
    '1': '一',
    a: 'A'
};
for (let key in obj) {
    console.log(key, obj[key]);
}
```

#### for of

用于遍历对象可迭代的值

- 不会遍历原型链上继承的属性；
- 不能直接遍历普通对象（普通 Object 没有实现 `Symbol.iterator`）；
- 可以使用 `break / continue`，forEach不能；

```
let obj = [1,2,3,4]
for(let v of obj){
   v;//代表数组的值
}
```

#### try-catch-finally

try尝试代码，catch捕获错误代码（包括错误对象和Promise的reject），finally最终一定执行一次的代码；try的返回值会被暂存，catch的返回值会覆盖try的，finally的返回值会覆盖try和catch的；

在同步函数中，try-catch-finally的返回值即函数返回值；

try-catch-finally，try-catch-finally的返回值为异步返回返回的Promise对象的then的参数；在异步函数中如果await的是reject同样会触发catch的代码；

```
async function fn2() {
    try {
        const res = await Promise.resolve("aaa");
        return res;
    } catch (error) {
        console.log(error);
    }
}

console.log(fn2().then(res => console.log(res)));//输出aaa
```

### 解构赋值

- 对于基本数据类型：解构得到的是值的副本，对于引用数据类型：解构得到的是引用的副本（同一地址）；
- 解构的变量名与属性名一定要相同；
- 当解构数据重命名后原来的数据名不能再使用，否则报错；

```
let obj={
   name:'aaa',
   age: 18,
   address:{city:'New York',country:'USA'},
}

let {name,age} = obj;

let {name:myName='bbb',age:myAge=134}=obj//给解构后数据重命名,并设置默认值

let {address,address:{city,country}} = obj;//嵌套解构,将嵌套对象和值都解构

let {address} = structuredClone(obj);//深拷贝再解构，解决引用共享问题
```

### 展开运算符

用于将一组元素展开，并且放到新的结构中

- 对于可迭代对象，会基于迭代器协议按顺序展开其元素
- 对于普通对象，会复制其自身可枚举属性（OwnEnumerableProperties），属于浅拷贝，不包含原型链和不可枚举属性

```
//合并数组
const arr1 = [1, 2];
const arr2 = [3, 4];
const merged = [...arr1, ...arr2]; // [1, 2, 3, 4]

//将字符串变为单个字符数组
[...'abc']

//将伪数组转为真数组
const arr = [...document.querySelectorAll('p')];

//字符串去重
const unique = [...new Set('abacabx')].join('');
```

### Promise对象

Promise封装了一个处理异步操作，并且可以获得异步操作执行结果的对象；核心是统一异步结果的状态管理 + 链式调用机制；

- executor 是同步执行的；
- resolve：当异步操作成功时调用，能将Promise的`Pending`状态变为`Fulfilled`；
- reject：当异步操作失败时调用，能将Promise的`Pending`状态变为`Rejected`；
- then：用于获取异步结果：
  1. 第一个参数是异步成功的回调
  2. 第二个参数是异步失败的回调，
  3. 回调函数的参数分别是resolve或reject传递的值
- catch：专门处理异步失败的方法（如throw错误，reject调用），相当于`promise.then(null, fn)`；
- finally：无论异步成功或者失败都会执行的方法，不接收任何参数；

```
let promsie = new Promise((resolve, reject) => {
  // executor 执行器
})

promise.then(onFulfilled, onRejected)
```

链式调用机制：

then/catch/finally都返回一个新的Promise，可以继续对新的Promise使用then/catch/finally：

then / catch 都返回一个新的 Promise，其状态由回调函数的执行结果决定：（返回值会作为下一个 Promise 的输入）

- 返回普通值 → 等价于 `Promise.resolve(value)`
- 返回 Promise / thenable → 新 Promise 跟随其状态；
- 抛出异常 → 等价于 `Promise.reject(error)`；
- 不写 return → 等价于 `Promise.resolve(undefined)`
- 如果then/catch没有写回调函数，会产生值穿透（then 参数缺失时，回调函数默认为`（value => value / throw error）`）

`finally` 本身返回一个新的 Promise，但它的回调函数的返回值不会影响链上的结果，只有抛错 / 返回 reject才会影响链上结果：

```
Promise.resolve(1)
  .finally(() => 999)
  .then(res => console.log(res)) // 👉 1

Promise.resolve(1)
  .finally(() => Promise.resolve(999))
  .then(res => console.log(res)) // 👉 1

Promise.resolve(1)
  .finally(() => {
    throw new Error("err")
  })
  .catch(e => console.log(e.message)) // 👉 "err"
```

#### Promise静态方法

`resolve()`直接生成一个resolve的Promise对象

```
Promise.resolve('aaa').then(value => {
    console.log(value);//输出aaa
})
```

`reject()`直接生成一个reject的Promise对象

```
Promise.reject('aaa').then(value => {
    console.log(value);//输出aaa
})
```

`all([])`接收一个Promise数组为参数，当数组的每一个Promise对象都成功时返回一个成功的Promise对象，否则返回失败的Promise对象；

```
const p1 = new Promise((resolve) => {
    resolve(1);
});
const p2 = new Promise((resolve) => {
    resolve(1);
});
const p3 = Promise.resolve('ok');

// 如果所有 Promise 都成功，result 将是一个包含 3 个结果的数组，如果其中一个失败，result 将是失败 Promise 的值
const result = Promise.all([p1, p2, p3]);
```

`allSettled([])`接收一个Promise数组为参数，等待所有Promise对象完成（无论成功还是失败）后返回一个成功的Promise，其then的回调函数参数为各个Promise请求回来的数据数组；

```
const p1 = Promise.resolve(1);
const p2 = Promise.reject(-1);
Promise.allSettled([p1, p2]).then(res => {
    console.log(res);
});
// 输出：
/*
   [
    { status: 'fulfilled', value: 1 },
    { status: 'rejected', reason: -1 }
   ]
*/
```

`any([])`接收一个Promise数组为参数，当数组只要有一个Promise对象成功时，返回一个成功的Promise对象，只有所有 Promise 都被拒绝，则返回的实例将变为已拒绝状态

```
const p1 = new Promise((resolve, reject) => {
    reject(1);
});
const p2 = new Promise((resolve, reject) => {
    reject(2);
});
const p3 = Promise.resolve("ok");

Promise.any([p1, p2, p3]).then(
    console.log(r), // 输出 'ok'
);
```

`race([])`：只要数组中的任何一个Promise 状态发生变化，`race` 方法的Promise状态立即发生相应变化；并且只接收第 一个发生变化的 Promise 的值将传递给 `race` 方法的then作为参数；

```
const p1 = new Promise((resolve) => {
    setTimeout(() => {
        resolve(10);
    }, 3000);
});
const p2 = new Promise((resolve, reject) => {
    setTimeout(() => {
        throw new Error("I encountered an error");
    }, 2000);
});

Promise.race([p1, p2]).then(
    (v) => console.log(v), // 输出 10
    (e) => console.log(e)
);
```

#### 使用方法

**手写 `Promise.all`**

 用一个计数器记录完成数量，用数组按索引收集结果，每个任务完成后判断是否全部完成；

```
Promise.myAll = function (tasks) {
  return new Promise((resolve, reject) => {
    // 1️⃣ 参数校验（可选但加分）
    if (!Array.isArray(tasks)) {
      return reject(new TypeError("Argument must be an array"))
    }

    const results = []
    let count = 0

    // 2️⃣ 空数组
    if (tasks.length === 0) {
      return resolve([])
    }

    tasks.forEach((task, index) => {
      // 3️⃣ 统一转 Promise（关键点🔥）
      Promise.resolve(task)
        .then(res => {
          results[index] = res
          count++

          // 4️⃣ 全部完成
          if (count === tasks.length) {
            resolve(results)
          }
        })
        .catch(err => {
          // 5️⃣ 失败立即结束
          reject(err)
        })
    })
  })
}
```

**并发数量限制**：限制同时执行的异步操作的数量，用于处理网络请求，文件上传；

比如：Promise.all(1000 个请求)，浏览器后台执行1000个网络请求任务，会造成服务雪崩；

- 整体使用一个Promise包裹，用于返回并发完成后的结果；
- 使用调度状态机：记录正在执行的异步任务数量，以及执行到哪个异步任务；
- 使用next方法进行派发任务和补位，当一个异步任务调用完成时，递归调用next进行补位下一个任务；
- next方法中使用while循环根据限制数量和正在执行的任务数量进行派发任务；

```
function promisePool(tasks, limit) {
    const results = []   // 存结果（按原顺序）
    let running = 0     // 当前正在执行的任务数
    let index = 0       // 下一个要启动的任务下标

  return new Promise((resolve, reject) => {
    const next = () => {
      // 全部完成
      if (index === tasks.length && running === 0) {
        resolve(results)
        return
      }

      while (running < limit && index < tasks.length) {
        const currentIndex = index++
        running++

        Promise.resolve()
          .then(() => tasks[currentIndex]())
          .then(res => {
            results[currentIndex] = res
          })
          .catch(err => {
            reject(err) //一旦有任务失败，整个池直接失败
          })
          .finally(() => {
            running--
            next()
          })
      }
    }
    next()
  })
}
```

 **Promise重试封装**：请求失败后，按一定规则重新执行 Promise 任务（如接口重新请求、异步计算等）

```
    function retryWithDelay(fn, retries = 3, delay = 1000) {
            return fn().catch(err => {//失败时在catch重试
                if (retries <= 0) {//重试次数用完，返回失败
                    return Promise.reject(err);
                }
                return new Promise(resolve => {//返回一个新的Promise，在delay后执行resolve，在then重试
                    setTimeout(resolve, delay);
                }).then(() => retryWithDelay(fn, retries - 1, delay));
            });
        }

    retryWithDelay(() => fetch('/api/data'), 3, 2000)
    .then(res => res.json())
    .catch(err => console.error('最终失败', err));
```

**Promise超时处理**：希望 Promise 在一定时间内未完成则自动拒绝，这可以用于防止长时间等待无响应的请求；

```
function withTimeout(promise, timeout = 3000) {
  return Promise.race([
    promise,
    new Promise((_, reject) => {
      setTimeout(() => {
        reject(new Error('Promise timeout'));
      }, timeout);
    })
  ]);
}
```

#### async和await

async/await 本质是使用生成器暂停和恢复流程 ，使用 Promise进行异步操作 ，使用自动执行器控制流程；

```
function* gen() {
  const res = yield fetch('/api')
  console.log(res)
}
```

async：用于声明异步函数：

- 在遇到到await之前是同步执行，await后的代码进入微任务队列；
- 返回一个Promise（默认是resolve状态）；

await：用于在async函数内部中暂停执行：

- 后面跟一个Promise对象，当Promise的状态为resolve时继续执行async，为reject时抛出错误并终止async函数执行；
- 返回Promise的resolve或reject的内容；
- 如果 `await` 后面不是 Promise，会自动用 `Promise.resolve()` 包装，并返回；

```
async function fn1(){
    console.log(1)
    await fn2();//执行fn2后根据fn2的promise结果执行后面的代码
    console.log(2);
}

async function fn2(){
    console.log('fn2')
}
fn1();
console.log(3)//输出为1 fn2 3  2
```

### 正则表达式：		

`RegExp`构造函数的实例对象，通过用一套符号定义匹配规则，快速查找，替换，验证文本内容；

通过//字面量和修饰符定义正则表达式；再通过正则表达式上的方法来匹配文本；

**test方法**：方法用于检测一个字符串是否匹配该正则表达式，返回一个布尔值；

**exec方法**：返回一个包含详细匹配成功信息的数组，如果匹配失败返回null；数组第一个元素是匹配到的字符串字串，数组上的属性：index（匹配成功的起始索引），input（输入的字符串）；

```
const str = "123456";
const reg = /123/;//检查字符串是否包含123

reg.test(str);
reg.exec(str);
```

#### 转义字符：

对于正则表达式中具有特殊含义的字符（如 . * + ? ^ $ ( ) [ ] { } | \），如果需要匹配它们本身，必须在前面加上 \；

\d 相当于`[0-9]`；

\D 相当于非\d，`[^0-9]`；

\w 相当于`[A-Za-b0-9_]`；

\W 相当于非\w，`[^A-Za-b0-9_]`；

\s 匹配任意空白字符（空格、制表符、换行等）；

\S 匹配任意非空白字符；

\b 匹配单词边界（如`\bcat\b`会匹配："cat"、"cat."、" cat "（前后有空格）不会匹配："category"、"bobcat"、"cat123"）；

\n 匹配换行符；

\t 匹配制表符；

#### **边界符：**

^以什么开头；

$以什么结尾；

|代表或；

```
const str = '123456';
const reg1 = /^123/;//必须以123开头
const reg2 = /123$/;//必须以123结尾
const reg3 = /^123$/;//整个字符串必须从开头到结尾完全是123

reg1.test(str);//返回true
reg2.test(str);//返回false
```

#### **量词：**

用来表示重复次数；

*：出现零次或多次，相当于{0,}；

```
const reg1 = /^1*$/;//可以让1出现0次或者多次
const reg2 = /^12*3$/;//2可以出现多次
const reg3 = /^1(23)*$/;//结尾23可以出现0次或多次，但是不能单独出现2或3
```

+：重复一次或多次,相当于{1,}；

? 重复零次或一次，相当于{0,1}；

{n} 一定要重复n次；

{n,} 大于等于n次；

{n,m} 大于等于n，小于等于m次；

#### **字符集：**

.代表任意字符；

[ ]代表匹配到括号内任意一个字符即可（**匹配单字符串**），在括号内^代表非的意思，在括号内$+*失去特殊含义，无需转义（一般特殊字符需要\来转义），但是^]-还是需要转义；

```
const reg=/[abc]/;//括号中任何一个字符出现即为true
const reg=/^[abc]$/;//只能出现abc中的其中一个字符
const reg=/[^abc]/;//除了abc之外的字符
```

#### 修饰符：

约束正则表达式匹配的某些细节；

i：表示不区分大小写；

g：表示查找字符串中所有匹配项，而非仅第一个；

m：使 `^` 和 `$` 匹配每行的开头和结尾，而非整个字符串的开头和结尾（\n代表换行）

```
let str = '1234567123';
let newStr = str.replace(/123/g,"aaa");//将123全部转为aaa
```

#### 正向预查：

用于判断某个位置的后面是否存在符合特定模式的内容，但匹配结果中不包含这部分内容；

```
/\d+(?=元)/;//匹配后面跟着元的数字
```

#### 常用的正则

**用户名正则：**4-16位，字母开头，允许字母、数字、下划线；

```
/^[a-zA-Z][a-zA-Z0-9_]{3,15}$/
```

**密码强度正则：**6-20位，包括至少1个大写字母，1个小写字母，1个数字，1个特殊字符

```
/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{6,20}$/;
```

**qq邮箱正则**

```
/^\d{5,13}@qq\.com$/
```

**手机号正则**：1开头，第二位3-9，后9位0-9

```
/^1[3-9]\d{9}$/
```

**身份证号正则：**匹配18位中国大陆身份证号

```
/^\d{6}(18|19|20)\d{2}(0[1-9]|1[0-2])(0[1-9]|[12]\d|3[01])\d{3}[\dXx]$/
```

**车牌号正则：**

```
/^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z]{1}[A-Z]{1}[A-HJ-NP-Z0-9]{4}[A-HJ-NP-Z0-9挂学警港澳]{1}$|^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z]{1}[A-Z]{1}D[A-HJ-NP-Z0-9]{5}$/
```

 



  
