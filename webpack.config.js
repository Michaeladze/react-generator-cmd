const path = require('path');

module.exports = {
  mode: 'production',
  entry: './templater/index.ts',
  target: 'node',
  resolve: {
    extensions: ['.js', '.ts'],
    modules: [__dirname, 'node_modules']
  },
  module: {
    rules: [
      {
        test: /\.(js|ts)$/,
        use: {
          loader: 'babel-loader'
        },
        exclude: [path.resolve(__dirname, 'node_modules'), /(spec|test)\.(js|ts)$/]
      }
    ]
  },
  externals: [/(node_modules|main\..*\.js)/, ],
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'index.js'
  },
  optimization: {
    minimize: false
  },
};
