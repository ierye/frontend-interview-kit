import React from 'react';

interface ErrorMessageProps {
  error: Error | string;
  onRetry?: () => void;
  title?: string;
  showDetails?: boolean;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({
  error,
  onRetry,
  title = '加载失败',
  showDetails = false,
}) => {
  const errorMessage = typeof error === 'string' ? error : error.message;
  const errorDetails = typeof error === 'object' && error.stack ? error.stack : null;

  return (
    <div className="flex flex-col items-center justify-center p-8 text-center bg-red-500/10 border border-red-500/20 rounded-lg">
      <div className="w-12 h-12 mb-4 text-red-400">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="15" y1="9" x2="9" y2="15"></line>
          <line x1="9" y1="9" x2="15" y2="15"></line>
        </svg>
      </div>
      
      <div className="max-w-md">
        <h3 className="text-xl font-semibold text-white mb-2">{title}</h3>
        <p className="text-gray-300 mb-4">{errorMessage}</p>
        
        {showDetails && errorDetails && (
          <details className="mb-4 text-left">
            <summary className="cursor-pointer text-gray-400 hover:text-gray-300 mb-2">查看详细信息</summary>
            <pre className="text-xs text-gray-500 bg-black/20 p-3 rounded border overflow-auto max-h-32">{errorDetails}</pre>
          </details>
        )}
        
        {onRetry && (
          <button 
            onClick={onRetry} 
            className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="23 4 23 10 17 10"></polyline>
              <polyline points="1 20 1 14 7 14"></polyline>
              <path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15"></path>
            </svg>
            重试
          </button>
        )}
      </div>
    </div>
  );
};

// 网络错误组件
export const NetworkError: React.FC<{ onRetry?: () => void }> = ({ onRetry }) => {
  return (
    <ErrorMessage
      error="网络连接失败，请检查您的网络连接"
      title="网络错误"
      onRetry={onRetry}
    />
  );
};

// GraphQL错误组件
export const GraphQLError: React.FC<{ error: Error; onRetry?: () => void }> = ({ error, onRetry }) => {
  return (
    <ErrorMessage
      error={error}
      title="数据获取失败"
      onRetry={onRetry}
      showDetails={import.meta.env.DEV}
    />
  );
};