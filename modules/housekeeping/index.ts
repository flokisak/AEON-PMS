// modules/housekeeping/index.ts
import { IModule } from '../../core/interfaces/IModule';
import { useHousekeeping } from './logic/useHousekeeping';

const housekeepingModule: IModule = {
  name: 'Housekeeping',
  version: '1.0.0',
  description: 'Manages housekeeping tasks',
  services: [
    {
      name: 'housekeepingService',
      instance: useHousekeeping,
      dependencies: [],
    },
  ],
  routes: [],
};

export default housekeepingModule;