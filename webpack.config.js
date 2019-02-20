const CleanWebpackPlugin = require('clean-webpack-plugin')
const MiniCSSExtractPlugin = require('mini-css-extract-plugin')
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin")
const UglifyJSWebpackPlugin = require("uglifyjs-webpack-plugin")
const merge = require('webpack-merge')
const path = require('path')
const webpack = require('webpack')

const isDev = process.env.NODE_ENV !== 'production'
const resolveFromRoot = dir => {
	return path.resolve(__dirname, dir)
}

const base = {
	context: resolveFromRoot('src'),
	entry: './main.js',
	output: {
		filename: 'js/main.bundle.js',
		path: resolveFromRoot('static'),
		publicPath: '/'
	},
	module: {
		rules: [
			{
				test: /\.js$/,
				exclude: /node_modules/,
				use: {
					loader: 'babel-loader',
					options: {
						presets: ['@babel/preset-env']
					}
				}
			},
			{
				test: /\.(woff|woff2|eot|ttf|otf)$/,
				use: {
					loader: 'file-loader',
					options: {
						name: 'fonts/[hash].[ext]'
					}
				}
			}
		]
	}
}

const dev = merge(base, {
	mode: 'development',
	module: {
		rules: [
			{
				test: /\.css$/,
				use: ['style-loader', 'css-loader']
			}
		]
	},
	devServer: {
		contentBase: resolveFromRoot('static'),
		port: 1314,
		stats: 'errors-only',
		hot: true
	},
	plugins: [
		new webpack.HotModuleReplacementPlugin()
	]
})

const prod = merge(base, {
	mode: 'production',
	module: {
		rules: [
			{
				test: /\.css$/,
				use: [
					MiniCSSExtractPlugin.loader,
					'css-loader',
					{
						loader: 'postcss-loader',
						options: {
							plugins: [
								require('autoprefixer')
							]
						}
					}
				]
			}
		]
	},
	plugins: [
		new CleanWebpackPlugin('js', {
			root: resolveFromRoot('static')
		}),
		new CleanWebpackPlugin('css', {
			root: resolveFromRoot('static')
		}),
		new MiniCSSExtractPlugin({
			filename: 'css/[name].bundle.css'
		})
	],
	optimization: {
		minimizer: [
			new UglifyJSWebpackPlugin(),
			new OptimizeCSSAssetsPlugin()
		]
	}
})

const config = isDev ? dev : prod
module.exports = config