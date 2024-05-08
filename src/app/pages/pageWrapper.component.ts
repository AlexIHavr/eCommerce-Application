import Navigo from 'navigo';
import { Header } from 'pages/header/header.components';
import { Main } from 'pages/main/main.component';
import { BaseComponent } from 'shared/base/base.component';
import { div } from 'shared/tags/tags.component';

import { PagesPaths } from './pageWrapper.consts';
import styles from './pageWrapper.styles.module.scss';

export class PageWrapper extends BaseComponent {
  private readonly pageContent = div({});

  constructor() {
    super({ className: styles.pageWrapper }, new Header());
    this.append(this.pageContent);

    this.setRouting();
  }

  private setRouting(): void {
    const router = new Navigo(import.meta.env.BASE_URL);

    router.on(PagesPaths.MAIN, () => this.goToPage(new Main()));

    router.resolve();
  }

  private goToPage(page: BaseComponent): void {
    this.pageContent.destroyChildren();
    this.pageContent.append(page);
  }
}
