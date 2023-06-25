<template>
	<view>
		
	</view>
</template>

<script>
	function queryData(that) {
		let now = new Date()
		let ymd = now.toISOString().split("T")[0]
		uni.request({
			url: `https://stockjs.jrj.com.cn/share/news/yaowen/yw${ymd}.js`,
			success(res) {
				let news = []
				res.data.newsinfo.forEach(function(item) {
					news.push({
						date: item.makedate,
						title: item.title,
						source: item.infosource,
						detail: item.detail,
						url: item.mInfoUrl
					})
				})
				that.news = news
			}
		})
	}

	export default {
		data() {
			return {
				news: []
			}
		},
		onLoad() {
			queryData(this)
		},
		methods: {
			
		}
	}
</script>

<style>

</style>
