import {
  Customer,
  CustomerChangePassword,
  CustomerUpdateAction,
} from '@commercetools/platform-sdk';
import { SectionTitle } from 'pages/shared/components/sectionTitle/sectionTitle.component';
import { apiService } from 'services/api.service';
import { LocalStorageService } from 'services/localStorage.service';
import { alertModal } from 'shared/alert/alert.component';
import { BaseComponent } from 'shared/base/base.component';
import { loader } from 'shared/loader/loader.component';
import { div } from 'shared/tags/tags.component';

import {
  FAIL_PASSWORD_UPDATE,
  FAIL_USER_UPDATE,
  NO_USER_ERROR,
  SUCCESS_PASSWORD_UPDATE,
  SUCCESS_USER_UPDATE,
} from './profile.consts';
import { makeProfileProps } from './profile.helpers';
import styles from './profile.module.scss';
import { ProfileInfo } from './profileContent/profileInfo.component';
import { PasswordProps, ProfileInfoProps } from './profileContent/profileInfo.types';

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
        this.render(props, data.body);
      });
    } else {
      this.showNoUserError();
    }
  }

  private render(customerProps: ProfileInfoProps, data: Customer): void {
    this.profileInfo = new ProfileInfo(
      customerProps,
      data,
      this.saveChangesHandler.bind(this),
      this.cancelEditHandler.bind(this),
      this.passwordUpdateHandler.bind(this),
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
    let version;
    let currentActions = actions.slice();

    const actionAddAddr = currentActions.filter((obj) => obj.action === 'addAddress');
    const customerId = LocalStorageService.getData('customerId');

    if (customerId) {
      const customer = await apiService.getCustomerById(customerId);
      version = customer.body.version;

      if (actionAddAddr.length > 0) {
        const updatedInfo = await apiService.updateCustomerInfo(customerId, version, actionAddAddr);
        version = updatedInfo.body.version;

        if (this.profileInfo) currentActions = this.profileInfo.getActionsForApi(updatedInfo.body);
      }

      try {
        await apiService.updateCustomerInfo(customerId, version, currentActions);
        alertModal.showAlert('success', SUCCESS_USER_UPDATE);
        this.getCustomer();
      } catch (error) {
        alertModal.showAlert('error', FAIL_USER_UPDATE);
      }
    } else {
      this.contentWrapper.destroyChildren();
      this.profileInfo = null;
      this.showNoUserError();
    }
  }

  private async passwordUpdateHandler(password: PasswordProps): Promise<void> {
    loader.open();

    const customerId = LocalStorageService.getData('customerId');
    if (customerId) {
      const data = await apiService.getCustomerById(customerId);

      const body: CustomerChangePassword = {
        id: data.body.id,
        version: data.body.version,
        currentPassword: password.currentPassword,
        newPassword: password.newPassword,
      };

      apiService
        .updateCustomerPassword(body)
        .then(() => alertModal.showAlert('success', SUCCESS_PASSWORD_UPDATE))
        .catch(() => alertModal.showAlert('error', FAIL_PASSWORD_UPDATE))
        .finally(() => loader.close());
    } else {
      this.contentWrapper.destroyChildren();
      this.profileInfo = null;
      this.showNoUserError();
    }
  }
}
