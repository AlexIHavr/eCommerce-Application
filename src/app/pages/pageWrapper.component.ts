import BaseComponent from 'shared/base/base.component';

import styles from './pageWrapper.styles.module.scss';

class PageWrapper extends BaseComponent {
  constructor() {
    super({ className: styles.pageWrapper });
  }
}

export default new PageWrapper();
