import commonjs from '@rollup/plugin-commonjs'
import resolve from '@rollup/plugin-node-resolve'
import peerDepsExternal from 'rollup-plugin-peer-deps-external'
import typescript from 'rollup-plugin-typescript2'

export default {
	input: './src/index.tsx',
	output: {
		file: './dist/index.js',
		format: 'esm',
		sourcemap: true,
	},
	external: ['react'],
	plugins: [
		peerDepsExternal(),
		resolve(),
		commonjs(),
		typescript({
			// Keep stories and tests out of the published type declarations.
			exclude: ['**/stories/**', '**/*.test.ts', '**/*.test.tsx'],
		}),
	],
}
