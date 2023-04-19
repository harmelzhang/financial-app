'use strict';
exports.main = async (event, context) => {
	var result = {"success": false, "message": "标记失败，找不到指定股票信息或内部错误"}

	const openid = event.openid || event.queryStringParameters.openid
	const stockCode = event.stockCode || event.queryStringParameters.stockCode

	const dbJQL = uniCloud.databaseForJQL({event, context})

	var queryResp = await dbJQL.collection("stock").where(`code=="${stockCode}"`).limit(1).get()

	var stock = null
	if(queryResp.code == 0 && queryResp.affectedDocs != 0) {
		stock = queryResp.data[0]
	}

	if(stock == null) {
		return result
	}

	// 插入数据
	await dbJQL.collection("stock_favorites").add({
		"openid": openid,
		"stock": {
			"code": stock.code,
			"name": stock.stock_name
		}
	})

	result.success = true
	result.message = "标记成功"
	return result
};
