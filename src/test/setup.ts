import '@testing-library/jest-dom/vitest';

// Node 25+'s experimental built-in `localStorage` global shadows jsdom's
// working implementation with a stub that isn't actually functional in this
// test environment — replace it with a plain in-memory implementation.
class MemoryStorage implements Storage {
    private store = new Map<string, string>();
    get length() {
        return this.store.size;
    }
    clear() {
        this.store.clear();
    }
    getItem(key: string) {
        return this.store.has(key) ? this.store.get(key)! : null;
    }
    key(index: number) {
        return Array.from(this.store.keys())[index] ?? null;
    }
    removeItem(key: string) {
        this.store.delete(key);
    }
    setItem(key: string, value: string) {
        this.store.set(key, value);
    }
}

Object.defineProperty(globalThis, 'localStorage', {
    value: new MemoryStorage(),
    writable: true,
});
