"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.defaultBabelOptions = void 0;
const path = __importStar(require("path"));
const preact_render_to_string_1 = __importDefault(require("preact-render-to-string"));
const fs_1 = require("./fs");
const require_cache_1 = __importDefault(require("./require-cache"));
const transpiler_1 = require("./transpiler");
exports.defaultBabelOptions = transpiler_1.defaultBabelOptions;
class JsxPistols {
    expressEngine;
    rootPath;
    babelOptions;
    prependDoctype;
    productionMode;
    /**
     * Creates a new JSX Pistols renderer.
     * @param options Optional library configuration
     */
    constructor(options = {}) {
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
    registerToExpressApp(app, viewsPath) {
        const engines = this.productionMode ? ['js', 'jsx'] : ['js', 'jsx', 'tsx'];
        for (const engine of engines) {
            app.engine(engine, this.expressEngine);
        }
        if (viewsPath) {
            app.set('views', this.toAbsolutePath(viewsPath));
        }
    }
    async expressEngineInternal(filePath, options, callback) {
        try {
            const output = await this.render(filePath, options);
            callback(null, output);
        }
        catch (e) {
            callback(e);
        }
    }
    /**
     * Renders a template file.
     * @param templatePath Path to the template, either absolute or relative to the specified `rootPath`. Extension may be omitted if using `.jsx` or `.tsx`.
     * @param context Any context will be passed as a parameter to the template rendering function.
     * @returns A promise resolving to the rendered string
     */
    async render(templatePath, context) {
        let jsxTemplate;
        if (this.productionMode) {
            jsxTemplate = require(this.toAbsolutePath(templatePath)).default;
        }
        else {
            const existingPath = await this.searchExistingPath(this.toAbsolutePath(templatePath));
            const requireCacheSnapshot = (0, require_cache_1.default)({ rootPath: this.rootPath, ignore: ['**/node_modules/**'] });
            jsxTemplate = await (0, transpiler_1.transpileTsx)(existingPath, this.babelOptions);
            requireCacheSnapshot.restore();
        }
        const jsxOutput = jsxTemplate(context);
        const renderedHtml = (0, preact_render_to_string_1.default)(jsxOutput);
        const prefix = (this.prependDoctype && jsxOutput.type === 'html') ? '<!doctype html>' : '';
        return prefix + renderedHtml;
    }
    toAbsolutePath(value, fromRoot) {
        return path.isAbsolute(value) ? value : path.resolve(fromRoot || this.rootPath, value);
    }
    async searchExistingPath(templatePath) {
        const absolutePath = path.resolve(this.rootPath, templatePath);
        if (await (0, fs_1.pathExists)(absolutePath)) {
            return absolutePath;
        }
        for (const extension of ['.js', '.jsx', '.tsx']) {
            const candidatePath = absolutePath + extension;
            if (await (0, fs_1.pathExists)(candidatePath)) {
                return candidatePath;
            }
        }
        throw new Error(`Template not found: ${absolutePath}`);
    }
}
exports.default = JsxPistols;
