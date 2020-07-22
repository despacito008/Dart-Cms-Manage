import request from '@utils/request'

// 新增用户
export function AddUser(data, options){
	return request({
			url: '/manage/user/addUser',
		    method: 'POST',
		    data: data || {}
		},
		options || {}
	);
}
// 修改用户信息
export function UpdateUser(data, options){
	return request({
			url: '/manage/user/updateUser',
		    method: 'POST',
		    data: data || {}
		},
		options || {}
	);
}
// 删除用户
export function RemoveUser(data, options){
	return request({
			url: '/manage/user/removeUser',
		    method: 'POST',
		    data: data || {}
		},
		options || {}
	);
}
// 获取用户列表
export function GetUserList(data, options){
	return request({
			url: '/manage/user/getUserList',
		    method: 'POST',
		    data: data || {}
		},
		options || {}
	);
}
// ResetMyPassWord
export function ResetMyPassWord(data, options){
	return request({
			url: '/manage/user/resetMyPassWord',
		    method: 'POST',
		    data: data || {}
		},
		options || {}
	);
}