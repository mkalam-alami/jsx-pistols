import { Application } from 'express';
import * as fs from 'fs-extra';
import * as path from 'path';
import render from 'preact-render-to-string';
import Cache from './cache';
import { transpileTsx } from './transpiler';

export interface JsxPistolsOptions {
  rootPath: string;
  maxCacheSize?: number;
  disableCache?: boolean;
}

export default class JsxPistols {

  private rootPath: string;
  private cache: Cache;

  constructor(options: Partial<JsxPistolsOptions> = {}) {
    this.rootPath = this.toAbsolutePath(options.rootPath || process.cwd(), process.cwd());
    this.cache = new Cache({
      disableCache: options.disableCache,
      maxCacheSize: options.maxCacheSize
    });
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

  public async render(templatePath: string, context: Object = {}): Promise<string> {
    const jsxTemplate = await this.cache.wrap(templatePath, async () => {
      const validPath = await this.validatePath(this.toAbsolutePath(templatePath));
      return transpileTsx(validPath);
    });
    return render(jsxTemplate(context));
  }

  private toAbsolutePath(value: string, fromRoot?: string) {
    return path.isAbsolute(value) ? value : path.resolve(fromRoot || this.rootPath, value);
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
