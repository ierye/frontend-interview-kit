import App from './App.tsx';
import { createBridgeComponent } from '@module-federation/bridge-react/v19';

export default createBridgeComponent({
  rootComponent: App,
});