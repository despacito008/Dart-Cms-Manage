import request from '@utils/request'

// 创建任务
export function createCron(data, options){
	return request({
			url: '/manage/cron/createCron',
		    method: 'POST',
		    data: data || {}
		},
		options || {}
	);
}
// 删除任务
export function removeCron(data, options){
	return request({
			url: '/manage/cron/removeCron',
		    method: 'POST',
		    data: data || {}
		},
		options || {}
	);
}
// 获取全部任务
export function getAllCrons(data, options){
	return request({
			url: '/manage/cron/getAllCrons',
		    method: 'POST',
		    data: data || {}
		},
		options || {}
	);
}
