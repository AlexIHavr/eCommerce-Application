import {
  setFirstNameAction,
  setLastNameAction,
} from 'pages/profile/components/profileInfo/profileInfo.actions';
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

    const {
      body: { customer },
    } = await apiService.loginCustomer({
      email: 'test@mail.ru',
      password: currentPassword,
    });

    await apiService.updateCustomerPassword({
      id: customer.id,
      version: customer.version,
      currentPassword,
      newPassword: currentPassword,
    });

    await apiService.updatePasswordFlowCredentials({
      email: customer.email,
      password: currentPassword,
    });
  });
});

describe('api success change customer data', () => {
  test('check no errors during changing first name and last name', async () => {
    const newFirstName = 'New first name';
    const newLastName = 'New last name';

    const {
      body: { customer },
    } = await apiService.loginCustomer({
      email: 'test@mail.ru',
      password: 'Qwerty123',
    });

    const data = await apiService.updateCustomerInfo(customer.id, customer.version, [
      setFirstNameAction(newFirstName),
      setLastNameAction(newLastName),
    ]);

    expect(data.body.firstName).toBe(newFirstName);
    expect(data.body.lastName).toBe(newLastName);
  });
});
