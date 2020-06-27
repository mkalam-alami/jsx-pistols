import * as babel from "@babel/core";
import * as fs from 'fs-extra';
import { JSX } from "preact";
import requireFromString from 'require-from-string';

export type JSXTemplate = (context: Object) => JSX.Element;

export async function transpileTsx(absolutePath: string): Promise<JSXTemplate> {
  const tsxSources = (await fs.readFile(absolutePath)).toString();
  const transformResult = await babel.transformAsync(tsxSources, tsxToJsOptions());
  const module = requireFromString(transformResult.code);
  if (typeof module.default !== 'function') {
    throw new Error(`Module's default export is missing or not a function: ${absolutePath}`);
  }
  return module.default as JSXTemplate;
}

function tsxToJsOptions() {
  return {
    filename: "file.ts",
    presets: [[
      "@babel/preset-typescript",
      {
        allExtensions: true,
        isTSX: true
      }
    ]],
    plugins: [
      "@babel/plugin-transform-modules-commonjs",
      "@babel/plugin-transform-react-jsx"
    ]
  };
}
