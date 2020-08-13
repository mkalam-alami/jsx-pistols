# JSX Pistols

TypeScript and JSX as web templates, for NodeJS.

* Allows importing your app sources & typings from the templates
* Caching
* Express support

Under the hood, this is just a thin wrapper for [preact-render-to-string](https://www.npmjs.com/package/preact-render-to-string) and [Babel](https://babeljs.io/).

> WARNING: JSX Pistols is currently in alpha. Github issues are welcome.

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [API reference](#api-reference)
  - [Constructor](#constructor)
  - [Methods](#methods)
  - [Template contract](#template-contract)
  - [Default Babel options](#default-babel-options)
- [Caveats](#caveats)

## Installation

```
npm install jsx-pistols
```

## Usage

### Template

```jsx
import * as React from "preact";
import { MyControllerContext } from "./mycontroller";

export default function render(context: MyControllerContext) {
  return <html><body>Hello {context.name}!</body></html>;
}
```

In production, you can either copy the files as-is, or compile them to JavaScript.

### Rendering

**Manually**

```typescript
import JsxPistols from 'jsx-pistols';

const jsxPistols = new JsxPistols({ rootPath: 'path/to/templates' });
const result = await jsxPistols.render('mytemplate', { name: 'John' });

console.log(result); // <!doctype html><html><body>Hello John!</body></html>
```

**In an Express app**

```typescript
const app = express();

new JsxPistols({ expressApp: app });

app.get('/', (req, res) => {
  res.render('mytemplate', { name: 'John' })
})
```

## API reference

### Constructor

`new JsxPistols([options: Object])`

* **rootPath** *(string)*: The root path from which templates will be resolved. Defaults to the current working directory.
* **expressApp** *(object)*: An Express application that will be configured for using JSX Pistols as an engine. Extensions .js, .jsx and .tsx will be registered.
* **babelOptions** *(object | `skip`)*: Options object to pass to the Babel transpiler. Pass `skip` to skip the transpiler completely (useful if templates are compiled in production). By default, the transpiler will support TypeScript and ECMAScript modules (see below).
* **disableCache** *(boolean)*: Whether template caching is disabled. If `true`, it will be loaded from the disk on every render. The library will also prevent Node from caching code that is only imported in templates. Defaults to `false` if NODE_ENV is set to 'production', `true` otherwise.
* **maxCacheSize** *(number)*: The maximum number of templates to be kept in the cache. Unused if `disableCache` is set. Defaults to `0` (infinite).
* **prependDoctype** *(boolean)*: Whether to prepend "\<!doctype html>" if the root element is an "\<html>" tag. Defaults to `true`.

### Methods

`jsxPistols.render(templatePath: string[, context: any])`

Renders a template file.

* **templatePath** *(string)*: Path to the template. Either absolute, or relative to the specified `rootPath`. Extension may be omitted if `.jsx` or `.tsx`.
* **context** *(any)*: Any context will be passed as the first parameter of the template rendering function.

### Template contract

The only requirement is that the **default export must be a function returning a JSX element**. Minimal example:

```jsx
import * as React from "preact";

export default function render(context: any) {
  return <div></div>;
}
```

Asynchronous functions are supported (promises will be resolved), although they are generally considered bad separation of controller and view.

### Default Babel options

By default, the transpiler will support TypeScript and JSX. If you have different features to support, you will need to override this object. The `@babel/plugin-transform-modules-commonjs` plugin is however mandatory, not keeping it will break all templates.

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
