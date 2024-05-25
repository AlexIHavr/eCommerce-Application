import { SectionTitle } from 'pages/shared/components/sectionTitle/sectionTitle.component';
import { BaseComponent } from 'shared/base/base.component';
import { loader } from 'shared/loader/loader.component';
import { div } from 'shared/tags/tags.component';

import styles from './profile.module.scss';
import { ProfileInfo } from './profileContent/profileInfo.component';

export class Profile extends BaseComponent {
  private readonly contentWrapper = div({});

  constructor() {
    super({ className: styles.profilePage }, new SectionTitle('Profile'));
    this.append(this.contentWrapper);

    loader.open();
    this.render();
  }

  private render(): void {
    this.contentWrapper.destroyChildren();
    this.contentWrapper.append(new ProfileInfo());
    loader.close();
  }
}
