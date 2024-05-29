import { PageWrapper } from 'pages/pageWrapper.component';
import { routingService } from 'services/routing.service';
import { alertModal } from 'shared/alert/alert.component';
import { BaseComponent } from 'shared/base/base.component';
import { loader } from 'shared/loader/loader.component';
import { Slider } from 'shared/slider/slider.component';

class App {
  constructor(private readonly children: BaseComponent[]) {}

  public start(): void {
    this.children.forEach((child) => document.body.append(child.getNode()));
    routingService.updateLinks();
    // apiService.getFilteredProducts(
    //   PRODUCTS_CATEGORIES_IDS.CHAIRS,
    //   { from: 0, to: 15000 },
    //   [ProductsBrands.COLAMY, ProductsBrands.FEONASE],
    //   [ProductsColors.BEIGE],
    // );
    Slider.init();
  }
}

const app = new App([new PageWrapper(), alertModal, loader]);

app.start();
