// Storybook Imports
import { Meta, StoryObj } from '@storybook/angular'
import { fn } from '@storybook/test'
// This Component Imports
import { ButtonComponent } from './button.component'

const meta: Meta<ButtonComponent> = {
  title: 'buttons/button',
  component: ButtonComponent,
  tags: ['autodocs'],
  argTypes: {
    name: {
      description: 'Required name',
      control: {
        type: 'text',
        accept: 'string',
      },
      table: {
        type: { summary: 'Name' },
        defaultValue: { summary: 'button name' },
      },
    },
    color: {
      description: 'Supported colors',
      control: {
        type: 'select',
        accept: 'string',
      },
      options: ['pink', 'purple', 'mustard', 'orange', 'red', 'blue', 'green'],
      table: {
        type: { summary: 'ButtonColor' },
        defaultValue: { summary: 'pink' },
      },
    },
    size: {
      description: 'Supported sizes',
      control: {
        type: 'select',
        accept: 'string',
      },
      options: ['tiny', 'small', 'normal', 'medium', 'large'],
      table: {
        type: { summary: 'ButtonSize' },
        defaultValue: { summary: 'normal' },
      },
    },
    disabled: {
      control: {
        type: 'boolean',
        accept: 'boolean',
      },
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    clicked: {
      table: {
        type: { summary: 'function' },
        defaultValue: { summary: '() => void' },
      },
    },
  },
  args: {
    name: 'button',
    color: 'pink',
    size: 'normal',
    disabled: false,
    clicked: fn(),
  },
  parameters: {},
  render: (args) => ({
    props: {
      ...args,
      ngContent: 'Button',
    },
    template: `
    <gld-button [name]="name" [color]="color" [size]="size" [disable]="disable">
      {{ ngContent }}
    </gld-button>`,
  }),
}

export default meta
type Story = StoryObj<ButtonComponent>

export const Pink: Story = {
  args: {
    color: 'pink',
  },
}
