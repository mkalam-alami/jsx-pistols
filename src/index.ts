import * as fs from 'fs-extra';
import * as path from 'path';
import render from 'preact-render-to-string';
import Cache from './cache';
import { defaultBabelOptions as defaultBabelOptionsTranspiler, transpileTsx } from './transpiler';

export const defaultBabelOptions = defaultBabelOptionsTranspiler;

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
  babelOptions?: Object;
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
}

export default class JsxPistols {

  private rootPath: string;
  private cache: Cache;
  private babelOptions?: Object;

  /**
   * Creates a new JSX Pistols renderer.
   * @param options Optional library configuration
   */
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

    app.engine('jsx', expressEngine);
    app.engine('tsx', expressEngine);
    app.set('view engine', 'tsx');
    if (viewsPath) {
      app.set('views', this.toAbsolutePath(viewsPath));
    }
  }

  /**
   * Renders a template file.
   * @param templatePath Path to the template, either absolute or relative to the specified `rootPath`. Extension may be omitted if using `.jsx` or `.tsx`.
   * @param context Any context will be passed as a parameter to the template rendering function.
   * @returns A promise resolving to the rendered string
   */
  public async render<T>(templatePath: string, context?: T): Promise<string> {
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

    if (await fs.pathExists(absolutePath)) {
      return absolutePath;
    }
    for (const extension of ['.js', '.jsx', '.tsx']) {
      const candidatePath = absolutePath + extension;
      if (await fs.pathExists(candidatePath)) {
        return candidatePath;
      }
    }

    throw new Error(`Template not found: ${absolutePath}`);
  }

}
