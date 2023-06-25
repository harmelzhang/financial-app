<template>
	<view class="search">
		<view class="input" v-on:click="toSearch">
			<image class="icon" src="/static/index/search.png"></image>
			<text class="tip">请输入股票名称或代码</text>
		</view>
	</view>
	<scroll-view class="index" scroll-x="true">
		<view class="item" v-for="index in indexs">
			<view class="content" v-bind:class="{'down_bgc': index.percent < 0}">
				<view class="point" v-bind:class="{'down_c': index.percent < 0}">
					<text>{{index.point}}</text>
				</view>
				<view class="info">
					<view class="name">
						<text>{{index.name}}</text>
					</view>
					<view class="percent" v-bind:class="{'down_c': index.percent < 0}">
						<text>{{index.percent}}%</text>
					</view>
				</view>
			</view>
		</view>
		<!-- 底部站位，解决右侧太贴的问题 -->
		<view style="display: inline-block; width: 4pt;"></view>
	</scroll-view>
	<view class="market">
		<view class="title">
			<view class="title_prefix"></view>
			<text>市场总览</text>
			<image class="help" src="/static/common/help.png"></image>
		</view>
		<view class="content">
			<qiun-data-charts v-bind:canvas2d="true" canvasId="gFnpbLRuTmVXzchYNeVYRFuvBQFsnmiV" v-bind:animation="false" type="column" v-bind:opts="marketOverviewOpts" v-bind:chart-data="marketOverviewData"/>
		</view>
	</view>
	<view class="market currency">
		<view class="title">
			<view class="title_prefix"></view>
			<text>沪深港通</text>
			<image class="help" src="/static/common/help.png"></image>
		</view>
		<view class="content">
			<view class="switch_area">
				<view class="switch_items">
					<text class="item" v-on:click="changeFundType('北向')" v-bind:class="{'switch_tab': fundType == '北向'}">北向资金</text>
					<text class="item" v-on:click="changeFundType('南向')" v-bind:class="{'switch_tab': fundType == '南向'}">南向资金</text>
				</view>
			</view>
			<view class="chart_area">
				<qiun-data-charts v-bind:canvas2d="true" canvasId="SrzaviNMWZDJfNvVAFUqPdMBFJOFkQVQ" v-bind:animation="false" type="line" v-bind:opts="fundOverviewOpts" v-bind:chart-data="fundOverviewData"/>
			</view>
		</view>
	</view>
	<view class="market currency">
		<view class="title">
			<view class="title_prefix"></view>
			<text>估值分析</text>
			<image class="help" src="/static/common/help.png"></image>
		</view>
		<view class="content">
			<view class="switch_area">
				<view class="switch_items">
					<text class="item" v-on:click="changeValuationType('市盈率')" v-bind:class="{'switch_tab': valuationType == '市盈率'}">市盈率TTM</text>
					<text class="item" v-on:click="changeValuationType('市净率')" v-bind:class="{'switch_tab': valuationType == '市净率'}">市净率MRQ</text>
					<text class="item" v-on:click="changeValuationType('总市值')" v-bind:class="{'switch_tab': valuationType == '总市值'}">总市值/GDP</text>
				</view>
			</view>
			<view class="chart_area">
				<qiun-data-charts v-bind:canvas2d="true" canvasId="CMhaRxRNGCxmqZjkDlPGzttSgIgKoAsd" v-bind:animation="false" type="line" v-bind:opts="valuationOverviewOpts" v-bind:chart-data="valuationOverviewData"/>
			</view>
		</view>
	</view>
	<view class="market currency">
		<view class="title">
			<view class="title_prefix"></view>
			<text>货币风向</text>
			<image class="help" src="/static/common/help.png"></image>
		</view>
		<view class="content">
			<view class="switch_area">
				<view class="switch_items">
					<text class="item" v-on:click="changeCurrencyType('美元')" v-bind:class="{'switch_tab': currencyType == '美元'}">美元/人民币</text>
					<text class="item" v-on:click="changeCurrencyType('国债')" v-bind:class="{'switch_tab': currencyType == '国债'}">10年期国债收益率(%)</text>
				</view>
			</view>
			<view class="chart_area">
				<qiun-data-charts v-bind:canvas2d="true" canvasId="iXHaBRLuazvVjLfggUKwNITfhcKxgWBR" v-bind:animation="false" type="mix" v-bind:opts="currencyOverviewOpts" v-bind:chart-data="currencyOverviewData"/>
			</view>
		</view>
	</view>
	
	<!-- 底部站位，解决小程序端太贴底部的问题 -->
	<view style="height: 1pt;"></view>
