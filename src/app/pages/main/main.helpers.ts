import { alertModal } from 'shared/alert/alert.component';

import { CHAIRS_PROMOCODE, PROMOCODDE_COPY_SUCCESS } from './main.consts';

export function copyPromocode(): void {
  navigator.clipboard.writeText(CHAIRS_PROMOCODE);
  alertModal.showAlert('success', PROMOCODDE_COPY_SUCCESS);
}
