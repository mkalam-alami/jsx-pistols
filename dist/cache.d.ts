export interface CacheOptions {
    maxCacheSize?: number;
    disableCache?: boolean;
}
export default class Cache {
    private cache?;
    constructor(options: CacheOptions);
    wrap<T>(key: string, valueSupplier: () => Promise<T>): Promise<T>;
}
