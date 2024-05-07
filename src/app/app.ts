import { PageWrapper } from 'pages/pageWrapper.component';
import { BaseComponent } from 'shared/base/base.component';

class App {
  constructor(private readonly wrapper: BaseComponent) {}

  public start(): void {
    document.body.append(this.wrapper.getNode());
  }
}

const app = new App(new PageWrapper());

app.start();
