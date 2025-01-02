export function isSafeSafari(userAgent: string): boolean {
  const isSafari = /Safari/.test(userAgent) && !/Chrome|CriOS|FxiOS|EdgiOS/.test(userAgent);

  if (!isSafari) {
    return true;
  }

  const safariVersionMatch = userAgent.match(/Version\/(\d+)\./);
  if (safariVersionMatch) {
    const safariVersion = parseInt(safariVersionMatch[1], 10);
    if (safariVersion >= 18) {
      return true;
    }
  }

  const iosVersionMatch = userAgent.match(/OS (\d+)_/);
  if (iosVersionMatch) {
    const iosVersion = parseInt(iosVersionMatch[1], 10);
    if (iosVersion >= 18) {
      return true;
    }
  }

  // Extract macOS Version (if applicable)
  const macOSVersionMatch = userAgent.match(/Mac OS X (\d+_\d+)/);
  if (macOSVersionMatch) {
    const macOSVersion = macOSVersionMatch[1].replace("_", ".");
    if (parseFloat(macOSVersion) >= 15) {
      return true;
    }
  }

  return false;
}
