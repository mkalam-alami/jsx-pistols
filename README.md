# JSX Pistols

JSX as web templates, tweaked for fast development. For TypeScript and NodeJS.

* Hot reload in development mode
* Native NodeJS require() in production mode
* Freely import arbitrary sources & typings in your templates
* Express support
* Asynchronous rendering

Under the hood, this is just a thin wrapper for [preact-render-to-string](https://www.npmjs.com/package/preact-render-to-string), using [Babel](https://babeljs.io/) for live transpiling during development.

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [API reference](#api-reference)
  - [Constructor](#constructor)
  - [Methods](#methods)
  - [Template contract](#template-contract)
  - [Default Babel options](#default-babel-options)
- [Tips and caveats](#tips-and-caveats)
- [License](#license)

## Installation

```
npm install jsx-pistols
```

## Example

### Template

```jsx
import * as React from "preact";
import { MyControllerContext } from "./mycontroller";

export default function render(context: MyControllerContext) {
  return <html><body>Hello {context.name}!</body></html>;
}
```

In production, it is recommended to let TypeScript compile the templates to JavaScript for performance.

### Rendering

**Using the API**

```typescript
import JsxPistols from 'jsx-pistols';

const jsxPistols = new JsxPistols({ rootPath: 'path/to/templates' });
const result = await jsxPistols.render('mytemplate', { name: 'John' });

console.log(result); // <!doctype html><html><body>Hello John!</body></html>
```

**Using an Express app**

```typescript
const app = express();

new JsxPistols({ expressApp: app });

app.set("view engine", "tsx"); // can be switched to "js" in production

app.get('/', (req, res) => {
  res.render('mytemplate', { name: 'John' })
})
```

## API reference

### Constructor

`new JsxPistols([options: Object])`

* **rootPath** *(string)*: The root path from which templates will be resolved. Defaults to the current working directory.
* **expressApp** *(object)*: An Express application that will be configured for using JSX Pistols as an engine. Extensions .js, .jsx and .tsx will be registered.
* **babelOptions** *(object)*: Options object to pass to the Babel transpiler. By default, the transpiler will support TypeScript and ECMAScript modules (see below).
* **prependDoctype** *(boolean)*: Whether to prepend "\<!doctype html>" if the root element is an "\<html>" tag. Defaults to `true`.
* **productionMode** *(boolean)*: Whether to import the templates as native JS modules. Defaults to `true` if `NODE_ENV` is set to 'production', `false` otherwise. If production mode is disabled, the library will compile the template on every render, and also prevent Node from caching code that is only imported in templates.

### Methods
  
`jsxPistols.render(templatePath: string[, context: any])`

Renders a template file.

* **templatePath** *(string)*: Path to the template. Either absolute, or relative to the specified `rootPath`. Extension may be omitted if `.jsx` or `.tsx`.
* **context** *(any)*: Any context will be passed as the first parameter of the template rendering function.

`jsxPistols.expressEngine(filePath: string, options: object, callback: Function)`

Express-compatible templating engine. Can be used as an alternative to the *expressApp* constructor option, for finer control on Express configuration.

### Template contract

The only requirement is that the **default export must be a function returning a JSX element**. Minimal example:

```jsx
import * as React from "preact";

export default function render(context: any) {
  return <div></div>;
}
```

Note: while not necessarily a good practice, the render function can return a promise for asynchronous rendering.

### Default Babel options

By default, the transpiler will support TypeScript and JSX. If you want different features to support, in order to match more closely your TypeScript config, you will need to override this object. The `@babel/plugin-transform-modules-commonjs` plugin is however mandatory, not keeping it will break all templates.

See also the [Babel options reference](https://babeljs.io/docs/en/options).

```json
{
  "presets": [[
    "@babel/preset-typescript",
    {
      "allExtensions": true,
      "isTSX": true
    }
  ]],
  "plugins": [
    "@babel/plugin-transform-modules-commonjs",
    "@babel/plugin-transform-react-jsx"
  ]
}
```

## Tips and caveats

Your templates may have to work around some issues due to the nature of JSX.

* **`class` vs `className`**

Prefer using Preact over React for your JSX typings, as the former accepts `class` as an attribute. Although both will be rendered properly.

* **Functions returing multiple tags**

Use ![fragments](https://reactjs.org/docs/fragments.html):

```jsx
function listElements() {
  return <>
    <li></li>
    <li></li>
    <li></li>
  </>;
}
```

* **Using handler attributes**

Preact will not render React handlers like `onClick`. It will work fine though for the actual native handlers (`onclick` in lower case). You will have to extend your JSX definitions to make your compiler accept them, here is an example with Preact:

```typescript
// types/preact/index.d.ts
// (to be referenced in tsconfig.json > compilerOptions > typeRoots)

import "preact";

declare module "preact" {
  namespace JSX {
    interface HTMLAttributes<RefType extends EventTarget = EventTarget>
        extends preact.ClassAttributes<RefType>, DOMAttributes<RefType> {
      onclick?: string;
    }
  }
}
```


## License

MIT License

Copyright (c) 2020 Marwane Kalam-Alami
