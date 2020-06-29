import { BabelOptions } from './transpiler';
export declare const defaultBabelOptions: {
    presets: any[][];
    plugins: any[];
};
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
     * Pass `skip` to skip the transpiler completely (useful if templates are compiled in production).
     * By default, the transpiler will support TypeScript and ECMAScript modules.
     */
    babelOptions?: BabelOptions;
    /**
     * Whether template caching is enabled. If `false`, it will be loaded from the disk on every render.
     * Defaults to `true` if NODE_ENV is set to 'production', `false` otherwise.
     */
    disableCache?: boolean;
    /**
     * The maximum number of templates to be kept in the cache. Unused if `disableCache` is set.
     * Defaults to `0` (infinite).
     */
    maxCacheSize?: number;
    /**
     * Whether to prepend "<!doctype html>" if the root element is an <html> tag.
     * Defaults to `true`.
     */
    prependDoctype?: boolean;
}
export default class JsxPistols {
    private rootPath;
    private cache;
    private babelOptions?;
    private prependDoctype;
    /**
     * Creates a new JSX Pistols renderer.
     * @param options Optional library configuration
     */
    constructor(options?: Partial<JsxPistolsOptions>);
    private registerToExpressApp;
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
