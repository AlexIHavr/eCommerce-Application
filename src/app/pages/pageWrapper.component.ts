import { Footer } from 'pages/footer/footer.component';
import { Header } from 'pages/header/header.components';
import { Login } from 'pages/login/login.component';
import { Main } from 'pages/main/main.component';
import { NotFound } from 'pages/notFound/notFound.component';
import { Signup } from 'pages/signup/signup.component';
import { routingService } from 'services/routing.service';
import { BaseComponent } from 'shared/base/base.component';
import { div } from 'shared/tags/tags.component';

import { PagesPaths } from './pageWrapper.consts';
import { loginRedirect } from './pageWrapper.helpers';
import styles from './pageWrapper.module.scss';

export class PageWrapper extends BaseComponent {
  private readonly pageContent;

  constructor() {
    super({ className: styles.pageWrapper });

    this.pageContent = div({ className: styles.pageContent });

    const [header, main, login, signup, notFound] = [
      new Header(),
      new Main(),
      new Login(),
      new Signup(),
      new NotFound(),
    ];

    this.appendChildren([header, this.pageContent, new Footer()]);

    this.addListener('click', (e) => header.closeBurger(e));

    routingService.setHooks({
      after(match) {
        header.updateNavLinks(match.url);
      },
    });

    routingService.setRouting({
      [PagesPaths.MAIN]: () => this.goToPage(main),
      [PagesPaths.LOGIN]: () => {
        this.goToPage(login);
        loginRedirect();
      },
      [PagesPaths.SIGNUP]: () => this.goToPage(signup),
    });

    routingService.setNotFound(() => this.goToPage(notFound));
  }

  private goToPage(page: BaseComponent): void {
    this.pageContent.destroyChildren();
    this.pageContent.append(page);
  }
}
