# FIX 交易对行情系统

一个基于 React + TypeScript + Apollo Client 构建的实时交易对行情展示系统，支持从 FIX 协议获取交易数据并进行实时展示。

## 🚀 功能特性

- **实时数据更新**: 每5秒自动轮询获取最新交易对数据
- **交易对搜索**: 支持按交易对符号进行实时搜索过滤
- **响应式设计**: 完美适配桌面端和移动端设备
- **错误处理**: 完善的加载状态、错误提示和重试机制
- **TypeScript**: 完整的类型安全保障
- **现代化UI**: 美观的界面设计和流畅的交互体验

## 🛠️ 技术栈

- **前端框架**: React 19
- **类型系统**: TypeScript
- **数据获取**: Apollo Client + GraphQL
- **构建工具**: Vite
- **包管理器**: Bun
- **样式**: CSS3 + CSS Modules

## 📦 项目结构

```
src/
├── apollo/                 # Apollo Client 配置
│   ├── client.ts          # Apollo Client 实例
│   └── mockServer.ts      # 模拟 GraphQL 服务器
├── components/            # React 组件
│   ├── ErrorMessage.tsx   # 错误提示组件
│   ├── LoadingSpinner.tsx # 加载状态组件
│   ├── SearchBar.tsx      # 搜索栏组件
│   ├── TradingPairItem.tsx # 交易对列表项
│   └── TradingPairList.tsx # 交易对列表容器
├── graphql/               # GraphQL 查询定义
│   └── queries.ts         # 查询语句
├── hooks/                 # 自定义 React Hooks
│   └── useMarketData.ts   # 市场数据相关 Hooks
├── types/                 # TypeScript 类型定义
│   └── market.ts          # 市场数据类型
├── utils/                 # 工具函数
│   └── mockData.ts        # 模拟数据生成器
├── App.tsx               # 主应用组件
├── App.css               # 应用样式
├── main.tsx              # 应用入口
└── index.css             # 全局样式
```

## 🚀 快速开始

### 环境要求

- Node.js >= 18
- Bun >= 1.0

### 安装依赖

```bash
# 进入项目目录
cd market-list-app

# 安装依赖
bun install
```

### 环境配置

```bash
# 复制环境变量配置文件
cp .env.example .env

# 编辑 .env 文件，配置你的 GraphQL 端点
# VITE_GRAPHQL_ENDPOINT=https://your-fix-api.example.com/graphql
```

### 启动开发服务器

```bash
bun run dev
```

应用将在 `http://localhost:5173` 启动。

### 构建生产版本

```bash
bun run build
```

### 预览生产版本

```bash
bun run preview
```

## 📊 数据模型

### 交易对信息 (TradingPair)

```typescript
interface TradingPair {
  symbol: string;              // 交易对符号，如 "BTCUSDT"
  lastPrice: number;           // 最新价格
  volume: number;              // 24小时交易量
  priceChange24h: number;      // 24小时价格变化
  priceChangePercent24h: number; // 24小时价格变化百分比
}
```

### 订单薄信息 (OrderBook)

```typescript
interface OrderBook {
  symbol: string;              // 交易对符号
  bids: OrderBookEntry[];      // 买单列表
  asks: OrderBookEntry[];      // 卖单列表
  timestamp: number;           // 时间戳
}

interface OrderBookEntry {
  price: number;               // 价格
  quantity: number;            // 数量
}
```

### K线数据 (KlineData)

```typescript
interface KlineData {
  timestamp: number;           // 时间戳
  open: number;               // 开盘价
  high: number;               // 最高价
  low: number;                // 最低价
  close: number;              // 收盘价
  volume: number;             // 成交量
}
```

## 🔧 配置说明

### Apollo Client 配置

项目支持两种数据源模式：

1. **模拟数据模式**（默认）: 用于开发和演示
2. **真实API模式**: 连接到实际的 FIX 协议数据源

通过设置环境变量 `VITE_GRAPHQL_ENDPOINT` 来切换模式。

### 轮询配置

- 交易对数据: 每5秒更新
- 订单薄数据: 每2秒更新
- K线数据: 每10秒更新

可以通过修改 `useMarketData.ts` 中的 `pollInterval` 参数来调整轮询频率。

## 🎨 UI 特性

- **现代化设计**: 采用渐变背景和毛玻璃效果
- **响应式布局**: 完美适配各种屏幕尺寸
- **暗色主题**: 自动适配系统主题偏好
- **加载状态**: 骨架屏和加载动画
- **错误处理**: 友好的错误提示和重试机制
- **搜索功能**: 实时搜索过滤交易对

## 🔌 扩展功能

项目预留了以下扩展接口：

1. **订单薄展示**: 可以扩展显示买卖盘深度
2. **K线图表**: 可以集成图表库显示价格走势
3. **实时推送**: 可以替换轮询为 WebSocket 实时推送
4. **更多指标**: 可以添加更多技术指标和市场数据

## 🚨 注意事项

1. **数据源**: 当前使用模拟数据，生产环境需要配置真实的 FIX 协议数据源
2. **认证**: 如果 API 需要认证，请在 `.env` 文件中配置 `VITE_API_TOKEN`
3. **CORS**: 确保 GraphQL 端点支持跨域请求
4. **性能**: 大量数据时建议实现虚拟滚动优化性能

## 📝 开发指南

### 添加新的查询

1. 在 `src/graphql/queries.ts` 中定义 GraphQL 查询
2. 在 `src/types/market.ts` 中添加对应的 TypeScript 类型
3. 在 `src/hooks/useMarketData.ts` 中创建自定义 Hook
4. 在组件中使用新的 Hook

### 自定义样式

项目使用 CSS Modules 和全局样式相结合的方式：
- 组件样式: 使用独立的 `.css` 文件
- 全局样式: 在 `src/App.css` 和 `src/index.css` 中定义

### 错误处理

项目提供了完善的错误处理机制：
- 网络错误自动重试
- 用户友好的错误提示
- 开发环境显示详细错误信息

## 🤝 贡献指南

1. Fork 项目
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 创建 Pull Request

## 📄 许可证

本项目采用 MIT 许可证。

## 🙏 致谢

- [React](https://reactjs.org/) - 用户界面库
- [Apollo Client](https://www.apollographql.com/docs/react/) - GraphQL 客户端
- [Vite](https://vitejs.dev/) - 构建工具
- [Bun](https://bun.sh/) - JavaScript 运行时和包管理器
