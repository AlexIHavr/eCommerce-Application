import { apiService } from 'services/api.service';
import { BaseComponent } from 'shared/base/base.component';
import { button, div } from 'shared/tags/tags.component';

import styles from './confirmClear.module.scss';

export class ConfirmClear extends BaseComponent {
  constructor() {
    super({ className: styles.overlay });

    this.appendChildren([
      div(
        { className: styles.contentWrapper },
        div({ className: styles.confirmText, text: 'Clear Cart?' }),
        div(
          { className: styles.btnWrapper },
          button({
            className: styles.rejectBtn,
            text: 'Yes',
            onclick: () => {
              console.log('TODO Yes');
              apiService
                .clearCart()
                .then((cart) => {
                  // TODO: remove items on page
                  console.log(cart);
                })
                .finally(() => this.closeModal());
            },
          }),
          button({
            className: styles.confirmBtn,
            text: 'No',
            onclick: () => this.closeModal(),
          }),
        ),
      ),
    ]);

    this.addListener('mousedown', (e) => {
      if (e?.target === e?.currentTarget) this.closeModal();
    });
  }

  private closeModal(): void {
    this.destroy();
  }
}
