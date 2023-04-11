'use strict';
exports.main = async (event, context) => {
	var result = {"success": false, "data": null}

	const code = event.code || event.queryStringParameters.code
	const dbJQL = uniCloud.databaseForJQL({event, context})
	const queryResp = await dbJQL.collection("stock").where(`code=='${code}'`).limit(1).get()
	if(queryResp.affectedDocs != 0) {
		result.success = true
		result.data = queryResp.data[0]
	}

	return result
};
