import request from '@utils/request'

// 获取全部留言消息
export function GetMessageList(data, options){
	return request({
			url: '/manage/message/getMessageList',
		    method: 'POST',
		    data: data || {}
		},
		options || {}
	);
}
// 删除留言消息
export function RemoveMessage(data, options){
	return request({
			url: '/manage/message/removeMessage',
		    method: 'POST',
		    data: data || {}
		},
		options || {}
	);
}
// 改变留言状态
export function ChangeMsgState(data, options){
	return request({
			url: '/manage/message/changeMsgState',
		    method: 'POST',
		    data: data || {}
		},
		options || {}
	);
}
// 回复留言
export function ReplyMessage(data, options){
	return request({
			url: '/manage/message/replyMessage',
		    method: 'POST',
		    data: data || {}
		},
		options || {}
	);
}