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
exports.transpileTsx = transpileTsx;
const babel = __importStar(require("@babel/core"));
const plugin_transform_modules_commonjs_1 = __importDefault(require("@babel/plugin-transform-modules-commonjs"));
const plugin_transform_react_jsx_1 = __importDefault(require("@babel/plugin-transform-react-jsx"));
const preset_typescript_1 = __importDefault(require("@babel/preset-typescript"));
const require_from_string_1 = __importDefault(require("require-from-string"));
const fs_1 = require("./fs");
exports.defaultBabelOptions = {
    presets: [[
            preset_typescript_1.default,
            {
                ignoreExtensions: true
            }
        ]],
    plugins: [
        plugin_transform_modules_commonjs_1.default,
        [plugin_transform_react_jsx_1.default, { runtime: "classic" }]
    ]
};
async function transpileTsx(absolutePath, babelOptions) {
    const tsxSources = await (0, fs_1.readFile)(absolutePath);
    const jsSources = await babelTransform(tsxSources.toString(), absolutePath, babelOptions || exports.defaultBabelOptions);
    const module = (0, require_from_string_1.default)(jsSources, absolutePath);
    if (typeof module.default !== 'function') {
        throw new Error(`Module's default export is missing or not a function: ${absolutePath}`);
    }
    return module.default;
}
async function babelTransform(tsxSources, absolutePath, babelOptions = exports.defaultBabelOptions) {
    const transformResult = await babel.transformAsync(tsxSources, {
        ...babelOptions,
        filename: absolutePath
    });
    return transformResult.code;
}
