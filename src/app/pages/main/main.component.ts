import { BaseComponent } from 'shared/base/base.component';
import { h1 } from 'shared/tags/tags.component';

import styles from './main.module.scss';

export class Main extends BaseComponent {
  constructor() {
    super({ tag: 'main', className: styles.main }, h1('Main'));
  }
}
