// core/interfaces/IModule.ts
export interface IModule {
  name: string;
  version: string;
  description?: string;
  dependencies?: string[];
  services: IService[];
  routes: IRoute[];
  hooks?: IHook[];
}

export interface IService {
  name: string;
  instance: unknown;
  dependencies?: string[];
}

export interface IRoute {
  path: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  handler: (req: unknown, res: unknown) => Promise<unknown>;
  middleware?: unknown[];
}

export interface IHook {
  event: string;
  handler: (...args: unknown[]) => void;
}