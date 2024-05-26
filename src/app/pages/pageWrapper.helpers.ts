import { Anchor } from 'globalTypes/elements';
import { BreadcrumbPath } from 'pages/shared/components/breadcrumbs/breadcrumbs.interfaces';
import { LocalStorageService } from 'services/localStorage.service';
import { routingService } from 'services/routing.service';
import { alertModal } from 'shared/alert/alert.component';
import { BaseComponent } from 'shared/base/base.component';
import { a } from 'shared/tags/tags.component';
import { tokenCache } from 'utils/tokenCache.util';

import { CATEGORIES_TYPES_VALUES, CategoriesTypes, PagesPaths } from './pageWrapper.consts';

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
  if (!tokenCache.cache.refreshToken) return;

  LocalStorageService.saveData('refreshToken', tokenCache.cache.refreshToken);

  redirectToMain();
  alertModal.showAlert('success', title);
}

export function isIncorrectCategoryPath(category: CategoriesTypes): boolean {
  return !CATEGORIES_TYPES_VALUES.includes(category);
}

export function getCategoryPath(category: CategoriesTypes): string {
  return `${PagesPaths.CATALOG}/${category}`;
}

export function getProductPath(category: CategoriesTypes, id: string): string {
  return `${getCategoryPath(category)}/${id}`;
}

export function getCategoryBreadcrumbPath(category: CategoriesTypes): BreadcrumbPath {
  return { name: category, path: getCategoryPath(category) };
}
