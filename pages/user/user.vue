<template>
	<view class="user_info">
		<view class="user">
			<view class="avatar" v-on:click="changeAvatar">
				<image class="icon" src="/static/user/user.png"></image>
				<image class="camera" src="/static/user/camera.png"></image>
			</view>
			<view class="info">
				<view class="nickname">
					<text>周大高</text>
				</view>
				<view class="join">
					<text>会员到期日 </text>
					<text>2023-04-11</text>
				</view>
			</view>
		</view>
		<view class="statistic">
			<view class="item">
				<text class="value">{{todayQuery}}</text>
				<text class="name">今日查询</text>
			</view>
			<view class="item" v-on:click="toFavorites">
				<text class="value">{{favorites}}</text>
				<text class="name">我的自选</text>
			</view>
			<view class="item" v-on:click="toFilters">
				<text class="value">{{filters}}</text>
				<text class="name">我的条件</text>
			</view>
			<view class="item" v-on:click="toPointShop">
				<text class="value">{{points}}</text>
				<text class="name">我的积分</text>
				<view class="shop">
					<text>兑</text>
				</view>
			</view>
		</view>
	</view>
	<view class="card">
	</view>
	<view class="operate">
		<view class="item">
			<view class="icon_area">
				<image class="icon" src="/static/user/coupon.png"></image>
			</view>
			<view class="btn_area">
				<button class="text" type="default" v-on:click="toCoupon">券码兑换</button>
			</view>
			<view class="nav_area">
				<image class="nav" src="/static/user/right.png"></image>
			</view>
		</view>
		<view class="item">
			<view class="icon_area">
				<image class="icon" src="/static/user/order.png"></image>
			</view>
			<view class="btn_area">
				<button class="text" type="default" v-on:click="toOrder">我的订单</button>
			</view>
			<view class="nav_area">
				<image class="nav" src="/static/user/right.png"></image>
			</view>
		</view>
		<view class="item">
			<view class="icon_area">
				<image class="icon" src="/static/user/setting.png"></image>
			</view>
			<view class="btn_area">
				<button class="text" type="default" v-on:click="toSetting">用户配置</button>
			</view>
			<view class="nav_area">
				<image class="nav" src="/static/user/right.png"></image>
			</view>
		</view>
	</view>
	<view class="operate">
		<view class="item">
			<view class="icon_area">
				<image class="icon" src="/static/user/share.png"></image>
			</view>
			<view class="btn_area">
				<button class="text" type="default" open-type="share">分享好友</button>
			</view>
			<view class="nav_area">
				<image class="nav" src="/static/user/right.png"></image>
			</view>
		</view>
		<view class="item">
			<view class="icon_area">
				<image class="icon" src="/static/user/help.png"></image>
			</view>
			<view class="btn_area">
				<button class="text" type="default" v-on:click="toHelp">使用帮助</button>
			</view>
			<view class="nav_area">
				<image class="nav" src="/static/user/right.png"></image>
			</view>
		</view>
		<view class="item">
			<view class="icon_area">
				<image class="icon" src="/static/user/headset.png"></image>
			</view>
			<view class="btn_area">
				<button class="text" type="default" open-type="contact">在线客服</button>
			</view>
			<view class="nav_area">
				<image class="nav" src="/static/user/right.png"></image>
			</view>
		</view>
		<view class="item">
			<view class="icon_area">
				<image class="icon" src="/static/user/about.png"></image>
			</view>
			<view class="btn_area">
				<button class="text" type="default" v-on:click="toAbout">关于我们</button>
			</view>
			<view class="nav_area">
				<image class="nav" src="/static/user/right.png"></image>
			</view>
		</view>
	</view>
	<!-- 底部站位，解决小程序端太贴底部的问题 -->
	<view style="height: 1pt;"></view>
</template>

