const path = require('path');

module.exports = {
  entry: './src/index.js',
  target: 'node',
  resolve: {extensions: ['.js']},
  externals: [/(node_modules|main\..*\.js)/,],
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'index.js'
  },
  optimization: {
    minimize: true
  },
};
