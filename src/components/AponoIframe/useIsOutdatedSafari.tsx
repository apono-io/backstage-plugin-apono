import { useCallback } from 'react';

export function useIsOutdatedSafari() {
  return useCallback(() => {
    const ua = navigator.userAgent;

    // Check for Safari on macOS
    const safariMatch = ua.match(/Version\/(\d+)\.(\d+)/);
    if (safariMatch && ua.includes("Safari") && !ua.includes("Chrome")) {
      const version = parseInt(safariMatch[1], 10);
      return version < 18;
    }

    // Check for visionOS
    const visionMatch = ua.match(/visionOS\/(\d+)\.(\d+)/);
    if (visionMatch) {
      const version = parseInt(visionMatch[1], 10);
      return version < 2;
    }

    // Check for watchOS
    const watchMatch = ua.match(/WatchOS\/(\d+)\.(\d+)/i);
    if (watchMatch) {
      const version = parseInt(watchMatch[1], 10);
      return version < 11;
    }

    // Check for iOS and iPadOS
    const iosMatch = ua.match(/OS (\d+)_/); // iOS and iPadOS report "OS X_Y" format
    if (iosMatch && ua.includes("like Mac OS X")) {
      const version = parseInt(iosMatch[1], 10);
      return version < 18;
    }

    // Check for macOS (Sequoia)
    const macOSMatch = ua.match(/Mac OS X (\d+)_(\d+)/);
    if (macOSMatch) {
      const majorVersion = parseInt(macOSMatch[1], 10);
      const minorVersion = parseInt(macOSMatch[2], 10);
      return majorVersion < 15 || (majorVersion === 15 && minorVersion < 0);
    }

    // Check for tvOS
    const tvOSMatch = ua.match(/AppleTV(?!.*Safari).*OS (\d+)_/);
    if (tvOSMatch) {
      const version = parseInt(tvOSMatch[1], 10);
      return version < 18;
    }

    // Default to false if no outdated version detected
    return false;
  }, []);
}
