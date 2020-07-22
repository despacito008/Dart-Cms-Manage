import Root from '@/main'
import { MessageBox, Message } from 'element-ui'


// 设置全局锁
let setTimeontLock = ( bool ) => {
	let ID = Root.lockID || null;
	clearTimeout(ID);

	let time = bool ? 86400000 : 0;
	// 两种情况，1：正常加定时器，到时间提示。2：服务端token持久化失效，301 code，立即触发
	if(!Root.lockID || !time){
		Root.lockID = setTimeout(() => {
			// 先删除本地token和userinfo
			removeData();
			// 弹窗提示
	        MessageBox.alert(
				'您的登录状态已经过期，请重新登录！',
				'温馨提示',
				{
					confirmButtonText: '确定',
					callback: action => {
						setTimeout(() => {
							removeData();
							window.location.reload();
						}, 500);
					}
				}
			)
		}, time);
	}
}
// 删除用户本地持久化数据
export function removeData () {
	removeStorage( 'token' );
	removeStorage( 'userInfo' );
}
// 是否本地开发环境
export function isDev () {
	return process.env.NODE_ENV === 'development';
}
// 检查登录状态
export function inspectState ( res ) {
	let isTimeout = res.data.code === 301;
	// 未超时
	if ( !isTimeout && authToken() ) {
		// 续签token
		setToken( true, true );
		// 提醒
		setTimeontLock( true );
		return
	}
	// 超时锁 ++ 超时删除持久化数据+弹窗提示
	if( isTimeout && Root.$route.path !== '/login' ){
		setTimeontLock( false )
	}
}
// 设置token
export function setToken ( val, refresh ) {
	// 续签token
	if( refresh ) {
		let oldToken = window.localStorage.getItem( "token" );
		let parseToken = JSON.parse(oldToken);
		val = parseToken.value;
	}
	// token正确性
	if( val && typeof val === 'string' ) {
		let tokenInfo = {
			value: val,
			time: new Date().getTime()
		}
		window.localStorage.setItem("token", JSON.stringify( tokenInfo ));
	}
}
// 本地序列化用户信息
export function setStorage ( key, info ) {
	try {
		let infoStr = JSON.stringify( info );
		window.localStorage.setItem( key, infoStr );
	} catch ( err ) {
		return
	}
}
// 查看本地序列信息
export function catStorage ( key ) {
	try {
		let info = JSON.parse( window.localStorage.getItem( key ) );
		return info || {}
	} catch ( err ) {
		return {}
	}
}
// 删除本地序列信息
export function removeStorage ( key ) {
	window.localStorage.removeItem( key )
	return true
}
// router守卫 - 获取token正确性
export function authToken () {

	try {
		if( !window.localStorage.getItem( "token" ) ){
			throw new Error('');
		}
		let tokenInfo = JSON.parse( window.localStorage.getItem( "token" ) );
		// 是否超时
		let isActives = tokenInfo ? (( new Date().getTime() - tokenInfo.time ) < 86400000 ) : false;
		let tokenVal = tokenInfo.value && ( typeof tokenInfo.value === 'string' );
		let bool = JSON.stringify( catStorage( 'userInfo' ) ) !== '{}';
		let info = catStorage( 'userInfo' );

		// 存在-没有过期-用户信息存在
		if( tokenInfo && tokenVal && isActives && bool ) {
			return true
		} else {
			return
		}
	} catch( err ) {
		return
	}
}
// 设置全局title
export function setPageTitle ( name ) {
	document.title = name;
}
