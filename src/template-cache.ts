import LRUCache from 'lru-cache';

export interface TemplateCacheOptions {
  maxCacheSize?: number;
  disable?: boolean;
}

export default class TemplateCache {

  private cache?: LRUCache<string, any>;

  constructor(options: TemplateCacheOptions) {
    if (!options.disable) {
      this.cache = new LRUCache({
        max: options.maxCacheSize || 0
      })
    }
  }

  public async wrap<T>(key: string, valueSupplier: () => Promise<T>): Promise<T> {
    if (this.cache) {
      if (!this.cache.has(key)) {
        this.cache.set(key, await valueSupplier());
      }
      return this.cache.get(key);
    } else {
      return valueSupplier();
    }
  }

}
