import { Minimatch, IMinimatch } from "minimatch";
import * as path from "path";

export default function takeRequireCacheSnapshot(options: RequireCacheSnapshotOptions = {}): RequireCacheSnapshot {
  const snapshot = new RequireCacheSnapshotImpl(options);
  snapshot.capture();
  return snapshot;
}

export interface RequireCacheSnapshotOptions {
  rootPath?: string;
  ignore?: string[];
  bypass?: boolean;
}

export interface RequireCacheSnapshot {
  restore(): void;
}

class RequireCacheSnapshotImpl implements RequireCacheSnapshot {

  private initialSnapshot: string[];
  private excludeMatchers: IMinimatch[] = [];
  private rootPath?: string;

  constructor(options: RequireCacheSnapshotOptions) {
    this.rootPath = options.rootPath;
    if (options.ignore) {
      this.excludeMatchers = options.ignore
        .map(excludeExpression => new Minimatch(excludeExpression));
    }
  }

  public capture() {
    this.initialSnapshot = Object.keys(require.cache);
  }

  public restore() {
    const currentSnapshot = Object.keys(require.cache);
    const newRequiredPaths = this.difference(currentSnapshot, this.initialSnapshot);
    newRequiredPaths.forEach(newRequiredPath => {
      // Ignore outside template root path
      if (this.rootPath && path.relative(this.rootPath, newRequiredPath).startsWith('..')) {
        return;
      }
      // Ignore excluded files
      for (const excludeMatcher of this.excludeMatchers) {
        if (excludeMatcher.match(newRequiredPath)) {
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