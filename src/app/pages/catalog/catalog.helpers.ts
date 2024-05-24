import { Anchor } from 'globalTypes/elements';
import { CategoriesTypes, PagesPaths } from 'pages/pageWrapper.consts';
import { getNavLink } from 'pages/pageWrapper.helpers';
import { div, img } from 'shared/tags/tags.component';

import styles from './catalog.module.scss';

export function getCategory(category: CategoriesTypes, text: string, src: string): Anchor {
  return getNavLink(
    '',
    `${PagesPaths.CATALOG}/${category}`,
    styles.category,
    img({ className: styles.categoryImage, src, alt: `${text}-img` }),
    div({ text }),
  );
}
