import { gql } from '@apollo/client';

// 获取交易对列表的查询
export const GET_TRADING_PAIRS = gql`
  query GetTradingPairs {
    tradingPairs {
      symbol
      lastPrice
      volume
      priceChange24h
      priceChangePercent24h
    }
  }
`;

// 获取订单薄数据的查询
export const GET_ORDER_BOOK = gql`
  query GetOrderBook($symbol: String!) {
    orderBook(symbol: $symbol) {
      symbol
      bids {
        price
        quantity
      }
      asks {
        price
        quantity
      }
      timestamp
    }
  }
`;

// 获取K线数据的查询
export const GET_KLINES = gql`
  query GetKlines($symbol: String!, $interval: String!, $limit: Int) {
    klines(symbol: $symbol, interval: $interval, limit: $limit) {
      timestamp
      open
      high
      low
      close
      volume
    }
  }
`;