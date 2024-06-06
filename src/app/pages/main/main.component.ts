import sharedStyles from 'pages/shared/styles/common.module.scss';
import { BaseComponent } from 'shared/base/base.component';
import { div, h1 } from 'shared/tags/tags.component';

import { CHAIRS_PROMOCODE } from './main.consts';
import { copyPromocode } from './main.helpers';
import styles from './main.module.scss';

export class Main extends BaseComponent {
  constructor() {
    super(
      { className: styles.main },
      div(
        { className: sharedStyles.container },
        h1('Welcome to The Furniture Store', styles.mainTitle),
        div(
          { className: styles.promocode },
          div({ className: styles.promoText, text: 'Get discount for all chairs in the catalog!' }),
          div(
            { className: styles.promoWrapper },
            div({ className: styles.title, text: 'Promo code' }),
            div({
              className: styles.code,
              text: CHAIRS_PROMOCODE,
              onclick: () => copyPromocode(),
            }),
            div({ className: styles.cover }),
          ),
        ),
      ),
    );
  }
}
