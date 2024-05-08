import { LoginFieldProps } from 'pages/shared/components/formField/formField.types';

export const LOGIN_PAGE_PROPS: Record<string, LoginFieldProps> = {
  email: {
    name: 'login-email',
    type: 'text',
    labelName: 'E-mail',
    placeholder: 'Enter your email',
    pattern: 'TODO PATTERN',
    required: true,
    errorText: '⚠️ Текст для требований валидации',
  },
};
