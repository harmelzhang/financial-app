'use strict';
exports.main = async (event, context) => {
	var result = {
		"success": false,
		"increased": 0,
		"decreased": 0,
		"unchanged": 0,
		"data": []
	}

	const resp = await uniCloud.httpclient.request(
		"https://datacenter.eastmoney.com/securities/api/data/v1/get?reportName=RPTAAA_DMSK_TS_CHANGESTATISTICS&source=securities&client=APP",
		{
			method: "GET",
			dataType: "json"
		}
	)

	if(resp.status != 200 || resp.data.code != 0) {
		return result
	}
	
	result.success = true
	var data = resp.data.result.data[0]
	
	result.increased = data.IND1
	result.decreased = data.IND2
	result.unchanged = data.INDEX5
	
	// 构建 key 和 name 的关系
	var names = [
		{"name": "涨停", "key": "IND3"},
		{"name": ">5%", "key": "INDEX8"},
		{"name": "5~1%", "key": "INDEX7"},
		{"name": "1~0%", "key": "INDEX6"},
		{"name": "平", "key": "INDEX5"},
		{"name": "0~1%", "key": "INDEX4"},
		{"name": "1~5%", "key": "INDEX3"},
		{"name": ">5%", "key": "INDEX2"},
		{"name": "跌停", "key": "IND5"},
	]
	
	names.forEach(function(item) {
		result.data.push({"name": item.name, "value": data[item.key]})
	})

	return result
};
