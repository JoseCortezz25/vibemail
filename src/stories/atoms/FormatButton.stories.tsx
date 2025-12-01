import type { Meta, StoryObj } from '@storybook/react';
import { FormatButton } from '@/components/atoms/format-button';
import { Bold, Italic, Underline, AlignCenter } from 'lucide-react';
import { useState } from 'react';

const meta = {
  title: 'Atoms/FormatButton',
  component: FormatButton,
  parameters: {
    layout: 'centered'
  },
  tags: ['autodocs'],
  argTypes: {
    isActive: {
      control: 'boolean',
      description: 'Whether the button is in active state'
    },
    disabled: {
      control: 'boolean',
      description: 'Whether the button is disabled'
    }
  }
} satisfies Meta<typeof FormatButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const BoldButton: Story = {
  args: {
    icon: Bold,
    label: 'Bold',
    onClick: () => console.log('Bold clicked'),
    isActive: false
  }
};

export const ItalicButton: Story = {
  args: {
    icon: Italic,
    label: 'Italic',
    onClick: () => console.log('Italic clicked'),
    isActive: false
  }
};

export const ActiveState: Story = {
  args: {
    icon: Underline,
    label: 'Underline',
    onClick: () => console.log('Underline clicked'),
    isActive: true
  }
};

export const Disabled: Story = {
  args: {
    icon: AlignCenter,
    label: 'Align Center',
    onClick: () => console.log('Align clicked'),
    disabled: true
  }
};

export const InteractiveGroup: Story = {
  render: () => {
    const [activeFormats, setActiveFormats] = useState<string[]>([]);

    const toggleFormat = (format: string) => {
      setActiveFormats(prev =>
        prev.includes(format)
          ? prev.filter(f => f !== format)
          : [...prev, format]
      );
    };

    return (
      <div className="flex items-center gap-2">
        <FormatButton
          icon={Bold}
          label="Bold"
          onClick={() => toggleFormat('bold')}
          isActive={activeFormats.includes('bold')}
        />
        <FormatButton
          icon={Italic}
          label="Italic"
          onClick={() => toggleFormat('italic')}
          isActive={activeFormats.includes('italic')}
        />
        <FormatButton
          icon={Underline}
          label="Underline"
          onClick={() => toggleFormat('underline')}
          isActive={activeFormats.includes('underline')}
        />
      </div>
    );
  }
};
