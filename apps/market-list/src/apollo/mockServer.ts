import type {FetchResult} from '@apollo/client';
import { ApolloLink, Observable } from '@apollo/client';
import { print } from 'graphql';
import { 
  generateMockTradingPairs, 
  generateMockOrderBook, 
  generateMockKlines,
  simulateNetworkDelay,
  simulateNetworkError
} from '../utils/mockData';
import type { 
  MarketDataResponse, 
  OrderBookResponse, 
  KlineResponse 
} from '../types/market';

// 模拟GraphQL解析器
class MockGraphQLServer {
  private tradingPairsCache: MarketDataResponse['tradingPairs'] = [];
  private lastUpdate = 0;
  private readonly CACHE_DURATION = 5000; // 5秒缓存

  // 获取交易对数据
  async getTradingPairs(): Promise<MarketDataResponse> {
    await simulateNetworkDelay(200, 800);
    
    if (simulateNetworkError(0.05)) { // 5% 错误率
      throw new Error('网络连接失败，请稍后重试');
    }

    const now = Date.now();
    if (now - this.lastUpdate > this.CACHE_DURATION || this.tradingPairsCache.length === 0) {
      this.tradingPairsCache = generateMockTradingPairs();
      this.lastUpdate = now;
    }

    return {
      tradingPairs: this.tradingPairsCache
    };
  }

  // 获取订单薄数据
  async getOrderBook(symbol: string): Promise<OrderBookResponse> {
    await simulateNetworkDelay(100, 300);
    
    if (simulateNetworkError(0.03)) { // 3% 错误率
      throw new Error(`获取 ${symbol} 订单薄数据失败`);
    }

    if (!symbol) {
      throw new Error('交易对符号不能为空');
    }

    return {
      orderBook: generateMockOrderBook(symbol)
    };
  }

  // 获取K线数据
  async getKlines(symbol: string, interval: string = '1m', limit: number = 100): Promise<KlineResponse> {
    await simulateNetworkDelay(300, 600);
    
    if (simulateNetworkError(0.02)) { // 2% 错误率
      throw new Error(`获取 ${symbol} K线数据失败`);
    }

    if (!symbol) {
      throw new Error('交易对符号不能为空');
    }

    return {
      klines: generateMockKlines(symbol, interval, limit)
    };
  }
}

// 创建模拟服务器实例
export const mockServer = new MockGraphQLServer();

// 模拟 GraphQL 查询处理器
export const mockGraphQLHandler = async (query: string, variables?: Record<string, string | number>) => {
  // 解析查询类型
  if (query.includes('GetTradingPairs')) {
    return mockServer.getTradingPairs();
  }
  
  if (query.includes('GetOrderBook')) {
    const { symbol } = variables || {};
    return mockServer.getOrderBook(symbol.toString());
  }
  
  if (query.includes('GetKlines')) {
    const { symbol, interval, limit } = variables || {};
    return mockServer.getKlines(symbol.toString(), interval.toString(), Number(limit));
  }
  
  throw new Error('未知的GraphQL查询');
};

// 创建模拟的 Apollo Link
export const createMockLink = (): ApolloLink => {
  return new ApolloLink((operation) => {
    return new Observable<FetchResult>((observer) => {
      const { query, variables } = operation;
      const queryString = print(query);
      
      mockGraphQLHandler(queryString, variables)
        .then((data) => {
          observer.next({ data });
          observer.complete();
        })
        .catch((error) => {
          observer.error(error);
        });
    });
  });
};