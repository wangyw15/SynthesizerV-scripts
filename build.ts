import * as esbuild from 'esbuild'
import { mappingPlugin } from './src/fix_char/mapping_generator'
import { svPlugin } from './src/sv'

esbuild.build({
    entryPoints: ['src/fix_char/index.ts'],
    bundle: true,
    outfile: 'dist/fix_char.js',
    plugins: [mappingPlugin, svPlugin],
    treeShaking: false,
    target: ['es2015'],
    charset: 'utf8',
    format: 'esm',
})
