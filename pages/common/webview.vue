<template>
	<view>
		<web-view v-bind:src="url"></web-view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				url: ""
			}
		},
		onLoad(options) {
			this.url = options.url
		}
	}
</script>

<style>

</style>
