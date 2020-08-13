import { Minimatch, IMinimatch } from "minimatch";
import * as path from "path";

export default function takeRequireCacheSnapshot(options: RequireCacheSnapshotOptions = {}) {
  return new RequireCacheSnapshot(options);
}

export interface RequireCacheSnapshotOptions {
  rootPath?: string;
  ignore?: string[];
  bypass?: boolean;
}

export class RequireCacheSnapshot {

  private initialSnapshot: string[] = [];
  private rootPath?: string;
  private ignorePathsMatchers: IMinimatch[] = [];

  constructor(options: RequireCacheSnapshotOptions) {
    this.initialSnapshot = Object.keys(require.cache);
    this.rootPath = options.rootPath;
    if (options.ignore) {
      this.ignorePathsMatchers = options.ignore
        .map(excludeExpression => new Minimatch(excludeExpression));
    }
  }

  public restore() {
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
    })
  }

  private difference(initial: string[], substract: string[]) {
    var difference = new Set(initial);
    for (var elem of substract) {
      difference.delete(elem);
    }
    return difference;
  }

}