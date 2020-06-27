import { Application } from 'express';
import ts from 'typescript';
export interface JsxPistolsOptions {
    rootPath: string;
    tsCompilerOptions?: ts.CompilerOptions;
    maxCacheSize?: number;
    disableCache?: boolean;
}
export default class JsxPistols {
    private rootPath;
    private tsCompilerOptions?;
    private cache;
    constructor(options?: Partial<JsxPistolsOptions>);
    private toAbsolutePath;
    registerEngine(app: Application): void;
    private engine;
    render(templatePath: string, context?: object & any): Promise<string>;
    private validatePath;
}
