import { Div, Span } from 'globalTypes/elements';
import { BaseComponent } from 'shared/base/base.component';
import { div, span } from 'shared/tags/tags.component';

import styles from './alert.module.scss';

class Alert extends BaseComponent {
  private readonly HIDE_DELAY: number;

  private readonly wrapper: Div;

  private readonly info: Div;

  private readonly infoTitle: Span;

  private readonly infoText: Span;

  constructor() {
    super({ className: `${styles.alert} ${styles.hide}` });
    this.HIDE_DELAY = 3000;
    this.wrapper = div({ className: styles.wrapper });
    this.info = div({ className: styles.info });
    this.infoTitle = span({ className: styles.infoTitle });
    this.infoText = span({ className: styles.infoText });

    this.info.appendChildren([this.infoTitle, this.infoText]);
    this.wrapper.append(this.info);
    this.append(this.wrapper);
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
