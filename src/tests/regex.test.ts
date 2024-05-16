import { LOGIN_PROPS } from 'pages/login/login.consts';

describe('check login regex', () => {
  test('check email', () => {
    const emailPattern = LOGIN_PROPS.email.pattern ?? '';

    ['test@mail.ru', 'test@mail.com', 'Test_@mail.ruru'].forEach((test) => {
      expect(test.match(emailPattern)).not.toBe(null);
    });

    ['test.ru', ' test@mail.ru', 'test@mail.ru ', 'test@.ru'].forEach((test) => {
      expect(test.match(emailPattern)).toBe(null);
    });
  });

  test('check password', () => {
    const passwordPattern = LOGIN_PROPS.password.pattern ?? '';

    ['1234567', 'aaaaaaa1', 'AAAAAAA1', 'Aaaaaaaa', ' 12345aAa '].forEach((test) => {
      expect(test.match(passwordPattern)).toBe(null);
    });

    expect('123456Aa'.match(passwordPattern)).not.toBe(null);
  });
});

describe();
