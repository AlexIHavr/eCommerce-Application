import { Heading } from 'globalTypes/elements';
import { button, div, h2, h3 } from 'shared/tags/tags.component';
import Wrapper from 'shared/wrapper/wrapper.component';

import styles from './modal.styles.module.scss';

export default class Modal extends Wrapper {
  private readonly description: Heading = h3('');

  constructor(title: string) {
    super();

    this.addClass(styles.modal);
    this.setProps({ onclick: (event) => this.closeOutside(event) });

    const modalWindow = div({ className: styles.modalWindow }, h2(title), this.description);

    modalWindow.append(button({ text: 'Ok', onclick: () => this.close() }));

    this.append(modalWindow);
  }

  public setDescription(description: string): void {
    this.description.setText(description);
  }

  private closeOutside(event: MouseEvent): void {
    if (event.target === this.getNode()) this.close();
  }
}
