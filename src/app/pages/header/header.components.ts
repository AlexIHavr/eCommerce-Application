import { PagesPaths } from 'pages/pageWrapper.consts';
import { BaseComponent } from 'shared/base/base.component';

import { getNavigoLink } from './header.helpers';
import styles from './header.styles.module.scss';

export class Header extends BaseComponent {
  constructor() {
    super(
      { tag: 'header', className: styles.header },
      getNavigoLink('Home', PagesPaths.MAIN),
      getNavigoLink('Login', PagesPaths.LOGIN),
      getNavigoLink('Signup', PagesPaths.SIGNUP),
    );
  }
}
