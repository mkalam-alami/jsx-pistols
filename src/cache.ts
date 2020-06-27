import LRUCache from 'lru-cache';

export interface CacheOptions {
  maxCacheSize?: number;
  disableCache?: boolean;
}

export default class Cache {

  private cache?: LRUCache<string, any>;

  constructor(options: CacheOptions) {
    const disableCache = options.disableCache !== undefined ? options.disableCache : process.env.NODE_ENV !== 'production';
    if (!disableCache) {
      this.cache = new LRUCache({
        max: options.maxCacheSize || 0
      })
    }
  }

  public async wrap<T>(key: string, valueSupplier: () => Promise<T>): Promise<T> {
    if (this.cache) {
      if (!this.cache.get(key)) {
        this.cache.set(key, await valueSupplier());
      }
      return this.cache.get(key);
    } else {
      return valueSupplier();
    }
  }

}