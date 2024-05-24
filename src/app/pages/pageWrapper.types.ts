import { CatalogParams, CategoriesTypes } from './pageWrapper.consts';

export type CategoryParams = {
  [CatalogParams.CATEGORY]: CategoriesTypes;
};

export type ProductParams = CategoryParams & {
  [CatalogParams.ID]: string;
};
