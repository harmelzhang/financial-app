<template>
	<view class="content">
		<image src="/static/filter/no_condition.png"></image>
		<text>暂无选股策略</text>
		<button class="btn_new_condition">创建选股策略</button>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				
			}
		},
		methods: {
			
		}
	}
</script>

<style>
	.content {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}
	.btn_new_condition {
		margin-top: 50rpx;
		background-color: #FFC100;
		color: white;
		font-size: 30rpx;
		border-radius: 15rpx;
	}
</style>
