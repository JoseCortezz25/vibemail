import type { Meta, StoryObj } from '@storybook/react';
import { EmailContentEditor } from '@/components/molecules/email-content-editor';
import { useState } from 'react';

const meta = {
  title: 'Molecules/EmailContentEditor',
  component: EmailContentEditor,
  parameters: {
    layout: 'padded'
  },
  tags: ['autodocs'],
  argTypes: {
    disabled: {
      control: 'boolean',
      description: 'Whether the editor is disabled'
    },
    minHeight: {
      control: 'text',
      description: 'Minimum height of the editor'
    }
  }
} satisfies Meta<typeof EmailContentEditor>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Empty: Story = {
  args: {
    content: '',
    onChange: (content) => console.log('Content changed:', content)
  }
};

export const WithContent: Story = {
  args: {
    content: `Dear Team,

I hope this email finds you well. I wanted to reach out regarding our upcoming project deadline.

Please review the attached documents and let me know if you have any questions.

Best regards,
John`,
    onChange: (content) => console.log('Content changed:', content)
  }
};

export const CustomHeight: Story = {
  args: {
    content: '',
    minHeight: '500px',
    onChange: (content) => console.log('Content changed:', content)
  }
};

export const Disabled: Story = {
  args: {
    content: 'This content cannot be edited',
    disabled: true,
    onChange: (content) => console.log('Content changed:', content)
  }
};

export const Interactive: Story = {
  render: () => {
    const [content, setContent] = useState('');

    return (
      <div className="w-[800px] space-y-4">
        <EmailContentEditor content={content} onChange={setContent} />
        <div className="bg-muted rounded-lg p-4">
          <p className="text-sm font-medium">Character count: {content.length}</p>
          <p className="text-muted-foreground text-xs mt-1">
            Word count: {content.split(/\s+/).filter(Boolean).length}
          </p>
        </div>
      </div>
    );
  }
};
