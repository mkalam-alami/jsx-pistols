"use strict";
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
var axios_1 = __importDefault(require("axios"));
var express_1 = __importDefault(require("express"));
var index_1 = __importDefault(require("../dist/index"));
test("[ JSX Pistols ]", function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, test("Default templates root", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var jsxPistols, result;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                jsxPistols = new index_1["default"]();
                                return [4 /*yield*/, jsxPistols.render('test/template-div', { name: 'world' })];
                            case 1:
                                result = _a.sent();
                                console.log(result);
                                assert(result === '<div>Hello world!</div>');
                                return [2 /*return*/];
                        }
                    });
                }); })];
            case 1:
                _a.sent();
                return [4 /*yield*/, test("Explicit templates root", function () { return __awaiter(void 0, void 0, void 0, function () {
                        var jsxPistols, context, result;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    jsxPistols = new index_1["default"]({ rootPath: __dirname });
                                    context = { name: 'world' };
                                    return [4 /*yield*/, jsxPistols.render('template-div.tsx', context)];
                                case 1:
                                    result = _a.sent();
                                    console.log(result);
                                    assert(result === '<div>Hello world!</div>');
                                    return [2 /*return*/];
                            }
                        });
                    }); })];
            case 2:
                _a.sent();
                return [4 /*yield*/, test("HTML tag", function () { return __awaiter(void 0, void 0, void 0, function () {
                        var jsxPistols, result;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    jsxPistols = new index_1["default"]();
                                    return [4 /*yield*/, jsxPistols.render('test/template-html')];
                                case 1:
                                    result = _a.sent();
                                    console.log(result);
                                    assert(result === '<!doctype html><html><body>Hello world!</body></html>');
                                    return [2 /*return*/];
                            }
                        });
                    }); })];
            case 3:
                _a.sent();
                return [4 /*yield*/, test("Fragment", function () { return __awaiter(void 0, void 0, void 0, function () {
                        var jsxPistols, result;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    jsxPistols = new index_1["default"]();
                                    return [4 /*yield*/, jsxPistols.render('test/template-fragment', { name: 'world' })];
                                case 1:
                                    result = _a.sent();
                                    console.log(result);
                                    assert(result === '<div>Hello</div><div>world!</div>');
                                    return [2 /*return*/];
                            }
                        });
                    }); })];
            case 4:
                _a.sent();
                return [4 /*yield*/, test("Express template engine", function () { return __awaiter(void 0, void 0, void 0, function () {
                        var app, server;
                        return __generator(this, function (_a) {
                            app = express_1["default"]();
                            new index_1["default"]({ rootPath: __dirname, expressApp: app });
                            app.set('view engine', 'tsx');
                            /*
                        
                            // Manual registration
                            
                            const jsxPistols = new JsxPistols({ rootPath: __dirname, expressApp: app });
                            
                            app.engine('tsx', jsxPistols.expressEngine);
                            app.set('view engine', 'tsx');
                            app.set('views', __dirname);
                        
                            */
                            app.get('/', function (req, res) {
                                res.render('template-div', { name: 'world' });
                            });
                            server = app.listen(8787, function () { return __awaiter(void 0, void 0, void 0, function () {
                                var response;
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0: return [4 /*yield*/, axios_1["default"].get('http://localhost:8787/')];
                                        case 1:
                                            response = _a.sent();
                                            console.log(response.data);
                                            assert(response.data === '<div>Hello world!</div>');
                                            server.close();
                                            return [2 /*return*/];
                                    }
                                });
                            }); });
                            return [2 /*return*/];
                        });
                    }); })];
            case 5:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); });
function test(name, callback) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log();
                    console.log(name);
                    return [4 /*yield*/, callback()];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
function assert(expression) {
    if (!expression) {
        process.exit(1);
    }
}
