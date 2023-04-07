'use strict';
exports.main = async (event, context) => {
	var result = {"success": false, "data": []}

	const resp = await uniCloud.httpclient.request(
		"https://www.csindex.com.cn/csindex-home/quotes/index-press",
		{
			method: "GET",
			dataType: "json"
		}
	)

	if(resp.status != 200 || resp.data.code != "200") {
		return result
	}
	
	var data = resp.data.data

	var indexCodes = ["000001", "399001", "399006", "000300", "000905", "000688", "899050"]
	indexCodes.forEach(function(code) {
		for(var i = 0; i < data.length; i++) {
			if(code == data[i].indexCode) {
				result.data.push({
					"name": data[i].indexName,
					"point": data[i].current,
					"change": data[i].change,
					"percent": data[i].changePct
				})
			}
		}
	})
	result.success = true

	return result
};
