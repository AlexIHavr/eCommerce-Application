import { SectionTitle } from 'pages/shared/components/sectionTitle/sectionTitle.component';
import { apiService } from 'services/api.service';
import { LocalStorageService } from 'services/localStorage.service';
import { BaseComponent } from 'shared/base/base.component';
import { loader } from 'shared/loader/loader.component';
import { div } from 'shared/tags/tags.component';

import { makeProfileProps } from './profile.helpers';
import styles from './profile.module.scss';
import { ProfileInfo } from './profileContent/profileInfo.component';
import { ProfileInfoProps } from './profileContent/profileInfo.types';

export class Profile extends BaseComponent {
  private readonly contentWrapper = div({});

  constructor() {
    super({ className: styles.profilePage }, new SectionTitle('Profile'));

    this.append(this.contentWrapper);
    this.getCustomer();
  }

  private getCustomer(): void {
    this.contentWrapper.destroyChildren();
    loader.open();

    const customerId = LocalStorageService.getData('customerId');

    if (customerId) {
      apiService.getCustomerById(customerId).then((data) => {
        const props = makeProfileProps(data.body);
        this.render(props);
      });
    } else {
      this.showNoUserError();
    }
  }

  private render(customerProps: ProfileInfoProps): void {
    this.contentWrapper.append(new ProfileInfo(customerProps));
    loader.close();
  }

  private showNoUserError(): void {
    this.contentWrapper.append(
      div({ className: styles.noUserError, text: 'No such user. Please, relogin' }),
    );
    loader.close();
  }
}
