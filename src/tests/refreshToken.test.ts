import { apiService } from 'services/api.service';
import { tokenCache } from 'utils/tokenCache.util';
import { describe, expect, test } from 'vitest';

describe('check refresh token', () => {
  test('check existing refresh token', () => {
    expect(tokenCache.cache.refreshToken).toBeUndefined();

    return apiService
      .loginCustomer({
        email: 'test@mail.ru',
        password: 'Qwerty123',
      })
      .then(() => expect(tokenCache.cache.refreshToken).not.toBeUndefined());
  });
});
