import commonjs from '@rollup/plugin-commonjs'
import resolve from '@rollup/plugin-node-resolve'
import peerDepsExternal from 'rollup-plugin-peer-deps-external'
import typescript from 'rollup-plugin-typescript2'
import { createRequire } from 'node:module'

const packageJson = createRequire(import.meta.url)('./package.json')

export default {
	input: './src/index.tsx',
	output: [
		{
			file: packageJson.main,
			format: 'cjs',
			sourcemap: true,
		},
		{
			file: packageJson.module,
			format: 'esm',
			sourcemap: true,
		},
	],
	external: ['react'],
	plugins: [peerDepsExternal(), resolve(), commonjs(), typescript()],
}
