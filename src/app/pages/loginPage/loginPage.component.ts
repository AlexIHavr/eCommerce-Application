import { Anchor, Button, Form } from 'globalTypes/elements';
import { FormField } from 'pages/shared/components/formField/formField.component';
import formFieldStyles from 'pages/shared/components/formField/formField.styles.module.scss';
import { BaseComponent } from 'shared/base/base.component';
import { a, button, form, h2, span } from 'shared/tags/tags.component';

import styles from './loginPage.styles.module.scss';
import { LOGIN_PAGE_PROPS } from './loginPageProps';

export class LoginPage extends BaseComponent {
  private readonly loginForm: Form;

  private readonly emailField: FormField;

  private readonly passwordField: FormField;

  private readonly loginButton: Button;

  private readonly linkToRegistration: Anchor;

  constructor() {
    super({ className: styles.loginPage });
    this.emailField = new FormField(LOGIN_PAGE_PROPS.email);
    this.passwordField = new FormField(LOGIN_PAGE_PROPS.password);
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
    const footer = span({ className: styles.formFooter, text: 'Don`t have an account? ' });
    footer.getNode().insertAdjacentElement('beforeend', this.linkToRegistration.getNode());

    this.appendChildren([h2('Login', styles.formHeader), this.loginForm, footer]);
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
