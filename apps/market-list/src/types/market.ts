// 交易对信息类型
export interface TradingPair {
  symbol: string;
  lastPrice: number;
  volume: number;
  priceChange24h: number;
  priceChangePercent24h: number;
}

// 订单薄条目类型
export interface OrderBookEntry {
  price: number;
  quantity: number;
}

// 订单薄类型
export interface OrderBook {
  symbol: string;
  bids: OrderBookEntry[];
  asks: OrderBookEntry[];
  timestamp: number;
}

// K线数据类型
export interface KlineData {
  timestamp: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

// 市场数据响应类型
export interface MarketDataResponse {
  tradingPairs: TradingPair[];
}

export interface OrderBookResponse {
  orderBook: OrderBook;
}

export interface KlineResponse {
  klines: KlineData[];
}

// Apollo查询状态类型
export interface QueryState<T> {
  data?: T;
  loading: boolean;
  error?: Error;
}