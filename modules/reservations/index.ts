// modules/reservations/index.ts
import { IModule } from '../../core/interfaces/IModule';
import { useReservations } from './logic/useReservations';

const reservationsModule: IModule = {
  name: 'Reservations',
  version: '1.0.0',
  description: 'Manages hotel reservations',
  services: [
    {
      name: 'reservationsService',
      instance: useReservations,
      dependencies: [],
    },
  ],
  routes: [
    // In Next.js, routes are handled by pages, so perhaps empty or API routes
  ],
};

export default reservationsModule;