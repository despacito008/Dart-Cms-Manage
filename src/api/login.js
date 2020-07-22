import request from '@utils/request'

// 验证码获取
export function CreateCodeImg(data, options){
	return request({
			url: '/manage/codeImg',
		    method: 'GET',
		    params: data || {}
		},
		options || {}
	);
}
// 登录
export function AdminLogin(data, options){
	return request({
			url: '/manage/admin/login',
		    method: 'POST',
		    data: data || {}
		},
		options || {}
	);
}
// 注销
export function AdminLogout(data, options){
	return request({
			url: '/manage/admin/logout',
		    method: 'POST',
		    data: data || {}
		},
		options || {}
	);
}