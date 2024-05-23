import { Button, Input, Select } from 'globalTypes/elements';
import { FormField } from 'pages/shared/components/formField/formField.component';
import formFieldStyles from 'pages/shared/components/formField/formField.module.scss';
import { COUNTRIES_PROPS, SIGNUP_PROPS } from 'pages/signup/signup.consts';
import { BaseComponent } from 'shared/base/base.component';
import { button, input, option, select, td } from 'shared/tags/tags.component';

import styles from './tableRow.module.scss';
import { TableRowProps } from './tableRow.types';

export class TableRow extends BaseComponent {
  public readonly defaultField: Input;

  public readonly cityField: FormField;

  public readonly streetField: FormField;

  public readonly postalCodeField: FormField;

  public readonly typeField: Select;

  public readonly countryField: Select;

  public readonly deleteBtn: Button;

  public isDefaultAddress: boolean = false;

  public addressId: string;

  constructor(props: TableRowProps, removeRow: (id: string) => void) {
    super({ tag: 'tr', className: `${styles.row} ${formFieldStyles.error}` });
    this.addressId = props.addressId;

    this.defaultField = input({
      className: styles.formCheckbox,
      type: 'checkbox',
      name: `default-${props.type}`,
      checked:
        props.type === 'billing'
          ? props.addressId === props.defaultBilAddress
          : props.addressId === props.defaultShipAddress,
      onclick: () => {
        this.isDefaultAddress = !this.isDefaultAddress;
        console.log('TODO change default');
      },
    });

    this.cityField = new FormField(SIGNUP_PROPS.firstName, props.city);
    this.cityField.getNode().removeChild(this.cityField.getNode().firstChild!);

    this.streetField = new FormField(SIGNUP_PROPS.firstName, props.street);
    this.streetField.getNode().removeChild(this.streetField.getNode().firstChild!);

    this.postalCodeField = new FormField(SIGNUP_PROPS.addressPostalCode, props.postalCode);
    this.postalCodeField.getNode().removeChild(this.postalCodeField.getNode().firstChild!);
    this.postalCodeField.addListener('input', () => this.isPostalCodeValid());

    this.typeField = select(
      {
        className: styles.select,
        name: 'type',
      },
      option({ value: 'billing', text: 'Billing', selected: props.type === 'billing' }),
      option({ value: 'shipping', text: 'Shipping', selected: props.type === 'shipping' }),
    );

    this.countryField = select(
      {
        className: styles.select,
        name: 'country',
        onchange: () => this.isPostalCodeValid(),
      },
      option({
        value: COUNTRIES_PROPS.BY.country,
        text: COUNTRIES_PROPS.BY.title,
        selected: props.country === 'BY',
      }),
      option({
        value: COUNTRIES_PROPS.UA.country,
        text: COUNTRIES_PROPS.UA.title,
        selected: props.country === 'UA',
      }),
    );

    this.deleteBtn = button({
      className: styles.deleteButton,
      text: 'X',
      type: 'button',
      onclick: () => removeRow(props.addressId),
    });

    this.appendChildren([
      td({}, this.defaultField),
      td({}, this.typeField),
      td({}, this.cityField),
      td({}, this.streetField),
      td({}, this.postalCodeField),
      td({}, this.countryField),
      td({}, this.deleteBtn),
    ]);
  }

  private isPostalCodeValid(): boolean {
    const countryValue = this.countryField.getNode().value;
    if (!(countryValue in COUNTRIES_PROPS)) return false;

    const postalCodeValue = this.postalCodeField.value;
    const country = COUNTRIES_PROPS[countryValue as keyof typeof COUNTRIES_PROPS];

    this.postalCodeField.setPattern(`${country.pattern}`);
    this.postalCodeField.setErrorText(`${country.errorText}`);

    return Boolean(postalCodeValue.match(`${country.pattern}`));
  }
}
