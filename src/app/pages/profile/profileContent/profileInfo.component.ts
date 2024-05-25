import { Button, Div, Form, Table } from 'globalTypes/elements';
import { PasswordChange } from 'pages/profile/passwordChange/passwordChange.component';
import { TableRow } from 'pages/profile/tableRow/tableRow.component';
import { TableRowProps } from 'pages/profile/tableRow/tableRow.types';
import { FormField } from 'pages/shared/components/formField/formField.component';
import formFieldStyles from 'pages/shared/components/formField/formField.module.scss';
import sharedStyles from 'pages/shared/styles/common.module.scss';
import formStyles from 'pages/shared/styles/formElements.module.scss';
import { SIGNUP_PROPS, USER_AVAILABLE_AGE } from 'pages/signup/signup.consts';
import { BaseComponent } from 'shared/base/base.component';
import { button, div, form, table, td, tr } from 'shared/tags/tags.component';

import styles from './profileInfo.module.scss';
import { ProfileInfoProps } from './profileInfo.types';

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

  private addresses: TableRow[];

  private newAddressCounter = 0;

  constructor(props: ProfileInfoProps) {
    super({ className: sharedStyles.container });
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
        td({ text: 'Street' }),
        td({ text: 'City' }),
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
      onclick: () => console.log('TODO SAVE CHANGES'),
    });

    this.appendChildren([
      this.profileWrapper,
      div(
        { className: styles.btnWrapper },
        button({
          className: `${formStyles.formButton} ${styles.passwordEditBtn}`,
          text: 'Change password',
          type: 'button',
          onclick: () => this.append(new PasswordChange()),
        }),
        div(
          { className: styles.saveCancelWrapper },
          this.saveChangesBtn,
          button({
            className: `${formStyles.formButton} ${styles.cancelEditBtn}`,
            text: 'Cancel',
            type: 'button',
            onclick: () => this.stopEdit(),
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
    const delAddrIndex = this.addresses.findIndex((address) => address.addressId === id);
    this.addresses[delAddrIndex].destroy();
    this.addresses.splice(delAddrIndex, 1);
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
}
