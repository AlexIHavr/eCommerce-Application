import './styles/style.scss';
import './app/app';

import ECommerceAPIService from 'services/ECommerceToolsAPI.service';

const eCommerceAPIService = new ECommerceAPIService();

eCommerceAPIService.addCustomer().then(console.log).catch(console.log);
