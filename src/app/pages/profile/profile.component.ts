import { CustomerUpdateAction } from '@commercetools/platform-sdk';
import { SectionTitle } from 'pages/shared/components/sectionTitle/sectionTitle.component';
import { apiService } from 'services/api.service';
import { LocalStorageService } from 'services/localStorage.service';
import { alertModal } from 'shared/alert/alert.component';
import { BaseComponent } from 'shared/base/base.component';
import { loader } from 'shared/loader/loader.component';
import { div } from 'shared/tags/tags.component';

import { NO_USER_ERROR, SUCCESS_USER_UPDATE } from './profile.consts';
import { makeProfileProps } from './profile.helpers';
import styles from './profile.module.scss';
import { ProfileInfo } from './profileContent/profileInfo.component';
import { ProfileInfoProps } from './profileContent/profileInfo.types';

export class Profile extends BaseComponent {
  private readonly contentWrapper = div({});

  private profileInfo: ProfileInfo | null;

  constructor() {
    super({ className: styles.profilePage }, new SectionTitle('Profile'));
    this.profileInfo = null;

    this.append(this.contentWrapper);
    this.getCustomer();
  }

  private getCustomer(): void {
    this.contentWrapper.destroyChildren();
    this.profileInfo = null;
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
    this.profileInfo = new ProfileInfo(
      customerProps,
      this.saveChangesHandler.bind(this),
      this.cancelEditHandler.bind(this),
    );
    this.contentWrapper.append(this.profileInfo);
    loader.close();
  }

  private showNoUserError(): void {
    this.contentWrapper.append(div({ className: styles.noUserError, text: NO_USER_ERROR }));
    loader.close();
  }

  private cancelEditHandler(): void {
    this.getCustomer();
  }

  private async saveChangesHandler(actions: CustomerUpdateAction[]): Promise<void> {
    let actualVersion;
    const actionNewAddr = actions.filter((a) => a.action === 'addAddress');

    if (actionNewAddr.length > 0) {
      const customerId = LocalStorageService.getData('customerId');
      if (customerId) {
        const user = await apiService.getCustomerById(customerId);
        actualVersion = user.body.version;
        const upduser = await apiService.updateCustomerInfo(
          customerId,
          actualVersion,
          actionNewAddr,
        );
        actualVersion = upduser.body.version;
        console.log(upduser.body.addresses);
        console.log(actions);
        const newActions = this.profileInfo?.getActionsForApi(upduser.body.addresses);
        console.log(newActions);
      } else {
        this.contentWrapper.destroyChildren();
        this.profileInfo = null;
        this.showNoUserError();
      }
    }
    console.log('posle');

    // const customerId = LocalStorageService.getData('customerId');

    // if (customerId) {
    //   apiService.getCustomerById(customerId).then((data) => {
    //     const { version } = data.body;
    //     apiService
    //       .updateCustomerInfo(customerId, version, actions)
    //       .then(() => alertModal.showAlert('success', SUCCESS_USER_UPDATE))
    //       .then(() => this.getCustomer());
    //   });
    // } else {
    //   this.contentWrapper.destroyChildren();
    //   this.profileInfo = null;
    //   this.showNoUserError();
    // }
    console.log(alertModal);
    console.log(SUCCESS_USER_UPDATE);
  }
}
