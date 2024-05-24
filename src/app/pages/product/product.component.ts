import { IProductParams } from 'pages/pageWrapper.types';
import { SectionTitle } from 'pages/shared/components/sectionTitle/sectionTitle.component';
import { BaseComponent } from 'shared/base/base.component';

export class Product extends BaseComponent {
  constructor(params: IProductParams) {
    super({}, new SectionTitle(params.id));
  }
}
