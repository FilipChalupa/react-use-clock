import React, { FunctionComponent } from 'react'
import { useClock } from '../useClock'
import './global.css'

export const Example: FunctionComponent = () => {
	const clock = useClock()
	const clockHHMMSS = `${clock.hours
		.toString()
		.padStart(2, '0')}:${clock.minutes
		.toString()
		.padStart(2, '0')}:${clock.seconds.toString().padStart(2, '0')}`

	return (
		<>
			<h1>Time is:</h1>
			<p>{clockHHMMSS}</p>
		</>
	)
}
