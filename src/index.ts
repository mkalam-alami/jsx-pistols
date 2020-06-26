import * as path from 'path';
import { renderTSX } from './renderer';
import * as fs from 'fs-extra';
import { Application } from 'express';

export default class JsxPistols {

  private rootPath: string;

  constructor(rootPath: string = process.cwd()) {
    this.rootPath = path.isAbsolute(rootPath) ? rootPath : path.resolve(process.cwd(), rootPath);
  }

  public registerEngine(app: Application) {
    app.engine('jsx', this.engine.bind(this));
    app.engine('tsx', this.engine.bind(this));
    app.set('view engine', 'tsx');
  }

  private async engine(filePath: string, options: any, callback: Function) {
    try {
      const output = await this.render(filePath, options);
      callback(null, output);
    } catch (e) {
      callback(e);
    }
  }

  public async render(templatePath: string, context: object & any = {}): Promise<string> {
    const absolutePath = path.resolve(this.rootPath, templatePath);
    const validPath = await this.validatePath(templatePath);
    return renderTSX(validPath, context);
  }

  private async validatePath(templatePath: string): Promise<string> {
    const absolutePath = path.resolve(this.rootPath, templatePath);
    const extname = path.extname(absolutePath);

    if (extname) {
      if (await fs.pathExists(absolutePath)) {
        return absolutePath;
      }
    } else {
      const candidatePathJsx = absolutePath + '.jsx';
      if (await fs.pathExists(candidatePathJsx)) {
        return candidatePathJsx;
      }
      const candidatePathTsx = absolutePath + '.tsx';
      if (await fs.pathExists(candidatePathTsx)) {
        return candidatePathTsx;
      }
    }

    throw new Error(`Template doesn't exist (from root path ${this.rootPath}): ${templatePath}`);
  }

}
