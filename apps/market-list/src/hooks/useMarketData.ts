import { useState, useEffect } from 'react';
import { useQuery } from '@apollo/client';
import { GET_TRADING_PAIRS, GET_ORDER_BOOK, GET_KLINES } from '../graphql/queries';
import type { 
  TradingPair,
  MarketDataResponse,
  OrderBookResponse,
  KlineResponse
} from '../types/market';

// 使用交易对数据的Hook
export const useTradingPairs = () => {
  const { data, loading, error, refetch } = useQuery<MarketDataResponse>(GET_TRADING_PAIRS, {
    pollInterval: 5000, // 每5秒轮询一次
    errorPolicy: 'all',
    notifyOnNetworkStatusChange: true,
  });

  return {
    tradingPairs: data?.tradingPairs || [],
    loading,
    error,
    refetch,
  };
};

// 使用订单薄数据的Hook
export const useOrderBook = (symbol: string) => {
  const { data, loading, error, refetch } = useQuery<OrderBookResponse>(GET_ORDER_BOOK, {
    variables: { symbol },
    skip: !symbol,
    pollInterval: 2000, // 订单薄更新更频繁
    errorPolicy: 'all',
  });

  return {
    orderBook: data?.orderBook,
    loading,
    error,
    refetch,
  };
};

// 使用K线数据的Hook
export const useKlines = (symbol: string, interval: string = '1m', limit: number = 100) => {
  const { data, loading, error, refetch } = useQuery<KlineResponse>(GET_KLINES, {
    variables: { symbol, interval, limit },
    skip: !symbol,
    pollInterval: 10000, // K线数据10秒更新一次
    errorPolicy: 'all',
  });

  return {
    klines: data?.klines || [],
    loading,
    error,
    refetch,
  };
};

// 搜索过滤Hook
export const useMarketSearch = (tradingPairs: TradingPair[]) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredPairs, setFilteredPairs] = useState<TradingPair[]>(tradingPairs);

  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredPairs(tradingPairs);
    } else {
      const filtered = tradingPairs.filter(pair =>
        pair.symbol.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredPairs(filtered);
    }
  }, [searchTerm]);

  return {
    searchTerm,
    setSearchTerm,
    filteredPairs,
  };
};