import { SectionTitle } from 'pages/shared/components/sectionTitle/sectionTitle.component';
import { BaseComponent } from 'shared/base/base.component';

import styles from './profile.module.scss';

export class Profile extends BaseComponent {
  constructor() {
    super({ className: styles.profile }, new SectionTitle('Profile'));
  }
}
