import { BaseComponent } from 'shared/base/base.component';
import { div } from 'shared/tags/tags.component';

import styles from './loader.styles.module.scss';

class Loader extends BaseComponent {
  private isOpened: boolean = false;

  constructor() {
    super({ className: styles.loader });

    this.append(div({ className: styles.loaderIcon }));
  }

  public open(): void {
    if (this.isOpened) return;

    document.body.append(this.getNode());
    this.isOpened = true;
  }

  public close(): void {
    this.destroy();
    this.isOpened = false;
  }
}

export const loader = new Loader();
