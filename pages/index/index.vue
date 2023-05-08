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
			<qiun-data-charts type="column" v-bind:opts="marketOverviewOpts" v-bind:chart-data="marketOverviewData"/>
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
				<qiun-data-charts type="mix" v-bind:opts="currencyOverviewOpts" v-bind:chart-data="currencyOverviewData"/>
			</view>
		</view>
	</view>
	
	<!-- <view class="content">
	<view class="info">
		本应用数据来源于互联网公开信息汇总，尚未经过严格校验，仅供使用者查阅参考并不构成投资建议，投资者需自主决策并独立承担投资风险！
	</view>
		<view class="disclaimer">
			
		</view>
	</view> -->
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

	// 查询货币风向（国债、美元）
	function querycurrencyTrends(that, type) {
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
				currencyType: "美元",
				marketOverviewData: {},
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
							{position: "left", title: "十年期国债收益率"},
							{position: "right", title: "上证指数"}
						]
					},
					extra: {
						line: {
							animation: "horizontal"
						},
						mix: {
							line: {
								width: 1.5
							}
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
			querycurrencyTrends(that, "美元")

			setInterval(function() {
				if(queryMarketStatus()) {
					queryIndexs(that)
					queryMarketTrends(that)
				}
			}, 5000)
		},
		methods: {
			toSearch() {
				uni.navigateTo({
					url: "/pages/index/search"
				})
			},
			changeCurrencyType(type) {
				this.currencyType = type
				querycurrencyTrends(this, type)
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
