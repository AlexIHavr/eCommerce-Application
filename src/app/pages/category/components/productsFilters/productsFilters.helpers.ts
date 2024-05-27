import { Div } from 'globalTypes/elements';
import { div, img } from 'shared/tags/tags.component';

import arrowIcon from './images/arrowIcon.png';
import styles from './productsFilters.module.scss';

export function getSortField(text: string): Div {
  const sortImage = img({
    className: styles.icon,
    src: arrowIcon,
    alt: 'arrow-icon',
  });

  sortImage.addClass(styles.arrowIcon);

  const setSortTypeClass = (): void => {
    if (sortImage.containsClass(styles.asc)) {
      sortImage.removeClass(styles.asc);
      sortImage.addClass(styles.desc);
    } else if (sortImage.containsClass(styles.desc)) {
      sortImage.removeClass(styles.desc);
    } else sortImage.addClass(styles.asc);
  };

  return div({ className: styles.sortField, text, onclick: setSortTypeClass }, sortImage);
}
