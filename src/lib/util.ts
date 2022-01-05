export const log = console;

export async function measurePromise<T>(fn: (...args: any[]) => Promise<T>, name?: string, ...args: any[]): Promise<T> {
    const start = performance.now();
    const result = await fn(...args);
    log.info(`${name ?? fn.name} took ${performance.now() - start} ms`);
    return result;
}

export type HasID<T> = T & { id: number };
