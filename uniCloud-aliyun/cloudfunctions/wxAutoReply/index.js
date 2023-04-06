'use strict';

const xml2js = require('xml2js');

const token = "xxx";

const appId = "xxx"
const appSecret = "xxx"

exports.main = async (event, context) => {
	var msgType = ""
	var msg = ""
	var fromUser = ""
	var toUser = ""
	const createTime = Date.parse(new Date()) / 1000;

	xml2js.parseString(event.body, {explicitArray : false}, function (err, result) {
		msgType = result.xml.MsgType
		msg = result.xml.Content
		toUser = result.xml.ToUserName
		fromUser = result.xml.FromUserName
		console.log(result)
	});

	if(msgType === "text") {
		var result = `找不到您要查询的信息，请检查是否输入正确`
	    return `<xml><ToUserName><![CDATA[${fromUser}]]></ToUserName><FromUserName><![CDATA[${toUser}]]></FromUserName><CreateTime>${createTime}</CreateTime><MsgType><![CDATA[text]]></MsgType><Content><![CDATA[${result}]]></Content></xml>`
	}

	return "success"
};
