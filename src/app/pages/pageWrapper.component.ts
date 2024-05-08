import Navigo from 'navigo';
import { Header } from 'pages/header/header.components';
import { Main } from 'pages/main/main.component';
import { BaseComponent } from 'shared/base/base.component';
import { div } from 'shared/tags/tags.component';

import { PagesPaths } from './pageWrapper.consts';
import styles from './pageWrapper.styles.module.scss';

export class PageWrapper extends BaseComponent {
  private router: Navigo;

  private readonly pageContent = div({});

  constructor() {
    super({ className: styles.pageWrapper }, new Header());
    this.append(this.pageContent);

    this.router = new Navigo(import.meta.env.BASE_URL);

    this.setRouting();
  }

  private setRouting(): void {
    this.router
      .on({
        [PagesPaths.MAIN]: () => this.goToPage(new Main()),
      })
      .resolve();
  }

  private goToPage(page: BaseComponent): void {
    this.pageContent.destroyChildren();
    this.pageContent.append(page);
    this.router.updatePageLinks();
  }
}
