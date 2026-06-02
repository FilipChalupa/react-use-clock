import React from 'react'
import { Example } from './Example'

export default {
	title: 'Example',
	component: Example,
}

export const Demo = () => <Example />

export const EverySecond = () => <Example granularity="second" />

export const EveryMinute = () => <Example granularity="minute" />

export const EveryHour = () => <Example granularity="hour" />

export const EveryDay = () => <Example granularity="day" />
