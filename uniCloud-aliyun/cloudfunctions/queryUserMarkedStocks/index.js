'use strict';
exports.main = async (event, context) => {
	var result = {"success": false, "data": []}

	const openid = event.openid || event.queryStringParameters.openid
	const dbJQL = uniCloud.databaseForJQL({event, context})
	
	
	const stock_favorites = dbJQL.collection("stock_favorites").where(`openid=="${openid}"`).orderBy("create_time desc").getTemp()
	const queryResp = await dbJQL.collection(stock_favorites, "stock").get()

	if(queryResp.code == 0 && queryResp.affectedDocs != 0) {
		console.log(queryResp)
		result.success = true
		queryResp.data.forEach(function(item) {
			if(item.stocks.length > 0) {
				var data = item.stocks[0]
				result.data.push({
					"code": data.code,
					"name": data.stock_name
				})
			}
		})
	}

	return result
};
