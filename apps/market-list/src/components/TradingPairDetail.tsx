import React, { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useOrderBook, useKlines } from '../hooks/useMarketData';
import { LoadingSpinner } from './LoadingSpinner';
import { ErrorMessage } from './ErrorMessage';
import type {CandlestickData, Time, WhitespaceData} from 'lightweight-charts';
import { createChart, ColorType, CandlestickSeries } from 'lightweight-charts';

interface TradingPairDetailProps {
  symbol?: string;
}

export const TradingPairDetail: React.FC<TradingPairDetailProps> = () => {
  const { symbol } = useParams<{ symbol: string }>();
  const navigate = useNavigate();
  const [interval, setInterval] = useState<string>('1m');
  const chartContainerRef = useRef<HTMLDivElement>(null);
  
  // 获取订单薄数据
  const { 
    orderBook, 
    loading: orderBookLoading, 
    error: orderBookError,
    refetch: refetchOrderBook 
  } = useOrderBook(symbol || '');

  // 获取K线数据
  const { 
    klines, 
    loading: klinesLoading, 
    error: klinesError,
    refetch: refetchKlines 
  } = useKlines(symbol || '', interval, 100);

  // 处理返回按钮点击
  const handleBack = () => {
    navigate('/');
  };

  // 处理刷新按钮点击
  const handleRefresh = () => {
    refetchOrderBook();
    refetchKlines();
  };

  // 处理时间间隔变更
  const handleIntervalChange = (newInterval: string) => {
    setInterval(newInterval);
  };

  // 格式化价格
  const formatPrice = (price: number): string => {
    return price.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 8,
    });
  };

  // 使用useEffect创建和更新图表
  useEffect(() => {
    if (klinesLoading || !klines.length || !chartContainerRef.current) return;

    // 清除之前的图表
    const container = chartContainerRef.current;
    container.innerHTML = '';

    // 创建新图表
    const chart = createChart(container, {
      layout: {
        background: { type: ColorType.Solid, color: 'rgba(0, 0, 0, 0.2)' },
        textColor: 'rgba(255, 255, 255, 0.9)',
      },
      width: container.clientWidth,
      height: container.clientHeight,
      grid: {
        vertLines: {
          color: 'rgba(255, 255, 255, 0.1)',
        },
        horzLines: {
          color: 'rgba(255, 255, 255, 0.1)',
        },
      },
      timeScale: {
        borderColor: 'rgba(255, 255, 255, 0.2)',
      },
      crosshair: {
        mode: 1,
        vertLine: {
          color: 'rgba(255, 255, 255, 0.4)',
        },
        horzLine: {
          color: 'rgba(255, 255, 255, 0.4)',
        },
      },
    });

    // 添加蜡烛图系列
    const candlestickSeries = chart.addSeries(CandlestickSeries, {
      upColor: '#26a69a',
      downColor: '#ef5350',
      borderVisible: false,
      wickUpColor: '#26a69a',
      wickDownColor: '#ef5350',
    });

    // 转换数据格式
    const formattedData = klines.map<CandlestickData<Time> | WhitespaceData<Time>>(kline => ({
      time: (kline.timestamp / 1000) as Time, // 转换为秒
      open: kline.open,
      high: kline.high,
      low: kline.low,
      close: kline.close,
    }));

    // 设置数据
    candlestickSeries.setData(formattedData);

    // 自适应图表大小
    chart.timeScale().fitContent();

    // 处理窗口大小变化
    const handleResize = () => {
      chart.applyOptions({ width: container.clientWidth });
    };

    window.addEventListener('resize', handleResize);

    // 清理函数
    return () => {
      window.removeEventListener('resize', handleResize);
      chart.remove();
    };
  }, [klines, klinesLoading]);

  // 加载状态
  const isLoading = orderBookLoading || klinesLoading;
  
  // 错误状态
  const error = orderBookError || klinesError;

  if (!symbol) {
    return (
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-indigo-500 to-purple-600 dark:from-gray-700 dark:to-gray-900 font-sans antialiased animate-fadeInUp">
        <header className="bg-white/10 backdrop-blur-md border-b border-white/20 py-8 text-center animate-fadeInUp">
          <div className="max-w-6xl mx-auto px-8 md:px-4">
            <h1 className="text-5xl md:text-4xl sm:text-3xl font-bold text-white mb-4 flex items-center justify-center gap-4 md:flex-col md:gap-2 drop-shadow-lg">
              <span className="text-6xl md:text-5xl sm:text-4xl drop-shadow-lg">📈</span>
              FIX 交易对行情系统
            </h1>
          </div>
        </header>
        
        <main className="flex-1 py-8 md:py-4 animate-fadeInUp-delay-100">
          <div className="w-full max-w-6xl mx-auto p-6">
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-6 text-center">
              <h2 className="text-2xl font-bold text-white mb-4">交易对不存在</h2>
              <p className="text-gray-300 mb-6">未找到指定的交易对信息</p>
              <button
                onClick={handleBack}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              >
                返回首页
              </button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-indigo-500 to-purple-600 dark:from-gray-700 dark:to-gray-900 font-sans antialiased animate-fadeInUp">
      <header className="bg-white/10 backdrop-blur-md border-b border-white/20 py-8 text-center animate-fadeInUp">
        <div className="max-w-6xl mx-auto px-8 md:px-4">
          <h1 className="text-5xl md:text-4xl sm:text-3xl font-bold text-white mb-4 flex items-center justify-center gap-4 md:flex-col md:gap-2 drop-shadow-lg">
            <span className="text-6xl md:text-5xl sm:text-4xl drop-shadow-lg">📈</span>
            FIX 交易对行情系统
          </h1>
        </div>
      </header>
      
      <main className="flex-1 py-8 md:py-4 animate-fadeInUp-delay-100">
        <div className="w-full max-w-6xl mx-auto p-6">
          {/* 头部导航 */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <button
                onClick={handleBack}
                className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
                title="返回"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-white">
                  <path d="M19 12H5M12 19l-7-7 7-7" />
                </svg>
              </button>
              <h2 className="text-2xl font-bold text-white">
                {symbol.includes('USDT') ? (
                  <>
                    {symbol.replace('USDT', '')}
                    <span className="text-gray-300 text-sm">/USDT</span>
                  </>
                ) : (
                  symbol
                )}
              </h2>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleRefresh}
                className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isLoading}
                title="刷新数据"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-white">
                  <polyline points="23 4 23 10 17 10"></polyline>
                  <polyline points="1 20 1 14 7 14"></polyline>
                  <path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15"></path>
                </svg>
              </button>
            </div>
          </div>

          {/* 错误信息 */}
          {error && (
            <div className="mb-6">
              <ErrorMessage
                error={error}
                onRetry={handleRefresh}
                title={`获取${symbol}数据失败`}
              />
            </div>
          )}

          {/* 主内容区 */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* K线图区域 */}
            <div className="lg:col-span-2 bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-white">K线图</h3>
                <div className="flex items-center gap-2">
                  {['1m', '5m', '15m', '30m', '1h', '4h', '1d'].map((i) => (
                    <button
                      key={i}
                      onClick={() => handleIntervalChange(i)}
                      className={`px-2 py-1 text-xs rounded ${interval === i ? 'bg-blue-600 text-white' : 'bg-white/10 text-gray-300 hover:bg-white/20'}`}
                    >
                      {i}
                    </button>
                  ))}
                </div>
              </div>
              
              {klinesLoading ? (
                <div className="flex items-center justify-center h-80">
                  <LoadingSpinner size="medium" message="加载K线数据..." />
                </div>
              ) : klines.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-80 text-center">
                  <div className="w-12 h-12 mb-4 text-gray-400">
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18"></rect>
                      <line x1="7" y1="2" x2="7" y2="22"></line>
                      <line x1="17" y1="2" x2="17" y2="22"></line>
                      <line x1="2" y1="12" x2="22" y2="12"></line>
                      <line x1="2" y1="7" x2="7" y2="7"></line>
                      <line x1="2" y1="17" x2="7" y2="17"></line>
                      <line x1="17" y1="17" x2="22" y2="17"></line>
                      <line x1="17" y1="7" x2="22" y2="7"></line>
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">暂无K线数据</h3>
                  <p className="text-gray-400">请稍后再试或选择其他时间间隔</p>
                </div>
              ) : (
                <div className="h-80 bg-black/20 rounded-lg overflow-hidden" ref={chartContainerRef}></div>
              )}
            </div>

            {/* 订单薄区域 */}
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-white mb-4">订单薄</h3>
              
              {orderBookLoading ? (
                <div className="flex items-center justify-center h-80">
                  <LoadingSpinner size="medium" message="加载订单薄..." />
                </div>
              ) : !orderBook ? (
                <div className="flex flex-col items-center justify-center h-80 text-center">
                  <div className="w-12 h-12 mb-4 text-gray-400">
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">暂无订单薄数据</h3>
                  <p className="text-gray-400">请稍后再试</p>
                </div>
              ) : (
                <div>
                  {/* 卖单区域 */}
                  <div className="mb-4">
                    <div className="text-sm text-gray-400 mb-2">卖单 (Asks)</div>
                    <div className="space-y-1 max-h-40 overflow-y-auto">
                      {orderBook.asks.map((ask, index) => (
                        <div key={`ask-${index}`} className="flex justify-between text-sm">
                          <span className="text-red-400">${formatPrice(ask.price)}</span>
                          <span className="text-gray-300">{ask.quantity.toFixed(4)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* 买单区域 */}
                  <div>
                    <div className="text-sm text-gray-400 mb-2">买单 (Bids)</div>
                    <div className="space-y-1 max-h-40 overflow-y-auto">
                      {orderBook.bids.map((bid, index) => (
                        <div key={`bid-${index}`} className="flex justify-between text-sm">
                          <span className="text-green-400">${formatPrice(bid.price)}</span>
                          <span className="text-gray-300">{bid.quantity.toFixed(4)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};