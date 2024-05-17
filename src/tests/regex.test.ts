import { LOGIN_PROPS } from 'pages/login/login.consts';
import { SIGNUP_PROPS } from 'pages/signup/signup.consts';
import { describe, expect, test } from 'vitest';

describe('check login regex', () => {
  test('check email', () => {
    const emailPattern = LOGIN_PROPS.email.pattern ?? '';

    ['test@mail.ru', 'test@mail.com', 'Test_@mail.ruru'].forEach((value) => {
      expect(value.match(emailPattern)).not.toBeNull();
    });

    ['test.ru', ' test@mail.ru', 'test@mail.ru ', 'test@.ru'].forEach((value) => {
      expect(value.match(emailPattern)).toBeNull();
    });
  });

  test('check password', () => {
    const passwordPattern = LOGIN_PROPS.password.pattern ?? '';

    ['1234567', 'aaaaaaa1', 'AAAAAAA1', 'Aaaaaaaa', ' 12345aAa '].forEach((value) => {
      expect(value.match(passwordPattern)).toBeNull();
    });

    expect('123456Aa'.match(passwordPattern)).not.toBeNull();
  });
});

describe('check signup regex', () => {
  test('check first name, last name, cities', () => {
    const firstNamePattern = SIGNUP_PROPS.firstname.pattern ?? '';
    const lastNamePattern = SIGNUP_PROPS.lastname.pattern ?? '';
    const bilCityPattern = SIGNUP_PROPS.bilCity.pattern ?? '';
    const shipCityPattern = SIGNUP_PROPS.shipCity.pattern ?? '';

    ['aAA1', 'a_A', '  '].forEach((value) => {
      expect(value.match(firstNamePattern)).toBeNull();
      expect(value.match(lastNamePattern)).toBeNull();
      expect(value.match(bilCityPattern)).toBeNull();
      expect(value.match(shipCityPattern)).toBeNull();
    });

    ['a', 'a a'].forEach((value) => {
      expect(value.match(firstNamePattern)).not.toBeNull();
      expect(value.match(lastNamePattern)).not.toBeNull();
      expect(value.match(bilCityPattern)).not.toBeNull();
      expect(value.match(shipCityPattern)).not.toBeNull();
    });
  });

  test('check streets', () => {
    const bilStreetPattern = SIGNUP_PROPS.bilStreet.pattern ?? '';
    const shipStreetPattern = SIGNUP_PROPS.shipStreet.pattern ?? '';

    ['A', '1', '_'].forEach((value) => {
      expect(value.match(bilStreetPattern)).not.toBeNull();
      expect(value.match(shipStreetPattern)).not.toBeNull();
    });

    ['  ', ''].forEach((value) => {
      expect(value.match(bilStreetPattern)).toBeNull();
      expect(value.match(shipStreetPattern)).toBeNull();
    });
  });
});
