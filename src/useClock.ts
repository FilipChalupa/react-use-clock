import { useEffect, useState } from 'react'

export const useClock = (
	initialValue = {
		hours: 0,
		minutes: 0,
		seconds: 0,
	},
	getDate = () => new Date(),
) => {
	const [clock, setClock] = useState(() => ({
		...initialValue,
		isInitialized: false,
	}))

	useEffect(() => {
		let timer: ReturnType<typeof setTimeout>

		const loop = () => {
			const now = getDate()
			setClock({
				hours: now.getHours(),
				minutes: now.getMinutes(),
				seconds: now.getSeconds(),
				isInitialized: true,
			})
			const nextTick = Math.max(1, 1000 - (now.getTime() % 1000))
			timer = setTimeout(loop, nextTick)
		}
		loop()

		return () => {
			clearTimeout(timer)
		}
	}, [])

	return clock
}
