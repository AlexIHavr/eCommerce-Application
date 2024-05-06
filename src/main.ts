import './styles/style.scss';
import './app/app';

import ECommerceAPIService from 'services/eCommerceApi.service';

const eCommerceAPIService = new ECommerceAPIService();

eCommerceAPIService.getProject();
