import { BaseComponent } from 'shared/base/base.component';

import styles from './main.styles.module.scss';

export class Main extends BaseComponent {
  constructor() {
    super({ tag: 'main', className: styles.main, text: 'Main' });
  }
}
