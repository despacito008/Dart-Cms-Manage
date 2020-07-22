const path = require('path');

let isDev = () => {
    return process.env.NODE_ENV === 'development';
}

module.exports = {
    outputDir: 'dist', // 输出文件目录
    lintOnSave: false, // eslint-loader 是否在保存的时候检查
    publicPath: './',  // 相对于当前入口文件路径
    productionSourceMap: isDev() ? true : false,    // 是否注入源码
    css: {
        sourceMap: isDev() ? true : false,           // 为css注入源码
        extract: isDev() ? false: true
    },
    // 配置路径
    chainWebpack: (config)=>{
        config.resolve.alias
            .set('@', path.join(__dirname, 'src'))
            .set('@assets', path.join(__dirname, 'src/assets'))
            .set('@components', path.join(__dirname, 'src/components'))
            .set('@css', path.join(__dirname, 'src/style'))
            .set('@utils', path.join(__dirname, 'src/utils'))
            .set('@views', path.join(__dirname, 'src/views'))
            .set('@api', path.join(__dirname, 'src/api'))
    },
    // 反向代理
    devServer: {
        proxy: {
            '/api': {
                target: 'http://localhost:9999',
                changeOrigin: true,
                ws: true,
                pathRewrite: {
                  '^/api': ''
                }
            }
        }
    },
    configureWebpack: {
        // externals: {
        //   'axios': 'axios',
        //   'vue': 'Vue',
        //   'vue-router': 'VueRouter'
        // }
    }
}