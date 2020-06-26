import axios from 'axios';
import express from 'express';
import JsxPistols from '../dist/index';

export interface TestContext {
  name: string;
}

test("[ JSX Pistols ]", async () => {

  await test("Default templates root", async () => {
    const jsxPistols = new JsxPistols();

    const result = await jsxPistols.render('test/template', { name: 'world' });
    console.log(result);

    assert(result === '<div>Hello world!</div>');
  });

  await test("Explicit templates root", async () => {
    const jsxPistols = new JsxPistols(__dirname);

    const context: TestContext = { name: 'world' };
    const result = await jsxPistols.render('template.tsx', context);
    console.log(result);

    assert(result === '<div>Hello world!</div>');
  });

  await test("Express template engine", async () => {
    const app = express();

    const jsxPistols = new JsxPistols();
    jsxPistols.registerEngine(app);

    app.set('views', __dirname);
    app.get('/', (req, res) => {
      res.render('template', { name: 'world' })
    })

    const server = app.listen(8787, async () => {
      const response = await axios.get('http://localhost:8787/');
      console.log(response.data)
      assert(response.data === '<div>Hello world!</div>');

      server.close();
    })

  });

});

async function test(name: string, callback: () => any) {
  console.log();
  console.log(name);
  await callback();
}

function assert(expression: boolean) {
  if (!expression) {
    process.exit(1);
  }
}
