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
exports.__esModule = true;
var path = __importStar(require("path"));
var renderer_1 = require("./renderer");
var fs = __importStar(require("fs-extra"));
var JsxPistols = /** @class */ (function () {
    function JsxPistols(rootPath) {
        if (rootPath === void 0) { rootPath = process.cwd(); }
        this.rootPath = path.isAbsolute(rootPath) ? rootPath : path.resolve(process.cwd(), rootPath);
    }
    JsxPistols.prototype.registerEngine = function (app) {
        app.engine('jsx', this.engine.bind(this));
        app.engine('tsx', this.engine.bind(this));
        app.set('view engine', 'tsx');
    };
    JsxPistols.prototype.engine = function (filePath, options, callback) {
        return __awaiter(this, void 0, void 0, function () {
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
        });
    };
    JsxPistols.prototype.render = function (templatePath, context) {
        if (context === void 0) { context = {}; }
        return __awaiter(this, void 0, void 0, function () {
            var absolutePath, validPath;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        absolutePath = path.resolve(this.rootPath, templatePath);
                        return [4 /*yield*/, this.validatePath(templatePath)];
                    case 1:
                        validPath = _a.sent();
                        return [2 /*return*/, renderer_1.renderTSX(validPath, context)];
                }
            });
        });
    };
    JsxPistols.prototype.validatePath = function (templatePath) {
        return __awaiter(this, void 0, void 0, function () {
            var absolutePath, extname, candidatePathJsx, candidatePathTsx;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        absolutePath = path.resolve(this.rootPath, templatePath);
                        extname = path.extname(absolutePath);
                        if (!extname) return [3 /*break*/, 2];
                        return [4 /*yield*/, fs.pathExists(absolutePath)];
                    case 1:
                        if (_a.sent()) {
                            return [2 /*return*/, absolutePath];
                        }
                        return [3 /*break*/, 5];
                    case 2:
                        candidatePathJsx = absolutePath + '.jsx';
                        return [4 /*yield*/, fs.pathExists(candidatePathJsx)];
                    case 3:
                        if (_a.sent()) {
                            return [2 /*return*/, candidatePathJsx];
                        }
                        candidatePathTsx = absolutePath + '.tsx';
                        return [4 /*yield*/, fs.pathExists(candidatePathTsx)];
                    case 4:
                        if (_a.sent()) {
                            return [2 /*return*/, candidatePathTsx];
                        }
                        _a.label = 5;
                    case 5: throw new Error("Template doesn't exist (from root path " + this.rootPath + "): " + templatePath);
                }
            });
        });
    };
    return JsxPistols;
}());
exports["default"] = JsxPistols;
