import { ProductsCategories } from 'globalConsts/api.const';
import { Anchor } from 'globalTypes/elements';
import { BreadcrumbPath } from 'pages/shared/components/breadcrumbs/breadcrumbs.interfaces';
import { LocalStorageService } from 'services/localStorage.service';
import { routingService } from 'services/routing.service';
import { alertModal } from 'shared/alert/alert.component';
import { BaseComponent } from 'shared/base/base.component';
import { a } from 'shared/tags/tags.component';
import { tokenCache } from 'utils/tokenCache.util';

import { PagesPaths, PRODUCTS_CATEGORIES_VALUES } from './pageWrapper.consts';

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
  return !PRODUCTS_CATEGORIES_VALUES.includes(category);
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

export function getDiscountPrice(price: string, discount?: string): string {
  return discount
    ? `${Number(price) - (Number(price) * Number(discount)) / 100} BYN`
    : `${price} BYN`;
}
