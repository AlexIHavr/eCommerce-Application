import { Anchor, Button, Form } from 'globalTypes/elements';
import { FormField } from 'pages/shared/components/formField/formField.component';
import formFieldStyles from 'pages/shared/components/formField/formField.module.scss';
import { BaseComponent } from 'shared/base/base.component';
import { a, button, form, h2, span } from 'shared/tags/tags.component';

import { LOGIN_PROPS } from './login.consts';
import styles from './login.module.scss';

export class LoginPage extends BaseComponent {
  private readonly loginForm: Form;

  private readonly emailField: FormField;

  private readonly passwordField: FormField;

  private readonly loginButton: Button;

  private readonly linkToRegistration: Anchor;

  constructor() {
    super({ className: styles.loginPage });

    this.emailField = new FormField(LOGIN_PROPS.email);
    this.passwordField = new FormField(LOGIN_PROPS.password);

    this.loginButton = button({
      className: styles.formButton,
      text: 'Login',
      type: 'submit',
      onclick: (e) => this.submitHandler(e),
    });

    this.loginForm = form(
      { className: styles.formWrapper },
      this.emailField,
      this.passwordField,
      this.loginButton,
    );

    this.linkToRegistration = a({
      className: styles.formFooterLink,
      text: 'Signup',
      onclick: () => console.log('TODO redirect to RegPage'),
    });

    this.appendChildren([
      h2('Login', styles.formHeader),
      this.loginForm,
      span(
        { className: styles.formFooter, text: 'Don`t have an account? ' },
        this.linkToRegistration,
      ),
    ]);
  }

  private submitHandler(e: Event): void {
    e.preventDefault();
    if (this.emailField.isValid() && this.passwordField.isValid()) {
      console.log('TODO Success Login');
    } else {
      this.loginForm.addClass(formFieldStyles.error);
    }
  }
}
