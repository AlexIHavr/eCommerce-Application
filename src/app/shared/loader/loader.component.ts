import { BaseComponent } from 'shared/base/base.component';
import { div } from 'shared/tags/tags.component';

import { onErrorEventHandler } from './loader.helpers';
import styles from './loader.module.scss';

class Loader extends BaseComponent {
  private isOpened: boolean = false;

  constructor() {
    super({ className: styles.loader }, div({ className: styles.loaderIcon }));
  }

  public open(): void {
    if (this.isOpened) return;

    document.body.append(this.getNode());
    this.isOpened = true;

    document.body?.addEventListener('keydown', onErrorEventHandler);
  }

  public close(): void {
    this.destroy();
    this.isOpened = false;

    document.body?.removeEventListener('keydown', onErrorEventHandler);
  }
}

export const loader = new Loader();
