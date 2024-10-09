import {
  configApiRef,
  createApiFactory,
  createPlugin,
  createRoutableExtension,
  fetchApiRef,
} from '@backstage/core-plugin-api';

import { rootRouteRef } from './routes';
import { AponoApiClient, aponoApiRef } from './api';

export const aponoPlugin = createPlugin({
  id: 'apono',
  routes: {
    root: rootRouteRef,
  },
  apis: [
    createApiFactory({
      api: aponoApiRef,
      deps: { fetchApi: fetchApiRef, configApi: configApiRef },
      factory: ({  fetchApi, configApi }) =>
        new AponoApiClient({ fetchApi, configApi }),
    }),
  ],
});

export const AponoPage = aponoPlugin.provide(
  createRoutableExtension({
    name: 'AponoPage',
    component: () =>
      import('./components/AppWrapper').then(m => m.AppWrapper),
    mountPoint: rootRouteRef,
  }),
);
