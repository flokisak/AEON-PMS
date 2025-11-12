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
  instance: any;
  dependencies?: string[];
}

export interface IRoute {
  path: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  handler: (req: any, res: any) => Promise<any>;
  middleware?: any[];
}

export interface IHook {
  event: string;
  handler: (...args: any[]) => void;
}