import { alertModal } from 'shared/alert/alert.component';

import { PROMOCODDE_COPY_SUCCESS } from './promocode.consts';

export function copyPromocode(e?: Event): void {
  const target = e?.target as HTMLElement;
  const promocode = target.textContent || '';

  navigator.clipboard.writeText(promocode);
  alertModal.showAlert('success', PROMOCODDE_COPY_SUCCESS);
}
