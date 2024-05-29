import { ProductsCategories } from 'globalConsts/api.const';

import { CatalogParams } from './pageWrapper.consts';

export type CategoryParams = {
  [CatalogParams.CATEGORY]: ProductsCategories;
};

export type ProductParams = CategoryParams & {
  [CatalogParams.ID]: string;
};
