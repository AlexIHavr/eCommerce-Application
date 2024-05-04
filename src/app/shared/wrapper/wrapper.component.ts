import BaseComponent from 'shared/base/base.component';

import styles from './wrapper.styles.module.scss';

export default class Wrapper extends BaseComponent {
  private isOpened: boolean = false;

  constructor() {
    super({ className: styles.wrapper });
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
