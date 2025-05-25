import type { TradingPair, OrderBook, KlineData } from '../types/market';

// 模拟交易对数据
const MOCK_SYMBOLS = [
  'BTCUSDT', 'ETHUSDT', 'BNBUSDT', 'ADAUSDT', 'XRPUSDT',
  'SOLUSDT', 'DOTUSDT', 'DOGEUSDT', 'AVAXUSDT', 'SHIBUSDT',
  'MATICUSDT', 'LTCUSDT', 'UNIUSDT', 'LINKUSDT', 'ATOMUSDT',
  'ETCUSDT', 'XLMUSDT', 'BCHUSDT', 'FILUSDT', 'TRXUSDT'
];

// 生成随机价格变化
const generatePriceChange = (basePrice: number): { price: number; change: number; changePercent: number } => {
  const changePercent = (Math.random() - 0.5) * 20; // -10% 到 +10%
  const change = basePrice * (changePercent / 100);
  const newPrice = basePrice + change;
  
  return {
    price: Math.max(newPrice, 0.01), // 确保价格为正
    change,
    changePercent
  };
};

// 生成随机交易量
const generateVolume = (): number => {
  return Math.random() * 10000000 + 100000; // 10万到1000万之间
};

// 基础价格映射
const BASE_PRICES: Record<string, number> = {
  'BTCUSDT': 45000,
  'ETHUSDT': 3200,
  'BNBUSDT': 320,
  'ADAUSDT': 0.85,
  'XRPUSDT': 0.62,
  'SOLUSDT': 95,
  'DOTUSDT': 18,
  'DOGEUSDT': 0.08,
  'AVAXUSDT': 42,
  'SHIBUSDT': 0.000025,
  'MATICUSDT': 1.15,
  'LTCUSDT': 180,
  'UNIUSDT': 25,
  'LINKUSDT': 15,
  'ATOMUSDT': 12,
  'ETCUSDT': 35,
  'XLMUSDT': 0.25,
  'BCHUSDT': 420,
  'FILUSDT': 8.5,
  'TRXUSDT': 0.095
};

// 生成模拟交易对数据
export const generateMockTradingPairs = (): TradingPair[] => {
  return MOCK_SYMBOLS.map(symbol => {
    const basePrice = BASE_PRICES[symbol] || Math.random() * 100;
    const { price, change, changePercent } = generatePriceChange(basePrice);
    const volume = generateVolume();

    return {
      symbol,
      lastPrice: price,
      volume,
      priceChange24h: change,
      priceChangePercent24h: changePercent
    };
  });
};

// 生成模拟订单薄数据
export const generateMockOrderBook = (symbol: string): OrderBook => {
  const basePrice = BASE_PRICES[symbol] || Math.random() * 100;
  const spread = basePrice * 0.001; // 0.1% 价差
  
  // 生成买单 (bids)
  const bids = Array.from({ length: 10 }, (_, i) => ({
    price: basePrice - spread - (i * spread * 0.1),
    quantity: Math.random() * 100 + 10
  })).sort((a, b) => b.price - a.price);

  // 生成卖单 (asks)
  const asks = Array.from({ length: 10 }, (_, i) => ({
    price: basePrice + spread + (i * spread * 0.1),
    quantity: Math.random() * 100 + 10
  })).sort((a, b) => a.price - b.price);

  return {
    symbol,
    bids,
    asks,
    timestamp: Date.now()
  };
};

// 生成模拟K线数据
export const generateMockKlines = (symbol: string, interval: string = '1m', limit: number = 100): KlineData[] => {
  const basePrice = BASE_PRICES[symbol] || Math.random() * 100;
  const now = Date.now();
  const intervalMs = getIntervalMs(interval);
  
  return Array.from({ length: limit }, (_, i) => {
    const timestamp = now - (limit - i - 1) * intervalMs;
    const volatility = basePrice * 0.02; // 2% 波动率
    
    const open = basePrice + (Math.random() - 0.5) * volatility;
    const close = open + (Math.random() - 0.5) * volatility * 0.5;
    const high = Math.max(open, close) + Math.random() * volatility * 0.3;
    const low = Math.min(open, close) - Math.random() * volatility * 0.3;
    const volume = Math.random() * 1000000 + 10000;

    return {
      timestamp,
      open: Math.max(open, 0.01),
      high: Math.max(high, 0.01),
      low: Math.max(low, 0.01),
      close: Math.max(close, 0.01),
      volume
    };
  });
};

// 获取时间间隔的毫秒数
const getIntervalMs = (interval: string): number => {
  const intervalMap: Record<string, number> = {
    '1m': 60 * 1000,
    '5m': 5 * 60 * 1000,
    '15m': 15 * 60 * 1000,
    '30m': 30 * 60 * 1000,
    '1h': 60 * 60 * 1000,
    '4h': 4 * 60 * 60 * 1000,
    '1d': 24 * 60 * 60 * 1000
  };
  
  return intervalMap[interval] || intervalMap['1m'];
};

// 模拟网络延迟
export const simulateNetworkDelay = (min: number = 100, max: number = 500): Promise<void> => {
  const delay = Math.random() * (max - min) + min;
  return new Promise(resolve => setTimeout(resolve, delay));
};

// 模拟网络错误
export const simulateNetworkError = (errorRate: number = 0.1): boolean => {
  return Math.random() < errorRate;
};