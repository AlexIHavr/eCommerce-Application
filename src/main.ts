import './styles/style.scss';
import './app/app';

import { LoginPage } from 'pages/login/login.component';

document.body.append(new LoginPage().getNode());
