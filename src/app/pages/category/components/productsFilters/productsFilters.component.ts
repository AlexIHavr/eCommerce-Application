import { Div, Input } from 'globalTypes/elements';
import { BaseComponent } from 'shared/base/base.component';
import { button, div, form, img, input, label } from 'shared/tags/tags.component';
import { capitalizeFirstLetter } from 'utils/strings.util';

import filterIcon from './images/filterIcon.png';
import searchIcon from './images/searchIcon.png';
import selectArrowIcon from './images/selectArrowIcon.png';
import sortIcon from './images/sortIcon.png';
import { PRODUCTS_FILTERS_PROPS, PRODUCTS_OPTIONS } from './productsFilters.consts';
import { getSortField } from './productsFilters.helpers';
import styles from './productsFilters.module.scss';
import { OptionsType } from './productsFilters.types';

export class ProductsFilters extends BaseComponent {
  private readonly priceFromInput: Input;

  private readonly priceToInput: Input;

  private readonly filteredCount: Div;

  private readonly inputOptions: Record<OptionsType, Input[]>;

  private selectFields: Div[] = [];

  constructor() {
    super({ className: styles.productsFilters });

    this.inputOptions = { color: [], brand: [] };

    this.priceFromInput = input({
      className: styles.priceInput,
      ...PRODUCTS_FILTERS_PROPS.priceFrom,
    });

    this.priceToInput = input({
      className: styles.priceInput,
      ...PRODUCTS_FILTERS_PROPS.priceTo,
    });

    const filterFieldForm = form(
      { className: styles.filterFieldForm },
      div({ className: styles.filterField, text: 'Price' }, this.priceFromInput, this.priceToInput),
      this.getMultipleSelectField('brand'),
      this.getMultipleSelectField('color'),
      button({
        className: styles.submitFilterBtn,
        type: 'submit',
        text: 'Apply',
        onclick: (event) => this.submitFilter(event),
      }),
    );

    this.filteredCount = div(
      { className: styles.filteredCount, text: '5 / 20' },
      img({ className: styles.icon, src: filterIcon, alt: 'filter-icon' }),
    );

    this.appendChildren([
      this.filteredCount,
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
        input({ className: styles.searchInput, ...PRODUCTS_FILTERS_PROPS.search }),
      ),
    ]);

    window.onclick = (event): void => this.hideSelectFields(event);
  }

  private hideSelectFields(event: MouseEvent): void {
    this.selectFields.forEach((selectField) => {
      if (!event.composedPath().includes(selectField.getNode())) {
        selectField.removeClass(styles.show);
      }
    });
  }

  private getMultipleSelectField(optionsType: OptionsType): Div {
    const multipleSelect = div(
      { className: styles.multipleSelect },
      ...PRODUCTS_OPTIONS[optionsType].map((option) => {
        const inputOption = input({
          className: styles.selectCheckbox,
          value: option,
          type: 'checkbox',
        });

        this.inputOptions[optionsType].push(inputOption);

        return label({ className: styles.multipleSelectLabel, text: option }, inputOption);
      }),
    );

    const selectIcon = img({
      className: styles.icon,
      src: selectArrowIcon,
      alt: 'select-array-icon',
    });
    selectIcon.addClass(styles.selectIcon);

    const multipleSelectField = div(
      { className: styles.filterField },
      div(
        {
          className: styles.filterFieldTitle,
          text: capitalizeFirstLetter(optionsType),
          onclick: (event) => {
            if (!event.composedPath().includes(multipleSelect.getNode())) {
              multipleSelectField.toggleClass(styles.show);
            }
          },
        },
        selectIcon,
        multipleSelect,
      ),
    );

    this.selectFields.push(multipleSelectField);

    return multipleSelectField;
  }

  private submitFilter(event: MouseEvent): void {
    event.preventDefault();
    // TODO: SUBMIT FILTER
    console.log(this);
  }
}