<script>
	export default {
		data() {
			return {
				todayQuery: 0,
				favorites: 72,
				filters: 8,
				points: 9999
			}
		},
		onShareAppMessage: function() {
			return {
				title: "图说财报",
				path: "/pages/index/index",
				imageUrl: "显示图片长宽比是 5:4"
			}
		},
		methods: {
			changeAvatar() {
				console.log(">>>")
			},
			toFavorites() {
				uni.switchTab({
					url: "/pages/favorite/favorite"
				})
			},
			toFilters() {
				uni.switchTab({
					url: "/pages/filter/filter"
				})
			},
			toPointShop() {
				uni.navigateTo({
					url: "/pages/user/shop"
				})
			},
			toCoupon() {
				uni.navigateTo({
					url: "/pages/user/coupon"
				})
			},
			toOrder() {
				uni.navigateTo({
					url: "/pages/user/order"
				})
			},
			toSetting() {
				uni.navigateTo({
					url: "/pages/user/setting"
				})
			},
			toHelp() {
				uni.navigateTo({
					url: "/pages/common/webview?url=https://mp.weixin.qq.com/s/GEOo6HgAjO4pR1d0nTLzlg"
				})
			},
			toAbout() {
				uni.navigateTo({
					url: "/pages/common/webview?url=https://mp.weixin.qq.com/s/GEOo6HgAjO4pR1d0nTLzlg"
				})
			}
		}
	}
</script>

<style lang="scss">
	.user_info {
		height: 160pt;
		background-color: #FFC100;
		border-radius: 0pt 0pt 16pt 16pt;
		.user {
			display: flex;
			flex-direction: row;
			padding: 8pt 0pt 0pt 8pt;
			.avatar {
				height: 40pt;
				position: relative;
				.icon {
					width: 40pt;
					height: 40pt;
					border-radius: 50%;
				}
				.camera {
					width: 14pt;
					height: 14pt;
					position: absolute;
					bottom: 0pt;
					right: 0pt;
				}
			}
			.info {
				height: 32pt;
				margin-top: 4pt;
				margin-left: 10pt;
				display: flex;
				flex-direction: column;
				.nickname {
					font-size: 13pt;
					font-weight: bold;
					letter-spacing: 2pt;
					color: white;
				}
				.join {
					color: #333333;
					font-size: 9pt;
					margin-top: auto;
				}
			}
		}
		.statistic {
			margin: 8pt;
			height: 48pt;
			background-color: white;
			border-radius: 4pt;
			display: flex;
			flex-direction: row;
			.item {
				flex: 1;
				display: flex;
				flex-direction: column;
				justify-content: center;
				align-items: center;
				border-right: 1rpx solid #F3F3F3;
				margin: 6pt 0pt 6pt 0pt;
				&:last-child {
					border: none;
					position: relative;
				}
				.name {
					margin-top: 4pt;
					font-size: 10pt;
					color: #333333;
				}
				.value {
					font-size: 12pt;
					color: #FFC100;
					font-weight: bold;
				}
				.shop {
					position: absolute;
					top: -6pt;
					right: 0pt;
					background-color: #FF4848;
					padding: 3pt;
					border-top-right-radius: 4pt;
					font-size: 6pt;
					color: white;
				}
			}
		}
	}
	.card {
		margin: -48pt 8pt 0pt 8pt;
		height: 100pt;
		background-color: #2A2E33;
		border-radius: 4pt;
	}
	.operate {
		margin: 8pt;
		padding: 0pt 4pt;
		background-color: white;
		border-radius: 4pt;
		&:last-child {
			margin-bottom: 40pt;
		}
		.item {
			height: 36pt;
			padding-left: 12pt;
			border-top: 1rpx solid #F3F3F3;
			color: #333333;
			display: flex;
			flex-direction: row;
			align-items: center;
			.icon_area {
				height: 100%;
				display: flex;
				flex-direction: column;
				justify-content: center;
				.icon {
					width: 16pt;
					height: 16pt;
				}
			}
			.btn_area {
				width: 100%;
				margin-left: 10pt;
				.text {
					width: 100%;
					padding: 0px;
					text-align: left;
					font-size: 11pt;
					color: #333333;
					background-color: white;
					border: none;
					&::after {
						border: none;
					}
				}
			}
			.nav_area {
				height: 100%;
				width: 16pt;
				margin-left: auto;
				margin-right: 8pt;
				display: flex;
				flex-direction: column;
				justify-content: center;
				.nav {
					width: 16pt;
					height: 16pt;
				}
			}
		}
	}
</style>
