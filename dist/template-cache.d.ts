export interface TemplateCacheOptions {
    maxCacheSize?: number;
    disable?: boolean;
}
export default class TemplateCache {
    private cache?;
    constructor(options: TemplateCacheOptions);
    wrap<T>(key: string, valueSupplier: () => Promise<T>): Promise<T>;
}
