import { apiService } from 'services/api.service';
import { describe, expect, test } from 'vitest';

describe('check login api errors', async () => {
  await apiService.getProject();

  test('check email', async () => {
    try {
      await apiService.loginCustomer({
        email: 'test@mail.ru',
        password: 'Qwerty123',
      });
    } catch (error) {
      expect((error as Error).message).toBe(
        'Customer account with the given credentials not found.',
      );
    }
  });
});
