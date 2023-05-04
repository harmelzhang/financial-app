<template>
	<view class="shop">
		<view class="item">
			<view class="name_area">
				<view class="name">
					<text>普通会员7天体验卡</text>
				</view>
				<view class="info">
					<text>具体会员权益请移步会员权益中心查询</text>
				</view>
				<view class="left_gap"></view>
			</view>
			<view class="oper_area">
				<view class="point">
					<view class="value">
						<text>20</text>
					</view>
					<view class="name">
						<text>积分</text>
					</view>
				</view>
				<view class="oper">
					<text>兑换</text>
				</view>
			</view>
		</view>
		<view class="item">
			<view class="name_area">
				<view class="name">
					<text>黄金会员7天体验卡</text>
				</view>
				<view class="info">
					<text>具体会员权益请移步会员权益中心查询</text>
				</view>
				<view class="left_gap"></view>
			</view>
			<view class="oper_area">
				<view class="point">
					<view class="value">
						<text>40</text>
					</view>
					<view class="name">
						<text>积分</text>
					</view>
				</view>
				<view class="oper">
					<text>兑换</text>
				</view>
			</view>
		</view>
		<view class="item">
			<view class="name_area">
				<view class="name">
					<text>钻石会员7天体验卡</text>
				</view>
				<view class="info">
					<text>具体会员权益请移步会员权益中心查询</text>
				</view>
				<view class="left_gap"></view>
			</view>
			<view class="oper_area">
				<view class="point">
					<view class="value">
						<text>60</text>
					</view>
					<view class="name">
						<text>积分</text>
					</view>
				</view>
				<view class="oper">
					<text>兑换</text>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				
			}
		},
		methods: {
			exchange() {
				
			}
		}
	}
</script>

<style lang="scss">
	.shop {
		margin: 8pt;
		.item {
			margin-bottom: 8pt;
			background-color: white;
			border-radius: 4pt;
			display: flex;
			flex-direction: row;
			align-items: center;
			.name_area {
				display: flex;
				flex-direction: column;
				margin-left: 18pt;
				position: relative;
				.name {
					font-size: 12pt;
					font-weight: bold;
					color: #333333;
				}
				.info {
					margin-top: 8pt;
					font-size: 8pt;
					color: #A8A8A8;
				}
				.left_gap {
					position: absolute;
					height: 20pt;
					width: 20pt;
					background-color: #F3F3F3;
					border-radius: 50%;
					top: 8pt;
					left: -30pt;
				}
			}
			.oper_area {
				margin-left: auto;
				width: 50pt;
				border-left: 2pt dashed #F3F3F3;
				display: flex;
				flex-direction: column;
				align-items: center;
				padding: 4pt;
				.point {
					.name {
						font-size: 8pt;
						color: #A8A8A8;
						text-align: center;
					}
					.value {
						font-weight: bold;
						font-size: 16pt;
						color: #ED6A32;
					}
				}
				.oper {
					background-color: #FFC100;
					color: white;
					width: 40pt;
					text-align: center;
					font-size: 10pt;
					border-radius: 50pt;
					padding: 2pt 0pt 2pt 0pt;
					margin-top: 4pt;
				}
			}
		}
	}
</style>
