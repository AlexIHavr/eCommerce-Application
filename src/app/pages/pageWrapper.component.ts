import { BaseComponent } from 'shared/base/base.component';

import styles from './pageWrapper.styles.module.scss';

export class PageWrapper extends BaseComponent {
  constructor() {
    super({ className: styles.pageWrapper });
  }
}
