import { Form } from 'globalTypes/elements';
import { FormField } from 'pages/shared/components/formField/formField.component';
import formFieldStyles from 'pages/shared/components/formField/formField.module.scss';
import formStyles from 'pages/shared/styles/form-elements.module.scss';
import { ApiService, apiService } from 'services/api.service';
import { BaseComponent } from 'shared/base/base.component';
import { a, button, form, h2, span } from 'shared/tags/tags.component';

import { LOGIN_PROPS } from './login.consts';
import styles from './login.module.scss';

export class Login extends BaseComponent {
  private readonly loginForm: Form;

  private readonly emailField: FormField;

  private readonly passwordField: FormField;

  private readonly loginButton: Button;

  private readonly linkToRegistration: Anchor;

  private readonly apiService: ApiService;

  constructor() {
    super({ className: styles.loginPage });

    this.apiService = apiService;

    this.emailField = new FormField(LOGIN_PROPS.email);
    this.passwordField = new FormField(LOGIN_PROPS.password);

    this.loginForm = form(
      { className: styles.loginFormWrapper },
      this.emailField,
      this.passwordField,
      button({
        className: formStyles.formButton,
        text: 'Login',
        type: 'submit',
        onclick: (e) => this.submitHandler(e),
      }),
    );

    this.appendChildren([
      h2('Login', formStyles.formHeader),
      this.loginForm,
      span(
        { className: formStyles.formFooter, text: 'Don`t have an account? ' },
        a({
          className: formStyles.formFooterLink,
          text: 'Signup',
          onclick: () => console.log('TODO redirect to RegPage'),
        }),
      ),
    ]);
  }

  private submitHandler(e: Event): void {
    e.preventDefault();
    if (this.emailField.isValid() && this.passwordField.isValid()) {
      console.log('TODO Success Login');
      this.apiService.loginCustomer({
        email: this.emailField.value,
        password: this.passwordField.value,
      });
    } else {
      this.loginForm.addClass(formFieldStyles.error);
    }
  }
}
