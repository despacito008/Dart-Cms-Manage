import request from '@utils/request'

// 获取入口页统计信息
export function getAllInfos(data, options){
	return request({
			url: '/manage/main/getAllInfos',
		    method: 'GET',
		    params: data || {}
		},
		options || {}
	);
}
