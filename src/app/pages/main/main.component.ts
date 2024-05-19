import sharedStyles from 'pages/shared/styles/common.module.scss';
import { BaseComponent } from 'shared/base/base.component';
import { div, h1 } from 'shared/tags/tags.component';

import styles from './main.module.scss';

export class Main extends BaseComponent {
  constructor() {
    super(
      { className: sharedStyles.container },
      div({ className: styles.main }, h1('Welcome to The Furniture Store')),
    );
  }
}
