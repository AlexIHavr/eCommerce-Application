import { Fieldset, Form, Select } from 'globalTypes/elements';
import { NewAddress, NewCustomer } from 'interfaces/api.interface';
import { navigateToMain } from 'pages/pageWrapper.helpers';
import { FormField } from 'pages/shared/components/formField/formField.component';
import formFieldStyles from 'pages/shared/components/formField/formField.module.scss';
import { loginNavLink } from 'pages/shared/components/navLinks/navLinks.component';
import formStyles from 'pages/shared/styles/form-elements.module.scss';
import { apiService } from 'services/api.service';
import { BaseComponent } from 'shared/base/base.component';
import {
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

import { POSTALCODE_PROPS, SIGNUP_PROPS, USER_AVAILABLE_AGE } from './signup.consts';
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

  private isDefaultBilAdr: boolean;

  private isDefaultShipAdr: boolean;

  constructor() {
    super({ className: styles.signupPage });
    this.isSameAddress = false;
    this.isDefaultBilAdr = false;
    this.isDefaultShipAdr = false;

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
    this.bilPostalCodeField.addListener('input', () => this.isPostalCodeValid('billing'));
    this.shipPostalCodeField.addListener('input', () => this.isPostalCodeValid('shipping'));

    this.bilCountryField = select(
      {
        className: styles.select,
        name: 'ship-country',
        onchange: () => this.isPostalCodeValid('billing'),
      },
      option({ value: 'BY', text: 'Belarus' }),
      option({ value: 'UA', text: 'Ukraine' }),
    );

    this.shipCountryField = select(
      {
        className: styles.select,
        name: 'bil-country',
        onchange: () => this.isPostalCodeValid('shipping'),
      },
      option({ value: 'BY', text: 'Belarus' }),
      option({ value: 'UA', text: 'Ukraine' }),
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
              onclick: () => {
                this.isDefaultBilAdr = !this.isDefaultBilAdr;
              },
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
              onclick: () => {
                this.isDefaultShipAdr = !this.isDefaultShipAdr;
              },
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
        loginNavLink(formStyles.formFooterLink),
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
      this.isPostalCodeValid('billing') &&
      this.shipStreetField.isValid() &&
      this.shipCityField.isValid() &&
      this.isPostalCodeValid('shipping')
    ) {
      apiService
        .signupCustomer(this.getNewCustomerFromForm())
        .then(() =>
          apiService.loginCustomer({
            email: this.emailField.value,
            password: this.passwordField.value,
          }),
        )
        .then(() => {
          navigateToMain();
        })
        .catch((res) => {
          // TODO: show errors in form
          console.log(res);
        });
    } else {
      this.signupForm.addClass(formFieldStyles.error);
    }
  }

  private getNewCustomerFromForm(): NewCustomer {
    const newCustomer: NewCustomer = {
      email: this.emailField.value,
      password: this.passwordField.value,
      firstName: this.firstNameField.value,
      lastName: this.lastNameField.value,
      dateOfBirth: this.birthField.value,
      addresses: [],
    };

    const billingAddress: NewAddress = {
      key: 'billing',
      streetName: this.bilStreetField.value,
      city: this.bilCityField.value,
      postalCode: this.bilPostalCodeField.value,
      country: this.bilCountryField.getNode().value,
    };

    const shippingAddress: NewAddress = {
      key: 'shipping',
      streetName: this.shipStreetField.value,
      city: this.shipCityField.value,
      postalCode: this.shipPostalCodeField.value,
      country: this.shipCountryField.getNode().value,
    };

    newCustomer.addresses.push(billingAddress, shippingAddress);

    if (this.isDefaultBilAdr) {
      newCustomer.defaultBillingAddress = 0;
    }

    if (this.isDefaultShipAdr) {
      newCustomer.defaultShippingAddress = 1;
    }

    return newCustomer;
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

  private isPostalCodeValid(address: 'billing' | 'shipping'): boolean {
    let countryInput;
    let postalCodeInput;

    if (address === 'billing') {
      countryInput = this.bilCountryField;
      postalCodeInput = this.bilPostalCodeField;
    } else {
      countryInput = this.shipCountryField;
      postalCodeInput = this.shipPostalCodeField;
    }

    const countryValue = countryInput.getNode().value;
    const postalCodeValue = postalCodeInput.value;
    const country = POSTALCODE_PROPS[countryValue];

    if (!country) return false;
    postalCodeInput.setPattern(`${country.pattern}`);
    postalCodeInput.setErrorText(`${country.errorText}`);

    return Boolean(postalCodeValue.match(`${country.pattern}`));
  }
}
