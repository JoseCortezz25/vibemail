import type { Meta, StoryObj } from '@storybook/react';
import { EmailEditor } from '@/components/organisms/email-editor';
import { Email } from '@/domains/email-editor/schema';
import { useState } from 'react';

const meta = {
  title: 'Organisms/EmailEditor',
  component: EmailEditor,
  parameters: {
    layout: 'padded'
  },
  tags: ['autodocs'],
  argTypes: {
    disabled: {
      control: 'boolean',
      description: 'Whether the entire editor is disabled'
    }
  }
} satisfies Meta<typeof EmailEditor>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Empty: Story = {
  args: {
    onChange: (email) => console.log('Email changed:', email)
  }
};

export const WithInitialData: Story = {
  args: {
    initialEmail: {
      to: 'team@example.com',
      subject: 'Project Update',
      content: 'Hi team,\n\nHere is the latest update on our project...'
    },
    onChange: (email) => console.log('Email changed:', email)
  }
};

export const Disabled: Story = {
  args: {
    initialEmail: {
      to: 'locked@example.com',
      subject: 'Read Only',
      content: 'This email is in read-only mode'
    },
    disabled: true,
    onChange: (email) => console.log('Email changed:', email)
  }
};

export const DraftTemplate: Story = {
  args: {
    initialEmail: {
      to: '',
      subject: '[Draft] Weekly Newsletter',
      content: `Hello [Name],

Welcome to our weekly newsletter!

This week's highlights:
• Feature 1
• Feature 2
• Feature 3

Best regards,
The Team`
    },
    onChange: (email) => console.log('Email changed:', email)
  }
};

export const Interactive: Story = {
  render: () => {
    const [email, setEmail] = useState<Email | null>(null);
    const [saveCount, setSaveCount] = useState(0);

    const handleChange = (newEmail: Email) => {
      setEmail(newEmail);
    };

    const handleSave = () => {
      setSaveCount(prev => prev + 1);
      console.log('Saved email:', email);
    };

    return (
      <div className="space-y-4">
        <EmailEditor onChange={handleChange} />

        <div className="bg-muted flex items-center justify-between rounded-lg p-4">
          <div className="text-sm">
            <p className="font-medium">Email Status</p>
            <p className="text-muted-foreground text-xs">
              Modified: {email ? 'Yes' : 'No'} | Saves: {saveCount}
            </p>
          </div>
          <button
            onClick={handleSave}
            disabled={!email}
            className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg px-4 py-2 text-sm font-medium disabled:opacity-50"
          >
            Save Draft
          </button>
        </div>

        {email && (
          <div className="bg-muted rounded-lg p-4">
            <p className="mb-2 text-sm font-medium">Current Email Data:</p>
            <pre className="text-muted-foreground overflow-x-auto text-xs">
              {JSON.stringify(email, null, 2)}
            </pre>
          </div>
        )}
      </div>
    );
  }
};
