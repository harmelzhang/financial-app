'use strict';
exports.main = async (event, context) => {
	var result = {"success": false, "data": null}

	const code = event.code || event.queryStringParameters.code
	const dbJQL = uniCloud.databaseForJQL({event, context})

	var queryResp = await dbJQL.collection("stock").where(`code=='${code}'`).limit(1).get()
	if(queryResp.code == 0 && queryResp.affectedDocs != 0) {
		result.success = true
		result.data = queryResp.data[0]
	}

	queryResp = await dbJQL.collection("index_sample").where(`stock_code=='${code}'`).orderBy("type_code").get()
	if(queryResp.code == 0 && queryResp.affectedDocs != 0) {
		var indexs = []
		queryResp.data.forEach(function(item) {
			indexs.push(item.type_name)
		})
	}
	result.data.index = indexs

	return result
};
