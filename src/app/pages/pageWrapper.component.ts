import { About } from 'pages/about/about.component';
import { Catalog } from 'pages/catalog/catalog.component';
import { Footer } from 'pages/footer/footer.component';
import { Header } from 'pages/header/header.components';
import { Login } from 'pages/login/login.component';
import { Main } from 'pages/main/main.component';
import { NotFound } from 'pages/notFound/notFound.component';
import { Signup } from 'pages/signup/signup.component';
import { routingService } from 'services/routing.service';
import { BaseComponent } from 'shared/base/base.component';

import { PagesPaths } from './pageWrapper.consts';
import { loginRedirect } from './pageWrapper.helpers';
import styles from './pageWrapper.module.scss';

export class PageWrapper extends BaseComponent {
  private readonly pageContent;

  private readonly header: Header;

  constructor() {
    super({ className: styles.pageWrapper });

    this.pageContent = new BaseComponent({ tag: 'main', className: styles.pageContent });

    this.header = new Header();

    this.appendChildren([this.header, this.pageContent, new Footer()]);

    this.addListener('click', (event) => this.header.closeMobileMenu(event));

    this.initRoutingService();
  }

  private initRoutingService(): void {
    const main = new Main();
    const notFound = new NotFound();

    routingService.setHooks({
      before: (done, match) => {
        this.header.updateNavLinks(match.url);
        done();
      },
    });

    routingService.setRouting({
      [PagesPaths.MAIN]: () => this.goToPage(main),
      [PagesPaths.HOME]: () => this.goToPage(main),
      [PagesPaths.LOGIN]: () => this.goToLogin(),
      [PagesPaths.SIGNUP]: () => this.goToPage(new Signup()),
      [PagesPaths.CATALOG]: () => this.goToPage(new Catalog()),
      [PagesPaths.ABOUT]: () => this.goToPage(new About()),
    });

    routingService.setNotFound(() => this.goToPage(notFound));
  }

  private goToLogin(): void {
    this.goToPage(new Login());
    loginRedirect();
  }

  private goToPage(page: BaseComponent): void {
    this.pageContent.destroyChildren();
    this.pageContent.append(page);
  }
}
