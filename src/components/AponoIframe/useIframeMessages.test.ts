import { renderHook, act } from '@testing-library/react-hooks';
import { useApi } from '@backstage/core-plugin-api';
import { Theme, useTheme } from '@material-ui/core';
import { useIframeMessages } from './useIframeMessages';
import { serializeTheme } from './themeSerializer';
import { mockTheme } from './mockTheme';

// Mock dependencies
jest.mock('@backstage/core-plugin-api');
jest.mock('@material-ui/core');

describe('useIframeMessages', () => {
  const mockClientUrl = new URL('https://example.com');
  const mockProfile = { email: 'test@example.com' };

  let mockIframeRef: { current: { contentWindow: { postMessage: jest.Mock } } };
  let mockPostMessage: jest.Mock;

  beforeEach(() => {
    // Setup mocks
    mockPostMessage = jest.fn();
    mockIframeRef = {
      current: {
        contentWindow: {
          postMessage: mockPostMessage,
        },
      },
    };

    (useTheme as jest.Mock).mockReturnValue(mockTheme);
    (useApi as jest.Mock).mockReturnValue({
      authenticate: jest.fn().mockResolvedValue({ token: 'mock-token' }),
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should handle READY message and trigger authentication', async () => {
    const { result } = renderHook(() =>
      useIframeMessages(mockIframeRef as any, mockClientUrl, mockProfile),
    );

    expect(result.current.appIsReady).toBe(false);

    // Simulate READY message
    act(() => {
      window.dispatchEvent(
        new MessageEvent('message', {
          data: { type: 'READY' },
          origin: 'https://example.com',
        }),
      );
    });

    // Wait for async operations
    await act(async () => {
      await Promise.resolve();
    });

    expect(result.current.appIsReady).toBe(true);
    expect(mockPostMessage).toHaveBeenCalledWith(
      {
        type: 'AUTHENTICATE',
        auth: {
          token: 'mock-token',
          isFetched: true,
          isFetching: false,
        },
      },
      'https://example.com',
    );
  });

  it('should handle THEME_READY message and send theme update', async () => {
    renderHook(() =>
      useIframeMessages(mockIframeRef as any, mockClientUrl, mockProfile),
    );

    // Simulate THEME_READY message
    act(() => {
      window.dispatchEvent(
        new MessageEvent('message', {
          data: { type: 'THEME_READY' },
          origin: 'https://example.com',
        }),
      );
    });

    expect(mockPostMessage).toHaveBeenCalledWith(
      {
        type: 'THEME_UPDATE',
        theme: serializeTheme(mockTheme as Theme),
      },
      'https://example.com',
    );
  });

  it('should handle authentication error', async () => {
    const mockError = new Error('Auth failed');
    (useApi as jest.Mock).mockReturnValue({
      authenticate: jest.fn().mockRejectedValue(mockError),
    });

    const { result } = renderHook(() =>
      useIframeMessages(mockIframeRef as any, mockClientUrl, mockProfile),
    );

    // Simulate READY message
    act(() => {
      window.dispatchEvent(
        new MessageEvent('message', {
          data: { type: 'READY' },
          origin: 'https://example.com',
        }),
      );
    });

    // Wait for async operations
    await act(async () => {
      await Promise.resolve();
    });

    expect(result.current.error).toBe(mockError);
  });

  it('should ignore messages from invalid origins', () => {
    const { result } = renderHook(() =>
      useIframeMessages(mockIframeRef as any, mockClientUrl, mockProfile),
    );

    // Simulate message from different origin
    act(() => {
      window.dispatchEvent(
        new MessageEvent('message', {
          data: { type: 'READY' },
          origin: 'https://malicious.com',
        }),
      );
    });

    expect(result.current.appIsReady).toBe(false);
    expect(mockPostMessage).not.toHaveBeenCalled();
  });

  it('should cleanup event listener on unmount', () => {
    const removeEventListenerSpy = jest.spyOn(window, 'removeEventListener');

    const { unmount } = renderHook(() =>
      useIframeMessages(mockIframeRef as any, mockClientUrl, mockProfile),
    );

    unmount();

    expect(removeEventListenerSpy).toHaveBeenCalledWith(
      'message',
      expect.any(Function),
    );
  });
});
