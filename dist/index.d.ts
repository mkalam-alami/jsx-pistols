import { Application } from 'express';
export interface JsxPistolsOptions {
    rootPath: string;
    maxCacheSize?: number;
    disableCache?: boolean;
}
export default class JsxPistols {
    private rootPath;
    private cache;
    constructor(options?: Partial<JsxPistolsOptions>);
    registerEngine(app: Application): void;
    private engine;
    render(templatePath: string, context?: Object): Promise<string>;
    private toAbsolutePath;
    private validatePath;
}
