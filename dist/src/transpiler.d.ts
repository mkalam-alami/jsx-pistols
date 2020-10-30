import { JSX } from "preact";
export declare const defaultBabelOptions: {
    presets: any[][];
    plugins: any[];
};
export declare type BabelOptions = Object;
export declare type JSXTemplate = (context: Object) => JSX.Element;
export declare function transpileTsx(absolutePath: string, babelOptions?: BabelOptions): Promise<JSXTemplate>;
