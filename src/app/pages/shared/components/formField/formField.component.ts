import { Div, Input, Span } from 'globalTypes/elements';
import { BaseComponent } from 'shared/base/base.component';
import { div, input, span } from 'shared/tags/tags.component';

import styles from './formField.module.scss';
import { LoginFieldProps } from './formField.types';

export class FormField extends BaseComponent {
  private readonly input: Input;

  private readonly errorText: Span;

  private passwordButton: Div | null;

  private readonly pattern: string;

  constructor(props: LoginFieldProps) {
    super({ tag: 'label', className: styles.formLabel, text: props.labelName });

    this.pattern = props.pattern || '';
    this.input = input({ ...props, className: styles.formInput });
    this.errorText = span({ className: styles.formErrorText, text: props.errorText });
    this.passwordButton = null;
    this.appendChildren([this.input, this.errorText]);

    if (props.type === 'password') this.addPasswordButton();
  }

  public get value(): string {
    return this.input.getNode().value || '';
  }

  public set value(text: string) {
    this.input.getNode().value = text;
  }

  public isValid(): boolean {
    return Boolean(this.value.match(this.pattern));
  }

  private addPasswordButton(): void {
    this.passwordButton = div({
      className: styles.btnPassVis,
      onclick: () => this.togglePasswordVisibility(),
    });
    this.append(this.passwordButton);
  }

  private togglePasswordVisibility(): void {
    this.passwordButton?.toggleClass(styles.open);
    const currentType = this.input.getAttribute('type');
    const newType = currentType === 'password' ? 'text' : 'password';
    this.input.setAttribute('type', newType);
  }
}
