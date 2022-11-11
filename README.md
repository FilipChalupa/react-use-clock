# React useClock [![npm](https://img.shields.io/npm/v/react-use-clock.svg)](https://www.npmjs.com/package/react-use-clock) ![npm type definitions](https://img.shields.io/npm/types/react-use-clock.svg)

Simplified access to current hours, minutes, seconds.

## Installation

```bash
npm install react-use-clock
```

## How to use

```jsx
const MyClockComponent = () => {
	const clock = useClock()

	return (
		<div>
			Time is:{' '}
			<strong>
				{clock.hours.toString().padStart(2, '0')}:
				{clock.minutes.toString().padStart(2, '0')}:
				{clock.seconds.toString().padStart(2, '0')}
			</strong>
			<div
				style={{
					'--hours': `${clock.hours}`,
					'--minutes': `${clock.minutes}`,
					'--seconds': `${clock.seconds}`,
				}}
			/>
		</div>
	)
}
```

Create your own wrapper component. You can get inspired by [Example here](src/stories/Example.tsx) and [Storybook here](https://react-use-clock.netlify.app).

## Development

Run `npm start` and `npm run storybook` parallelly.
