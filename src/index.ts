import * as fs from 'fs-extra';
import * as path from 'path';
import render from 'preact-render-to-string';
import Cache from './cache';
import { defaultBabelOptions as defaultBabelOptionsTranspiler, transpileTsx } from './transpiler';

export const defaultBabelOptions = defaultBabelOptionsTranspiler;

export interface JsxPistolsOptions {
  rootPath: string;
  maxCacheSize?: number;
  disableCache?: boolean;
  babelOptions?: Object;
  expressApp?: any;
}

export default class JsxPistols {

  private rootPath: string;
  private cache: Cache;
  private babelOptions?: Object;

  constructor(options: Partial<JsxPistolsOptions> = {}) {
    this.rootPath = this.toAbsolutePath(options.rootPath || process.cwd(), process.cwd());
    this.babelOptions = options.babelOptions;
    this.cache = new Cache({
      disableCache: options.disableCache,
      maxCacheSize: options.maxCacheSize
    });
    if (options.expressApp) {
      this.registerToExpressApp(options.expressApp, options.rootPath);
    }
  }

  private registerToExpressApp(app: any, viewsPath?: string) {
    const expressEngine = async (filePath: string, options: any, callback: Function) => {
      try {
        const output = await this.render(filePath, options);
        callback(null, output);
      } catch (e) {
        callback(e);
      }
    }

    app.engine('jsx', expressEngine.bind(this));
    app.engine('tsx', expressEngine.bind(this));
    app.set('view engine', 'tsx');
    if (viewsPath) {
      app.set('views', this.toAbsolutePath(viewsPath));
    }
  }

  public async render(templatePath: string, context: Object = {}): Promise<string> {
    const jsxTemplate = await this.cache.wrap(templatePath, async () => {
      const existingPath = await this.searchExistingPath(this.toAbsolutePath(templatePath));
      return transpileTsx(existingPath, this.babelOptions);
    });
    return render(jsxTemplate(context));
  }

  private toAbsolutePath(value: string, fromRoot?: string) {
    return path.isAbsolute(value) ? value : path.resolve(fromRoot || this.rootPath, value);
  }

  private async searchExistingPath(templatePath: string): Promise<string> {
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

    throw new Error(`Template not found: ${absolutePath}`);
  }

}
