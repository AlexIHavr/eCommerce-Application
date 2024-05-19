import { ActionFunc } from 'globalTypes/actionFunc';
import Navigo, { RouteHooks } from 'navigo';

class RoutingService {
  private router: Navigo;

  constructor() {
    this.router = new Navigo(import.meta.env.BASE_URL, { hash: true });
  }

  public setRouting(map: Record<string, ActionFunc>): void {
    this.router.on(map).resolve();
  }

  public setNotFound(notFoundAction: ActionFunc): void {
    this.router.notFound(notFoundAction).resolve();
  }

  public setHooks(hooks: RouteHooks): void {
    this.router.hooks(hooks);
  }

  public navigate(path: string): void {
    this.router.navigate(path);
  }

  public updateLinks(): void {
    this.router.updatePageLinks();
  }
}

export const routingService = new RoutingService();
