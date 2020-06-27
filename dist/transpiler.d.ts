import { JSX } from "preact";
export declare type JSXTemplate = (context: Object) => JSX.Element;
export declare function transpileTsx(absolutePath: string): Promise<JSXTemplate>;
