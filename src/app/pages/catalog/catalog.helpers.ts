import { Anchor } from 'globalTypes/elements';
import { CategoriesTypes } from 'pages/pageWrapper.consts';
import { getCategoryPath, getNavLink } from 'pages/pageWrapper.helpers';
import { div, img } from 'shared/tags/tags.component';
import { capitalizeFirstLetter } from 'utils/strings.util';

import styles from './catalog.module.scss';

export function getCategory(category: CategoriesTypes, src: string): Anchor {
  const text = capitalizeFirstLetter(category);

  return getNavLink(
    '',
    getCategoryPath(category),
    styles.category,
    img({ className: styles.categoryImage, src, alt: `${text}-img` }),
    div({ text }),
  );
}
