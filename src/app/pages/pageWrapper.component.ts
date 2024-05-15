import { Footer } from 'pages/footer/footer.component';
import { Header } from 'pages/header/header.components';
import { Main } from 'pages/main/main.component';
import { NotFound } from 'pages/notFound/notFound.component';
import { routingService } from 'services/routing.service';
import { BaseComponent } from 'shared/base/base.component';
import { div } from 'shared/tags/tags.component';

import { Login } from './login/login.component';
import { PagesPaths } from './pageWrapper.consts';
import styles from './pageWrapper.module.scss';
import { Signup } from './signup/signup.component';

export class PageWrapper extends BaseComponent {
  private readonly pageContent = div({ className: styles.pageContent });

  private readonly header;

  constructor() {
    super({ className: styles.pageWrapper });

    this.header = new Header();

    this.appendChildren([this.header, this.pageContent, new Footer()]);

    const [main, login, signup, notFound] = [new Main(), new Login(), new Signup(), new NotFound()];

    routingService.setRouting(
      {
        [PagesPaths.MAIN]: () => this.goToPage(main),
        [PagesPaths.LOGIN]: () => this.goToPage(login),
        [PagesPaths.SIGNUP]: () => this.goToPage(signup),
      },
      () => this.goToPage(notFound),
    );
  }

  private goToPage(page: BaseComponent): void {
    this.pageContent.destroyChildren();
    this.pageContent.append(page);
    this.header.setLoginNavLink();
  }
}
