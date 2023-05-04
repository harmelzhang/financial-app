<template>
	<view class="search">
		<view class="input">
			<image class="icon" src="/static/index/search.png"></image>
			<input class="tip" type="text" placeholder="请输入股票名称或代码" v-on:input="input"/>
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
				stocks: []
			}
		},
		methods: {
			toIndex() {
				uni.switchTab({
					url: "/pages/index/index"
				})
			},
			input(event) {
				let value = event.detail.value.trim()
				if(value == "") {
					this.stocks = []
					return
				}
				this.stocks = [
					{code: "600031", name: "三一重工", market: "上海"},
					{code: "000001", name: "平安银行", market: "深圳"},
					{code: "830946", name: "森萱医药", market: "北京"}
				]
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
				color: #A8A8A8;
				font-size: 10pt;
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
			}
			.name {
				margin-left: 8pt;
				color: #6d6d6d;
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
				color: #6d6d6d;
				font-size: 10pt;
				padding: 2pt 4pt;
			}
		}
	}
</style>
