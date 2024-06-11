import { Anchor, Div, LI } from 'globalTypes/elements.type';
import { PagesPaths } from 'pages/pageWrapper.consts';
import { getNavLink, isLogined } from 'pages/pageWrapper.helpers';
import {
  aboutNavLink,
  cartNavLink,
  catalogNavLink,
  loginNavLink,
  profileNavLink,
  signupNavLink,
} from 'pages/shared/components/navLinks/navLinks.component';
import sharedStyles from 'pages/shared/styles/common.module.scss';
import { apiService } from 'services/api.service';
import { LocalStorageService } from 'services/localStorage.service';
import { BaseComponent } from 'shared/base/base.component';
import { div, li, span, ul } from 'shared/tags/tags.component';

import styles from './header.module.scss';
import { NavLinksEntries } from './header.types';

export class Header extends BaseComponent {
  private readonly nav: BaseComponent;

  private readonly burger: Div;

  private readonly navLinks: Partial<Record<PagesPaths, Anchor>>;

  private readonly navLinksEntries: NavLinksEntries;

  private readonly allNavLinksEntries: NavLinksEntries;

  private readonly logoutNavLink: Anchor;

  private readonly loginNavLinkWrapper: LI;

  private readonly profileLink: Anchor;

  constructor() {
    super({ tag: 'header', className: styles.header });

    const homeLink = getNavLink(
      '',
      PagesPaths.HOME,
      styles.titleWrapper,
      div({ className: styles.logo }),
      span({ className: styles.title, text: 'Furniture' }),
    );

    this.profileLink = profileNavLink(styles.profile);
    const cartLink = cartNavLink(styles.cart);

    this.navLinks = {
      [PagesPaths.CATALOG]: catalogNavLink(styles.listItem),
      [PagesPaths.ABOUT]: aboutNavLink(styles.listItem),
      [PagesPaths.SIGNUP]: signupNavLink(styles.listItem),
      [PagesPaths.LOGIN]: loginNavLink(styles.listItem),
    };

    const outerNavLinks = {
      [PagesPaths.HOME]: homeLink,
      [PagesPaths.PROFILE]: this.profileLink,
      [PagesPaths.CART]: cartLink,
    };

    this.navLinksEntries = Object.entries(this.navLinks);
    this.allNavLinksEntries = this.navLinksEntries.concat(Object.entries(outerNavLinks));

    this.nav = new BaseComponent({ tag: 'nav', className: styles.nav });

    this.burger = div(
      {
        className: styles.burger,
        onclick: () => this.nav.toggleClass(styles.mobileMenu),
      },
      div({ className: styles.burgerElem }),
      div({ className: styles.burgerElem }),
      div({ className: styles.burgerElem }),
    );

    this.logoutNavLink = getNavLink('Logout', PagesPaths.LOGIN, styles.listItem);
    this.logoutNavLink.addListener('click', () => this.onLogoutEvent());

    this.loginNavLinkWrapper = li({});

    this.setLinkWrapper();

    this.appendChildren([
      div(
        { className: sharedStyles.container },
        div(
          { className: styles.headerInner },
          homeLink,
          this.nav,
          div({ className: styles.sidePanel }, this.profileLink, cartLink, this.burger),
        ),
      ),
    ]);
  }

  public updateNavLinks(url: string): void {
    this.allNavLinksEntries.forEach(([path, navLink]) => {
      if (path === url) navLink.addClass(styles.active);
      else {
        navLink.removeClass(styles.active);
      }

      this.closeMobileMenu();

      if (navLink === this.navLinks[PagesPaths.LOGIN]) this.setLoginNavLink();
    });
  }

  public closeMobileMenu(event?: Event): void {
    if (
      this.nav.containsClass(styles.mobileMenu) &&
      !event?.composedPath().includes(this.burger.getNode())
    ) {
      if (!event?.composedPath().includes(this.nav.getNode())) {
        this.nav.removeClass(styles.mobileMenu);
      }
    }
  }

  private setLinkWrapper(): void {
    const linkWrapper = ul({ className: styles.navList });

    this.setLoginNavLink();

    linkWrapper.appendChildren(
      this.navLinksEntries.map(([, navLink]) =>
        navLink === this.navLinks[PagesPaths.LOGIN] ? this.loginNavLinkWrapper : li({}, navLink),
      ),
    );

    this.nav.append(linkWrapper);
  }

  private setLoginNavLink(): void {
    this.loginNavLinkWrapper.destroyChildren();
    this.loginNavLinkWrapper.append(
      isLogined() ? this.logoutNavLink : this.navLinks[PagesPaths.LOGIN]!,
    );

    if (isLogined()) {
      this.profileLink.removeClass(styles.hidden);
    } else {
      this.profileLink.addClass(styles.hidden);
    }
  }

  private onLogoutEvent(): void {
    LocalStorageService.removeData('refreshToken');
    LocalStorageService.removeData('token');
    LocalStorageService.removeData('customerId');
    LocalStorageService.removeData('cartId');

    apiService.logout();

    this.updateNavLinks(PagesPaths.LOGIN);
    this.setLoginNavLink();
  }
}
