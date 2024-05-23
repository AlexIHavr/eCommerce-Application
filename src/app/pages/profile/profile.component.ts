import { Div, Form, Table } from 'globalTypes/elements';
import { FormField } from 'pages/shared/components/formField/formField.component';
import formFieldStyles from 'pages/shared/components/formField/formField.module.scss';
import { SectionTitle } from 'pages/shared/components/sectionTitle/sectionTitle.component';
import sharedStyles from 'pages/shared/styles/common.module.scss';
import formStyles from 'pages/shared/styles/formElements.module.scss';
import { SIGNUP_PROPS, USER_AVAILABLE_AGE } from 'pages/signup/signup.consts';
import { BaseComponent } from 'shared/base/base.component';
import { button, div, form, table, td, tr } from 'shared/tags/tags.component';

import styles from './profile.module.scss';
import { TableRow } from './tableRow/tableRow.component';
import { TableRowProps } from './tableRow/tableRow.types';

const MOCK = {
  firstname: 'Firstname',
  lastname: 'Lastname',
  email: 'dimatest@dimatest.com',
  birthDate: '2024-05-22',
};

const ADDRESS_MOCK_1: TableRowProps = {
  type: 'shipping',
  city: 'Cityname',
  street: 'Streetname',
  postalCode: '222111',
  country: 'BY',
  addressId: 'mock_ship_id',
  defaultBilAddress: '',
  defaultShipAddress: 'mock_ship_id',
};

const ADDRESS_MOCK_2: TableRowProps = {
  type: 'billing',
  city: 'City',
  street: 'Street',
  postalCode: '111222',
  country: 'UA',
  addressId: 'mock_bill_id',
  defaultBilAddress: '',
  defaultShipAddress: '',
};

const ADDRESS_MOCK_3: TableRowProps = {
  type: 'billing',
  city: 'Asdasdasda',
  street: 'Asdasd',
  postalCode: '01234',
  country: 'UA',
  addressId: 'test',
  defaultBilAddress: 'test',
  defaultShipAddress: '',
};

export class Profile extends BaseComponent {
  private readonly profileWrapper: Div;

  private readonly userInfoForm: Form;

  private readonly addressTable: Table;

  private readonly firstNameField: FormField;

  private readonly lastNameField: FormField;

  private readonly emailField: FormField;

  private readonly birthField: FormField;

  private addresses: TableRow[];

  private counter = 0;

  constructor() {
    super({ className: styles.profilePage }, new SectionTitle('Profile'));
    this.addresses = [];

    this.firstNameField = new FormField(SIGNUP_PROPS.firstName, MOCK.firstname);
    this.lastNameField = new FormField(SIGNUP_PROPS.lastName, MOCK.lastname);
    this.emailField = new FormField(SIGNUP_PROPS.email, MOCK.email);
    this.birthField = new FormField(SIGNUP_PROPS.birthDate, MOCK.birthDate);
    this.birthField.addListener('input', () => this.birthField.isBirthdayValid(USER_AVAILABLE_AGE));

    this.userInfoForm = form(
      { className: `${styles.userInfoForm} ${formFieldStyles.error}` },
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

    this.profileWrapper = div(
      { className: `${styles.profileWrapper} ${formFieldStyles.noEdit}` },
      this.userInfoForm,
      div(
        { className: styles.addressWrapper },
        div({ className: styles.tableTitle, text: 'Addresses' }),
        this.addressTable,
        button({
          className: `${formStyles.formButton} ${styles.rowAddBtn}`,
          text: '+ Add',
          type: 'button',
          onclick: () => this.addNewRowAddress(),
        }),
      ),
    );

    this.appendChildren([
      div(
        { className: sharedStyles.container },
        this.profileWrapper,
        button({
          className: `${formStyles.formButton} ${styles.startEditBtn}`,
          text: 'Edit',
          type: 'button',
          onclick: () => this.startEdit(),
        }),
      ),
    ]);

    // TEST
    const address1 = new TableRow(
      ADDRESS_MOCK_1,
      this.deleteRowAddress.bind(this),
      this.defaultHandler.bind(this),
    );
    const address2 = new TableRow(
      ADDRESS_MOCK_2,
      this.deleteRowAddress.bind(this),
      this.defaultHandler.bind(this),
    );
    const address3 = new TableRow(
      ADDRESS_MOCK_3,
      this.deleteRowAddress.bind(this),
      this.defaultHandler.bind(this),
    );
    this.addressTable.appendChildren([address1, address2, address3]);
    this.addresses.push(address1, address2, address3);
  }

  private startEdit(): void {
    this.profileWrapper.toggleClass(formFieldStyles.noEdit);
  }

  private addNewRowAddress(): void {
    const emptyProps: TableRowProps = {
      type: 'billing',
      city: '',
      street: '',
      postalCode: '',
      country: 'BY',
      addressId: `newAddress${this.counter}`,
    };
    const newAddress = new TableRow(
      emptyProps,
      this.deleteRowAddress.bind(this),
      this.defaultHandler.bind(this),
    );

    this.addressTable.append(newAddress);
    this.addresses.push(newAddress);
    this.counter += 1;
  }

  private deleteRowAddress(id: string): void {
    const delAddrIndex = this.addresses.findIndex((address) => address.addressId === id);
    this.addresses[delAddrIndex].destroy();
    this.addresses.splice(delAddrIndex, 1);
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
