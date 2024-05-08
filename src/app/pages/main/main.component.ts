import { BaseComponent } from 'shared/base/base.component';
import { h2 } from 'shared/tags/tags.component';

import styles from './main.styles.module.scss';

export class Main extends BaseComponent {
  constructor() {
    super({ tag: 'main', className: styles.main }, h2('Main'));
  }
}
