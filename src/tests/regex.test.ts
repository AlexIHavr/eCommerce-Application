import { LOGIN_PROPS } from 'pages/login/login.consts';
import { SIGNUP_PROPS } from 'pages/signup/signup.consts';

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

describe('check signup regex', () => {
  test('check first name, last name, cities', () => {
    const firstNamePattern = SIGNUP_PROPS.firstname.pattern ?? '';
    const lastNamePattern = SIGNUP_PROPS.lastname.pattern ?? '';
    const bilCityPattern = SIGNUP_PROPS.bilCity.pattern ?? '';
    const shipCityPattern = SIGNUP_PROPS.shipCity.pattern ?? '';

    ['aAA1', 'a_A', '  '].forEach((test) => {
      expect(test.match(firstNamePattern)).toBe(null);
      expect(test.match(lastNamePattern)).toBe(null);
      expect(test.match(bilCityPattern)).toBe(null);
      expect(test.match(shipCityPattern)).toBe(null);
    });

    ['a', 'a a'].forEach((test) => {
      expect(test.match(firstNamePattern)).not.toBe(null);
      expect(test.match(lastNamePattern)).not.toBe(null);
      expect(test.match(bilCityPattern)).not.toBe(null);
      expect(test.match(shipCityPattern)).not.toBe(null);
    });
  });

  test('check streets', () => {
    const bilStreetPattern = SIGNUP_PROPS.bilStreet.pattern ?? '';
    const shipStreetPattern = SIGNUP_PROPS.shipStreet.pattern ?? '';

    ['A', '1', '_'].forEach((test) => {
      expect(test.match(bilStreetPattern)).not.toBe(null);
      expect(test.match(shipStreetPattern)).not.toBe(null);
    });

    ['  ', ''].forEach((test) => {
      expect(test.match(bilStreetPattern)).toBe(null);
      expect(test.match(shipStreetPattern)).toBe(null);
    });
  });
});