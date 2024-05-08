import { Input, Span } from 'globalTypes/elements';
import { BaseComponent } from 'shared/base/base.component';
import { input, span } from 'shared/tags/tags.component';

import styles from './formField.styles.module.scss';

export type LoginFieldProps = {
  name: string;
  type: string;
  labelName: string;
  autocomplete?: AutoFill;
  minLength?: number;
  maxLength?: number;
  placeholder?: string;
  pattern?: string;
  required?: boolean;
  errorText?: string;
};

export class FormField extends BaseComponent {
  private readonly Input: Input;

  private readonly ErrorText: Span;

  private readonly pattern: string;

  constructor(props: LoginFieldProps) {
    super({ tag: 'label', className: styles.formLabel, text: props.labelName });
    this.pattern = props.pattern || '';
    this.Input = input({ className: styles.formInput });
    Object.assign(this.Input.getNode(), props);
    this.ErrorText = span({ className: styles.formErrorText, text: props.errorText });
    this.appendChildren([this.Input, this.ErrorText]);
  }

  public get value(): string {
    return this.Input.getNode().value || '';
  }

  public isValid(): boolean | null {
    return this.value.match(this.pattern) ? true : null;
  }
}
