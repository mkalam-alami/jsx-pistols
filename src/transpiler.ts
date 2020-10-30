import * as babel from "@babel/core";
import * as babelPluginTransformModulesCommonJs from "@babel/plugin-transform-modules-commonjs";
import * as babelPluginTransformReactJsx from "@babel/plugin-transform-react-jsx";
import * as babelPresetTypescript from "@babel/preset-typescript";
import { JSX } from "preact";
import requireFromString from 'require-from-string';
import { readFile } from "./fs";

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

export type BabelOptions = Object | 'skip';

export type JSXTemplate = (context: Object) => JSX.Element;

export async function transpileTsx(absolutePath: string, babelOptions?: BabelOptions): Promise<JSXTemplate> {
  const tsxSources = await readFile(absolutePath);
  const jsSources = await babelTransform(tsxSources.toString(), absolutePath, babelOptions || defaultBabelOptions);
  const module = requireFromString(jsSources, absolutePath);
  if (typeof module.default !== 'function') {
    throw new Error(`Module's default export is missing or not a function: ${absolutePath}`);
  }
  return module.default as JSXTemplate;
}

async function babelTransform(tsxSources: string, absolutePath: string, babelOptions: BabelOptions = defaultBabelOptions) {
  if (babelOptions === 'skip') {
    return tsxSources;
  }
  const transformResult = await babel.transformAsync(tsxSources, {
    ...babelOptions,
    filename: absolutePath
  });
  return transformResult.code;
}
