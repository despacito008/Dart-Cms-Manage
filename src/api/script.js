import request from '@utils/request'

// 获取所有脚本
export function GetScriptList(data, options){
	return request({
			url: '/manage/script/getScriptList',
		    method: 'GET',
		    params: data || {}
		},
		options || {}
	);
}
// 执行脚本
export function RunScript(data, options){
	return request({
			url: '/manage/script/runScript',
		    method: 'POST',
		    data: data || {}
		},
		options || {}
	);
}
// 停止运行
export function StopRunScript(data, options){
	return request({
			url: '/manage/script/stopRunScript',
		    method: 'POST',
		    data: data || {}
		},
		options || {}
	);
}
// 删除脚本
export function RemoveScript(data, options){
	return request({
			url: '/manage/script/removeScript',
		    method: 'POST',
		    data: data || {}
		},
		options || {}
	);
}
// 删除脚本
export function UploadScript(data, options){
	return '/manage/script/uploadScript'
}
// 修改脚本
export function UpdateScript(data, options){
	return request({
			url: '/manage/script/updateScript',
		    method: 'POST',
		    data: data || {}
		},
		options || {}
	);
}