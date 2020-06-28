# JSX Pistols

TypeScript and JSX as web templates, for NodeJS.

* Reference your actual app typings for auto-completion & error checking
* Template caching
* Express support

This library is a thin wrapper for [preact-render-to-string](https://www.npmjs.com/package/preact-render-to-string) and [Babel](https://babeljs.io/).

> WARNING: JSX Pistols is currently in alpha and should be used at your own risk. Github issues are welcome.

## Installation

```
npm install jsx-pistols
```

## Usage

### Template

```jsx
import { MyControllerContext } from "./mycontroller";

export default function render(context: MyControllerContext) {
  return <div>Hello {context.name}!</div>;
}
```

### Rendering

Manual

```typescript
import JsxPistols from 'jsx-pistols';

const jsxPistols = new JsxPistols({ rootPath: 'path/to/templates' });
const result = await jsxPistols.render('mytemplate', { name: 'John' });

console.log(result); // <div>Hello John!</div>
```

In an Express app

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

| key | type | default | description | 
| --- | ---- | ------- | ----------- |
| **rootPath** | string | Current working directory | The root path from which templates will be resolved. |
| **expressApp** | object | `undefined` | An Express application that will be configured for using JSX Pistols as an engine (.jsx/.tsx extensions). |
| **babelOptions** | object | *(see below)* | Options object to pass to the Babel transpiler. |
| **disableCache** | boolean | `true` if NODE_ENV is set to 'production', `false` otherwise | Whether template caching is enabled. If false, it will be loaded from the disk on every render. |
| **maxCacheSize** | number | O (infinite) | The maximum number of templates to be kept in the cache. Unused if `disableCache` is set. |

### Methods

`jsxPistols.render(templatePath: string[, context: any])`

Renders a template file.

| parameter | type | description | 
| --- | ---- | ------- | ----------- |
| **templatePath** | string | Path to the template, either absolute or relative to the specified `rootPath`. Extension may be omitted if using `.jsx` or `.tsx`. |
| **context** | any | Any context will be passed as a parameter to the template rendering function. | 

### Default Babel options

By default, the transpiler will support TypeScript and ECMAScript modules. If you don't need one or either, or have different features to support, you will need to override this object.

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

## Template contract

The only requirement for templates is that the **default export must be a function returning a JSX element**.

Asynchronous functions are supported (promises will be resolved), although they are generally considered bad separation of controller and view.

## Caveats

JSX is not HTML, so your templates will still have to work around some issues like:
* Having to use `className` instead of `class`
* Overriding preact's typings if you want to use the default DOM event handlers (`onclick` etc.)