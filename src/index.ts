import * as path from 'path';
import render from 'preact-render-to-string';
import { pathExists } from './fs';
import takeRequireCacheSnapshot from './require-cache';
import { BabelOptions as TranspilerBabelOptions, defaultBabelOptions as defaultTranspilerBabelOptions, JSXTemplate, transpileTsx } from './transpiler';


export const defaultBabelOptions = defaultTranspilerBabelOptions;

export type BabelOptions = TranspilerBabelOptions;

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

  public expressEngine: (filePath: string, options: any, callback: Function) => void;

  private rootPath: string;
  private babelOptions?: Object;
  private prependDoctype: boolean;
  private productionMode: boolean;

  /**
   * Creates a new JSX Pistols renderer.
   * @param options Optional library configuration
   */
  constructor(options: Partial<JsxPistolsOptions> = {}) {
    this.expressEngine = this.expressEngineInternal.bind(this);

    const isDevEnv = process.env.NODE_ENV !== 'production';

    this.rootPath = this.toAbsolutePath(options.rootPath || process.cwd(), process.cwd());
    this.babelOptions = options.babelOptions;
    this.prependDoctype = options.prependDoctype ?? true;
    this.productionMode = options.productionMode ?? !isDevEnv;

    if (options.expressApp) {
      this.registerToExpressApp(options.expressApp, options.rootPath);
    }
  }

  private registerToExpressApp(app: any, viewsPath?: string) {
    const engines = this.productionMode ? ['js', 'jsx'] : ['js', 'jsx', 'tsx'];
    for (const engine of engines) {
      app.engine(engine, this.expressEngine);
    }
    if (viewsPath) {
      app.set('views', this.toAbsolutePath(viewsPath));
    }
  }

  private async expressEngineInternal(filePath: string, options: any, callback: Function) {
    try {
      const output = await this.render(filePath, options);
      callback(null, output);
    } catch (e) {
      callback(e);
    }
  }

  /**
   * Renders a template file.
   * @param templatePath Path to the template, either absolute or relative to the specified `rootPath`. Extension may be omitted if using `.jsx` or `.tsx`.
   * @param context Any context will be passed as a parameter to the template rendering function.
   * @returns A promise resolving to the rendered string
   */
  public async render<T>(templatePath: string, context?: T): Promise<string> {
    let jsxTemplate: JSXTemplate;
    if (this.productionMode) {
      jsxTemplate = require(this.toAbsolutePath(templatePath)).default;
    } else {
      const existingPath = await this.searchExistingPath(this.toAbsolutePath(templatePath));
      const requireCacheSnapshot = takeRequireCacheSnapshot({ rootPath: this.rootPath, ignore: ['**/node_modules/**'] });
      jsxTemplate = await transpileTsx(existingPath, this.babelOptions);
      requireCacheSnapshot.restore();
    }

    const jsxOutput = jsxTemplate(context);
    const renderedHtml = render(jsxOutput);
    const prefix = (this.prependDoctype && jsxOutput.type === 'html') ? '<!doctype html>' : '';
    return prefix + renderedHtml;
  }

  private toAbsolutePath(value: string, fromRoot?: string) {
    return path.isAbsolute(value) ? value : path.resolve(fromRoot || this.rootPath, value);
  }

  private async searchExistingPath(templatePath: string): Promise<string> {
    const absolutePath = path.resolve(this.rootPath, templatePath);

    if (await pathExists(absolutePath)) {
      return absolutePath;
    }
    for (const extension of ['.js', '.jsx', '.tsx']) {
      const candidatePath = absolutePath + extension;
      if (await pathExists(candidatePath)) {
        return candidatePath;
      }
    }

    throw new Error(`Template not found: ${absolutePath}`);
  }

}
