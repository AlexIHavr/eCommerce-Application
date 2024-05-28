import { ProductBrands, ProductCategoriesId, ProductColors } from 'globalTypes/api.type';
import { PageWrapper } from 'pages/pageWrapper.component';
import { apiService } from 'services/api.service';
import { routingService } from 'services/routing.service';
import { alertModal } from 'shared/alert/alert.component';
import { BaseComponent } from 'shared/base/base.component';
import { loader } from 'shared/loader/loader.component';

class App {
  constructor(private readonly children: BaseComponent[]) {}

  public start(): void {
    this.children.forEach((child) => document.body.append(child.getNode()));
    routingService.updateLinks();

    apiService.getFilteredProducts(
      ProductCategoriesId.chairs,
      { from: 0, to: 15000 },
      [ProductBrands.colamy, ProductBrands.feonase],
      [ProductColors.beige],
    );
  }
}

const app = new App([new PageWrapper(), alertModal, loader]);

app.start();
