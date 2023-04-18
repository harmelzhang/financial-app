'use strict';

const xml2js = require('xml2js');

const token = "FTH46g5h56r";

const appId = "wx7e487bf86d7a08b5"
const appSecret = "4424a59f65ed32e86585058e539bf17b"

exports.main = async (event, context) => {
	var msgType = ""
	var msg = ""
	var fromUser = ""
	var toUser = ""
	var eventInfo = ""
	const createTime = Date.parse(new Date()) / 1000;

	xml2js.parseString(event.body, {explicitArray : false}, function (err, result) {
		msgType = result.xml.MsgType
		msg = result.xml.Content
		toUser = result.xml.ToUserName
		fromUser = result.xml.FromUserName
		eventInfo = result.xml.Event
	});

	if(msgType === "text") {
		var result = "找不到您要查询的信息，请检查是否输入正确"
		const dbJQL = uniCloud.databaseForJQL({event, context})
		const queryResp = await dbJQL.collection("stock").where(`stock_name=='${msg}'`).limit(1).get()
		if(queryResp.affectedDocs != 0) {
			result = queryResp.data[0].main_business
		}
		return `<xml><ToUserName><![CDATA[${fromUser}]]></ToUserName><FromUserName><![CDATA[${toUser}]]></FromUserName><CreateTime>${createTime}</CreateTime><MsgType><![CDATA[text]]></MsgType><Content><![CDATA[${result}]]></Content></xml>`
	} else if(msgType === "event") {
		if(eventInfo === "subscribe") {
			var result = "您好，感谢关注「周大高」，这里主要提供热门公司的财务报表分析。由于目前小程序还在开发中，暂时在公众号发布“图说财报”系列文章，后续小程序上线后会停止更新，转而发布个人对财报以及市场行情的分析。来了就请坐下吧！\n\n小提示：公众号回复公司名称会提示其主营业务哦"
			return `<xml><ToUserName><![CDATA[${fromUser}]]></ToUserName><FromUserName><![CDATA[${toUser}]]></FromUserName><CreateTime>${createTime}</CreateTime><MsgType><![CDATA[text]]></MsgType><Content><![CDATA[${result}]]></Content></xml>`
		}
	}

	return "success"
};
