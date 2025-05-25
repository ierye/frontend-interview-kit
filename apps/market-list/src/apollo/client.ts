import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';
import { createMockLink } from './mockServer';

// 判断是否使用模拟数据
const USE_MOCK_DATA = !import.meta.env.VITE_GRAPHQL_ENDPOINT;

// 创建链接
const link = USE_MOCK_DATA 
  ? createMockLink() // 使用模拟数据
  : createHttpLink({
      // 真实的GraphQL端点，用于生产环境
      uri: import.meta.env.VITE_GRAPHQL_ENDPOINT,
      headers: {
        'Content-Type': 'application/json',
        // 可以添加认证头等配置
        // 'Authorization': `Bearer ${process.env.VITE_API_TOKEN}`,
      },
    });

// 创建Apollo Client实例
export const apolloClient = new ApolloClient({
  link,
  cache: new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          tradingPairs: {
            // 缓存策略：每次都从网络获取最新数据
            // fetchPolicy: 'cache-and-network',
          },
          orderBook: {
            // 订单薄数据需要实时更新
            // fetchPolicy: 'network-only',
          },
          klines: {
            // K线数据可以缓存一段时间
            // fetchPolicy: 'cache-first',
          },
        },
      },
    },
  }),
  // 默认查询选项
  defaultOptions: {
    watchQuery: {
      errorPolicy: 'all',
      notifyOnNetworkStatusChange: true,
    },
    query: {
      errorPolicy: 'all',
    },
  },
});