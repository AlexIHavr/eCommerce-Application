import { ProductProjection } from '@commercetools/platform-sdk';
import { ProductsAttributes, ProductsBrands, ProductsColors } from 'globalConsts/api.const';
import { Div, Input } from 'globalTypes/elements';
import { Category } from 'pages/category/category.component';
import { getProductBrand, getProductColor } from 'pages/pageWrapper.helpers';
import { BaseComponent } from 'shared/base/base.component';
import { button, div, form, img, input, label } from 'shared/tags/tags.component';
import { capitalizeFirstLetter } from 'utils/strings.util';

import filterIcon from './images/filterIcon.png';
import searchIcon from './images/searchIcon.png';
import selectArrowIcon from './images/selectArrowIcon.png';
import sortIcon from './images/sortIcon.png';
import { PRODUCTS_FILTERS_PROPS } from './productsFilters.consts';
import { getSortField } from './productsFilters.helpers';
import styles from './productsFilters.module.scss';

export class ProductsFilters extends BaseComponent {
  private readonly priceFromInput: Input;

  private readonly priceToInput: Input;

  private readonly inputOptions: Record<ProductsAttributes, Input[]>;

  private readonly multipleSelects: Record<ProductsAttributes, Div>;

  private selectFields: Div[] = [];

  constructor(private readonly parent: Category) {
    super({ className: styles.productsFilters });

    this.inputOptions = { color: [], brand: [] };

    this.multipleSelects = {
      color: div({ className: styles.multipleSelect }),
      brand: div({ className: styles.multipleSelect }),
    };

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
      label(
        { className: styles.filterFieldLabel },
        img({ className: styles.icon, src: filterIcon, alt: 'filter-icon' }),
        div(
          { className: styles.filterField, text: 'Price' },
          this.priceFromInput,
          this.priceToInput,
        ),
      ),
      this.getMultipleSelectField(ProductsAttributes.BRAND),
      this.getMultipleSelectField(ProductsAttributes.COLOR),
      button({
        className: styles.resetFilterBtn,
        type: 'reset',
        text: 'Reset',
        onclick: () => this.resetFilters(),
      }),
      button({
        className: styles.submitFilterBtn,
        type: 'submit',
        text: 'Apply',
        onclick: (event) => this.submitFilter(event),
      }),
    );

    this.appendChildren([
      filterFieldForm,
      div(
        { className: styles.filterField },
        img({ className: styles.icon, src: sortIcon, alt: 'sort-icon' }),
        getSortField('Name'),
        getSortField('Price'),
      ),
      label(
        { className: styles.filterField },
        img({ className: styles.icon, src: searchIcon, alt: 'sort-icon' }),
        input({ className: styles.searchInput, ...PRODUCTS_FILTERS_PROPS.search }),
      ),
    ]);

    window.onclick = (event): void => this.hideSelectFields(event);
  }

  public setProductsOptions(products: ProductProjection[]): void {
    products.forEach(({ masterVariant, variants }) => {
      this.addOptionToMultipleSelect(ProductsAttributes.BRAND, getProductBrand(masterVariant));
      this.addOptionToMultipleSelect(ProductsAttributes.COLOR, getProductColor(masterVariant));

      variants.forEach((variant) => {
        this.addOptionToMultipleSelect(ProductsAttributes.COLOR, getProductColor(variant));
      });
    });
  }

  private hideSelectFields(event: MouseEvent): void {
    this.selectFields.forEach((selectField) => {
      if (!event.composedPath().includes(selectField.getNode())) {
        selectField.removeClass(styles.show);
      }
    });
  }

  private getMultipleSelectField(optionsType: ProductsAttributes): Div {
    const multipleSelect = this.multipleSelects[optionsType];

    multipleSelect.addClass(styles[optionsType]);

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

  private addOptionToMultipleSelect(optionsType: ProductsAttributes, option?: string): void {
    if (
      !option ||
      this.inputOptions[optionsType].find((inputOption) => inputOption.getNode().value === option)
    ) {
      return;
    }

    const inputOption = input({
      className: styles.selectCheckbox,
      value: option,
      type: 'checkbox',
    });

    this.inputOptions[optionsType].push(inputOption);

    this.multipleSelects[optionsType].append(
      label({ className: styles.multipleSelectLabel, text: option }, inputOption),
    );
  }

  private resetFilters(): void {
    this.parent.setProducts();
  }

  private submitFilter(event: MouseEvent): void {
    event.preventDefault();

    const toInputValue = this.priceToInput.getNode().value;

    const fromValue = Number(this.priceFromInput.getNode().value) * 100;
    let toValue: number | undefined;

    if (toInputValue) {
      toValue = Number(toInputValue) * 100;
    }

    this.parent.setProducts({
      price: { from: fromValue, to: toValue },
      brands: this.getFilteredOptions(ProductsAttributes.BRAND),
      colors: this.getFilteredOptions(ProductsAttributes.COLOR),
    });
  }

  private getFilteredOptions<T extends ProductsBrands | ProductsColors>(
    optionsType: ProductsAttributes,
  ): T[] {
    return this.inputOptions[optionsType].reduce<T[]>((products, inputOption) => {
      const node = inputOption.getNode();

      if (node.checked) products.push(node.value as T);

      return products;
    }, []);
  }
}
