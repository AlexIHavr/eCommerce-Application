export type LoginFieldProps = {
  name: string;
  type: string;
  labelName: string;
  autocomplete?: AutoFill;
  minLength?: number;
  maxLength?: number;
  max?: string;
  placeholder?: string;
  pattern?: string;
  required?: boolean;
  errorText?: string;
};
