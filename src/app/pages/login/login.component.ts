import { Form } from 'globalTypes/elements';
import { FormField } from 'pages/shared/components/formField/formField.component';
import formFieldStyles from 'pages/shared/components/formField/formField.module.scss';
import formStyles from 'pages/shared/styles/form-elements.module.scss';
import { apiService } from 'services/api.service';
import { LocalStorageService } from 'services/localStorage.service';
import { BaseComponent } from 'shared/base/base.component';
import { a, button, form, h2, span } from 'shared/tags/tags.component';
import { clientBuildUtil } from 'utils/clientBuild.util';
import { tokenCache } from 'utils/tokenCache.util';

import { LOGIN_API_ERROR_TEXT, LOGIN_PROPS } from './login.consts';
import styles from './login.module.scss';

export class Login extends BaseComponent {
  private readonly loginForm: Form;

  private readonly emailField: FormField;

  private readonly passwordField: FormField;

  constructor() {
    super({ className: styles.loginPage });
    this.emailField = new FormField(LOGIN_PROPS.email);
    this.passwordField = new FormField(LOGIN_PROPS.password);

    this.emailField.addListener(
      'input',
      () => {
        this.emailField.addClass(formFieldStyles.selfError);
      },
      { once: true },
    );

    this.passwordField.addListener(
      'input',
      () => {
        this.passwordField.addClass(formFieldStyles.selfError);
      },
      { once: true },
    );

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
      apiService.getCustomerByEmail(this.emailField.value).then(({ body }) => {
        if (body.results.length === 0) {
          this.emailField.showApiError(LOGIN_API_ERROR_TEXT.email);
        } else {
          apiService
            .loginCustomer({
              email: this.emailField.value,
              password: this.passwordField.value,
            })
            .then(() => {
              // TODO: Redirect to main
              if (tokenCache.cache.refreshToken) {
                LocalStorageService.saveData('refreshToken', tokenCache.cache.refreshToken);
              } else {
                throw new Error('refreshToken was not found in tokenCache');
              }
            })
            .catch(() => {
              this.passwordField.showApiError(LOGIN_API_ERROR_TEXT.password);
              apiService.apiRoot = clientBuildUtil.getApiRootByFlow('anonymous');
            });
        }
      });
    } else {
      this.loginForm.addClass(formFieldStyles.error);
    }
  }
}
