# JSX Pistols

TypeScript and JSX as web templates

## Installing

```
npm install jsx-pistols
```

## Usage

### Manual

```typescript
import JsxPistols from 'jsx-pistols';

const jsxPistols = new JsxPistols('path/to/templates');
const result = await jsxPistols.render('mytemplate', { name: 'John' });
```

### Express integration

```typescript
import JsxPistols from 'jsx-pistols';

const app = express();

const jsxPistols = new JsxPistols('path/to/templates');
jsxPistols.registerEngine(app);
```