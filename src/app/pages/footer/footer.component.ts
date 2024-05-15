import { BaseComponent } from 'shared/base/base.component';
import { a, div, h3 } from 'shared/tags/tags.component';

import styles from './footer.module.scss';

export class Footer extends BaseComponent {
  constructor() {
    super(
      { tag: 'footer', className: styles.footer },
      div({ className: styles.rssLogo }),
      div(
        { className: styles.gitLinks },
        a({
          text: 'AlexIHavr (Team Lead)',
          href: 'https://github.com/AlexIHavr',
          target: '_blank',
        }),
        a({ text: 'Koshman-Dmitri', href: 'https://github.com/Koshman-Dmitri', target: '_blank' }),
        a({ text: 'Parxommm', href: 'https://github.com/Parxommm', target: '_blank' }),
      ),
      h3('2024', styles.year),
    );
  }
}
