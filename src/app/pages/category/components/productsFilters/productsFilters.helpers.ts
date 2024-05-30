import { Div } from 'globalTypes/elements';
import { div, img } from 'shared/tags/tags.component';

import arrowIcon from './images/arrowIcon.png';
import styles from './productsFilters.module.scss';

export function setSortTypeClass(sortField: Div, neighborSortField: Div): void {
  neighborSortField.removeClass(styles.asc);
  neighborSortField.removeClass(styles.desc);

  if (sortField.containsClass(styles.asc)) {
    sortField.removeClass(styles.asc);
    sortField.addClass(styles.desc);
  } else if (sortField.containsClass(styles.desc)) {
    sortField.removeClass(styles.desc);
  } else sortField.addClass(styles.asc);
}

export function getSortField(text: string): Div {
  const sortImage = img({
    className: styles.icon,
    src: arrowIcon,
    alt: 'arrow-icon',
  });

  sortImage.addClass(styles.arrowIcon);

  const sortField = div({ className: styles.sortField, text }, sortImage);

  return sortField;
}
