const path = require('path')
const nodeExternals = require('webpack-node-externals')

const PATHS = {
  app: path.join(__dirname, 'src/app.js'),
  build: path.join(__dirname, 'dist'),
}

module.exports = {
  entry: {
    app: PATHS.app,
  },
  output: {
    path: PATHS.build,
    filename: 'index.js',
  },
  externals: [
    nodeExternals({
      whitelist: ['expressjs', 'encoding', 'needle'],
    }),
  ],
  target: 'node',
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules)/,
        use: {
          loader: 'babel-loader',
          query: {
            cacheDirectory: true,
            presets: ['@babel/preset-env'],
            plugins: ['@babel/plugin-transform-runtime'],
          },
        },
      },
    ],
  },
}
