import type { Meta, StoryObj } from '@storybook/react';
import { EmailField } from '@/components/atoms/email-field';
import { useState } from 'react';

const meta = {
  title: 'Atoms/EmailField',
  component: EmailField,
  parameters: {
    layout: 'centered'
  },
  tags: ['autodocs'],
  argTypes: {
    label: {
      control: 'text',
      description: 'Label text for the field'
    },
    type: {
      control: 'select',
      options: ['text', 'email'],
      description: 'Input type'
    },
    required: {
      control: 'boolean',
      description: 'Whether the field is required'
    },
    disabled: {
      control: 'boolean',
      description: 'Whether the field is disabled'
    }
  }
} satisfies Meta<typeof EmailField>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    label: 'Email Subject',
    value: '',
    placeholder: 'Enter subject',
    onChange: () => {}
  }
};

export const WithValue: Story = {
  args: {
    label: 'Subject',
    value: 'Meeting Reminder',
    placeholder: 'Enter subject',
    onChange: () => {}
  }
};

export const Required: Story = {
  args: {
    label: 'Subject',
    value: '',
    placeholder: 'Enter subject',
    required: true,
    onChange: () => {}
  }
};

export const EmailType: Story = {
  args: {
    label: 'Recipient',
    type: 'email',
    value: '',
    placeholder: 'recipient@example.com',
    onChange: () => {}
  }
};

export const Disabled: Story = {
  args: {
    label: 'Subject',
    value: 'Locked Subject',
    disabled: true,
    onChange: () => {}
  }
};

export const Interactive: Story = {
  render: () => {
    const [value, setValue] = useState('');
    return (
      <div className="w-[400px]">
        <EmailField
          label="Subject"
          value={value}
          onChange={setValue}
          placeholder="Type something..."
        />
        <p className="text-muted-foreground mt-2 text-sm">Current value: {value || '(empty)'}</p>
      </div>
    );
  }
};
