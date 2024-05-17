import { Anchor, Div } from 'globalTypes/elements';
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
      },
    });

    this.appendChildren([
      div(
        { className: sharedStyles.container },
        div({ className: styles.headerInner }, this.homeLink, this.nav, this.sidePanel),
      ),
    ]);
  }

  public updateNavLinks(url: string): void {
    this.nav.destroyChildren();

    const linkWrapper = ul({ className: styles.navList });

    linkWrapper.appendChildren([
      ...this.navLinksEntries.map(([path, navLink]) => {
        if (path === url) navLink.addClass(styles.active);
        else navLink.removeClass(styles.active);

        if (navLink === this.navLinks[PagesPaths.LOGIN] && isLogined()) {
          return li({}, this.logoutNavLink);
        }
        return li({}, navLink);
      }),
    ]);

    this.nav.append(linkWrapper);
  }

  public closeBurger(e?: Event): void {
    if (
      this.nav.containsClass(styles.mobileMenu) &&
      !e?.composedPath().includes(this.burger.getNode())
    ) {
      if (!e?.composedPath().includes(this.nav.getNode())) this.nav.removeClass(styles.mobileMenu);
    }
  }
}
