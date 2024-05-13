import { PagesPaths } from 'pages/pageWrapper.consts';
import { LocalStorageService } from 'services/localStorage.service';
import { BaseComponent } from 'shared/base/base.component';
import { div, icon } from 'shared/tags/tags.component';

import { getNavLink } from './header.helpers';
import styles from './header.module.scss';

export class Header extends BaseComponent {
  constructor() {
    const isLogined = LocalStorageService.getData('refreshToken');
    const logoutNavLink = getNavLink('Logout', PagesPaths.LOGIN);

    super(
      { tag: 'header', className: styles.header },
      div({ className: styles.logo }, icon({}, '&#128241;')),
      div(
        { className: styles.navLinks },
        getNavLink('Home', PagesPaths.MAIN),
        isLogined ? logoutNavLink : getNavLink('Login', PagesPaths.LOGIN),
        getNavLink('Signup', PagesPaths.SIGNUP),
      ),
      div({ className: styles.navIcons }, icon({}, '&#128187;'), icon({}, '&#128722;')),
    );

    logoutNavLink.setProps({ onclick: () => console.log('TODO to logout') });
  }
}
