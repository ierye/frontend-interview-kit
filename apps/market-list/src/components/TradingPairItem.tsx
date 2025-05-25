import React from 'react';
import type { TradingPair } from '../types/market';

interface TradingPairItemProps {
  pair: TradingPair;
  onClick?: (symbol: string) => void;
  isSelected?: boolean;
}

export const TradingPairItem: React.FC<TradingPairItemProps> = ({
  pair,
  onClick,
  isSelected = false,
}) => {
  const formatPrice = (price: number): string => {
    return price.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 8,
    });
  };

  const formatVolume = (volume: number): string => {
    if (volume >= 1e9) {
      return `${(volume / 1e9).toFixed(2)}B`;
    } else if (volume >= 1e6) {
      return `${(volume / 1e6).toFixed(2)}M`;
    } else if (volume >= 1e3) {
      return `${(volume / 1e3).toFixed(2)}K`;
    }
    return volume.toFixed(2);
  };

  const formatPercentage = (percentage: number): string => {
    const sign = percentage >= 0 ? '+' : '';
    return `${sign}${percentage.toFixed(2)}%`;
  };

  const getPriceChangeColors = (change: number) => {
    if (change > 0) return 'text-green-400';
    if (change < 0) return 'text-red-400';
    return 'text-gray-400';
  };

  return (
    <div 
      className={`bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-4 hover:bg-white/10 transition-all duration-200 cursor-pointer flex items-center justify-between ${
        isSelected ? 'ring-2 ring-blue-400 bg-white/15' : ''
      }`}
      onClick={() => onClick?.(pair.symbol)}
    >
      <div className="flex-1">
        <div className="text-white font-semibold text-lg mb-1">
          {pair.symbol.includes('USDT') ? (
            <>
              {pair.symbol.replace('USDT', '')}
              <span className="text-gray-300 text-sm">/USDT</span>
            </>
          ) : (
            pair.symbol
          )}
        </div>
        <div className="text-gray-300 text-sm">成交量: {formatVolume(pair.volume)}</div>
      </div>
      
      <div className="text-right mr-4">
        <div className="text-white font-mono text-lg mb-1">
          ${formatPrice(pair.lastPrice)}
        </div>
        <div className={`text-sm font-medium ${getPriceChangeColors(pair.priceChangePercent24h)}`}>
          <span className="mr-2">
            ${formatPrice(Math.abs(pair.priceChange24h))}
          </span>
          <span>
            {formatPercentage(pair.priceChangePercent24h)}
          </span>
        </div>
      </div>

      <div className="flex-shrink-0">
        <svg 
          width="24" 
          height="24" 
          viewBox="0 0 24 24" 
          className={`w-6 h-6 ${getPriceChangeColors(pair.priceChangePercent24h)}`}
        >
          {pair.priceChangePercent24h >= 0 ? (
            <path d="M7 14l5-5 5 5H7z" fill="currentColor" />
          ) : (
            <path d="M7 10l5 5 5-5H7z" fill="currentColor" />
          )}
        </svg>
      </div>
    </div>
  );
};