import React, { CSSProperties, FunctionComponent } from 'react'
import { useClock } from '../useClock'
import './global.css'

export const Example: FunctionComponent = () => {
	const clock = useClock()
	const clockHHMMSS = `${clock.hours
		.toString()
		.padStart(2, '0')}:${clock.minutes
		.toString()
		.padStart(2, '0')}:${clock.seconds.toString().padStart(2, '0')}`

	const dateDMYY = `${clock.day}. ${clock.month}. ${clock.year}`

	return (
		<>
			<h1>Time is:</h1>
			<p>{clockHHMMSS}</p>
			<h2>Date is:</h2>
			<p>{dateDMYY}</p>
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
		</>
	)
}
