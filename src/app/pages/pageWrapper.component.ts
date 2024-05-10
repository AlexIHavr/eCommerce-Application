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

  constructor() {
    super({ className: styles.pageWrapper }, new Header());
    this.appendChildren([this.pageContent, new Footer()]);

    routingService.setRouting(
      {
        [PagesPaths.MAIN]: () => this.goToPage(new Main()),
        [PagesPaths.LOGIN]: () => this.goToPage(new Login()),
        [PagesPaths.SIGNUP]: () => this.goToPage(new Signup()),
      },
      () => this.goToPage(new NotFound()),
    );
  }

  private goToPage(page: BaseComponent): void {
    this.pageContent.destroyChildren();
    this.pageContent.append(page);
  }
}
