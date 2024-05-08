import './styles/style.scss';
import './app/app';

/* Example Api Service Request */
// import { ApiService } from 'services/api.service';

// const apiService = new ApiService();
// apiService.getProject();

// Example to test formField
console.log(`
import { FormField, LoginFieldProps } from 'pages/shared/components/formField/formField.component';

const propsTest: LoginFieldProps = {
  name: 'login-email',
  type: 'text',
  labelName: 'E-mail',
  placeholder: 'Enter your email',
  pattern: '[a-z][0-9]',
  required: true,
  errorText: '⚠️ Текст для требований валидации',
};

const field = new FormField(propsTest);
document.body.append(field.getNode());
field.getNode().oninput = (): void => console.log(field.isValid());
`);
