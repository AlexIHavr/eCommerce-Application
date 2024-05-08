// import { Button } from 'globalTypes/elements';
import { FormField } from 'pages/shared/components/formField/formField.component';
import { BaseComponent } from 'shared/base/base.component';

import styles from './loginPage.styles.module.scss';
import { LOGIN_PAGE_PROPS } from './loginPageProps';

export class LoginPage extends BaseComponent {
  private readonly emailField: FormField;

  // private readonly passwordField: FormField;

  // private readonly loginButton: Button;

  constructor() {
    super({ className: styles.loginPage });
    this.emailField = new FormField(LOGIN_PAGE_PROPS.email);
  }
}
