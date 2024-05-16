import { Anchor, Div } from 'globalTypes/elements';
import { PagesPaths } from 'pages/pageWrapper.consts';
import { getNavLink, isLogined } from 'pages/pageWrapper.helpers';
import { loginNavLink, signupNavLink } from 'pages/shared/components/navLinks/navLinks.component';
import { LocalStorageService } from 'services/localStorage.service';
import { BaseComponent } from 'shared/base/base.component';
import { div, icon } from 'shared/tags/tags.component';

import styles from './header.module.scss';

export class Header extends BaseComponent {
  private readonly navLinks: Record<PagesPaths, Anchor>;

  private readonly navLinksWrapper: Div;

  private readonly navLinksEntries: [string, Anchor][];

  private readonly logoutNavLink: Anchor;

  constructor() {
    super({ tag: 'header', className: styles.header });

    this.navLinks = {
      [PagesPaths.MAIN]: getNavLink('Home', PagesPaths.MAIN),
      [PagesPaths.LOGIN]: loginNavLink(),
      [PagesPaths.SIGNUP]: signupNavLink(),
    };

    this.navLinksEntries = Object.entries(this.navLinks);

    this.navLinksWrapper = div({ className: styles.navLinksWrapper });

    this.logoutNavLink = getNavLink('Logout', PagesPaths.LOGIN);
    this.logoutNavLink.setProps({ onclick: () => LocalStorageService.removeData('refreshToken') });

    this.appendChildren([
      div({ className: styles.logo }, icon({}, '&#128241;')),
      this.navLinksWrapper,
      div({ className: styles.navIcons }, icon({}, '&#128187;'), icon({}, '&#128722;')),
    ]);
  }

  public updateNavLinks(url: string): void {
    this.navLinksWrapper.destroyChildren();

    this.navLinksEntries.forEach(([path, navLink]) => {
      if (navLink === this.navLinks[PagesPaths.LOGIN]) {
        this.navLinksWrapper.append(isLogined() ? this.logoutNavLink : navLink);
      } else {
        this.navLinksWrapper.append(navLink);
      }

      if (path === url) navLink.addClass(styles.active);
      else navLink.removeClass(styles.active);
    });
  }
}
