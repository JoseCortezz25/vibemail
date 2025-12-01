import type { Meta, StoryObj } from '@storybook/react';
import { EmailToolbar, FormatAction } from '@/components/molecules/email-toolbar';
import { useState } from 'react';

const meta = {
  title: 'Molecules/EmailToolbar',
  component: EmailToolbar,
  parameters: {
    layout: 'padded'
  },
  tags: ['autodocs'],
  argTypes: {
    disabled: {
      control: 'boolean',
      description: 'Whether all toolbar buttons are disabled'
    }
  }
} satisfies Meta<typeof EmailToolbar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    onFormat: (action) => console.log('Format action:', action),
    activeFormats: []
  }
};

export const WithActiveFormats: Story = {
  args: {
    onFormat: (action) => console.log('Format action:', action),
    activeFormats: ['bold', 'alignLeft', 'bulletList']
  }
};

export const Disabled: Story = {
  args: {
    onFormat: (action) => console.log('Format action:', action),
    disabled: true,
    activeFormats: []
  }
};

export const Interactive: Story = {
  render: () => {
    const [activeFormats, setActiveFormats] = useState<FormatAction[]>([]);

    const handleFormat = (action: FormatAction) => {
      setActiveFormats(prev =>
        prev.includes(action)
          ? prev.filter(f => f !== action)
          : [...prev, action]
      );
      console.log('Format applied:', action);
    };

    return (
      <div className="space-y-4">
        <EmailToolbar onFormat={handleFormat} activeFormats={activeFormats} />
        <div className="text-muted-foreground text-sm">
          <strong>Active formats:</strong>{' '}
          {activeFormats.length > 0 ? activeFormats.join(', ') : 'None'}
        </div>
      </div>
    );
  }
};
