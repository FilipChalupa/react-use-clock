import React, { FunctionComponent, useEffect, useState } from 'react'

// Stories-only helper. Renders the real wall-clock time including milliseconds,
// refreshed every animation frame. It deliberately does NOT use `useClock` so it
// keeps moving regardless of the chosen granularity – making it obvious that the
// page is live even when a coarse-granularity clock (minute/hour/day) appears
// frozen.
export const RealtimeClock: FunctionComponent = () => {
	const [now, setNow] = useState(() => new Date())

	useEffect(() => {
		let frame: number
		const tick = () => {
			setNow(new Date())
			frame = requestAnimationFrame(tick)
		}
		frame = requestAnimationFrame(tick)
		return () => cancelAnimationFrame(frame)
	}, [])

	const realtime = `${now.getHours().toString().padStart(2, '0')}:${now
		.getMinutes()
		.toString()
		.padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}.${now
		.getMilliseconds()
		.toString()
		.padStart(3, '0')}`

	return (
		<p>
			<small>Real time (not from the hook): {realtime}</small>
		</p>
	)
}
