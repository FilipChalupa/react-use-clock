import { useCallback, useMemo, useRef, useSyncExternalStore } from 'react'

export type ClockGranularity = 'second' | 'minute' | 'hour' | 'day'

export interface ClockSnapshot {
	hours: number
	minutes: number
	seconds: number
	year: number
	month: number
	day: number
}

export interface UseClockOptions {
	/**
	 * How often the clock ticks. Lower fields are zeroed (e.g. `'minute'`
	 * reports `seconds: 0`) so the component only re-renders once per unit.
	 * @default 'second'
	 */
	granularity?: ClockGranularity
	/** Value used for the server snapshot / first render. */
	initialValue?: ClockSnapshot
	/** Source of the current time. Override for testing or custom clocks. */
	getDate?: () => Date
}

const defaultInitialValue: ClockSnapshot = {
	hours: 0,
	minutes: 0,
	seconds: 0,
	year: 0,
	month: 0,
	day: 0,
}

const snapshotFromDate = (date: Date): ClockSnapshot => ({
	hours: date.getHours(),
	minutes: date.getMinutes(),
	seconds: date.getSeconds(),
	year: date.getFullYear(),
	month: date.getMonth() + 1,
	day: date.getDate(),
})

const truncate = (
	snapshot: ClockSnapshot,
	granularity: ClockGranularity,
): ClockSnapshot => ({
	...snapshot,
	hours: granularity === 'day' ? 0 : snapshot.hours,
	minutes:
		granularity === 'day' || granularity === 'hour' ? 0 : snapshot.minutes,
	seconds: granularity === 'second' ? snapshot.seconds : 0,
})

// Milliseconds until the next tick, aligned to the granularity boundary.
// Uses local Date mutators so it stays correct across DST and month/year rollovers.
const millisecondsUntilNextTick = (
	now: Date,
	granularity: ClockGranularity,
): number => {
	const next = new Date(now)
	next.setMilliseconds(0)
	if (granularity !== 'second') {
		next.setSeconds(0)
	}
	if (granularity === 'hour' || granularity === 'day') {
		next.setMinutes(0)
	}
	if (granularity === 'day') {
		next.setHours(0)
	}
	switch (granularity) {
		case 'second':
			next.setSeconds(next.getSeconds() + 1)
			break
		case 'minute':
			next.setMinutes(next.getMinutes() + 1)
			break
		case 'hour':
			next.setHours(next.getHours() + 1)
			break
		case 'day':
			next.setDate(next.getDate() + 1)
			break
	}
	return Math.max(1, next.getTime() - now.getTime())
}

export const useClock = ({
	granularity = 'second',
	initialValue = defaultInitialValue,
	getDate = () => new Date(),
}: UseClockOptions = {}) => {
	const getDateRef = useRef(getDate)
	getDateRef.current = getDate
	const nowRef = useRef(getDate())
	const lastSnapshotRef = useRef<ClockSnapshot | null>(null)
	const subscribe = useCallback(
		(onStoreChange: () => void) => {
			let timer: ReturnType<typeof setTimeout>
			const loop = () => {
				nowRef.current = getDateRef.current()
				const nextTick = millisecondsUntilNextTick(nowRef.current, granularity)
				lastSnapshotRef.current = null // Request recalculation
				onStoreChange()
				timer = setTimeout(loop, nextTick)
			}
			loop()
			return () => {
				clearTimeout(timer)
			}
		},
		[granularity],
	)
	const getSnapshot = useCallback(() => {
		if (lastSnapshotRef.current === null) {
			lastSnapshotRef.current = truncate(
				snapshotFromDate(nowRef.current),
				granularity,
			)
		}
		return lastSnapshotRef.current
	}, [granularity])
	const serverSnapshot = useMemo(
		() => truncate(initialValue, granularity),
		[initialValue, granularity],
	)
	const getServerSnapshot = useCallback(() => serverSnapshot, [serverSnapshot])
	const clock = useSyncExternalStore<ClockSnapshot>(
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
