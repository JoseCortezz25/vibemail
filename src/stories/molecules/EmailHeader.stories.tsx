import type { Meta, StoryObj } from '@storybook/react';
import { EmailHeader, EmailHeaderData } from '@/components/molecules/email-header';
import { useState } from 'react';

const meta = {
  title: 'Molecules/EmailHeader',
  component: EmailHeader,
  parameters: {
    layout: 'padded'
  },
  tags: ['autodocs'],
  argTypes: {
    disabled: {
      control: 'boolean',
      description: 'Whether the fields are disabled'
    }
  }
} satisfies Meta<typeof EmailHeader>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Empty: Story = {
  args: {
    data: {
      to: '',
      subject: ''
    },
    onChange: (data) => console.log('Changed:', data)
  }
};

export const WithData: Story = {
  args: {
    data: {
      to: 'john@example.com',
      subject: 'Quarterly Review Meeting'
    },
    onChange: (data) => console.log('Changed:', data)
  }
};

export const Disabled: Story = {
  args: {
    data: {
      to: 'john@example.com',
      subject: 'Locked Email'
    },
    disabled: true,
    onChange: (data) => console.log('Changed:', data)
  }
};

export const Interactive: Story = {
  render: () => {
    const [data, setData] = useState<EmailHeaderData>({
      to: '',
      subject: ''
    });

    const handleChange = (newData: Partial<EmailHeaderData>) => {
      setData(prev => ({ ...prev, ...newData }));
    };

    return (
      <div className="w-[600px] space-y-4">
        <EmailHeader data={data} onChange={handleChange} />
        <div className="bg-muted rounded-lg p-4">
          <p className="text-sm font-medium">Current Data:</p>
          <pre className="text-muted-foreground mt-2 text-xs">
            {JSON.stringify(data, null, 2)}
          </pre>
        </div>
      </div>
    );
  }
};
