import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTradingPairs, useMarketSearch } from '../hooks/useMarketData';
import { SearchBar } from './SearchBar';
import { TradingPairItem } from './TradingPairItem';
import { LoadingSpinner, TradingPairSkeleton } from './LoadingSpinner';
import { ErrorMessage } from './ErrorMessage';

export const TradingPairList: React.FC = () => {
  const navigate = useNavigate();
  const { tradingPairs, loading, error, refetch } = useTradingPairs();
  const { searchTerm, setSearchTerm, filteredPairs } = useMarketSearch(tradingPairs);
  const [selectedSymbol] = useState<string | null>(null);

  const handlePairClick = (symbol: string) => {
    // 导航到交易对详情页面
    navigate(`/trading/${symbol}`);
  };

  const handleRetry = () => {
    refetch();
  };

  // 错误状态
  if (error && !loading && tradingPairs.length === 0) {
    return (
      <div className="w-full max-w-6xl mx-auto p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">交易对行情</h2>
          <div className="flex items-center gap-2 text-gray-300">
            <span className="text-sm">自动刷新: 5秒</span>
          </div>
        </div>
        <ErrorMessage 
          error={error} 
          onRetry={handleRetry}
          title="获取交易对数据失败"
        />
      </div>
    );
  }

  return (
    <div className="w-full max-w-6xl mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white">交易对行情</h2>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-gray-300">
            <div className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="23 4 23 10 17 10"></polyline>
                <polyline points="1 20 1 14 7 14"></polyline>
                <path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15"></path>
              </svg>
            </div>
            <span className="text-sm">自动刷新: 5秒</span>
          </div>
          <button 
            onClick={handleRetry} 
            className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={loading}
            title="手动刷新"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="23 4 23 10 17 10"></polyline>
              <polyline points="1 20 1 14 7 14"></polyline>
              <path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15"></path>
            </svg>
          </button>
        </div>
      </div>

      <SearchBar 
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        placeholder="搜索交易对 (例如: BTC, ETH, USDT)"
      />

      <div className="flex items-center justify-between mb-4 text-sm">
        <span className="text-gray-300">
          显示 {filteredPairs.length} / {tradingPairs.length} 个交易对
        </span>
        {error && (
          <span className="flex items-center gap-1 text-yellow-400" title={error.message}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="15" y1="9" x2="9" y2="15"></line>
              <line x1="9" y1="9" x2="15" y2="15"></line>
            </svg>
            数据可能不是最新
          </span>
        )}
      </div>

      <div className="min-h-[400px]">
        {loading && tradingPairs.length === 0 ? (
          <TradingPairSkeleton />
        ) : filteredPairs.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-12 h-12 mb-4 text-gray-400">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8"></circle>
                <path d="m21 21-4.35-4.35"></path>
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">未找到匹配的交易对</h3>
            <p className="text-gray-400 mb-4">请尝试其他搜索关键词</p>
            {searchTerm && (
              <button 
                onClick={() => setSearchTerm('')}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              >
                清除搜索
              </button>
            )}
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredPairs.map((pair) => (
              <TradingPairItem
                key={pair.symbol}
                pair={pair}
                onClick={handlePairClick}
                isSelected={selectedSymbol === pair.symbol}
              />
            ))}
          </div>
        )}
      </div>

      {loading && tradingPairs.length > 0 && (
        <div className="fixed bottom-4 right-4 bg-black/80 backdrop-blur-sm rounded-lg p-3">
          <LoadingSpinner size="small" message="更新中..." />
        </div>
      )}
    </div>
  );
};