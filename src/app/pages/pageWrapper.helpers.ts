import { LocalStorageService } from 'services/localStorage.service';
import { routingService } from 'services/routing.service';
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
