import { Match } from 'navigo';
import { About } from 'pages/about/about.component';
import { Catalog } from 'pages/catalog/catalog.component';
import { Footer } from 'pages/footer/footer.component';
import { Header } from 'pages/header/header.components';
import { Login } from 'pages/login/login.component';
import { Main } from 'pages/main/main.component';
import { NotFound } from 'pages/notFound/notFound.component';
import { Signup } from 'pages/signup/signup.component';
import { routingService } from 'services/routing.service';
import { BaseComponent } from 'shared/base/base.component';

import { Category } from './category/category.component';
import { PRODUCTS_CARDS_MOCK } from './category/category.consts';
import { PagesPaths } from './pageWrapper.consts';
import { isIncorrectCategoryPath, isLogined, redirectToMain } from './pageWrapper.helpers';
import styles from './pageWrapper.module.scss';
import { CategoryParams, ProductParams } from './pageWrapper.types';
import { Product } from './product/product.component';
import { Profile } from './profile/profile.component';

export class PageWrapper extends BaseComponent {
  private readonly pageContent;

  private readonly header: Header;

  private readonly notFound: NotFound;

  constructor() {
    super({ className: styles.pageWrapper });

    this.pageContent = new BaseComponent({ tag: 'main', className: styles.pageContent });

    this.header = new Header();

    this.notFound = new NotFound();

    this.appendChildren([this.header, this.pageContent, new Footer()]);

    this.addListener('click', (event) => this.header.closeMobileMenu(event));

    this.initRoutingService();
  }

  private initRoutingService(): void {
    const main = new Main();

    routingService.setHooks({
      before: (done, match) => {
        this.header.updateNavLinks(match.url);
        done();
      },
    });

    routingService.setRouting({
      [PagesPaths.MAIN]: () => this.goToPage(main),
      [PagesPaths.HOME]: () => this.goToPage(main),
      [PagesPaths.LOGIN]: () => this.goToLogin(),
      [PagesPaths.SIGNUP]: () => this.goToPage(new Signup()),
      [PagesPaths.CATALOG]: () => this.goToPage(new Catalog()),
      [PagesPaths.ABOUT]: () => this.goToPage(new About()),
      [PagesPaths.CATEGORY]: (match) => this.goToCategory(match),
      [PagesPaths.PRODUCT]: (match) => this.goToProduct(match),
      [PagesPaths.PROFILE]: () => this.goToProfile(),
    });

    routingService.setNotFound(() => this.goToPage(this.notFound));
  }

  private goToLogin(): void {
    if (isLogined()) {
      redirectToMain();
    } else {
      this.goToPage(new Login());
    }
  }

  private goToCategory({ data }: Match): void {
    if (!data) return;

    const params = data as CategoryParams;

    if (isIncorrectCategoryPath(params.category)) {
      this.goToPage(this.notFound);
    } else {
      this.goToPage(new Category(params));
    }
  }

  private goToProduct({ data }: Match): void {
    if (!data) return;

    const params = data as ProductParams;

    if (
      isIncorrectCategoryPath(params.category) ||
      !PRODUCTS_CARDS_MOCK.find(({ id }) => id === params.id)
    ) {
      this.goToPage(this.notFound);
    } else {
      this.goToPage(new Product(params));
    }
  }

  private goToProfile(): void {
    if (isLogined()) {
      this.goToPage(new Profile());
    } else {
      routingService.navigate(PagesPaths.LOGIN);
    }
  }

  private goToProfile(): void {
    if (isLogined()) {
      this.goToPage(new Profile());
    } else {
      routingService.navigate(PagesPaths.LOGIN);
    }
  }

  private goToPage(page: BaseComponent): void {
    this.pageContent.destroyChildren();
    this.pageContent.append(page);
  }
}
