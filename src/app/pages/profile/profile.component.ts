import { Div, Form } from 'globalTypes/elements';
import { FormField } from 'pages/shared/components/formField/formField.component';
import formFieldStyles from 'pages/shared/components/formField/formField.module.scss';
import { SectionTitle } from 'pages/shared/components/sectionTitle/sectionTitle.component';
import sharedStyles from 'pages/shared/styles/common.module.scss';
import formStyles from 'pages/shared/styles/formElements.module.scss';
import { SIGNUP_PROPS } from 'pages/signup/signup.consts';
import { BaseComponent } from 'shared/base/base.component';
import { button, div, form } from 'shared/tags/tags.component';

import styles from './profile.module.scss';

const MOCK = {
  firstname: 'Firstname',
  lastname: 'Lastname',
  email: 'dimatest@dimatest.com',
  birthDate: '2024-05-22',
};

export class Profile extends BaseComponent {
  private readonly profileWrapper: Div;

  private readonly userInfoForm: Form;

  private readonly firstNameField: FormField;

  private readonly lastNameField: FormField;

  private readonly emailField: FormField;

  private readonly birthField: FormField;

  constructor() {
    super({ className: styles.profilePage }, new SectionTitle('Profile'));

    this.firstNameField = new FormField(SIGNUP_PROPS.firstName, MOCK.firstname);
    this.lastNameField = new FormField(SIGNUP_PROPS.lastName, MOCK.lastname);
    this.emailField = new FormField(SIGNUP_PROPS.email, MOCK.email);
    this.birthField = new FormField(SIGNUP_PROPS.birthDate, MOCK.birthDate);

    this.userInfoForm = form(
      { className: `${styles.userInfoForm} ${formFieldStyles.error}` },
      this.firstNameField,
      this.lastNameField,
      this.emailField,
      this.birthField,
    );

    this.profileWrapper = div(
      { className: `${styles.profileWrapper} ${formFieldStyles.noEdit}` },
      this.userInfoForm,
      button({
        className: `${formStyles.formButton} ${styles.startEditBtn}`,
        text: 'Edit',
        type: 'button',
        onclick: () => this.startEdit(),
      }),
    );

    this.appendChildren([div({ className: sharedStyles.container }, this.profileWrapper)]);
  }

  private startEdit(): void {
    this.profileWrapper.removeClass(formFieldStyles.noEdit);
  }
}
