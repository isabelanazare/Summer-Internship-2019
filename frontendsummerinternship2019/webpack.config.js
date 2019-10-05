const HtmlWebPackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');

module.exports = () => {
    let environment = process.env.NODE_ENV || 'development';

    return {
        module: {
            rules: [
                {
                    test: /\.html$/,
                    use: [
                        { loader: 'html-loader', options: { minimize: false } }
                    ]
                },
                {
                    test: /\.css$/,
                    use: [
                        { loader: 'style-loader' },
                        { loader: 'css-loader' }
                    ]
                },
                {
                    test: /\.m?js$/,
                    exclude: /(node_modules|bower_components)/,
                    use: {
                        loader: 'babel-loader'
                    }
                }
            ]
        },
        plugins: [
            new HtmlWebPackPlugin({
                template: './src/index.html',
                filename: './index.html'
            }),
            new webpack.DefinePlugin({
                API_HOSTNAME: JSON.stringify(environment === 'development' 
                    ? 'http://localhost:3000' 
                    : 'https://framework-games-api.herokuapp.com'
                )
            })
        ],
        stats: {
            colors: true
        },
        devtool: 'source-map',
        node: {
            fs: 'empty'
        }
    };
    
};