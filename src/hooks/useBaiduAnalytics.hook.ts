interface BaiduAnalytics {
	push: (...args: any[]) => void
}

let _hmt: any[]
const BaiduAnalyticsCode = '4cce1636baa0c3f3ee35ffa310191c8d'

export const initBaiduAnalytics = () => {
	const script = document.createElement('script')
	script.src = `https://hm.baidu.com/hm.js?${BaiduAnalyticsCode}`
	document.body.appendChild(script)
	_hmt = []
}

export const useBaiduAnalytics = (): BaiduAnalytics => {
	const push = (...args: any[]) => {
		if (_hmt instanceof Array) {
			_hmt.push(args)
		}
	}
	return { push }
}
