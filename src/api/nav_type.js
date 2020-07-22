import request from '@utils/request'

// 获取所有的分类，不分页 get
export function GetNavList(data, options){
	return request({
			url: '/manage/nav/getNavList',
		    method: 'GET',
		    params: data || {}
		},
		options || {}
	);
}
// 添加导航
export function AddNav(data, options){
	return request({
			url: '/manage/nav/addNav',
		    method: 'POST',
		    data: data || {}
		},
		options || {}
	);
}
// 删除导航
export function RemoveNav(data, options){
	return request({
			url: '/manage/nav/removeNav',
		    method: 'POST',
		    data: data || {}
		},
		options || {}
	);
}
// 更新导航
export function UpdateNav(data, options){
	return request({
			url: '/manage/nav/updateNav',
		    method: 'POST',
		    data: data || {}
		},
		options || {}
	);
}
// 导航排序
export function NavSort(data, options){
	return request({
			url: '/manage/nav/navSort',
		    method: 'POST',
		    data: data || {}
		},
		options || {}
	);
}
