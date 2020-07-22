import request from '@utils/request'

// 获取所有的备份数据列表
export function DirDataBackup(data, options){
	return request({
			url: '/manage/backup/dirDataBackup',
		    method: 'POST',
		    data: data || {}
		},
		options || {}
	);
}
// 执行数据备份
export function ExecDataBackup(data, options){
	return request({
			url: '/manage/backup/execDataBackup',
		    method: 'POST',
		    data: data || {}
		},
		options || {}
	);
}
// 批量删除数据
export function RemoveDataBackup(data, options){
	return request({
			url: '/manage/backup/removeDataBackup',
		    method: 'POST',
		    data: data || {}
		},
		options || {}
	);
}
// 下载备份数据
export function DownloadData(data, options){
	return '/manage/backup/downloadData'
}