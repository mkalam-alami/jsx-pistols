import { JSX } from "preact";
export declare const defaultBabelOptions: {
    presets: any[][];
    plugins: any[];
};
export declare type JSXTemplate = (context: Object) => JSX.Element;
export declare function transpileTsx(absolutePath: string, babelOptions?: Object): Promise<JSXTemplate>;
