import { Anchor } from 'globalTypes/elements';
import { PagesPaths } from 'pages/pageWrapper.consts';
import { getNavLink } from 'pages/pageWrapper.helpers';
import { div, img } from 'shared/tags/tags.component';

import styles from './catalog.module.scss';

export function getCategory(path: PagesPaths, text: string, src: string): Anchor {
  return getNavLink(
    '',
    path,
    styles.category,
    img({ className: styles.categoryImage, src, alt: `${text}-img` }),
    div({ text }),
  );
}