</template>

<script>
	// 查询市场状态（是否开盘）
	function queryMarketStatus() {
		const now = new Date()
		
		const day = now.getDay()
		if(day == 0 || day == 6) {
			return false
		}
		
		const currentHour = now.getHours()
		const currentMinute = now.getMinutes()
		if((currentHour >= 0 && currentHour <=8) || currentHour == 12 || currentHour >= 15 || (currentHour == 11 && currentMinute >= 30)) {
			return false
		}
		
		return true
	}

	// 查询主要指数涨跌信息
	function queryIndexs(that) {
		var result = []

		uni.request({
			url: "https://push2.eastmoney.com/api/qt/clist/get?pn=1&pz=50&fltt=2&fs=b:MK0010&fields=f2,f3,f4,f12,f14",
			success(res) {
				var data = res.data.data.diff

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
						result.push(items[index])
					}
				})
				that.indexs = result
			}
		})
	}

	// 查询市场涨跌情况
	function queryMarketTrends(that) {
		// var result = {
		// 	"increased": 0,
		// 	"decreased": 0,
		// 	"unchanged": 0,
		// 	"data": []
		// }

		uni.request({
			url: "https://datacenter.eastmoney.com/securities/api/data/v1/get?reportName=RPTAAA_DMSK_TS_CHANGESTATISTICS&source=securities&client=APP",
			success(res) {
				var data = res.data.result.data[0]

				// result.increased = data.IND1
				// result.decreased = data.IND2
				// result.unchanged = data.INDEX5

				// 构建 key 和 name 的关系
				var names = [
					{"name": "涨停", "key": "IND3", "color": "#F05656"},
					{"name": ">5", "key": "INDEX8", "color": "#F05656"},
					{"name": "5-1", "key": "INDEX7", "color": "#F05656"},
					{"name": "1-0", "key": "INDEX6", "color": "#F05656"},
					{"name": "平", "key": "INDEX5", "color": "#A8A8A8"},
					{"name": "0-1", "key": "INDEX4", "color": "#3DB364"},
					{"name": "1-5", "key": "INDEX3", "color": "#3DB364"},
					{"name": ">5", "key": "INDEX2", "color": "#3DB364"},
					{"name": "跌停", "key": "IND5", "color": "#3DB364"},
				]

				let categories = []
				let values = []
				names.forEach(function(item) {
					// result.data.push({"name": item.name, "value": data[item.key]})
					categories.push(item.name)
					values.push({value: data[item.key], color: item.color})
				})
				
				// 构建图表数据
				let chartData = {
					categories: categories,
					series: [
						{name: "数量", data: values, textSize: 12}
					]
				}
				that.marketOverviewData = JSON.parse(JSON.stringify(chartData))
			}
		})
	}

	// 查询南北向资金情况
	function queryFundTrends(that, type) {
		let fields = "f1,f3"
		let valueKey = "s2n"
		if(type == "南向") {
			fields = "f2,f4"
			valueKey = "n2s"
		}
		
		uni.request({
			url: `https://push2.eastmoney.com/api/qt/kamtbs.rtmin/get?dpt=app.hsgt&fields1=${fields}&fields2=f51,f54,f58,f62`,
			success(res) {
				let categories = []
				let shanghai = []  // 沪股通
				let shenzhen = []  // 深股通
				let fund = []
				res.data.data[valueKey].forEach(function(item) {
					let values = item.split(",")
					
					categories.push(values[0])
					shanghai.push(values[1]=="-"?null:(parseFloat(values[1]) / 10000).toFixed(2))
					shenzhen.push(values[2]=="-"?null:(parseFloat(values[2]) / 10000).toFixed(2))
					fund.push(values[3]=="-"?null:(parseFloat(values[3]) / 10000).toFixed(2))
				})
				// 构建图表数据
				let chartData = {
					categories: categories,
					series: [
						{name: `${type}资金`, data: fund, color: "#487FDA"},
						{name: "沪股通", data: shanghai, color: "#EAAA47"},
						{name: "深股通", data: shenzhen, color: "#ED7B49"},
					]
				}
				that.fundOverviewData = JSON.parse(JSON.stringify(chartData))
			}
		})
	}

	// 查询估值（市盈率、市净率、总市值）
	function queryValuationTrends(that, type) {
		let url = 'https://datacenter.eastmoney.com/securities/api/data/v1/get?reportName=RPT_REVALUE_TREND&columns=TRADE_DATE,AVG_VALUE,PERCENTILE_30,PERCENTILE_50,PERCENTILE_70&filter=(INDICATOR_TYPE="1")&sortTypes=1&sortColumns=TRADE_DATE&source=securities&client=APP'
		let title = type
		let key = "AVG_VALUE"
		if(type == "市净率") {
			url = 'https://datacenter.eastmoney.com/securities/api/data/v1/get?reportName=RPT_REVALUE_TREND&columns=TRADE_DATE,AVG_VALUE,PERCENTILE_30,PERCENTILE_50,PERCENTILE_70&filter=(INDICATOR_TYPE="2")&sortTypes=1&sortColumns=TRADE_DATE&source=securities&client=APP'
		} else if(type == "总市值") {
			key = "INDICATOR_VALUE"
			title = "总市值/GDP"
			url = 'https://datacenter.eastmoney.com/securities/api/data/v1/get?reportName=RPT_MKTVALUE_STATISTICS&columns=TRADE_DATE,INDICATOR_VALUE,SCI_CLOSE_PRICE&filter=(INDICATOR_TYPE="1")&sortTypes=1&sortColumns=TRADE_DATE&source=securities&client=APP'
		}

		that.valuationOverviewOpts.yAxis.data = that.valuationOverviewOpts.yAxis.data.slice(0, 1)
		that.valuationOverviewOpts.yAxis.data[0].title = title
		if(type == "总市值") {
			that.valuationOverviewOpts.yAxis.data.push({position: "right", title: "上证指数"})
			that.valuationOverviewOpts.padding = [15, 15, 0, 15]
		} else {
			that.valuationOverviewOpts.padding = [15, 45, 0, 25]
		}

		uni.request({
			url: url,
			success(res) {
				let categories = []
				let leftValue = []
				let rightValue = []
				let value30 = []
				let value50 = []
				let value70 = []
				res.data.result.data.forEach(function(item) {
					categories.push(item["TRADE_DATE"].split(" ")[0])
					leftValue.push(item[key])
					if(type == "总市值") {
						rightValue.push(item["SCI_CLOSE_PRICE"])
					} else {
						value30.push(item["PERCENTILE_30"])
						value50.push(item["PERCENTILE_50"])
						value70.push(item["PERCENTILE_70"])
					}
				})
				// 构建图表数据
				let chartData = {
					categories: categories,
					series: [
						{index: 0, type: "line", style: "curve", name: title, data: leftValue, color: "#3381E3"}
					]
				}
				if(type == "总市值") {
					chartData.series.push({index: 1, type: "line", style: "curve", name: "上证指数", data: rightValue, color: "#FAA42A"})
				} else {
					chartData.series.push({lineType: "dash", name: "30分位", data: value30, color: "#3DB364"})
					chartData.series.push({lineType: "dash", name: "50分位", data: value50, color: "#FAA42A"})
					chartData.series.push({lineType: "dash", name: "70分位", data: value70, color: "#F05656"})
				}
				that.valuationOverviewData = JSON.parse(JSON.stringify(chartData))
			}
		})
	}

	// 查询货币风向（国债、美元）
	function queryCurrencyTrends(that, type) {
		let key = "YIELD"
		let title = "十年期国债收益率"
		if(type == "美元") {
			key = "USDCNH_CLOSE"
			title = "美元/人民币"
			that.currencyOverviewOpts.yAxis.data[0].title = title
		}
		uni.request({
			url: `https://datacenter.eastmoney.com/securities/api/data/v1/get?reportName=RPT_DMSK_WINDVANE_CURRENCY&columns=TRADE_DATE,${key},SZZS_CLOSE&sortTypes=1&sortColumns=TRADE_DATE&source=securities&client=APP`,
			success(res) {
				let categories = []
				let leftValue = []
				let rightValue = []
				res.data.result.data.forEach(function(item) {
					categories.push(item["TRADE_DATE"].split(" ")[0])
					leftValue.push(item[key])
					rightValue.push(item["SZZS_CLOSE"])
				})
				// 构建图表数据
				let chartData = {
					categories: categories,
					series: [
						{index: 0, type: "line", style: "curve", name: title, data: leftValue, color: "#3381E3"},
						{index: 1, type: "line", style: "curve", name: "上证指数", data: rightValue, color: "#FAA42A"}
					]
				}
				that.currencyOverviewData = JSON.parse(JSON.stringify(chartData))
			}
		})
	}

	export default {
		data() {
			return {
				indexs: [
					{name: "上证指数", point: "-", change: "-", percent: "-"},
					{name: "深证成指", point: "-", change: "-", percent: "-"},
					{name: "创业板指", point: "-", change: "-", percent: "-"},
					{name: "沪深300", point: "-", change: "-", percent: "-"},
					{name: "中证500", point: "-", change: "-", percent: "-"},
					{name: "上证50", point: "-", change: "-", percent: "-"},
					{name: "科创50", point: "-", change: "-", percent: "-"},
					{name: "北证50", point: "-", change: "-", percent: "-"}
				],
				marketOverviewOpts: {
					update: true,
					legend: {
						show: false
					},
					xAxis: {
						fontSize: 12,
						fontColor: "#000000",
						marginTop: 6
					},
					yAxis: {
						disabled: true,
						disableGrid: true
					},
					extra: {
						tooltip: {
							showBox: false,
							legendShow: false
						},
						column: {
							width: 16,
							barBorderRadius: [4, 4, 0, 0],
							activeBgOpacity: 0
						}
					}
				},
				marketOverviewData: {},
				fundType: "北向",
				fundOverviewOpts: {
					padding: [15, 25, 0, 10],
					update: true,
					fontSize: 11,
					dataLabel: false,
					dataPointShape: false,
					xAxis: {
						labelCount: 3,
						fontSize: 12,
						fontColor: "#000000",
						marginTop: 6
					},
					extra: {
						line: {
							type: "curve",
							width: 1.5
						},
						tooltip: {
							bgColor: "#FFFFFF",
							bgOpacity: 1,
							borderWidth: 1,
							borderRadius: 5,
							borderColor: "#C8C8C8",
							fontColor: "#000000"
						}
					}
				},
				fundOverviewData: {},
				valuationType: "市盈率",
				valuationOverviewOpts: {
					update: true,
					fontSize: 11,
					dataLabel: false,
					dataPointShape: false,
					xAxis: {
						labelCount: 3,
						fontSize: 12,
						fontColor: "#000000",
						marginTop: 6
					},
					yAxis: {
						showTitle: false,
						data: [
							{position: "left", title: "值"}
						]
					},
					extra: {
						line: {
							width: 1.5
						},
						tooltip: {
							bgColor: "#FFFFFF",
							bgOpacity: 1,
							borderWidth: 1,
							borderRadius: 5,
							borderColor: "#C8C8C8",
							fontColor: "#000000"
						}
					}
				},
				valuationOverviewData: {},
				currencyType: "美元",
				currencyOverviewOpts: {
					update: true,
					fontSize: 11,
					dataLabel: false,
					xAxis: {
						labelCount: 3,
						fontSize: 12,
						fontColor: "#000000",
						marginTop: 6
					},
					yAxis: {
						showTitle: false,
						data: [
							{position: "left", title: "值"},
							{position: "right", title: "上证指数"}
						]
					},
					extra: {
						mix: {
							line: {
								width: 1.5
							}
						},
						tooltip: {
							bgColor: "#FFFFFF",
							bgOpacity: 1,
							borderWidth: 1,
							borderRadius: 5,
							borderColor: "#C8C8C8",
							fontColor: "#000000"
						}
					}
				},
				currencyOverviewData: {}
			}
		},
		onLoad() {
			const that = this

			queryIndexs(that)
			queryMarketTrends(that)
			queryFundTrends(that, "北向")
			queryValuationTrends(that, "市盈率")
			queryCurrencyTrends(that, "美元")

			setInterval(function() {
				if(queryMarketStatus()) {
					queryIndexs(that)
					queryMarketTrends(that)
					queryFundTrends(that, that.fundType)
				}
			}, 5000)
		},
		methods: {
			toSearch() {
				uni.navigateTo({
					url: "/pages/index/search"
				})
			},
			changeFundType(type) {
				this.fundType = type
				queryFundTrends(this, type)
			},
			changeValuationType(type) {
				this.valuationType = type
				queryValuationTrends(this, type)
			},
			changeCurrencyType(type) {
				this.currencyType = type
				queryCurrencyTrends(this, type)
			}
		}
	}
