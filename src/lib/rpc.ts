// ****************************************************************
// * Simple JSON-RPC protocol implementation through IPC connection
// ****************************************************************

import { Worker } from 'cluster';
import { isPromise } from 'util/types';

type RpcCall<T> = {
  method: keyof T;
  params: unknown[];
  id: number;
};

type RpcResult = {
  result: unknown;
  id: number;
};

export class RpcServer<T extends object> {
  constructor(private target: T) {}

  listen = (worker: Worker) => {
    worker.on('message', async ({ method, params, id }: RpcCall<T>) => {
      const maybePromise = (
        this.target[method] as (...args: unknown[]) => unknown | Promise<unknown>
      )(...params);
      const result = isPromise(maybePromise) ? await maybePromise : maybePromise;
      worker.send({ result, id });
    });
  };
}

export class RpcProxyHandler<T extends object> {
  private resolvers = new Map<number, (value: unknown) => void>();
  private id = 1;

  constructor() {
    process.on('message', ({ result, id }: RpcResult) => {
      this.resolvers.get(id)?.(result);
      this.resolvers.delete(id);
      const maxId = Math.max(...Array.from(this.resolvers.keys()));
      this.id = maxId < 1 ? 1 : maxId + 1;
    });
  }

  get = (_: T, method: string) => {
    return (...params: RpcCall<T>['params']) => {
      return new Promise<unknown>((resolve) => {
        this.resolvers.set(this.id, resolve);
        process.send?.({ method, params, id: this.id++ });
      });
    };
  };
}
