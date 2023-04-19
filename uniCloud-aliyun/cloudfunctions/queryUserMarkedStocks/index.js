'use strict';
exports.main = async (event, context) => {
	var result = {"success": false, "data": []}

	const openid = event.openid || event.queryStringParameters.openid
	const dbJQL = uniCloud.databaseForJQL({event, context})

	var queryResp = await dbJQL.collection("stock_favorites").where(`openid=="${openid}"`).orderBy("create_time desc").get()

	if(queryResp.code == 0 && queryResp.affectedDocs != 0) {
		result.success = true
		queryResp.data.forEach(function(item) {
			result.data.push(item.stock)
		})
	}

	return result
};
