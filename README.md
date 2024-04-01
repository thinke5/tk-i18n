# i18n json to mjs

灵感来源 [https://inlang.com/m/gerre34r/library-inlang-paraglideJs](https://inlang.com/m/gerre34r/library-inlang-paraglideJs)

将多语言的 json 文件转为 mjs，支持`Tree-shaking`减少代码体积

支持 ts 有完整的类型提示

```shell
npx tk-i18n
```

`i18n.config.jsonc`

```jsonc
{
  // 支持的语言
  "language": ["zh", "en"],
  // 默认 or 兜底 语言
  "defaultLanguage": "zh",
  // 多语言 文件夹
  "inputDir": "messages",
  // 输出文件夹
  "outputDir": "./src/i18n"
}
```

### 支持的格式 jsonc json5 json

### 支持的语法

1. 基础类型、变量

```json
{
  "name": "Thin Ke",
  "hello": "hello {user} !",
  "num": 123,
  "bool0": false,
  "bool1": true,
  "nil": null
}
```

2. 数组、对象

```json
{
  "arr": [1, 2, 3],
  "arr_str": ["T", "h", "i", "n"],
  "obj": {
    "txt": "hello",
    "var": "hello {user} .",
    "num": 123,
    "arr_str": ["T", "h", "i", "n"]
  }
}
```

3. 自引用

```json
{
  "name": "Thin Ke",
  "hello": "hello {@name} !" // => hello Thin Ke !
}
```

4. 变量处理

```jsonc
// 支持链式、函数式； 支持任意全局函数或对应类型的方法
{
  // 1 链式调用
  "hello": "hello {name|..toUpperCase()} !",
  // 2 函数方式
  "fn": "max age is {age|>Math.max(99,#)}",
  // 支持混合使用
  "test1": "max age is {age|>Math.max(99,#)｜..toFixed(2)}",
  // 自引用 也支持处理
  "name": "Thin Ke",
  "name_test": "hello {@name|..toUpperCase()} !"
}
```

### 注意点

1. key 最终转为函数名，所有 要遵循 [命名规则](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Guide/Grammar_and_types#%E5%8F%98%E9%87%8F)
2. 多语言文件名 需要遵循 命名规则（同 1 所示）
