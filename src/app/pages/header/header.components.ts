import { Anchor, Div, Li, Ul } from 'globalTypes/elements';
import { PagesPaths } from 'pages/pageWrapper.consts';
import { getNavLink, isLogined } from 'pages/pageWrapper.helpers';
import {
  aboutNavLink,
  catalogNavLink,
  loginNavLink,
  signupNavLink,
} from 'pages/shared/components/navLinks/navLinks.component';
import sharedStyles from 'pages/shared/styles/common.module.scss';
import { apiService } from 'services/api.service';
import { LocalStorageService } from 'services/localStorage.service';
import { BaseComponent } from 'shared/base/base.component';
import { div, img, li, span, ul } from 'shared/tags/tags.component';

import styles from './header.module.scss';

export class Header extends BaseComponent {
  private readonly homeLink: Anchor;

  private readonly nav: BaseComponent;

  private readonly sidePanel: Div;

  private readonly burger: Div;

  private readonly navLinks: Partial<Record<PagesPaths, Anchor>>;

  private readonly navLinksEntries: [string, Anchor][];

  private readonly logoutNavLink: Anchor;

  private readonly loginNavLinkWrapper: Li;

  private readonly linkWrapper: Ul;

  constructor() {
    super({ tag: 'header', className: styles.header });

    this.homeLink = getNavLink(
      '',
      PagesPaths.MAIN,
      styles.titleWrapper,
      img({ src: '/logo.png', alt: 'Woodstore logo' }),
      span({ className: styles.title, text: 'Woodstore' }),
    );

    this.navLinks = {
      [PagesPaths.CATALOG]: catalogNavLink(styles.listItem),
      [PagesPaths.ABOUT]: aboutNavLink(styles.listItem),
      [PagesPaths.SIGNUP]: signupNavLink(styles.listItem),
      [PagesPaths.LOGIN]: loginNavLink(styles.listItem),
    };
    this.navLinksEntries = Object.entries(this.navLinks);

    this.nav = new BaseComponent({ tag: 'nav', className: styles.nav });
    this.burger = div(
      {
        className: styles.burger,
        onclick: () => {
          this.nav.toggleClass(styles.mobileMenu);
        },
      },
      div({ className: styles.burgerElem }),
      div({ className: styles.burgerElem }),
      div({ className: styles.burgerElem }),
    );
    this.sidePanel = div({ className: styles.sidePanel }, this.burger);

    this.logoutNavLink = getNavLink('Logout', PagesPaths.LOGIN, styles.listItem);
    this.logoutNavLink.setProps({
      onclick: () => {
        LocalStorageService.removeData('refreshToken');
        this.updateNavLinks(PagesPaths.LOGIN);
        apiService.logout();
        this.setLoginNavLink();
      },
    });

    this.appendChildren([
      div(
        { className: sharedStyles.container },
        div({ className: styles.headerInner }, this.homeLink, this.nav, this.sidePanel),
      ),
    ]);

    this.linkWrapper = ul({ className: styles.navList });

    this.loginNavLinkWrapper = li({});

    this.setLoginNavLink();

    this.linkWrapper.appendChildren(
      this.navLinksEntries.map(([, navLink]) => {
        if (navLink === this.navLinks[PagesPaths.LOGIN]) {
          return this.loginNavLinkWrapper;
        }
        return li({}, navLink);
      }),
    );

    this.nav.append(this.linkWrapper);
  }

  public updateNavLinks(url: string): void {
    this.navLinksEntries.forEach(([path, navLink]) => {
      if (path === url) navLink.addClass(styles.active);
      else if (navLink.containsClass(styles.active)) {
        navLink.removeClass(styles.active);
        this.closeMobileMenu();
      }

      if (navLink === this.navLinks[PagesPaths.LOGIN]) this.setLoginNavLink();
    });
  }

  public closeMobileMenu(): void {
    if (this.nav.containsClass(styles.mobileMenu)) {
      this.nav.removeClass(styles.mobileMenu);
    }
  }

  private setLoginNavLink(): void {
    this.loginNavLinkWrapper.destroyChildren();
    this.loginNavLinkWrapper.append(
      isLogined() ? this.logoutNavLink : this.navLinks[PagesPaths.LOGIN]!,
    );
  }
}
