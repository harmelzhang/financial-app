<template>
	<view class="search">
		<view class="input">
			<image class="icon" src="/static/index/search.png"></image>
			<input class="tip" type="text" placeholder="请输入股票名称或代码" v-on:input="input" v-bind:value="inputValue"/>
			<view class="clear" v-show="inputValue != ''" v-on:click="clearInput">
				<image src="/static/common/close.png"></image>
			</view>
		</view>
		<view class="btn" v-on:click="toIndex">
			<text>取消</text>
		</view>
	</view>
	<view class="suggest" v-show="stocks.length > 0">
		<view class="stock" v-for="stock in stocks">
			<text class="market"  v-bind:style="{backgroundColor: market_bgColors[stock.market]}">{{stock.market}}</text>
			<text class="code">{{stock.code}}</text>
			<text class="name">{{stock.name}}</text>
		</view>
	</view>
	<view class="record">
		<view class="title">
			<view class="title_prefix"></view>
			<text>历史搜索</text>
			<image class="delete" src="/static/common/delete.png" v-on:click="deleteHistoryRecord"></image>
		</view>
		<view class="content">
			<text class="item">隆基绿能</text>
			<text class="item">通威股份</text>
			<text class="item">ST广珠</text>
			<text class="item">三一重工</text>
			<text class="item">长电科技</text>
		</view>
	</view>
	<view class="record">
		<view class="title">
			<image class="title_icon" src="/static/index/fire.png"></image>
			<text>热门搜索</text>
		</view>
		<view class="content">
			<text class="item">中国平安</text>
			<text class="item">美的集团</text>
			<text class="item">隆基绿能</text>
			<text class="item">通威股份</text>
			<text class="item">中国移动</text>
			<text class="item">三一重工</text>
			<text class="item">万华化学</text>
			<text class="item">恒顺醋业</text>
			<text class="item">海天味业</text>
			<text class="item">紫光集团</text>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				market_bgColors: {
					"上海": "#38AAFE",
					"深圳": "#FF6E3F",
					"北京": "#FF4848"
				},
				inputValue: "",
				stocks: []
			}
		},
		methods: {
			clearInput() {
				this.inputValue = ""
				this.stocks = []
			},
			toIndex() {
				uni.switchTab({
					url: "/pages/index/index"
				})
			},
			input(event) {
				const that = this
				let value = event.detail.value.trim()
				if(value == "") {
					this.stocks = []
					this.inputValue = ""
					return
				}
				this.inputValue = value
				// 查询数据库
				const db = uniCloud.database()
				const dbCmd = db.command
				let res = db.collection("stock").where(
					dbCmd.or(
						{"code": new RegExp(value, "g")},
						{"stock_name": new RegExp(value, "g")},
					)
				).orderBy("code").limit(10).get().then((res) => {
					if(res.result.affectedDocs > 0) {
						let data = []
						res.result.data.forEach(function(item) {
							data.push({
								"code": item.code,
								"name": item.stock_name,
								"market": item.market_place
							})
						})
						that.stocks = data
					}
				})
			},
			deleteHistoryRecord() {
				console.log(">>")
			}
		}
	}
</script>

<style lang="scss">
	page {
		background-color: white;
	}
	.search {
		display: flex;
		flex-direction: row;
		align-items: center;
		padding: 8pt;
		.input {
			width: 100%;
			height: 16pt;
			padding: 4pt 0pt 4pt 8pt;
			margin-left: 4pt;
			border-radius: 50pt;
			display: flex;
			flex-direction: row;
			align-items: center;
			background-color: #F8F8F8;
			.icon {
				height: 12pt;
				width: 12pt;
				margin-top: 1pt;
			}
			.tip {
				width: 85%;
				margin-left: 2pt;
				font-size: 10pt;
			}
			.clear {
				padding: 4pt 4pt 0pt 4pt;
				image {
					width: 16pt;
					height: 16pt;
				}
			}
		}
		.btn {
			width: 40pt;
			font-size: 10pt;
			text-align: center;
		}
	}
	.suggest {
		position: fixed;
		background-color: white;
		width: 100%;
		height: 100%;
		z-index: 1;
		overflow: auto;
		.stock {
			display: flex;
			flex-direction: row;
			align-items: center;
			font-size: 11pt;
			padding: 8pt 0pt 8pt 14pt;
			.market {
				border-radius: 4pt;
				color: white;
				font-size: 8pt;
				padding: 2pt 4pt;
			}
			.code {
				margin-left: 8pt;
				color: #6D6D6D;
			}
			.name {
				margin-left: 8pt;
			}
		}
	}
	.record {
		margin: 4pt 8pt 8pt 8pt;
		height: 100pt;
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
				margin-left: 4pt;
				margin-right: 6pt;
				border-radius: 4pt;
			}
			.title_icon {
				width: 14pt;
				height: 14pt;
				margin-left: 4pt;
				margin-right: 2pt;
			}
			.delete {
				width: 12pt;
				height: 12pt;
				margin-left: auto;
				margin-right: 8pt;
			}
		}
		.content {
			.item {
				display: inline-block;
				margin-left: 8pt;
				margin-top: 8pt;
				background-color: #F8F8F8;
				border-radius: 4pt;
				color: #6D6D6D;
				font-size: 10pt;
				padding: 2pt 4pt;
			}
		}
	}
</style>
