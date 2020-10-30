import { BabelOptions as TranspilerBabelOptions } from './transpiler';
export declare const defaultBabelOptions: {
    presets: any[][];
    plugins: any[];
};
export declare type BabelOptions = TranspilerBabelOptions;
export interface JsxPistolsOptions {
    /**
     * The root path from which templates will be resolved.
     * Defaults to the current working directory.
     */
    rootPath: string;
    /**
     * An Express application that will be configured for using JSX Pistols as an engine (.jsx/.tsx extensions).
     */
    expressApp?: any;
    /**
     * Options object to pass to the Babel transpiler.
     * By default, the transpiler will support TypeScript and ECMAScript modules.
     */
    babelOptions?: BabelOptions;
    /**
     * Whether to import the templates as native JS modules.
     * Defaults to `true` if `NODE_ENV` is set to 'production', `false` otherwise.
     * If production mode is disabled, the library will compile the template on every render, and also prevent Node from caching code that is only imported in templates.
     */
    productionMode?: boolean;
    /**
     * Whether to prepend "<!doctype html>" if the root element is an <html> tag.
     * Defaults to `true`.
     */
    prependDoctype?: boolean;
}
export default class JsxPistols {
    expressEngine: (filePath: string, options: any, callback: Function) => void;
    private rootPath;
    private babelOptions?;
    private prependDoctype;
    private productionMode;
    /**
     * Creates a new JSX Pistols renderer.
     * @param options Optional library configuration
     */
    constructor(options?: Partial<JsxPistolsOptions>);
    private registerToExpressApp;
    private expressEngineInternal;
    /**
     * Renders a template file.
     * @param templatePath Path to the template, either absolute or relative to the specified `rootPath`. Extension may be omitted if using `.jsx` or `.tsx`.
     * @param context Any context will be passed as a parameter to the template rendering function.
     * @returns A promise resolving to the rendered string
     */
    render<T>(templatePath: string, context?: T): Promise<string>;
    private toAbsolutePath;
    private searchExistingPath;
}
