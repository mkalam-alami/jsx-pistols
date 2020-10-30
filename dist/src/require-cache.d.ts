export default function takeRequireCacheSnapshot(options?: RequireCacheSnapshotOptions): RequireCacheSnapshot;
export interface RequireCacheSnapshotOptions {
    rootPath?: string;
    ignore?: string[];
    bypass?: boolean;
}
export declare class RequireCacheSnapshot {
    private initialSnapshot;
    private rootPath?;
    private ignorePathsMatchers;
    constructor(options: RequireCacheSnapshotOptions);
    restore(): void;
    private difference;
}
