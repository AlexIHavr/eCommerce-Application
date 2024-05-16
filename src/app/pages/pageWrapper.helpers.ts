import { Anchor } from 'globalTypes/elements';
import { LocalStorageService } from 'services/localStorage.service';
import { routingService } from 'services/routing.service';
import { a } from 'shared/tags/tags.component';
import { tokenCache } from 'utils/tokenCache.util';

import { PagesPaths } from './pageWrapper.consts';

export function redirectToMain(): void {
  routingService.navigate(PagesPaths.MAIN);
}

export function saveRefreshToken(): void {
  if (!tokenCache.cache.refreshToken) return;

  LocalStorageService.saveData('refreshToken', tokenCache.cache.refreshToken);
}

export function getNavLink(title: string, path: PagesPaths, className?: string): Anchor {
  const homeLink = a({ text: title, href: path, className: className || '' });
  homeLink.setAttribute('data-navigo', '');

  return homeLink;
}

export function isLogined(): boolean {
  return Boolean(LocalStorageService.getData('refreshToken'));
}

export function loginRedirect(): void {
  if (!isLogined()) return;

  redirectToMain();
}