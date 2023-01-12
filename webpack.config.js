const path = require('path');

module.exports = {
  entry: './src/background.js',
  output: {
    filename: 'background.js',
    path: path.resolve(__dirname, 'dist'),
  },
  devtool : 'inline-source-map',
};