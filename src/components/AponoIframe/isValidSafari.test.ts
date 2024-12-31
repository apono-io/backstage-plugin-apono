import { isValidSafari } from './isValidSafari';

const invalidUserAgents = [
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Safari/605.1.15',
  'Mozilla/5.0 (iPhone; CPU iPhone OS 16_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.0 Mobile/15E148 Safari/604.1',
]

const validUserAgents = [
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 13_0) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Safari/605.1.15',
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.6 Safari/605.1.15',
  'Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Mobile/15E148 Safari/604.1',
]

describe('isValidSafari', () => {
  describe('invalid user agents (should return false)', () => {
    test.each(invalidUserAgents)(
      'should return false for user agent: %s',
      (userAgent) => {
        expect(isValidSafari(userAgent)).toBe(false);
      },
    );
  });

  describe('valid user agents (should return true)', () => {
    test.each(validUserAgents)(
      'should return true for user agent: %s',
      (userAgent) => {
        expect(isValidSafari(userAgent)).toBe(true);
      },
    );
  });
});
