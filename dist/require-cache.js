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
Object.defineProperty(exports, "__esModule", { value: true });
exports.RequireCacheSnapshot = void 0;
exports.default = takeRequireCacheSnapshot;
const minimatch_1 = require("minimatch");
const path = __importStar(require("path"));
function takeRequireCacheSnapshot(options = {}) {
    return new RequireCacheSnapshot(options);
}
class RequireCacheSnapshot {
    initialSnapshot = [];
    rootPath;
    ignorePathsMatchers = [];
    constructor(options) {
        this.initialSnapshot = Object.keys(require.cache);
        this.rootPath = options.rootPath;
        if (options.ignore) {
            this.ignorePathsMatchers = options.ignore
                .map(excludeExpression => new minimatch_1.Minimatch(excludeExpression));
        }
    }
    restore() {
        const currentSnapshot = Object.keys(require.cache);
        const newRequiredPaths = this.difference(currentSnapshot, this.initialSnapshot);
        newRequiredPaths.forEach(newRequiredPath => {
            // Ignore outside template root path
            if (this.rootPath && path.relative(this.rootPath, newRequiredPath).startsWith('..')) {
                return;
            }
            // Ignore files by paths matchers
            for (const matcher of this.ignorePathsMatchers) {
                if (matcher.match(newRequiredPath)) {
                    return;
                }
            }
            // Delete from cache
            delete require.cache[newRequiredPath];
        });
    }
    difference(initial, substract) {
        var difference = new Set(initial);
        for (var elem of substract) {
            difference.delete(elem);
        }
        return difference;
    }
}
exports.RequireCacheSnapshot = RequireCacheSnapshot;
