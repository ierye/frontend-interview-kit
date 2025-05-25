import type { FederationRuntimePlugin } from '@module-federation/enhanced/runtime'

const runtimePlugin: () => FederationRuntimePlugin = function () {
  return {
    name: 'co-runtime-plugin',
    beforeRequest(args) {
      console.log('beforeRequest', args)
      return args
    },
    afterResolve(args) {
      if (import.meta.env.DEV) {
        const origin = new URL(args.remoteInfo.version ?? '').origin

        args.remoteInfo.entry = `${origin}${args.remoteInfo.entry}`
      }
      console.log('afterResolve', args)
      return args
    },
    onLoad(args) {
      console.log('onLoad: ', args)
      return args
    },
  }
}

export default runtimePlugin
