import type { Meta, StoryObj } from '@storybook/react-vite'
import { Example } from './Example'

const meta: Meta<typeof Example> = {
	title: 'Example',
	component: Example,
}

export default meta

type Story = StoryObj<typeof Example>

export const Demo: Story = {}

export const EverySecond: Story = { args: { granularity: 'second' } }

export const EveryMinute: Story = { args: { granularity: 'minute' } }

export const EveryHour: Story = { args: { granularity: 'hour' } }

export const EveryDay: Story = { args: { granularity: 'day' } }
