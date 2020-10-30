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
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
exports.__esModule = true;
exports.RequireCacheSnapshot = void 0;
var minimatch_1 = require("minimatch");
var path = __importStar(require("path"));
function takeRequireCacheSnapshot(options) {
    if (options === void 0) { options = {}; }
    return new RequireCacheSnapshot(options);
}
exports["default"] = takeRequireCacheSnapshot;
var RequireCacheSnapshot = /** @class */ (function () {
    function RequireCacheSnapshot(options) {
        this.initialSnapshot = [];
        this.ignorePathsMatchers = [];
        this.initialSnapshot = Object.keys(require.cache);
        this.rootPath = options.rootPath;
        if (options.ignore) {
            this.ignorePathsMatchers = options.ignore
                .map(function (excludeExpression) { return new minimatch_1.Minimatch(excludeExpression); });
        }
    }
    RequireCacheSnapshot.prototype.restore = function () {
        var _this = this;
        var currentSnapshot = Object.keys(require.cache);
        var newRequiredPaths = this.difference(currentSnapshot, this.initialSnapshot);
        newRequiredPaths.forEach(function (newRequiredPath) {
            // Ignore outside template root path
            if (_this.rootPath && path.relative(_this.rootPath, newRequiredPath).startsWith('..')) {
                return;
            }
            // Ignore files by paths matchers
            for (var _i = 0, _a = _this.ignorePathsMatchers; _i < _a.length; _i++) {
                var matcher = _a[_i];
                if (matcher.match(newRequiredPath)) {
                    return;
                }
            }
            // Delete from cache
            delete require.cache[newRequiredPath];
        });
    };
    RequireCacheSnapshot.prototype.difference = function (initial, substract) {
        var difference = new Set(initial);
        for (var _i = 0, substract_1 = substract; _i < substract_1.length; _i++) {
            var elem = substract_1[_i];
            difference["delete"](elem);
        }
        return difference;
    };
    return RequireCacheSnapshot;
}());
exports.RequireCacheSnapshot = RequireCacheSnapshot;
