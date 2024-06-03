import { apiService } from 'services/api.service';
import { describe, expect, test } from 'vitest';

describe('api success login', () => {
  test('check no errors during login', () => {
    expect.assertions(0);

    return apiService.loginCustomer({
      email: 'test@mail.ru',
      password: 'Qwerty123',
    });
  });
});

describe('api success change password', () => {
  test('check no errors during changing password', async () => {
    expect.assertions(0);

    const currentPassword = 'Qwerty123';

    const loginData = await apiService.loginCustomer({
      email: 'test@mail.ru',
      password: currentPassword,
    });

    const data = await apiService.getCustomerById(loginData.body.customer.id);

    await apiService.updateCustomerPassword({
      id: data.body.id,
      version: data.body.version,
      currentPassword,
      newPassword: currentPassword,
    });

    await apiService.updatePasswordFlowCredentials({
      email: data.body.email,
      password: currentPassword,
    });
  });
});
