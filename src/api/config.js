import request from '@utils/request'

// 获取入口页统计信息
export function GetConfig(data, options){
	return request({
			url: '/manage/system/getConfig',
		    method: 'GET',
		    params: data || {}
		},
		options || {}
	);
}
// 上传App
export function UploadApp(){
	return '/manage/system/uploadApp'
}
// 上传Logo
export function UploadWebLogon(){
	return '/manage/system/uploadWebLogon'
}
// 修改配置
export function ExecConfig(data, options){
	return request({
			url: '/manage/system/execConfig',
		    method: 'POST',
		    data: data || {}
		},
		options || {}
	);
}