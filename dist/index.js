"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
exports.defaultBabelOptions = void 0;
var fs = __importStar(require("fs-extra"));
var path = __importStar(require("path"));
var preact_render_to_string_1 = __importDefault(require("preact-render-to-string"));
var cache_1 = __importDefault(require("./cache"));
var transpiler_1 = require("./transpiler");
exports.defaultBabelOptions = transpiler_1.defaultBabelOptions;
var JsxPistols = /** @class */ (function () {
    /**
     * Creates a new JSX Pistols renderer.
     * @param options Optional library configuration
     */
    function JsxPistols(options) {
        if (options === void 0) { options = {}; }
        this.rootPath = this.toAbsolutePath(options.rootPath || process.cwd(), process.cwd());
        this.babelOptions = options.babelOptions;
        this.prependDoctype = options.prependDoctype !== undefined ? options.prependDoctype : true;
        this.cache = new cache_1["default"]({
            disableCache: options.disableCache,
            maxCacheSize: options.maxCacheSize
        });
        this.wrapperTagRegexp = new RegExp("<\\/?" + (options.wrapperTagName || 'jsx-wrapper') + ">", 'g');
        if (options.expressApp) {
            this.registerToExpressApp(options.expressApp, options.rootPath);
        }
    }
    JsxPistols.prototype.registerToExpressApp = function (app, viewsPath) {
        var _this = this;
        var expressEngine = function (filePath, options, callback) { return __awaiter(_this, void 0, void 0, function () {
            var output, e_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.render(filePath, options)];
                    case 1:
                        output = _a.sent();
                        callback(null, output);
                        return [3 /*break*/, 3];
                    case 2:
                        e_1 = _a.sent();
                        callback(e_1);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        }); };
        app.engine('js', expressEngine);
        app.engine('jsx', expressEngine);
        app.engine('tsx', expressEngine);
        app.set('view engine', 'tsx');
        if (viewsPath) {
            app.set('views', this.toAbsolutePath(viewsPath));
        }
    };
    /**
     * Renders a template file.
     * @param templatePath Path to the template, either absolute or relative to the specified `rootPath`. Extension may be omitted if using `.jsx` or `.tsx`.
     * @param context Any context will be passed as a parameter to the template rendering function.
     * @returns A promise resolving to the rendered string
     */
    JsxPistols.prototype.render = function (templatePath, context) {
        return __awaiter(this, void 0, void 0, function () {
            var jsxTemplate, jsxOutput, renderedHtml, prefix;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.cache.wrap(templatePath, function () { return __awaiter(_this, void 0, void 0, function () {
                            var existingPath;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, this.searchExistingPath(this.toAbsolutePath(templatePath))];
                                    case 1:
                                        existingPath = _a.sent();
                                        return [2 /*return*/, transpiler_1.transpileTsx(existingPath, this.babelOptions)];
                                }
                            });
                        }); })];
                    case 1:
                        jsxTemplate = _a.sent();
                        jsxOutput = jsxTemplate(context);
                        renderedHtml = preact_render_to_string_1["default"](jsxOutput);
                        prefix = (this.prependDoctype && jsxOutput.type === 'html') ? '<!doctype html>' : '';
                        return [2 /*return*/, prefix + renderedHtml.replace(this.wrapperTagRegexp, '')];
                }
            });
        });
    };
    JsxPistols.prototype.toAbsolutePath = function (value, fromRoot) {
        return path.isAbsolute(value) ? value : path.resolve(fromRoot || this.rootPath, value);
    };
    JsxPistols.prototype.searchExistingPath = function (templatePath) {
        return __awaiter(this, void 0, void 0, function () {
            var absolutePath, _i, _a, extension, candidatePath;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        absolutePath = path.resolve(this.rootPath, templatePath);
                        return [4 /*yield*/, fs.pathExists(absolutePath)];
                    case 1:
                        if (_b.sent()) {
                            return [2 /*return*/, absolutePath];
                        }
                        _i = 0, _a = ['.js', '.jsx', '.tsx'];
                        _b.label = 2;
                    case 2:
                        if (!(_i < _a.length)) return [3 /*break*/, 5];
                        extension = _a[_i];
                        candidatePath = absolutePath + extension;
                        return [4 /*yield*/, fs.pathExists(candidatePath)];
                    case 3:
                        if (_b.sent()) {
                            return [2 /*return*/, candidatePath];
                        }
                        _b.label = 4;
                    case 4:
                        _i++;
                        return [3 /*break*/, 2];
                    case 5: throw new Error("Template not found: " + absolutePath);
                }
            });
        });
    };
    return JsxPistols;
}());
exports["default"] = JsxPistols;
