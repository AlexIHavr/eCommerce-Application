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

  constructor() {
    super({ className: styles.pageWrapper });

    this.pageContent = new BaseComponent({ tag: 'main', className: styles.pageContent });

    const [header, main, notFound] = [new Header(), new Main(), new NotFound()];

    this.appendChildren([header, this.pageContent, new Footer()]);

    this.addListener('click', (e) => header.closeMobileMenu(e));

    routingService.setHooks({
      before(done, match) {
        header.updateNavLinks(match.url);
        done();
      },
    });

    routingService.setRouting({
      [PagesPaths.MAIN]: () => this.goToPage(main),
      [PagesPaths.LOGIN]: () => {
        this.goToPage(new Login());
        loginRedirect();
      },
      [PagesPaths.SIGNUP]: () => this.goToPage(new Signup()),
      [PagesPaths.CATALOG]: () => this.goToPage(new Catalog()),
      [PagesPaths.ABOUT]: () => this.goToPage(new About()),
    });

    routingService.setNotFound(() => this.goToPage(notFound));
  }

  private goToPage(page: BaseComponent): void {
    this.pageContent.destroyChildren();
    this.pageContent.append(page);
  }
}
