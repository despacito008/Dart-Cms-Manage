import Qs from 'qs'
import Vue from 'vue'
import Axios from 'axios'
import Root from '@/main'
import { MessageBox, Message, Dialog } from 'element-ui'
import { catStorage, setToken, isDev, authToken, inspectState } from '@utils/tools'




let ajaxEvent = ( res, { loading } ) => {
    // 如果配置里面有开启loading在这里需要关闭
    if ( loading ) {
        Root.hideGlobalLoding();
    }
    // 验证token
    let isLogin = catStorage( 'token' ) && JSON.stringify( catStorage( 'token' ) ) !== '{}';
    // 是否本地续签token时间
    if( isLogin && res.status === 200 && res.data.code === 200 ){
        setToken( true, true );
    }
}

export default ( cf, options ) => {
    // 后台系统不跨域，所以不设置跨域信息
    const service = Axios.create({
        timeout: isDev() ? 100000000 : 15000 // 请求超时时间
    })

    service.interceptors.request.use(
        config => {

            // 设置json格式
            config.headers[ 'Content-Type' ] = options.type || 'application/json';

            if ( isDev() ) {
                config.url = '/api' + config.url;
            }

            // token
            let token = catStorage( 'token' ).value;
            if ( token ) {
                // 在header参数里面加入token
                config.headers[ 'Token' ] = token;
            }

            // // 序列化字符串参数
            // config.data = Qs.stringify( config.data );

            // 开启loading
            if( options.loading ) {
                Root.showGlobalLoding();
            }

            return config;
        },
        err => {
            ajaxEvent( err, options );
            return Promise.reject( err );
        }
    );

    service.interceptors.response.use(
        response => {

            ajaxEvent( response, options );
            inspectState( response );
            return response

        },
        error => {
            console.log(error);
            ajaxEvent( error, options );
            // let err = error.response.error;

            // if ( err > 0 ) {
            //     Message.error( "网络错误，请检查您的网络！" )
            // }

            return Promise.reject( error )
        }
    );
    return service( cf );
}
