import { Div } from 'globalTypes/elements';
import { div, img } from 'shared/tags/tags.component';

import styles from './catalog.module.scss';

export function getCategory(text: string, src: string): Div {
  return div(
    { className: styles.category },
    img({ className: styles.categoryImage, src, alt: `${text}-img` }),
    div({ text }),
  );
}
