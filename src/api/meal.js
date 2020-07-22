import request from '@utils/request'

// 全部广告
export function GetAllMeal(data, options){
	return request({
			url: '/manage/meal/getAllMeal',
		    method: 'POST',
		    data: data || {}
		},
		options || {}
	);
}
// 删除广告
export function RemoveMeal(data, options){
	return request({
			url: '/manage/meal/removeMeal',
		    method: 'POST',
		    data: data || {}
		},
		options || {}
	);
}
// 添加广告
export function AddMeal(data, options){
	return request({
			url: '/manage/meal/addMeal',
		    method: 'POST',
		    data: data || {}
		},
		options || {}
	);
}
// 更新广告
export function UpdateMeal(data, options){
	return request({
			url: '/manage/meal/updateMeal',
		    method: 'POST',
		    data: data || {}
		},
		options || {}
	);
}
// 获取所有的广告图片
export function DirMealImgs(data, options){
	return request({
			url: '/manage/meal/dirMealImgs',
		    method: 'POST',
		    data: data || {}
		},
		options || {}
	);
}
// 上传广告图片
export function UploadImages(data, options){
	return '/manage/meal/uploadImages'
}
// 删除广告图片
export function RemoveMealImg(data, options){
	return request({
			url: '/manage/meal/removeMealImg',
		    method: 'POST',
		    data: data || {}
		},
		options || {}
	);
}