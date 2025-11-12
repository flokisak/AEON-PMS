'use client';

// modules/packages-events/index.ts
import { IModule } from '../../core/interfaces/IModule';
import { usePackagesEvents } from './logic/usePackagesEvents';

const packagesEventsModule: IModule = {
  name: 'Packages & Events',
  version: '1.0.0',
  description: 'Management of hotel packages and events',
  services: [
    {
      name: 'packagesEventsService',
      instance: usePackagesEvents,
      dependencies: [],
    },
  ],
  routes: [],
};

export default packagesEventsModule;