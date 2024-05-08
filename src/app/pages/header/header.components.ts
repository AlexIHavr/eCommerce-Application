import {
  loginNavLink,
  logoutNavLink,
  mainNavLink,
  signupNavLink,
} from 'pages/shared/navLinks/navLinks.component';
import { LocalStorageService } from 'services/localStorage.service';
import { BaseComponent } from 'shared/base/base.component';
import { div, icon } from 'shared/tags/tags.component';

import styles from './header.styles.module.scss';

export class Header extends BaseComponent {
  constructor() {
    const isLogined = LocalStorageService.getData('user');

    super(
      { tag: 'header', className: styles.header },
      div({ className: styles.logo }, icon({}, '&#128241;')),
      div(
        { className: styles.navLinks },
        mainNavLink,
        isLogined ? logoutNavLink : loginNavLink,
        signupNavLink,
      ),
      div({ className: styles.navIcons }, icon({}, '&#128187;'), icon({}, '&#128722;')),
    );
  }
}
