import React, { CSSProperties, FunctionComponent } from 'react'
import { ClockGranularity, useClock } from '../useClock'
import { RealtimeClock } from './RealtimeClock'
import './global.css'

export const Example: FunctionComponent<{
	granularity?: ClockGranularity
}> = ({ granularity = 'second' }) => {
	const clock = useClock({ granularity })
	const clockHHMMSS = `${clock.hours
		.toString()
		.padStart(2, '0')}:${clock.minutes
		.toString()
		.padStart(2, '0')}:${clock.seconds.toString().padStart(2, '0')}`

	const dateDMYY = `${clock.day}. ${clock.month}. ${clock.year}`
	const intlDateTime = clock.date.toLocaleTimeString('en', {
		day: 'numeric',
		month: 'long',
		year: 'numeric',
	})

	return (
		<>
			<h1>Time is:</h1>
			<p>{clockHHMMSS}</p>
			<p>Date is: {dateDMYY}</p>
			<p>
				<small>Granularity: {granularity}</small>
			</p>
			<RealtimeClock />
			<div
				className="clock"
				style={
					{
						'--hours': `${clock.hours}`,
						'--minutes': `${clock.minutes}`,
						'--seconds': `${clock.seconds}`,
					} as CSSProperties
				}
			>
				<span className="clock__hours" />
				<span className="clock__minutes" />
				<span className="clock__seconds" />
			</div>
			<h2>Intl date:</h2>
			<p>{intlDateTime}</p>
		</>
	)
}
