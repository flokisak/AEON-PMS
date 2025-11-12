// core/interfaces/IController.ts
export interface IController {
  name: string;
  routes: IRoute[];
}

export interface IRoute {
  path: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  handler: (req: any, res: any) => Promise<any>;
  middleware?: any[];
}