import { Fieldset, Form, Select } from 'globalTypes/elements';
import { FormField } from 'pages/shared/components/formField/formField.component';
import formFieldStyles from 'pages/shared/components/formField/formField.module.scss';
import formStyles from 'pages/shared/styles/form-elements.module.scss';
import { BaseComponent } from 'shared/base/base.component';
import {
  a,
  button,
  div,
  fieldset,
  form,
  h2,
  input,
  label,
  option,
  select,
  span,
} from 'shared/tags/tags.component';

import { SIGNUP_PROPS, USER_AVAILABLE_AGE } from './signup.consts';
import styles from './signup.module.scss';

export class Signup extends BaseComponent {
  private readonly signupForm: Form;

  private readonly emailField: FormField;

  private readonly passwordField: FormField;

  private readonly firstNameField: FormField;

  private readonly lastNameField: FormField;

  private readonly birthField: FormField;

  private readonly bilFieldset: Fieldset;

  private readonly bilStreetField: FormField;

  private readonly bilCityField: FormField;

  private readonly bilPostalCodeField: FormField;

  private readonly bilCountryField: Select;

  private readonly shipFieldset: Fieldset;

  private readonly shipStreetField: FormField;

  private readonly shipCityField: FormField;

  private readonly shipPostalCodeField: FormField;

  private readonly shipCountryField: Select;

  private isSameAddress: boolean;

  constructor() {
    super({ className: styles.signupPage });
    this.isSameAddress = false;

    this.emailField = new FormField(SIGNUP_PROPS.email);
    this.passwordField = new FormField(SIGNUP_PROPS.password);
    this.firstNameField = new FormField(SIGNUP_PROPS.firstname);
    this.lastNameField = new FormField(SIGNUP_PROPS.lastname);
    this.birthField = new FormField(SIGNUP_PROPS.birthDate);
    this.bilStreetField = new FormField(SIGNUP_PROPS.bilStreet);
    this.bilCityField = new FormField(SIGNUP_PROPS.bilCity);
    this.bilPostalCodeField = new FormField(SIGNUP_PROPS.bilPostalCode);
    this.shipStreetField = new FormField(SIGNUP_PROPS.shipStreet);
    this.shipCityField = new FormField(SIGNUP_PROPS.shipCity);
    this.shipPostalCodeField = new FormField(SIGNUP_PROPS.shipPostalCode);

    this.birthField.addListener('input', () => this.isBirthdayValid());

    this.bilCountryField = select(
      { className: styles.select, name: 'ship-country' },
      option({ value: 'Belarus', text: 'Belarus' }),
      option({ value: 'Russia', text: 'Russia' }),
    );

    this.shipCountryField = select(
      { className: styles.select, name: 'bil-country' },
      option({ value: 'Belarus', text: 'Belarus' }),
      option({ value: 'Russia', text: 'Russia' }),
    );

    this.bilFieldset = fieldset(
      { className: styles.billingFieldset },
      span({ className: styles.formText, text: 'Billing' }),
      this.bilStreetField,
      this.bilCityField,
      this.bilPostalCodeField,
      label({ className: formFieldStyles.formLabel, text: 'Country' }),
      this.bilCountryField,
    );

    this.shipFieldset = fieldset(
      { className: styles.shippingFieldset },
      span({ className: styles.formText, text: 'Shipping' }),
      this.shipStreetField,
      this.shipCityField,
      this.shipPostalCodeField,
      label({ className: formFieldStyles.formLabel, text: 'Country' }),
      this.shipCountryField,
    );

    this.signupForm = form(
      { className: styles.signupFormWrapper },
      div(
        { className: styles.userWrapper },
        this.emailField,
        this.passwordField,
        this.firstNameField,
        this.lastNameField,
        this.birthField,
      ),
      div({ className: styles.formText, text: 'Addresses' }),
      label(
        {
          className: styles.checkboxLabel,
          text: 'Set the same for both',
        },
        input({
          className: styles.formCheckbox,
          type: 'checkbox',
          name: 'sameAddress',
          onclick: () => this.sameAddressHandler(),
        }),
      ),
      div({ className: styles.hr }),
      div(
        { className: styles.addressWrapper },
        div(
          {},
          this.bilFieldset,
          label(
            {
              className: styles.checkboxLabel,
              text: 'Set as default address',
            },
            input({
              className: styles.formCheckbox,
              type: 'checkbox',
              name: 'defaultBilling',
              onclick: () => console.log('TODO set default billing'),
            }),
          ),
        ),
        div(
          {},
          this.shipFieldset,
          label(
            {
              className: styles.checkboxLabel,
              text: 'Set as default address',
            },
            input({
              className: styles.formCheckbox,
              type: 'checkbox',
              name: 'defaultShipping',
              onclick: () => console.log('TODO set default shipping'),
            }),
          ),
        ),
      ),
      button({
        className: formStyles.formButton,
        text: 'Signup',
        type: 'submit',
        onclick: (e) => this.submitHandler(e),
      }),
    );

    this.appendChildren([
      h2('Signup', formStyles.formHeader),
      this.signupForm,
      span(
        { className: formStyles.formFooter, text: 'Don`t have an account? ' },
        a({
          className: formStyles.formFooterLink,
          text: 'Login',
          onclick: () => console.log('TODO redirect to LoginPage'),
        }),
      ),
    ]);
  }

  private submitHandler(e: Event): void {
    e.preventDefault();
    if (
      this.emailField.isValid() &&
      this.passwordField.isValid() &&
      this.firstNameField.isValid() &&
      this.lastNameField.isValid() &&
      this.isBirthdayValid() &&
      this.bilStreetField.isValid() &&
      this.bilCityField.isValid() &&
      this.bilPostalCodeField.isValid() &&
      this.shipStreetField.isValid() &&
      this.shipCityField.isValid() &&
      this.shipPostalCodeField.isValid()
    ) {
      console.log('TODO Signup');
    } else {
      this.signupForm.addClass(formFieldStyles.error);
    }
  }

  private isBirthdayValid(): boolean {
    const birth = new Date(this.birthField.value);
    birth.setHours(0);

    const validationDate = new Date();
    validationDate.setFullYear(new Date().getFullYear() - USER_AVAILABLE_AGE);

    if (birth < validationDate) {
      this.birthField.removeAttribute('area-invalid');
      return true;
    }
    this.birthField.setAttribute('area-invalid', 'true');
    return false;
  }

  private sameAddressHandler(): void {
    this.isSameAddress = !this.isSameAddress;
    this.copyAddress();

    if (this.isSameAddress) {
      this.shipFieldset.setAttribute('disabled', '');
      this.bilFieldset.addListener('input', this.copyAddress);
    } else {
      this.shipFieldset.removeAttribute('disabled');
      this.bilFieldset.removeListener('input', this.copyAddress);
    }
  }

  private copyAddress = (): void => {
    this.shipStreetField.value = this.bilStreetField.value;
    this.shipCityField.value = this.bilCityField.value;
    this.shipPostalCodeField.value = this.bilPostalCodeField.value;
    this.shipCountryField.getNode().value = this.bilCountryField.getNode().value;
  };
}
