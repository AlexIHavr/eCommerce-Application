import { SectionTitle } from 'pages/shared/components/sectionTitle/sectionTitle.component';
import { apiService } from 'services/api.service';
import { LocalStorageService } from 'services/localStorage.service';
import { BaseComponent } from 'shared/base/base.component';
import { loader } from 'shared/loader/loader.component';
import { div } from 'shared/tags/tags.component';

import styles from './profile.module.scss';
import { ProfileInfo } from './profileContent/profileInfo.component';
import { ProfileInfoProps } from './profileContent/profileInfo.types';

export class Profile extends BaseComponent {
  private readonly contentWrapper = div({});

  constructor() {
    super({ className: styles.profilePage }, new SectionTitle('Profile'));

    this.append(this.contentWrapper);
    loader.open();
    this.getCustomer();
  }

  private getCustomer(): void {
    const customerId = LocalStorageService.getData('customerId');
    if (customerId) {
      apiService.getCustomerById(customerId).then((data) => {
        const customerInfo = data.body;
        const customerAddresses = customerInfo.addresses.map((addr) => {
          const address = {
            type: addr.key,
            city: addr.city,
            street: addr.streetName,
            postalCode: addr.postalCode,
            country: addr.country,
            addressId: addr.id,
            defaultBilAddress: '',
            defaultShipAddress: '',
          };

          if (customerInfo.defaultBillingAddressId)
            address.defaultBilAddress = customerInfo.defaultBillingAddressId;
          if (customerInfo.defaultShippingAddressId)
            address.defaultShipAddress = customerInfo.defaultShippingAddressId;
          return address;
        });

        const user = {
          firstName: customerInfo.firstName,
          lastName: customerInfo.lastName,
          email: customerInfo.email,
          dateOfBirth: customerInfo.dateOfBirth,
          addresses: customerAddresses,
        };

        this.render(user as ProfileInfoProps);
      });
    } else {
      this.loadUserError();
    }
  }

  private render(customerProps: ProfileInfoProps): void {
    this.contentWrapper.destroyChildren();
    this.contentWrapper.append(new ProfileInfo(customerProps));
    loader.close();
  }

  private loadUserError(): void {
    this.contentWrapper.append(
      div({ className: styles.noUserError, text: 'No such user. Please, relogin' }),
    );
    loader.close();
  }
}
