//webpack.config.js
const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
  entry: './src/index.ts',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
    clean: true
  },
  resolve: {
    extensions: ['.ts', '.js']
  },
  devtool: 'source-map',
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: 'ts-loader',
        exclude: /node_modules/
      },
      {
        test: /\.(png|jpe?g|gif|svg)$/i,
        type: 'asset/resource'
      },
      {
        test: /\.(mp3|wav|ogg)$/i,
        type: 'asset/resource'
      },
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader']
      },
      {
        test: /\.(json|atlas|txt)$/i,
        type: 'asset/resource',
        exclude: path.resolve(__dirname, 'public')
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      templateContent: `
        <!DOCTYPE html>
        <html lang="en">
          <head>
            <meta charset="UTF-8" />
            <title>Phaser Uptime</title>
            <style>
              body {
                margin: 0;
                padding: 0;
                background-color: #1d1d1d;
                display: flex;
                justify-content: center;
                align-items: center;
                min-height: 100vh;
              }
              #game {
                box-shadow: 0 0 20px rgba(0, 0, 0, 0.5);
              }
            </style>
          </head>
          <body>
            <div id="game"></div>
            <script src="bundle.js"></script>
          </body>
        </html>
      `
    })
  ],
  devServer: {
    static: [
      {
        directory: path.resolve(__dirname, 'dist')
      },
      {
        directory: path.resolve(__dirname, 'public/assets'),
        publicPath: '/assets/'             
      }
    ],
    
    open: true,
    hot: true,
    port: 3000
  },
  mode: 'development'
}
