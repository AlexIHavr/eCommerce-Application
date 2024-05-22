import { BaseComponent } from 'shared/base/base.component';
import { button, div, form, img, input, label } from 'shared/tags/tags.component';

import filterIcon from './images/filterIcon.png';
import searchIcon from './images/searchIcon.png';
import sortIcon from './images/sortIcon.png';
import { PRODUCT_FILTER_PROPS } from './productsFilters.consts';
import { getSortField } from './productsFilters.helpers';
import styles from './productsFilters.module.scss';

export class ProductsFilters extends BaseComponent {
  constructor() {
    const filterFieldForm = form(
      { className: styles.filterFieldForm },
      div(
        { className: styles.filterField, text: 'Price' },
        input({ className: styles.priceInput, ...PRODUCT_FILTER_PROPS.priceFrom }),
        input({ className: styles.priceInput, ...PRODUCT_FILTER_PROPS.priceTo }),
      ),
      div(
        { className: styles.filterField },
        div({ className: styles.filterFieldTitle, text: 'Size' }),
        div(
          { className: styles.multipleSelect },
          label(
            { className: styles.multipleSelectLabel, text: 'Small' },
            input({ className: styles.selectCheckbox, value: 'S', type: 'checkbox' }),
          ),
          label(
            { className: styles.multipleSelectLabel, text: 'Medium' },
            input({ className: styles.selectCheckbox, value: 'M', type: 'checkbox' }),
          ),
          label(
            { className: styles.multipleSelectLabel, text: 'Large' },
            input({ className: styles.selectCheckbox, value: 'L', type: 'checkbox' }),
          ),
        ),
      ),
      div(
        { className: styles.filterField },
        div({ className: styles.filterFieldTitle, text: 'Color' }),
        div(
          { className: styles.multipleSelect },
          label(
            { className: styles.multipleSelectLabel, text: 'Black' },
            input({ className: styles.selectCheckbox, value: 'Black', type: 'checkbox' }),
          ),
          label(
            { className: styles.multipleSelectLabel, text: 'Red' },
            input({ className: styles.selectCheckbox, value: 'Red', type: 'checkbox' }),
          ),
          label(
            { className: styles.multipleSelectLabel, text: 'Yellow' },
            input({ className: styles.selectCheckbox, value: 'Yellow', type: 'checkbox' }),
          ),
          label(
            { className: styles.multipleSelectLabel, text: 'Green' },
            input({ className: styles.selectCheckbox, value: 'Green', type: 'checkbox' }),
          ),
          label(
            { className: styles.multipleSelectLabel, text: 'White' },
            input({ className: styles.selectCheckbox, value: 'White', type: 'checkbox' }),
          ),
        ),
      ),
      button({
        className: styles.filterSubmitBtn,
        type: 'submit',
        text: 'Apply',
        onclick: (event) => this.submitFilter(event),
      }),
    );

    super(
      { className: styles.productsFilters },
      div(
        {
          className: styles.filteredCount,
          text: '5 / 20',
          onclick: () => filterFieldForm.toggleClass(styles.show),
        },
        img({ className: styles.icon, src: filterIcon, alt: 'filter-icon' }),
      ),
      filterFieldForm,
      div(
        { className: styles.filterField },
        img({ className: styles.icon, src: sortIcon, alt: 'sort-icon' }),
        getSortField('Name'),
        getSortField('Price'),
      ),
      div(
        { className: styles.filterField },
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
