import { createApiRef, FetchApi, ConfigApi } from '@backstage/core-plugin-api';

export interface AponoAuth {
  token: string;
}

export interface AponoApi {
  authenticate: () => Promise<AponoAuth>;
}

export type Options = {
  fetchApi: FetchApi
  configApi: ConfigApi
}

export const aponoApiRef = createApiRef<AponoApi>({
  id: 'plugin.apono-api.service',
});

export class AponoApiClient implements AponoApi {
  // @ts-ignore
  private readonly fetchApi: FetchApi

  // @ts-ignore
  private readonly configApi: ConfigApi

  constructor({ fetchApi, configApi }: Options) {
    this.fetchApi = fetchApi;
    this.configApi = configApi;
  }

  private async fetch<T = any>(input: string, init?: RequestInit): Promise<T> {
    const baseUrl = this.configApi.getString('backend.baseUrl');

    const resp = await this.fetchApi.fetch(`${baseUrl}${input}`, init);
    if (!resp.ok){
      return resp.text().then(text => {throw new Error(text)})
    }

    return await resp.json();
  }

  async authenticate(): Promise<AponoAuth> {
    return await this.fetch<AponoAuth>('/api/apono/authenticate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}