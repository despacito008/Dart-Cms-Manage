import request from '@utils/request'

// 获取当前模板的所有文件
export function DirCurTempFiles(data, options){
	return request({
			url: '/manage/temp/dirCurTempFiles',
		    method: 'POST',
		    data: data || {}
		},
		options || {}
	);
}
// 删除模板
export function RemoveTemplate(data, options){
	return request({
			url: '/manage/temp/removeTemplate',
		    method: 'POST',
		    data: data || {}
		},
		options || {}
	);
}
// 删除模板文件
export function RemoveTempFile(data, options){
	return request({
			url: '/manage/temp/removeTempFile',
		    method: 'POST',
		    data: data || {}
		},
		options || {}
	);
}
// 上传模板
export function UploadTemplate(){
	return '/manage/temp/uploadTemplate'
}
// 获取所有的模板名称
export function DirTempList(data, options){
	return request({
			url: '/manage/temp/dirTempList',
		    method: 'POST',
		    data: data || {}
		},
		options || {}
	);
}
// 设置默认模板
export function SetCurUseTempName(data, options){
	return request({
			url: '/manage/temp/setCurUseTempName',
		    method: 'POST',
		    data: data || {}
		},
		options || {}
	);
}
// 修改模板文件的内容
export function EditTempFileContent(data, options){
	return request({
			url: '/manage/temp/editTempFileContent',
		    method: 'POST',
		    data: data || {}
		},
		options || {}
	);
}
// 读取模板文件中文
export function ReadTempFileContent(data, options){
	return request({
			url: '/manage/temp/readTempFileContent',
		    method: 'POST',
		    data: data || {}
		},
		options || {}
	);
}