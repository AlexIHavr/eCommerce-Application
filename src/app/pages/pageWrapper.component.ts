import { Header } from 'pages/header/header.components';
import { Main } from 'pages/main/main.component';
import { NotFound } from 'pages/notFound/notFound.component';
import { routingService } from 'services/routing.service';
import { BaseComponent } from 'shared/base/base.component';
import { div } from 'shared/tags/tags.component';

import { PagesPaths } from './pageWrapper.consts';
import styles from './pageWrapper.styles.module.scss';

export class PageWrapper extends BaseComponent {
  private readonly pageContent = div({});

  constructor() {
    super({ className: styles.pageWrapper }, new Header());
    this.append(this.pageContent);

    routingService.setRouting(
      {
        [PagesPaths.MAIN]: () => this.goToPage(new Main()),
      },
      () => this.goToPage(new NotFound()),
    );
  }

  private goToPage(page: BaseComponent): void {
    this.pageContent.destroyChildren();
    this.pageContent.append(page);
  }
}
