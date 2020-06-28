import * as babel from "@babel/core";
import * as babelPluginTransformModulesCommonJs from "@babel/plugin-transform-modules-commonjs";
import * as babelPluginTransformReactJsx from "@babel/plugin-transform-react-jsx";
import * as babelPresetTypescript from "@babel/preset-typescript";
import * as fs from 'fs-extra';
import { JSX } from "preact";
import requireFromString from 'require-from-string';

export const defaultBabelOptions = {
  presets: [[
    babelPresetTypescript,
    {
      allExtensions: true,
      isTSX: true
    }
  ]],
  plugins: [
    babelPluginTransformModulesCommonJs,
    babelPluginTransformReactJsx
  ]
};

export type JSXTemplate = (context: Object) => JSX.Element;

export async function transpileTsx(absolutePath: string, babelOptions: Object = defaultBabelOptions): Promise<JSXTemplate> {
  const tsxSources = (await fs.readFile(absolutePath)).toString();
  const transformResult = await babel.transformAsync(tsxSources, {
    ...babelOptions,
    filename: absolutePath,
  });
  const module = requireFromString(transformResult.code, absolutePath);
  if (typeof module.default !== 'function') {
    throw new Error(`Module's default export is missing or not a function: ${absolutePath}`);
  }
  return module.default as JSXTemplate;
}
