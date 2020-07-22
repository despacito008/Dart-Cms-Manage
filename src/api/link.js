import request from '@utils/request'

// 全部外链
export function GetAllLinks(data, options){
	return request({
			url: '/manage/link/getAllLinks',
		    method: 'POST',
		    data: data || {}
		},
		options || {}
	);
}
// 删除外链
export function RemoveLinks(data, options){
	return request({
			url: '/manage/link/removeLinks',
		    method: 'POST',
		    data: data || {}
		},
		options || {}
	);
}
// 添加外链
export function AddLink(data, options){
	return request({
			url: '/manage/link/addLink',
		    method: 'POST',
		    data: data || {}
		},
		options || {}
	);
}
// 更新外链
export function UpdateLinks(data, options){
	return request({
			url: '/manage/link/updateLinks',
		    method: 'POST',
		    data: data || {}
		},
		options || {}
	);
}
// 更新外链
export function DirLinkImgs(data, options){
	return request({
			url: '/manage/link/dirLinkImgs',
		    method: 'POST',
		    data: data || {}
		},
		options || {}
	);
}
// 上传外链图片
export function UploadImages(data, options){
	return '/manage/link/uploadImages'
}
// 删除外链图片
export function RemoveLinkImg(data, options){
	return request({
			url: '/manage/link/removeLinkImg',
		    method: 'POST',
		    data: data || {}
		},
		options || {}
	);
}
