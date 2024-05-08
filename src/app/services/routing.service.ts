import { ActionFunc } from 'globalTypes/actionFunc';
import Navigo from 'navigo';

class RoutingService {
  private router: Navigo;

  constructor() {
    this.router = new Navigo(import.meta.env.BASE_URL);
  }

  public setRouting(map: Record<string, ActionFunc>, notFoundAction: ActionFunc): void {
    this.router.on(map).notFound(notFoundAction).resolve();
  }

  public navigate(path: string): void {
    this.router.navigate(path);
  }

  public updateLinks(): void {
    this.router.updatePageLinks();
  }
}

export const routingService = new RoutingService();
