import axios from 'axios';
import express from 'express';
import { pathToFileURL } from 'url';
import JsxPistols from '../dist/index';
import * as path from 'path';

const JsxPistolsConstructor = 
  (process.env.NODE_ENV === 'production')
  ? require('../../dist/index').default as typeof JsxPistols
  : JsxPistols;

const TPL_ROOT = (process.env.NODE_ENV === 'production') ? 'test/dist' : 'test';

export interface TestContext {
  name: string;
}

test("[ JSX Pistols ]", async () => {

    await test("Default templates root", async () => {
      const jsxPistols = new JsxPistolsConstructor();

      const result = await jsxPistols.render(`${TPL_ROOT}/template-div`, { name: 'world' });
      console.log(result);

      assert(result === '<div>Hello world!</div>');
    });

    await test("Explicit templates root", async () => {
      const jsxPistols = new JsxPistolsConstructor({ rootPath: __dirname });

      const context: TestContext = { name: 'world' };
      const extension = process.env.NODE_ENV === 'production' ? '' : '.tsx'; // test explicit extension (dev only)
      const result = await jsxPistols.render(`template-div${extension}`, context);
      console.log(result);

      assert(result === '<div>Hello world!</div>');
    });

    await test("HTML tag", async () => {
      const jsxPistols = new JsxPistolsConstructor();

      const result = await jsxPistols.render(`${TPL_ROOT}/template-html`);
      console.log(result);

      assert(result === '<!doctype html><html><body>Hello world!</body></html>');
    });

    await test("Fragment", async () => {
      const jsxPistols = new JsxPistolsConstructor();

      const result = await jsxPistols.render(`${TPL_ROOT}/template-fragment`, { name: 'world' });
      console.log(result);

      assert(result === '<div>Hello</div><div>world!</div>');
    });

    await test("Express template engine", async () => {
      const app = express();

      new JsxPistolsConstructor({ rootPath: __dirname, expressApp: app });
      
      app.set('view engine', process.env.NODE_ENV === 'production' ? 'js' : 'tsx');

      /*

      // Manual registration
      
      const jsxPistols = new JsxPistols({ rootPath: __dirname, expressApp: app });
      
      app.engine('tsx', jsxPistols.expressEngine);
      app.set('view engine', 'tsx');
      app.set('views', __dirname);

      */

      app.get('/', (_req, res) => {
        res.render('template-div', { name: 'world' })
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