</script>

<style lang="scss">
	.down_bgc {
		background-color: #EEFAF4 !important;
	}
	.down_c {
		color: #3DB364 !important;
	}
	
	.switch_tab {
		color: #000000 !important;
		background-color: #FFFFFF;
	}

	.search {
		display: flex;
		flex-direction: row;
		justify-content: center;
		background: linear-gradient(to bottom, #FFC100 0%, #F3F3F3 100%);
		padding: 8pt;
		height: 120pt;
		.input {
			width: 200pt;
			height: 16pt;
			padding: 4pt 0pt;
			border-radius: 50pt;
			display: flex;
			flex-direction: row;
			justify-content: center;
			align-items: center;
			background-color: #F8F8F8;
			.icon {
				height: 12pt;
				width: 12pt;
				margin-top: 1pt;
			}
			.tip {
				margin-left: 2pt;
				color: #A8A8A8;
				font-size: 10pt;
			}
		}
	}
	.index {
		white-space: nowrap;
		margin-top: -100pt;
		padding: 4pt;
		::-webkit-scrollbar {
			display: none;
		}
		.item {
			display: inline-block;
			margin-right: 4pt;
			.content {
				border-radius: 4pt;
				padding: 4pt 8pt;
				background-color: #FFF2F3;
				display: flex;
				flex-direction: column;
				align-items: center;
				.point {
					font-size: 16pt;
					color: #F05656;
				}
				.info {
					display: flex;
					flex-direction: row;
					font-size: 8pt;
					font-weight: bold;
					margin-top: 4pt;
					.percent {
						margin-left: 4pt;
						color: #F05656;
					}
				}
			}
		}
	}
	.market {
		margin: 4pt 8pt 8pt 8pt;
		padding-bottom: 8pt;
		background-color: white;
		border-radius: 4pt;
		.title {
			padding: 4pt 0pt;
			display: flex;
			flex-direction: row;
			align-items: center;
			color: #333333;
			font-size: 11pt;
			font-weight: bold;
			.title_prefix {
				width: 6pt;
				height: 16pt;
				background-color: #FFC100;
				margin-left: 8pt;
				margin-right: 6pt;
				border-radius: 4pt;
			}
			.help {
				width: 14pt;
				height: 14pt;
				margin-left: auto;
				margin-right: 8pt;
			}
		}
		.content {
			height: 100pt;
		}
	}
	.currency {
		.content {
			height: 180pt;
			.switch_area {
				font-size: 10pt;
				display: flex;
				flex-direction: row;
				justify-content: center;
				.switch_items {
					background-color: #F2F2F2;
					padding: 6pt 2pt;
					border-radius: 4pt;
					.item {
						border-radius: 4pt;
						padding: 4pt;
						color: #A8A8A8;
						&:last-child {
							margin-left: 4pt;
						}
					}
				}
			}
			.chart_area {
				height: 160pt;
			}
		}
	}
</style>
