export declare const defaultBabelOptions: {
    presets: any[][];
    plugins: any[];
};
export interface JsxPistolsOptions {
    rootPath: string;
    maxCacheSize?: number;
    disableCache?: boolean;
    babelOptions?: Object;
    expressApp?: any;
}
export default class JsxPistols {
    private rootPath;
    private cache;
    private babelOptions?;
    constructor(options?: Partial<JsxPistolsOptions>);
    private registerToExpressApp;
    render(templatePath: string, context?: Object): Promise<string>;
    private toAbsolutePath;
    private searchExistingPath;
}
