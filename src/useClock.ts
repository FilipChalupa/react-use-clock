import { useCallback, useMemo, useRef, useSyncExternalStore } from 'react'

export const useClock = (
	initialValue = {
		hours: 0,
		minutes: 0,
		seconds: 0,
		year: 0,
		month: 0,
		day: 0, // @TODO: rename to date
	},
	getDate = () => new Date(),
) => {
	const nowRef = useRef(getDate())
	const lastSnapshotRef = useRef<null | typeof initialValue>(null)
	const subscribe = useCallback((onStoreChange: () => void) => {
		let timer: ReturnType<typeof setTimeout>
		const loop = () => {
			nowRef.current = getDate()
			const nextTick = Math.max(1, 1000 - (nowRef.current.getTime() % 1000))
			lastSnapshotRef.current = null // Request recalculation
			onStoreChange()
			timer = setTimeout(loop, nextTick)
		}
		loop()
		return () => {
			clearTimeout(timer)
		}
	}, [])
	const getSnapshot = useCallback(() => {
		if (lastSnapshotRef.current === null) {
			lastSnapshotRef.current = {
				hours: nowRef.current.getHours(),
				minutes: nowRef.current.getMinutes(),
				seconds: nowRef.current.getSeconds(),
				year: nowRef.current.getFullYear(),
				month: nowRef.current.getMonth() + 1,
				day: nowRef.current.getDate(),
			}
		}
		return lastSnapshotRef.current
	}, [])
	const getServerSnapshot = useCallback(() => initialValue, [initialValue])
	const clock = useSyncExternalStore<typeof initialValue>(
		subscribe,
		getSnapshot,
		getServerSnapshot,
	)

	return useMemo(
		() => ({
			...clock,
			date: new Date(
				clock.year,
				clock.month - 1,
				clock.day,
				clock.hours,
				clock.minutes,
				clock.seconds,
			),
		}),
		[clock],
	)
}
