<template>
	<view class="operate">
		<view class="item" v-on:click="edit">
			<view class="icon_area">
				<image class="icon" src="/static/user/nickname.png"></image>
			</view>
			<view class="name_area">
				<text class="text">用户昵称</text>
			</view>
			<view class="value_area">
				<text class="text">{{nickname}}</text>
			</view>
			<view class="operate_area">
				<image class="nav" src="/static/user/right.png"></image>
			</view>
		</view>
		<view class="item">
			<view class="icon_area">
				<image class="icon" src="/static/user/message.png"></image>
			</view>
			<view class="name_area">
				<text class="text">消息通知</text>
			</view>
			<view class="value_area"></view>
			<view class="operate_area">
				<switch color="#FFC100" v-bind:checked="notify" v-on:change="notifyChange"></switch>
			</view>
		</view>
		<view class="item" v-on:click="clear">
			<view class="icon_area">
				<image class="icon" src="/static/user/clear.png"></image>
			</view>
			<view class="name_area">
				<text class="text">清除数据</text>
			</view>
			<view class="value_area"></view>
			<view class="operate_area">
				<image class="nav" src="/static/user/right.png"></image>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				nickname: "周大高",
				notify: false
			}
		},
		methods: {
			edit() {
				const that = this;
				uni.showModal({
					title: "用户昵称",
					content: that.nickname,
					editable: true,
					confirmColor: "#FFC100",
					success: function(res) {
						if(res.confirm) {
							if(res.content == "") {
								uni.showToast({
									icon: "none",
									title: "用户昵称不能为空"
								})
								return
							}
							if(res.content.length > 8) {
								uni.showToast({
									icon: "none",
									title: "用户昵称不能超过8个字符"
								})
								return
							}
							that.nickname = res.content
						}
					}
				})
			},
			notifyChange(event) {
				uni.showToast({
					icon: "none",
					title: "" + event.detail.value
				})
			},
			clear() {
				uni.showModal({
					title: "清除数据",
					content: "是否要清除所有自选记录和条件记录？该操作不可逆！",
					confirmColor: "#FF4848",
					success: function(res) {
						if(res.confirm) {
							uni.showToast({
								icon: "none",
								title: "已清空"
							})
						}
					}
				})
			}
		}
	}
</script>

<style lang="scss">
	.operate {
		margin: 8pt;
		padding: 0pt 4pt;
		background-color: white;
		border-radius: 4pt;
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
			.name_area {
				margin-left: 10pt;
				height: 100%;
				display: flex;
				flex-direction: column;
				justify-content: center;
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
			.value_area {
				height: 100%;
				margin-left: auto;
				margin-right: 8pt;
				display: flex;
				flex-direction: column;
				justify-content: center;
				.text {
					font-size: 11pt;
					color: #333333;
				}
			}
			.operate_area {
				height: 100%;
				margin-right: 8pt;
				display: flex;
				flex-direction: column;
				justify-content: center;
				.nav {
					width: 16pt;
					height: 16pt;
				}
				switch {
					margin-right: -8pt;
					transform: scale(0.6);
				}
			}
		}
	}
</style>
