import { init,registerPlugins } from '@module-federation/enhanced/runtime'
import BridgeReactPlugin from '@module-federation/bridge-react/plugin';

import runtimePlugin from './modPlugin'

const remotes = [
  {
    name: '@mf/quotes',
    // mf-manifest.json 是在 Module federation 新版构建工具中生成的文件类型，对比 remoteEntry 提供了更丰富的功能
    // 预加载功能依赖于使用 mf-manifest.json 文件类型
    entry: `http://localhost:9001/quotes/assets/mf-manifest.json`,
    alias: 'quotes',
  },
  {
    name: '@mf/trade',
    entry: `http://localhost:9002/trade/assets/mf-manifest.json`,
    alias: 'trade',
  }
]

init({
  name: '@mf/host',
  remotes,
})

if (import.meta.env.DEV) {
  registerPlugins([runtimePlugin(), BridgeReactPlugin()])
}
