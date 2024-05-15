import { Div, Span } from 'globalTypes/elements';
import { BaseComponent } from 'shared/base/base.component';
import { div, span } from 'shared/tags/tags.component';

import styles from './alert.module.scss';

class Alert extends BaseComponent {
  private HIDE_DELAY: number = 2000;

  private wrapper: Div = div({ className: styles.wrapper });

  private info: Div = div({ className: styles.info });

  private infoTitle: Span = span({ className: styles.infoTitle });

  private infoText: Span = span({ className: styles.infoText });

  constructor() {
    super({ className: `${styles.alert} ${styles.hide}` });
    this.info.appendChildren([this.infoTitle, this.infoText]);
    this.wrapper.appendChildren([this.info]);
    this.appendChildren([this.wrapper]);
  }

  public showAlert(type: 'success' | 'error' | 'attention', text: string): void {
    switch (type) {
      case 'success':
        this.addClass(styles.success);
        this.infoTitle.setText('Success');
        break;

      case 'attention':
        this.addClass(styles.attention);
        this.infoTitle.setText('Attention');
        break;

      case 'error':
        this.addClass(styles.error);
        this.infoTitle.setText('Error');
        break;

      default:
        break;
    }

    this.infoText.setText(text);

    this.removeClass(styles.hide);

    setTimeout(() => {
      this.hideAlert();
    }, this.HIDE_DELAY);
  }

  private hideAlert(): void {
    this.addClass(styles.hide);
  }
}

export const alertModal = new Alert();
