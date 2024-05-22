import { BaseComponent } from 'shared/base/base.component';
import { button, div, form, img, input, option, select } from 'shared/tags/tags.component';

import filterIcon from './images/filterIcon.png';
import searchIcon from './images/searchIcon.png';
import sortIcon from './images/sortIcon.png';
import { MULTIPLY_SELECT_SIZE, PRODUCT_FILTER_PROPS } from './productsFilters.consts';
import { getSortField } from './productsFilters.helpers';
import styles from './productsFilters.module.scss';

export class ProductsFilters extends BaseComponent {
  constructor() {
    super(
      { className: styles.productFilter },
      form(
        { className: styles.filterFieldWrapper },
        img({ className: styles.icon, src: filterIcon, alt: 'filter-icon' }),
        div(
          { className: styles.filterField, text: 'Price' },
          input({ className: styles.priceInput, ...PRODUCT_FILTER_PROPS.priceFrom }),
          input({ className: styles.priceInput, ...PRODUCT_FILTER_PROPS.priceTo }),
        ),
        div(
          { className: styles.filterField, text: 'Size' },
          select(
            { className: styles.multipleSelect, multiple: true, size: MULTIPLY_SELECT_SIZE },
            option({ text: 'S', value: 'S' }),
            option({ text: 'M', value: 'M' }),
            option({ text: 'L', value: 'L' }),
          ),
        ),
        div(
          { className: styles.filterField, text: 'Color' },
          select(
            { className: styles.multipleSelect, multiple: true, size: MULTIPLY_SELECT_SIZE },
            option({ text: 'Black', value: 'Black' }),
            option({ text: 'Red', value: 'Red' }),
            option({ text: 'Yellow', value: 'Yellow' }),
            option({ text: 'Green', value: 'Green' }),
            option({ text: 'White', value: 'White' }),
          ),
        ),
        button({
          className: styles.filterSubmitBtn,
          type: 'submit',
          text: 'Apply',
          onclick: (event) => this.submitFilter(event),
        }),
      ),
      div(
        { className: styles.filterFieldWrapper },
        img({ className: styles.icon, src: sortIcon, alt: 'sort-icon' }),
        getSortField('Name'),
        getSortField('Price'),
      ),
      div(
        { className: styles.filterFieldWrapper },
        img({ className: styles.icon, src: searchIcon, alt: 'sort-icon' }),
        input({ className: styles.searchInput, ...PRODUCT_FILTER_PROPS.search }),
      ),
    );
  }

  private submitFilter(event: MouseEvent): void {
    event.preventDefault();
    // TODO: SUBMIT FILTER
    console.log(this);
  }
}
