import { Anchor } from 'globalTypes/elements';
import { LocalStorageService } from 'services/localStorage.service';
import { routingService } from 'services/routing.service';
import { a } from 'shared/tags/tags.component';
import { tokenCache } from 'utils/tokenCache.util';

import { PagesPaths } from './pageWrapper.consts';

export function navigateToMain(): void {
  if (tokenCache.cache.refreshToken) {
    LocalStorageService.saveData('refreshToken', tokenCache.cache.refreshToken);
    routingService.navigate(PagesPaths.MAIN);
  } else {
    throw new Error('refreshToken was not found in tokenCache');
  }
}

export function getNavLink(title: string, path: PagesPaths, className?: string): Anchor {
  const homeLink = a({ text: title, href: path, className });
  homeLink.setAttribute('data-navigo', '');

  return homeLink;
}
