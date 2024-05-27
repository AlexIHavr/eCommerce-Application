import { Customer, CustomerUpdateAction } from '@commercetools/platform-sdk';
import { Button, Div, Form, Table } from 'globalTypes/elements';
import { PasswordChange } from 'pages/profile/passwordChange/passwordChange.component';
import { INVALID_DATA_WARNING } from 'pages/profile/profile.consts';
import { TableRow } from 'pages/profile/tableRow/tableRow.component';
import { TableRowProps } from 'pages/profile/tableRow/tableRow.types';
import { FormField } from 'pages/shared/components/formField/formField.component';
import formFieldStyles from 'pages/shared/components/formField/formField.module.scss';
import sharedStyles from 'pages/shared/styles/common.module.scss';
import formStyles from 'pages/shared/styles/formElements.module.scss';
import { SIGNUP_PROPS, USER_AVAILABLE_AGE } from 'pages/signup/signup.consts';
import { alertModal } from 'shared/alert/alert.component';
import { BaseComponent } from 'shared/base/base.component';
import { button, div, form, table, td, tr } from 'shared/tags/tags.component';

import styles from './profileInfo.module.scss';
import { PasswordProps, ProfileInfoProps } from './profileInfo.types';

export class ProfileInfo extends BaseComponent {
  private readonly profileWrapper: Div;

  private readonly userInfoForm: Form;

  private readonly userAddressForm: Form;

  private readonly addressTable: Table;

  private readonly firstNameField: FormField;

  private readonly lastNameField: FormField;

  private readonly emailField: FormField;

  private readonly birthField: FormField;

  private readonly saveChangesBtn: Button;

  private readonly allCustomerData: Customer;

  private addresses: TableRow[];

  private newAddressCounter = 0;

  constructor(
    props: ProfileInfoProps,
    allCustomerData: Customer,
    saveChangesHandler: (actions: CustomerUpdateAction[]) => void,
    cancelEditHandler: () => void,
    passwordUpdateHandler: (data: PasswordProps) => void,
  ) {
    super({ className: sharedStyles.container });
    this.allCustomerData = allCustomerData;
    this.addresses = [];

    this.firstNameField = new FormField(SIGNUP_PROPS.firstName, props.firstName);
    this.lastNameField = new FormField(SIGNUP_PROPS.lastName, props.lastName);
    this.emailField = new FormField(SIGNUP_PROPS.email, props.email);
    this.birthField = new FormField(SIGNUP_PROPS.birthDate, props.dateOfBirth);
    this.birthField.addListener('input', () => this.birthField.isBirthdayValid(USER_AVAILABLE_AGE));

    this.userInfoForm = form(
      {
        className: `${styles.userInfoForm} ${formFieldStyles.error}`,
        oninput: () => {
          this.saveChangesBtn.removeAttribute('disabled');
        },
      },
      this.firstNameField,
      this.lastNameField,
      this.emailField,
      this.birthField,
    );

    this.addressTable = table(
      { className: styles.table },
      tr(
        { className: styles.tableHeader },
        td({ text: 'Default' }),
        td({ text: 'Type' }),
        td({ text: 'City' }),
        td({ text: 'Street' }),
        td({ text: 'Code' }),
        td({ text: 'Country' }),
        td({ text: 'Delete' }),
      ),
    );

    this.userAddressForm = form(
      {
        className: styles.userAddressForm,
        oninput: () => {
          this.saveChangesBtn.removeAttribute('disabled');
        },
      },
      div({ className: styles.tableTitle, text: 'Addresses' }),
      this.addressTable,
      button({
        className: `${formStyles.formButton} ${styles.rowAddBtn}`,
        text: 'Add',
        type: 'button',
        onclick: () => this.addNewRowAddress(),
      }),
    );

    this.profileWrapper = div(
      { className: `${styles.profileWrapper} ${formFieldStyles.noEdit}` },
      this.userInfoForm,
      this.userAddressForm,
    );

    this.saveChangesBtn = button({
      className: `${formStyles.formButton} ${styles.saveEditBtn}`,
      text: 'Save changes',
      type: 'button',
      disabled: true,
      onclick: () => {
        if (this.isProfileInfoValid()) {
          const actions = this.getActionsForApi();
          saveChangesHandler(actions);
        } else {
          alertModal.showAlert('attention', INVALID_DATA_WARNING);
        }
      },
    });

    this.appendChildren([
      this.profileWrapper,
      div(
        { className: styles.btnWrapper },
        button({
          className: `${formStyles.formButton} ${styles.passwordEditBtn}`,
          text: 'Change password',
          type: 'button',
          onclick: () => this.append(new PasswordChange(passwordUpdateHandler)),
        }),
        div(
          { className: styles.saveCancelWrapper },
          this.saveChangesBtn,
          button({
            className: `${formStyles.formButton} ${styles.cancelEditBtn}`,
            text: 'Cancel',
            type: 'button',
            onclick: () => {
              if (this.saveChangesBtn.getAttribute('disabled') === null) {
                cancelEditHandler();
              } else {
                this.stopEdit();
              }
            },
          }),
        ),
        button({
          className: `${formStyles.formButton} ${styles.startEditBtn}`,
          text: 'Edit',
          type: 'button',
          onclick: () => this.startEdit(),
        }),
      ),
    ]);

    this.renderAddresses(props.addresses);
  }

