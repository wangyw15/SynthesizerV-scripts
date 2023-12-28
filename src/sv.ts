import * as esbuild from 'esbuild'

let svPlugin: esbuild.Plugin = {
    name: 'sv',
    setup(build) {
        build.onResolve({ filter: /^sv$/ }, args => {
            return { path: args.path, namespace: 'sv' }
        })
        build.onLoad({ filter: /.*/, namespace: 'sv' }, args => {
            return {
                contents: '{}',
                loader: 'json',
            }
        })
    }
}

export { svPlugin }
