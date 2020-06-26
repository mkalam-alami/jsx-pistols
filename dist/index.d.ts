import { Application } from 'express';
export default class JsxPistols {
    private rootPath;
    constructor(rootPath?: string);
    registerEngine(app: Application): void;
    private engine;
    render(templatePath: string, context?: object & any): Promise<string>;
    private validatePath;
}