  private startEdit(): void {
    this.profileWrapper.removeClass(formFieldStyles.noEdit);
    this.profileWrapper.addClass(styles.edit);
  }

  private stopEdit(): void {
    this.profileWrapper.addClass(formFieldStyles.noEdit);
    this.profileWrapper.removeClass(styles.edit);
    this.saveChangesBtn.setAttribute('disabled', '');
  }

  private renderAddresses(addresses: TableRowProps[]): void {
    this.addressTable.appendChildren(
      addresses.map((addr) => {
        const customerAddress = new TableRow(
          addr,
          this.deleteRowAddress.bind(this),
          this.defaultHandler.bind(this),
        );
        this.addresses.push(customerAddress);
        return customerAddress;
      }),
    );
  }

  private addNewRowAddress(): void {
    const emptyProps: TableRowProps = {
      type: 'billing',
      city: '',
      street: '',
      postalCode: '',
      country: 'BY',
      addressId: `newAddress${this.newAddressCounter}`,
    };
    const newAddress = new TableRow(
      emptyProps,
      this.deleteRowAddress.bind(this),
      this.defaultHandler.bind(this),
    );

    this.addressTable.append(newAddress);
    this.addresses.push(newAddress);
    this.newAddressCounter += 1;
  }

  private deleteRowAddress(id: string): void {
    const delAddr = this.addresses.find((address) => address.addressId === id);
    if (delAddr?.addressId.startsWith('newAddress')) {
      const delAddrIndex = this.addresses.findIndex((address) => address.addressId === id);
      this.addresses.splice(delAddrIndex, 1);
    } else if (delAddr) delAddr.addressId = `deleteAddress${delAddr?.addressId}`;
    delAddr?.destroy();
    this.saveChangesBtn.removeAttribute('disabled');
  }

  private defaultHandler(id: string): void {
    const defaultAddress = this.addresses.find((address) => address.addressId === id);
    this.addresses
      .filter((addr) => addr.type === defaultAddress?.type)
      .forEach((addr) => {
        if (addr !== defaultAddress) addr.resetDefault();
      });
  }

  private isProfileInfoValid(): boolean {
    return (
      this.firstNameField.isValid() &&
      this.lastNameField.isValid() &&
      this.emailField.isValid() &&
      this.birthField.isBirthdayValid(USER_AVAILABLE_AGE) &&
      this.addresses.every((addr) => addr.isRowAddressValid())
    );
  }

