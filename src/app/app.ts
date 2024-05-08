import { PageWrapper } from 'pages/pageWrapper.component';
import { ApiService } from 'services/api.service';
import { routingService } from 'services/routing.service';
import { BaseComponent } from 'shared/base/base.component';

class App {
  constructor(private readonly wrapper: BaseComponent) {}

  public start(): void {
    document.body.append(this.wrapper.getNode());
    routingService.updateLinks();

    new ApiService().getProject();
  }
}

const app = new App(new PageWrapper());

app.start();
