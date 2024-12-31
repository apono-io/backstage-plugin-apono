export function isValidUrl(url: string) {
  try {
    return Boolean(new URL(url));
  } catch (err) {
    return false;
  }
}

export function isSameOrigin(url1: URL, url2: URL) {

  // Check if both URLs are localhost
  const isLocalhost = (url: URL) =>
    url.hostname === 'localhost' || url.hostname === '127.0.0.1';

  // If both are localhost, consider them same origin regardless of port
  if (isLocalhost(url1) && isLocalhost(url2)) {
    return true;
  }

  // For non-localhost URLs, compare full origin
  return url1.origin === url2.origin;
}
