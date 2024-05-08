import { loginNavLink, mainNavLink, signupNavLink } from 'pages/shared/navLinks/navLinks.component';
import { BaseComponent } from 'shared/base/base.component';

import styles from './header.styles.module.scss';

export class Header extends BaseComponent {
  constructor() {
    super({ tag: 'header', className: styles.header }, mainNavLink, loginNavLink, signupNavLink);
  }
}
