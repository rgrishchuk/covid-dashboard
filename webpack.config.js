var path = require('path');
const miniCss = require('mini-css-extract-plugin');

module.exports = {
  entry: './src/js/main.js',
  module: {
    rules: [
      {
        test: /\.(js)$/,
        exclude: /node_modules/,
        use: ["eslint-loader"]
      },
      {
        test:/\.(s*)css$/,
        use: [
           miniCss.loader,
           'css-loader',
           'sass-loader',
        ]
      }
    ]
  },
  plugins: [
    new miniCss({
       filename: 'style.css',
    }),
  ],
  output: {
    filename: 'index.js',
    path: __dirname,
  }
};