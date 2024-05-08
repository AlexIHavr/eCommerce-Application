import Navigo from 'navigo';
import { Main } from 'pages/main/main.component';
import { BaseComponent } from 'shared/base/base.component';
import { div } from 'shared/tags/tags.component';

import { PagesPaths } from './pageWrapper.consts';
import styles from './pageWrapper.styles.module.scss';

export class PageWrapper extends BaseComponent {
  private readonly pageContent = div({});

  constructor() {
    super({ className: styles.pageWrapper });
    this.append(this.pageContent);

    this.setRouting();
  }

  private setRouting(): void {
    const router = new Navigo(import.meta.env.BASE_URL);

    router.on(PagesPaths.MAIN, () => this.goToMainPage());

    router.resolve();
  }

  private goToMainPage(): void {
    this.goToPage(new Main());
  }

  private goToPage(page: BaseComponent): void {
    this.pageContent.destroyChildren();
    this.pageContent.append(page);
  }
}
