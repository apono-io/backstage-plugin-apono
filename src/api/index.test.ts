import { AponoApiClient } from './index';
import { ConfigApi, FetchApi } from '@backstage/core-plugin-api';

describe('AponoApiClient', () => {
  const mockBaseUrl = 'http://localhost:7007';
  let mockFetchApi: jest.Mocked<FetchApi>;
  let mockConfigApi: jest.Mocked<ConfigApi>;
  let client: AponoApiClient;

  beforeEach(() => {
    mockFetchApi = {
      fetch: jest.fn(),
    } as unknown as jest.Mocked<FetchApi>;

    mockConfigApi = {
      getString: jest.fn().mockReturnValue(mockBaseUrl),
    } as unknown as jest.Mocked<ConfigApi>;

    client = new AponoApiClient({
      fetchApi: mockFetchApi,
      configApi: mockConfigApi,
    });
  });

  describe('authenticate', () => {
    const mockToken = 'test-token';

    it('should authenticate without email', async () => {
      mockFetchApi.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ token: mockToken }),
      } as Response);

      const result = await client.authenticate();

      expect(result).toEqual({ token: mockToken });
    });

    it('should authenticate with email', async () => {
      const testEmail = 'test@example.com';
      mockFetchApi.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ token: mockToken }),
      } as Response);

      const result = await client.authenticate(testEmail);

      expect(result).toEqual({ token: mockToken });
    });

    it('should handle authentication errors', async () => {
      const errorMessage = 'Authentication failed';
      mockFetchApi.fetch.mockResolvedValueOnce({
        ok: false,
        text: async () => errorMessage,
      } as Response);

      await expect(client.authenticate()).rejects.toThrow(errorMessage);
    });

    it('should get base URL from config', async () => {
      mockFetchApi.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ token: mockToken }),
      } as Response);

      await client.authenticate();

      expect(mockConfigApi.getString).toHaveBeenCalledWith('backend.baseUrl');
    });
  });
});
