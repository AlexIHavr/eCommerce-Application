import { BaseComponent } from 'shared/base/base.component';
import { h2 } from 'shared/tags/tags.component';

import styles from './notFound.module.scss';

export class NotFound extends BaseComponent {
  constructor() {
    super({ className: styles.notFound }, h2('Page is not found'));
  }
}
