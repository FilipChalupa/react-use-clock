import { act, renderHook } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import type { ClockGranularity } from './useClock'
import { useClock } from './useClock'

describe('useClock', () => {
	beforeEach(() => {
		vi.useFakeTimers()
	})
	afterEach(() => {
		vi.useRealTimers()
	})

	it('reports the current time split into fields', () => {
		vi.setSystemTime(new Date(2026, 5, 2, 14, 30, 45, 500))
		const { result } = renderHook(() => useClock())
		expect(result.current).toMatchObject({
			year: 2026,
			month: 6,
			day: 2,
			hours: 14,
			minutes: 30,
			seconds: 45,
		})
	})

	it('exposes a Date instance matching the fields', () => {
		vi.setSystemTime(new Date(2026, 5, 2, 14, 30, 45, 500))
		const { result } = renderHook(() => useClock())
		const { date } = result.current
		expect(date.getFullYear()).toBe(2026)
		expect(date.getMonth()).toBe(5)
		expect(date.getDate()).toBe(2)
		expect(date.getHours()).toBe(14)
		expect(date.getMinutes()).toBe(30)
		expect(date.getSeconds()).toBe(45)
	})

	it('ticks on the next second boundary', () => {
		vi.setSystemTime(new Date(2026, 5, 2, 14, 30, 45, 500))
		const { result } = renderHook(() => useClock())
		expect(result.current.seconds).toBe(45)
		act(() => {
			vi.advanceTimersByTime(499)
		})
		expect(result.current.seconds).toBe(45)
		act(() => {
			vi.advanceTimersByTime(1)
		})
		expect(result.current.seconds).toBe(46)
	})

	it('zeroes fields below the chosen granularity', () => {
		vi.setSystemTime(new Date(2026, 5, 2, 14, 30, 45, 0))
		const { result } = renderHook(() => useClock({ granularity: 'minute' }))
		expect(result.current).toMatchObject({
			hours: 14,
			minutes: 30,
			seconds: 0,
		})
	})

	it('keeps a stable reference between ticks of a coarse granularity', () => {
		vi.setSystemTime(new Date(2026, 5, 2, 14, 30, 0, 0))
		const { result } = renderHook(() => useClock({ granularity: 'minute' }))
		const first = result.current
		// Half a minute later: still the same minute, so no re-render at all.
		act(() => {
			vi.advanceTimersByTime(30_000)
		})
		expect(result.current).toBe(first)
		// Crossing the minute boundary emits a new value.
		act(() => {
			vi.advanceTimersByTime(30_000)
		})
		expect(result.current).not.toBe(first)
		expect(result.current.minutes).toBe(31)
		expect(result.current.seconds).toBe(0)
	})

	it('emits a freshly truncated value when granularity changes', () => {
		vi.setSystemTime(new Date(2026, 5, 2, 14, 30, 45, 0))
		const { result, rerender } = renderHook(
			({ granularity }) => useClock({ granularity }),
			{ initialProps: { granularity: 'second' as ClockGranularity } },
		)
		expect(result.current.seconds).toBe(45)
		rerender({ granularity: 'minute' })
		expect(result.current.seconds).toBe(0)
		expect(result.current.minutes).toBe(30)
	})

	it('rolls over to the next day for day granularity', () => {
		vi.setSystemTime(new Date(2026, 0, 31, 23, 59, 30, 0))
		const { result } = renderHook(() => useClock({ granularity: 'day' }))
		expect(result.current).toMatchObject({
			year: 2026,
			month: 1,
			day: 31,
			hours: 0,
			minutes: 0,
			seconds: 0,
		})
		// 30 s later the day boundary (next midnight) is reached.
		act(() => {
			vi.advanceTimersByTime(30_000)
		})
		expect(result.current).toMatchObject({ year: 2026, month: 2, day: 1 })
	})

	it('uses the provided initialValue as the server snapshot', () => {
		const initialValue = {
			year: 2000,
			month: 1,
			day: 1,
			hours: 1,
			minutes: 2,
			seconds: 3,
		}
		const { result } = renderHook(() =>
			useClock({ granularity: 'minute', getDate: () => new Date(), initialValue }),
		)
		// Client snapshot wins after mount, but it is truncated like everything else.
		expect(result.current.seconds).toBe(0)
	})
})
