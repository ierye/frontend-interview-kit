import { createBrowserRouter } from 'react-router-dom';
import App from './App';
import { Root } from './Root';
import { TradingPairDetail } from './components/TradingPairDetail';

// 创建路由配置
export const router = createBrowserRouter([
  {
    path: '/',
    element: <Root />,
    children: [
      {
        index: true,
        element: <App />,
      },
      {
        path: 'trading/:symbol',
        element: <TradingPairDetail />,
      },
    ],
  },
]);