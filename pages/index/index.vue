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
	function queryMarketTrends() {
		var result = {
			"increased": 0,
			"decreased": 0,
			"unchanged": 0,
			"data": []
		}

		uni.request({
			url: "https://datacenter.eastmoney.com/securities/api/data/v1/get?reportName=RPTAAA_DMSK_TS_CHANGESTATISTICS&source=securities&client=APP",
			success(res) {
				var data = res.data.result.data[0]

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
			}
		})
		
		return result
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
					{name: "北证300", point: "-", change: "-", percent: "-"}
				]
			}
		},
		onLoad() {
			let that = this

			queryIndexs(that)
			setInterval(function() {
				const now = new Date()

				const day = now.getDay()
				if(day == 0 || day == 6) {
					return
				}

				const currentHour = now.getHours()
				const currentMinute = now.getMinutes()
				if((currentHour >= 0 && currentHour <=8) || currentHour == 12 || currentHour >= 15 || (currentHour == 11 && currentMinute >= 30)) {
					return
				}

				queryIndexs(that)
			}, 5000)
		},
		methods: {
			toSearch() {
				uni.navigateTo({
					url: "/pages/index/search"
				})
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
		height: 180pt;
		background-color: white;
		border-radius: 4pt;
		.title {
			padding: 4pt 0pt;
			display: flex;
			flex-direction: row;
			align-items: center;
			color: #333333;
			font-size: 12pt;
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
	}
</style>
