import { SectionTitle } from 'pages/shared/components/sectionTitle/sectionTitle.component';
import { BaseComponent } from 'shared/base/base.component';

import styles from './about.module.scss';

export class About extends BaseComponent {
  constructor() {
    super({ className: styles.about }, new SectionTitle('About'));
  }
}
