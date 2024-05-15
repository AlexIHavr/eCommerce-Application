import { LoginFieldProps } from 'pages/shared/components/formField/formField.types';

export const USER_AVAILABLE_AGE = 13;

export const SIGNUP_PROPS: Record<string, LoginFieldProps> = {
  email: {
    name: 'sign-email',
    type: 'text',
    labelName: 'E-mail',
    placeholder: 'Enter your email',
    maxLength: 30,
    pattern: '^[\\w]+@([\\w\\-]+\\.)+[a-z]{2,4}$',
    required: true,
    errorText: '⚠️ Enter correct email. No whitespaces allowed',
  },
  password: {
    name: 'sign-password',
    type: 'password',
    labelName: 'Password',
    placeholder: 'Enter your password',
    maxLength: 30,
    pattern: '(?=^[a-zA-Zа-яА-ЯёЁ\\d]{8,}$)(?=.*\\d)(?=.*[a-zа-яё])(?=.*[A-ZА-ЯЁ]).*',
    required: true,
    errorText: '⚠️ Min 8 letters/digits. At least one digit, one lowercase and uppercase letter',
  },
  firstname: {
    name: 'firstname',
    type: 'text',
    labelName: 'First name',
    placeholder: 'Enter your first name',
    maxLength: 30,
    pattern: '^(?! )(?!.* $)([a-zA-Zа-яА-ЯёЁ\\s]+)$',
    required: true,
    errorText:
      '⚠️ At least one symbol. Only letters allowed. Don`t leave leading or trailing whitespace',
  },
  lastname: {
    name: 'lastname',
    type: 'text',
    labelName: 'Last name',
    placeholder: 'Enter your last name',
    maxLength: 30,
    pattern: '^(?! )(?!.* $)([a-zA-Zа-яА-ЯёЁ\\s]+)$',
    required: true,
    errorText:
      '⚠️ At least one symbol. Only letters allowed. Don`t leave leading or trailing whitespace',
  },
  birthDate: {
    name: 'birth',
    type: 'date',
    labelName: 'Date of birth',
    max: '9999-12-31',
    required: true,
    errorText: '⚠️ The service is available to users over 13 years old',
  },
  bilStreet: {
    name: 'bil-street',
    type: 'text',
    labelName: 'Street',
    placeholder: 'Enter your street',
    maxLength: 30,
    pattern: '^(?! )(?!.* $).+$',
    required: true,
    errorText: '⚠️ Min 1 symbol. Don`t leave whitespace on the edges',
  },
  bilCity: {
    name: 'bil-city',
    type: 'text',
    labelName: 'City',
    placeholder: 'Enter your city',
    maxLength: 30,
    pattern: '^(?! )(?!.* $)([a-zA-Zа-яА-ЯёЁ\\s]+)$',
    required: true,
    errorText: '⚠️ Min 1 symbol. Only letters. Don`t leave whitespace on the edges',
  },
  bilPostalCode: {
    name: 'bil-postal-code',
    type: 'text',
    labelName: 'Postal code',
    placeholder: 'Enter your postal code',
    maxLength: 30,
    required: true,
    errorText: '⚠️ Belarus postal code must have 6 digits, starting with "2"',
  },
  shipStreet: {
    name: 'ship-street',
    type: 'text',
    labelName: 'Street',
    placeholder: 'Enter your street',
    maxLength: 30,
    pattern: '^(?! )(?!.* $).+$',
    required: true,
    errorText: '⚠️ Min 1 symbol. Don`t leave whitespace on the edges',
  },
  shipCity: {
    name: 'ship-city',
    type: 'text',
    labelName: 'City',
    placeholder: 'Enter your city',
    maxLength: 30,
    pattern: '^(?! )(?!.* $)([a-zA-Zа-яА-ЯёЁ\\s]+)$',
    required: true,
    errorText: '⚠️ Min 1 symbol. Only letters. Don`t leave whitespace on the edges',
  },
  shipPostalCode: {
    name: 'ship-postal-code',
    type: 'text',
    labelName: 'Postal code',
    placeholder: 'Enter your postal code',
    maxLength: 30,
    required: true,
    errorText: '⚠️ Belarus postal code must have 6 digits, starting with "2"',
  },
};

export const POSTALCODE_PROPS: Record<string, Partial<LoginFieldProps>> = {
  BY: {
    pattern: '^2\\d{5}$',
    errorText: '⚠️ Belarus postal code must have 6 digits, starting with "2"',
  },
  UA: {
    pattern: '^\\d{5}$',
    errorText: '⚠️ Ukraine postal code must have exactly 5 digits',
  },
};

export const SIGNUP_API_ERROR_TEXT: Record<
  | 'existedEmail'
  | 'emptyEmail'
  | 'emptyPassword'
  | 'emptyDateOfBirth'
  | 'badCountryValue'
  | 'serverInternalError',
  string
> = {
  existedEmail: '⚠️ Signup failed: this email has already exist. Try another email',
  emptyEmail: '⚠️ Email should not be empty',
  emptyPassword: '⚠️ Password should not be empty',
  emptyDateOfBirth: '⚠️ Please enter valid date of birth',
  badCountryValue: '⚠️ Invalid country value',
  serverInternalError: '⚠️ Signup failed: Technical issues. Try again later',
};
