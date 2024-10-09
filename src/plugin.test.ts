import { configApiRef, fetchApiRef } from '@backstage/core-plugin-api';
import { AponoApiClient, aponoApiRef } from './api';
import { aponoPlugin } from './plugin';
import { rootRouteRef } from './routes';

describe('apono', () => {
  it('should export plugin', () => {
    expect(aponoPlugin).toBeDefined();
  });

  it('should create the plugin with the correct id and routes', () => {
    expect(aponoPlugin.getId()).toBe('apono');
    expect(aponoPlugin.routes).toEqual({ root: rootRouteRef });
  });

  it('should create the API factory with the correct dependencies', () => {
    const apiFactories = Array.from(aponoPlugin.getApis());
    const apiFactory = apiFactories[0];
    expect(apiFactory.api).toBe(aponoApiRef);
    expect(apiFactory.deps).toEqual({ fetchApi: fetchApiRef, configApi: configApiRef });
  });

  it('should create the AponoApiClient with the correct dependencies', () => {
    const apiFactories = Array.from(aponoPlugin.getApis());
    const apiFactory = apiFactories[0];
    const fetchApi = {};
    const configApi = {};
    const apiClient = apiFactory.factory({ fetchApi, configApi });
    expect(apiClient).toBeInstanceOf(AponoApiClient);
  });
});
