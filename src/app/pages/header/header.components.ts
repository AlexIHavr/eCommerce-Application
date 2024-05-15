import { Anchor, Div } from 'globalTypes/elements';
import { PagesPaths } from 'pages/pageWrapper.consts';
import { getNavLink } from 'pages/pageWrapper.helpers';
import { loginNavLink, signupNavLink } from 'pages/shared/components/navLinks/navLinks.component';
import { LocalStorageService } from 'services/localStorage.service';
import { BaseComponent } from 'shared/base/base.component';
import { div, icon } from 'shared/tags/tags.component';

import styles from './header.module.scss';

export class Header extends BaseComponent {
  private readonly loginNavLinkWrapper: Div;

  private readonly logoutNavLink: Anchor;

  constructor() {
    super({ tag: 'header', className: styles.header });

    this.loginNavLinkWrapper = div({});
    this.logoutNavLink = getNavLink('Logout', PagesPaths.LOGIN);
    this.logoutNavLink.setProps({
      onclick: () => {
        LocalStorageService.removeData('refreshToken');
        this.setLoginNavLink();
      },
    });

    this.appendChildren([
      div({ className: styles.logo }, icon({}, '&#128241;')),
      div(
        { className: styles.navLinks },
        getNavLink('Home', PagesPaths.MAIN),
        this.loginNavLinkWrapper,
        signupNavLink(),
      ),
      div({ className: styles.navIcons }, icon({}, '&#128187;'), icon({}, '&#128722;')),
    ]);

    this.setLoginNavLink();
  }

  public setLoginNavLink(): void {
    const isLogined = LocalStorageService.getData('refreshToken');

    this.loginNavLinkWrapper.destroyChildren();
    this.loginNavLinkWrapper.append(isLogined ? this.logoutNavLink : loginNavLink());
  }
}
