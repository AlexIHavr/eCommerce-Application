import { BaseComponent } from 'shared/base/base.component';
import { h3 } from 'shared/tags/tags.component';

import styles from './notFound.styles.module.scss';

export class NotFound extends BaseComponent {
  constructor() {
    super({ className: styles.notFound }, h3('Page is not found'));
  }
}
