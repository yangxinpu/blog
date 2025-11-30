// Prettier配置文件 - 定义代码格式化规则
export default {
  // 尾随逗号配置：'es5'表示仅在ES5兼容的地方添加尾随逗号（对象、数组）
  // 可选值：'es5', 'all', 'none'
  trailingComma: 'es5', 
  
  // 缩进设置：每个缩进使用2个空格
  tabWidth: 2, 
  
  // 语句结尾是否添加分号
  semi: true, 
  
  // 字符串是否使用单引号（true）或双引号（false）
  singleQuote: true, 
  
  // 对象字面量中的括号内是否添加空格，如 { foo: bar } 而不是 {foo: bar}
  bracketSpacing: true, 
  
  // 箭头函数的参数是否总是使用括号
  arrowParens: 'always', 

  // 一行代码的最大长度，超过这个长度会自动换行
  printWidth: 200, 
};