  public getActionsForApi(customer?: Customer): CustomerUpdateAction[] {
    const addrToAdd = this.addresses.filter((addr) => addr.addressId.startsWith('newAddress'));

    // If there are new addresses to add
    if (addrToAdd.length > 0 && !customer) {
      const addressActionsArr: CustomerUpdateAction[] = addrToAdd.map((addr) => {
        const address = {
          city: addr.cityField.value,
          streetName: addr.streetField.value,
          postalCode: addr.postalCodeField.value,
          country: addr.countryField.getNode().value,
        };

        return {
          action: 'addAddress',
          address,
        };
      });

      return addressActionsArr;
    }

    const addressActionsArr: CustomerUpdateAction[][] = this.addresses.map((addr, index) => {
      const actions: CustomerUpdateAction[] = [];

      const address = {
        city: addr.cityField.value,
        streetName: addr.streetField.value,
        postalCode: addr.postalCodeField.value,
        country: addr.countryField.getNode().value,
      };

      if (addr.addressId.startsWith('deleteAddress')) {
        const originalAddrId = addr.addressId.replace('deleteAddress', '');
        actions.push({
          action: 'removeAddress',
          addressId: originalAddrId,
        });
      } else if (!addr.addressId.startsWith('newAddress')) {
        actions.push({
          action: 'changeAddress',
          addressId: addr.addressId,
          address,
        });
      }

      if (!addr.addressId.startsWith('deleteAddress')) {
        if (customer) {
          // This block executes if new addresses had been added and IDs were assigned
          const { id } = customer.addresses[index];
          actions.push({
            action: addr.type === 'billing' ? 'addBillingAddressId' : 'addShippingAddressId',
            addressId: id,
          });
          if (addr.type === 'billing' && customer.shippingAddressIds?.includes(id!)) {
            actions.push({
              action: 'removeShippingAddressId',
              addressId: id,
            });
          }
          if (addr.type === 'shipping' && customer.billingAddressIds?.includes(id!)) {
            actions.push({
              action: 'removeBillingAddressId',
              addressId: id,
            });
          }
          if (addr.isDefaultAddress) {
            actions.push({
              action:
                addr.type === 'billing' ? 'setDefaultBillingAddress' : 'setDefaultShippingAddress',
              addressId: id,
            });
          }
        } else {
          // This block executes if changes not included adding new addresses and all IDs are known
          actions.push({
            action: addr.type === 'billing' ? 'addBillingAddressId' : 'addShippingAddressId',
            addressId: addr.addressId,
          });
          if (
            addr.type === 'billing' &&
            this.allCustomerData.shippingAddressIds?.includes(addr.addressId)
          ) {
            actions.push({
              action: 'removeShippingAddressId',
              addressId: addr.addressId,
            });
          }
          if (
            addr.type === 'shipping' &&
            this.allCustomerData.billingAddressIds?.includes(addr.addressId)
          ) {
            actions.push({
              action: 'removeBillingAddressId',
              addressId: addr.addressId,
            });
          }
          if (addr.isDefaultAddress) {
            actions.push({
              action:
                addr.type === 'billing' ? 'setDefaultBillingAddress' : 'setDefaultShippingAddress',
              addressId: addr.addressId,
            });
          }
        }
      }

      return actions;
    });

    return [
      {
        action: 'setFirstName',
        firstName: this.firstNameField.value,
      },
      {
        action: 'setLastName',
        lastName: this.lastNameField.value,
      },
      {
        action: 'changeEmail',
        email: this.emailField.value,
      },
      {
        action: 'setDateOfBirth',
        dateOfBirth: this.birthField.value,
      },
      // Clear default addresses to reassign them later if needed
      {
        action: 'setDefaultBillingAddress',
        addressId: undefined,
      },
      {
        action: 'setDefaultShippingAddress',
        addressId: undefined,
      },
      ...addressActionsArr.flat(),
    ];
  }
}
