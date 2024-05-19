import { SectionTitle } from 'pages/shared/components/sectionTitle/sectionTitle.component';
import { BaseComponent } from 'shared/base/base.component';

import styles from './catalog.module.scss';

export class Catalog extends BaseComponent {
  constructor() {
    super({ className: styles.catalog }, new SectionTitle('Catalog'));
  }
}
