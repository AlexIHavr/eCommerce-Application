import './tags.styles.scss';

import { Anchor, Button, Div, Heading, Input } from 'globalTypes/elements';
import { BaseComponent } from 'shared/base/base.component';
import { Props } from 'shared/base/base.types';

type TagProps<T extends HTMLElement = HTMLElement> = Omit<Props<T>, 'tag'>;

export const h1 = (text: string, className: string = ''): Heading =>
  new BaseComponent({ tag: 'h1', className, text });

export const h2 = (text: string, className: string = ''): Heading =>
  new BaseComponent({ tag: 'h2', className, text });

export const h3 = (text: string, className: string = ''): Heading =>
  new BaseComponent({ tag: 'h3', className, text });

export const button = (props: TagProps<HTMLButtonElement>, ...children: BaseComponent[]): Button =>
  new BaseComponent({ ...props, tag: 'button' }, ...children);

export const label = (
  props: TagProps<HTMLLabelElement>,
  ...children: BaseComponent[]
): BaseComponent<HTMLLabelElement> => new BaseComponent({ ...props, tag: 'label' }, ...children);

export const input = (props: TagProps<HTMLInputElement>): Input =>
  new BaseComponent({ ...props, tag: 'input' });

export const icon = (props: TagProps, code: string): BaseComponent =>
  new BaseComponent({ ...props, tag: 'i', innerHTML: code });

export const div = (props: TagProps<HTMLDivElement>, ...children: BaseComponent[]): Div =>
  new BaseComponent(props, ...children);

export const a = (props: TagProps<HTMLAnchorElement>, ...children: BaseComponent[]): Anchor =>
  new BaseComponent({ ...props, tag: 'a' }, ...children);
