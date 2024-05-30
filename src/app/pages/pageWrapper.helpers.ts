import { LocalizedString, ProductVariant } from '@commercetools/platform-sdk';
import {
  ProductsAttributes,
  ProductsBrands,
  ProductsCategories,
  ProductsColors,
} from 'globalConsts/api.const';
import { Anchor } from 'globalTypes/elements';
import { BreadcrumbPath } from 'pages/shared/components/breadcrumbs/breadcrumbs.interfaces';
import { LocalStorageService } from 'services/localStorage.service';
import { routingService } from 'services/routing.service';
import { alertModal } from 'shared/alert/alert.component';
import { BaseComponent } from 'shared/base/base.component';
import { a } from 'shared/tags/tags.component';
import { tokenCache } from 'utils/tokenCache.util';

import { PagesPaths, PRODUCTS_CATEGORIES_KEYS } from './pageWrapper.consts';

export function redirectToMain(): void {
  routingService.navigate(PagesPaths.HOME);
}

export function getNavLink(
  title: string,
  path: string,
  className: string,
  ...children: BaseComponent[]
): Anchor {
  const homeLink = a({ text: title, href: path, className }, ...children);
  homeLink.setAttribute('data-navigo', '');

  return homeLink;
}

export function isLogined(): boolean {
  return Boolean(LocalStorageService.getData('refreshToken'));
}

export function successLogin(title: string): void {
  if (tokenCache.cache.refreshToken) {
    LocalStorageService.saveData('refreshToken', tokenCache.cache.refreshToken);
  }

  LocalStorageService.saveData('token', tokenCache.cache.token);

  redirectToMain();
  alertModal.showAlert('success', title);
}

export function isIncorrectCategoryPath(category: ProductsCategories): boolean {
  return !PRODUCTS_CATEGORIES_KEYS.includes(category);
}

export function getCategoryPath(category: ProductsCategories): string {
  return `${PagesPaths.CATALOG}/${category}`;
}

export function getProductPath(
  category: ProductsCategories,
  id: string,
  color?: ProductsColors,
): string {
  return `${getCategoryPath(category)}/${id}/${color}`;
}

export function getCategoryBreadcrumbPath(category: ProductsCategories): BreadcrumbPath {
  return { name: category, path: getCategoryPath(category) };
}

export function getDiscountPercent(price: number, discount: number): string {
  return String(Math.round((1 - discount / price) * 100));
}

export function getProductName(name: LocalizedString): string {
  return name.en;
}

export function getProductDescription(description?: LocalizedString): string | undefined {
  return description?.en;
}

export function getProductPrice(masterVariant: ProductVariant): number | undefined {
  const priceInCent = masterVariant.prices?.[0].value.centAmount;

  return priceInCent ? priceInCent / 100 : priceInCent;
}

export function getProductDiscount(masterVariant: ProductVariant): number | undefined {
  const discountInCent = masterVariant.prices?.[0].discounted?.value.centAmount;

  return discountInCent ? discountInCent / 100 : discountInCent;
}

export function getPriceWithCurrency(price?: number): string {
  return new Intl.NumberFormat('en', { style: 'currency', currency: 'USD' }).format(price ?? 0);
}

export function getProductBrand(masterVariant: ProductVariant): ProductsBrands | undefined {
  return masterVariant.attributes?.find(({ name }) => name === ProductsAttributes.BRAND)?.value;
}

export function getProductColor(masterVariant: ProductVariant): ProductsColors | undefined {
  return masterVariant.attributes?.find(({ name }) => name === ProductsAttributes.COLOR)?.value
    .label;
}
