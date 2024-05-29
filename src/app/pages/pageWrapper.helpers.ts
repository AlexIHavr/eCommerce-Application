import { Image, ProductData } from '@commercetools/platform-sdk';
import { CountriesLanguages, ProductsAttributes, ProductsCategories } from 'globalConsts/api.const';
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

export function getProductPath(category: ProductsCategories, id: string): string {
  return `${getCategoryPath(category)}/${id}`;
}

export function getCategoryBreadcrumbPath(category: ProductsCategories): BreadcrumbPath {
  return { name: category, path: getCategoryPath(category) };
}

export function getDiscountPercent(price: number, discount: number): string {
  return String(Math.round((1 - discount / price) * 100));
}

export function getProductName(current: ProductData): string {
  return current.name[CountriesLanguages.GB] ?? current.name[CountriesLanguages.US];
}

export function getProductDescription(current: ProductData): string | undefined {
  return (
    current.description?.[CountriesLanguages.GB] ?? current.description?.[CountriesLanguages.US]
  );
}

export function getProductPrice(current: ProductData): number | undefined {
  return current.masterVariant.prices?.[0].value.centAmount;
}

export function getProductDiscount(current: ProductData): number | undefined {
  return current.masterVariant.prices?.[0].discounted?.value.centAmount;
}

export function getProductImages(current: ProductData): Image[] | undefined {
  return current.masterVariant.images;
}

export function getProductBrand(current: ProductData): string | undefined {
  return current.masterVariant.attributes?.find(({ name }) => name === ProductsAttributes.BRAND)
    ?.value;
}

export function getProductColor(current: ProductData): string | undefined {
  return current.masterVariant.attributes?.find(({ name }) => name === ProductsAttributes.COLOR)
    ?.value;
}
