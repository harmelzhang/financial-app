'use strict';
exports.main = async (event, context) => {
	var result = {"success": false, "data": []}

	const resp = await uniCloud.httpclient.request(
		"https://42.push2.eastmoney.com/api/qt/clist/get?pn=1&pz=50&fltt=2&fs=b:MK0010&fields=f2,f3,f4,f12,f14",
		{
			method: "GET",
			dataType: "json"
		}
	)

	if(resp.status != 200) {
		return result
	}
	
	var data = resp.data.data.diff

	var items = []
	var codes = []
	Object.keys(data).forEach(function(key) {
		var item = data[key]
		items.push({
			"name": item.f14,
			"point": item.f2,
			"change": item.f4,
			"percent": item.f3
		})
		codes.push(item.f12)
	})

	var indexCodes = ["000001", "399001", "399006", "000300", "000905", "000016", "000688", "899050"]
	indexCodes.forEach(function(code) {
		var index = codes.indexOf(code)
		if(index != -1) {
			result.data.push(items[index])
		}
	})

	result.success = true
	return result
};
