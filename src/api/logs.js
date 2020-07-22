import request from '@utils/request'

// 获取全部日志
export function getAllLogs(data, options){
	return request({
			url: '/manage/logs/GetAllLogs',
		    method: 'POST',
		    data: data || {}
		},
		options || {}
	);
}
// 删除日志
export function RemoveLogs(data, options){
	return request({
			url: '/manage/logs/removeLogs',
		    method: 'POST',
		    data: data || {}
		},
		options || {}
	);
}