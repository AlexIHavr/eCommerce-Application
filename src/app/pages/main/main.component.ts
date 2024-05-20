import { loginNavLink, signupNavLink } from 'pages/shared/components/navLinks/navLinks.component';
import sharedStyles from 'pages/shared/styles/common.module.scss';
import formStyles from 'pages/shared/styles/formElements.module.scss';
import { BaseComponent } from 'shared/base/base.component';
import { div, h1 } from 'shared/tags/tags.component';

import styles from './main.module.scss';

export class Main extends BaseComponent {
  constructor() {
    super(
      { className: styles.main },
      div(
        { className: sharedStyles.container },
        h1('Welcome to The Furniture Store', styles.mainTitle),
        div(
          { className: styles.navLinks },
          signupNavLink(formStyles.formFooterLink),
          loginNavLink(formStyles.formFooterLink),
        ),
      ),
    );
  }
}
