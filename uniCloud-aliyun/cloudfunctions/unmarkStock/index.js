'use strict';
exports.main = async (event, context) => {
	var result = {"success": false, "message": "取消标记失败"}
	
	const openid = event.openid || event.queryStringParameters.openid
	const stockCode = event.stockCode || event.queryStringParameters.stockCode
	
	const dbJQL = uniCloud.databaseForJQL({event, context})
	
	var deleteResp = await dbJQL.collection("stock_favorites").where({
		"openid": openid,
		"stock.code": stockCode
	}).remove()

	if(deleteResp.code != 0) {
		return result
	}

	result.success = true
	result.message = "取消标记成功"
	return result
};
