import { Form } from 'globalTypes/elements';
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

import { REGISTRATION_PROPS, USER_AVAILABLE_AGE } from './registration.consts';
import styles from './registration.module.scss';

export class Registration extends BaseComponent {
  private readonly signupForm: Form;

  private readonly emailField: FormField;

  private readonly passwordField: FormField;

  private readonly firstNameField: FormField;

  private readonly lastNameField: FormField;

  private readonly birthField: FormField;

  private readonly bilStreetField: FormField;

  private readonly bilCityField: FormField;

  private readonly bilPostalCodeField: FormField;

  private readonly bilCountryField: BaseComponent;

  private readonly shipStreetField: FormField;

  private readonly shipCityField: FormField;

  private readonly shipPostalCodeField: FormField;

  private readonly shipCountryField: BaseComponent;

  constructor() {
    super({ className: styles.signupPage });

    this.emailField = new FormField(REGISTRATION_PROPS.email);
    this.passwordField = new FormField(REGISTRATION_PROPS.password);
    this.firstNameField = new FormField(REGISTRATION_PROPS.firstname);
    this.lastNameField = new FormField(REGISTRATION_PROPS.lastname);
    this.birthField = new FormField(REGISTRATION_PROPS.birthDate);
    this.bilStreetField = new FormField(REGISTRATION_PROPS.bilStreet);
    this.bilCityField = new FormField(REGISTRATION_PROPS.bilCity);
    this.bilPostalCodeField = new FormField(REGISTRATION_PROPS.bilPostalCode);
    this.shipStreetField = new FormField(REGISTRATION_PROPS.shipStreet);
    this.shipCityField = new FormField(REGISTRATION_PROPS.shipCity);
    this.shipPostalCodeField = new FormField(REGISTRATION_PROPS.shipPostalCode);

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
          onclick: () => console.log('TODO same address click'),
        }),
      ),
      div({ className: styles.hr }),
      div(
        { className: styles.addressWrapper },
        div(
          {},
          fieldset(
            { className: styles.billingFieldset },
            span({ className: styles.formText, text: 'Billing' }),
            this.bilStreetField,
            this.bilCityField,
            this.bilPostalCodeField,
            label({ className: formFieldStyles.formLabel, text: 'Country' }),
            this.bilCountryField,
          ),
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
          fieldset(
            { className: styles.shippingFieldset },
            span({ className: styles.formText, text: 'Shipping' }),
            this.shipStreetField,
            this.shipCityField,
            this.shipPostalCodeField,
            label({ className: formFieldStyles.formLabel, text: 'Country' }),
            this.shipCountryField,
          ),
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
    if (this.emailField.isValid() && this.passwordField.isValid()) {
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
}
