import { LoginFieldProps } from 'pages/shared/components/formField/formField.types';

export const LOGIN_PROPS: Record<string, LoginFieldProps> = {
  email: {
    name: 'login-email',
    type: 'text',
    labelName: 'E-mail',
    placeholder: 'Enter your email',
    maxLength: 30,
    pattern: '^[\\w]+@([\\w\\-]+\\.)+[a-z]{2,4}$',
    required: true,
    errorText: '⚠️ Enter correct email. No whitespaces allowed',
  },
  password: {
    name: 'login-password',
    type: 'password',
    labelName: 'Password',
    placeholder: 'Enter your password',
    maxLength: 30,
    pattern: '(?=^[a-zA-Z\\d]{8,}$)(?=.*\\d)(?=.*[a-z])(?=.*[A-Z]).*',
    required: true,
    errorText:
      '⚠️ At least one lowercase, uppercase letter and digit. Only letters and digits. Min 8 chars',
  },
};
