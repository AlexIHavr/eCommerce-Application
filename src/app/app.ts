import { PageWrapper } from 'pages/pageWrapper.component';
import { routingService } from 'services/routing.service';
import { alertModal } from 'shared/alert/alert.component';
import { BaseComponent } from 'shared/base/base.component';
import { loader } from 'shared/loader/loader.component';

class App {
  constructor(private readonly wrapper: BaseComponent) {}

  public start(): void {
    document.body.append(this.wrapper.getNode(), alertModal.getNode(), loader.getNode());
    routingService.updateLinks();
  }
}

const app = new App(new PageWrapper());

app.start();
