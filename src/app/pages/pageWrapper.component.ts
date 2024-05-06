import BaseComponent from 'shared/base/base.component';
import loader from 'shared/loader/loader.component';
import { a, button, div, h1, h2, h3, icon, input, label } from 'shared/tags/tags.component';

import styles from './pageWrapper.styles.module.scss';

class PageWrapper extends BaseComponent {
  constructor() {
    super({ className: styles.pageWrapper });

    // *! remove
    this.appendChildren([
      div({ className: styles.header }, h1('Application h1')),
      h2('Application h2'),
      h3('Application h3'),
      div({ className: styles.card, text: 'Card' }),
      label({ text: 'Label', htmlFor: 'label' }),
      input({ id: 'label', placeholder: 'Input' }),
      input({ id: 'label', placeholder: 'Disabled input', disabled: true }),
      button({ text: 'Show loader', onclick: () => loader.open() }),
      button({ text: 'Disabled', disabled: true }),
      a({ text: 'Link', href: 'https://yandex.by/' }),
      icon({}, '&#9989;'),
    ]);
  }
}

export default new PageWrapper();
