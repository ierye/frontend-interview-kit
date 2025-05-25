import { createBrowserRouter } from 'react-router-dom';
import { loadRemote } from '@module-federation/enhanced/runtime';
import { createRemoteComponent } from '@module-federation/bridge-react';

import App from './App';

const FallbackErrorComp = (info: {
    error: Error;
}) => <div>{info?.error?.message}</div>

const FallbackComp = <div>loading</div>;

const loaderComponent = (name: string) => {
  const RemoteComponent = createRemoteComponent({
    loader: () => loadRemote(name),
    fallback: FallbackErrorComp,
    loading: FallbackComp,
  });
  
  return <RemoteComponent />;
}

// 创建路由配置
export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />
  },
  {
    path: '/quotes/*',
    element: loaderComponent('@mf/quotes'),
  },
  {
    path: '/trade/*',
    element: loaderComponent('@mf/trade'),
  }
]);