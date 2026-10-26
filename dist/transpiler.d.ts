import * as babel from "@babel/core";
import { JSX } from "preact";
export declare const defaultBabelOptions: {
    presets: (((api: babel.PresetAPI, options: import("@babel/preset-typescript", { with: { "resolution-mode": "import" } }).Options, dirname: string) => babel.PresetObject) | {
        ignoreExtensions: boolean;
    })[][];
    plugins: ((((api: babel.PluginAPI, options: import("@babel/plugin-transform-react-jsx", { with: { "resolution-mode": "import" } }).Options, dirname: string) => babel.PluginObject<object & babel.PluginPass<object>>) | {
        runtime: string;
    })[] | ((api: babel.PluginAPI, options: import("@babel/plugin-transform-modules-commonjs", { with: { "resolution-mode": "import" } }).Options, dirname: string) => babel.PluginObject<object & babel.PluginPass<object>>))[];
};
export type BabelOptions = Object;
export type JSXTemplate = (context: Object) => JSX.Element;
export declare function transpileTsx(absolutePath: string, babelOptions?: BabelOptions): Promise<JSXTemplate>;
