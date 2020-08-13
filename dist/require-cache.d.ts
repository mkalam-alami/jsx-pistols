export default function takeRequireCacheSnapshot(options?: RequireCacheSnapshotOptions): RequireCacheSnapshot;
export interface RequireCacheSnapshotOptions {
    rootPath?: string;
    ignore?: string[];
    bypass?: boolean;
}
export interface RequireCacheSnapshot {
    restore(): void;
}
