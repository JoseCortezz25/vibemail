import type { Meta, StoryObj } from '@storybook/react';
import { EmailPreview } from '@/components/organisms/email-preview';
import { Email } from '@/domains/email-editor/schema';

const meta = {
  title: 'Organisms/EmailPreview',
  component: EmailPreview,
  parameters: {
    layout: 'padded'
  },
  tags: ['autodocs'],
  argTypes: {
    from: {
      control: 'text',
      description: 'Sender email address'
    }
  }
} satisfies Meta<typeof EmailPreview>;

export default meta;
type Story = StoryObj<typeof meta>;

const sampleEmail: Email = {
  to: 'john.doe@example.com',
  subject: 'Quarterly Business Review',
  content: `Dear John,

I hope this message finds you well. I wanted to reach out to discuss our upcoming Quarterly Business Review meeting.

Key Points to Discuss:
• Q3 Performance Metrics
• Q4 Goals and Objectives
• Budget Allocation
• Team Expansion Plans

Please review the attached materials before our meeting scheduled for next Wednesday at 2:00 PM.

Looking forward to our discussion.

Best regards,
Sarah Johnson
VP of Operations`,
  format: 'text'
};

export const Empty: Story = {
  args: {
    email: {
      to: '',
      subject: '',
      content: '',
      format: 'text'
    }
  }
};

export const CompleteEmail: Story = {
  args: {
    email: sampleEmail,
    from: 'sarah.johnson@company.com'
  }
};

export const OnlySubject: Story = {
  args: {
    email: {
      to: '',
      subject: 'Quick Question',
      content: '',
      format: 'text'
    }
  }
};

export const OnlyContent: Story = {
  args: {
    email: {
      to: '',
      subject: '',
      content: 'This is a brief message without subject or recipient.',
      format: 'text'
    }
  }
};

export const LongContent: Story = {
  args: {
    email: {
      to: 'team@example.com',
      subject: 'Important Update - Please Read',
      content: `Dear Team,

I hope this email finds everyone well and productive. I wanted to take a moment to share some important updates regarding our organization and upcoming changes.

ORGANIZATIONAL CHANGES
As we continue to grow, we're making some structural changes to better serve our customers and support our team. These changes will take effect starting next month.

PROJECT MILESTONES
We've achieved several significant milestones this quarter:
• Successfully launched Product X with 95% customer satisfaction
• Expanded our team by 30% across all departments
• Opened two new office locations in major metropolitan areas
• Increased revenue by 45% compared to last quarter

UPCOMING INITIATIVES
Looking ahead to next quarter, we have several exciting initiatives:
1. Launch of our new customer portal
2. Implementation of advanced analytics tools
3. Enhanced training programs for all staff
4. Sustainability initiative rollout

WHAT THIS MEANS FOR YOU
These changes bring new opportunities for growth and development. We'll be scheduling individual meetings to discuss how these changes might affect your role and to address any questions you may have.

NEXT STEPS
Please mark your calendars for our all-hands meeting next Friday at 10:00 AM, where we'll discuss these updates in detail and answer questions.

In the meantime, if you have any immediate concerns or questions, please don't hesitate to reach out to your direct manager or the HR department.

Thank you all for your continued dedication and hard work. Together, we're building something truly special.

Best regards,
Executive Team`,
      format: 'text'
    },
    from: 'executive@company.com'
  }
};

export const WithHTMLFormatting: Story = {
  args: {
    email: {
      to: 'customer@example.com',
      subject: 'Welcome to Our Service!',
      content: `<div style="font-family: Arial, sans-serif;">
  <h2 style="color: #2563eb;">Welcome Aboard!</h2>
  <p>Thank you for joining our service. We're excited to have you with us.</p>
  <p><strong>Here's what you can do next:</strong></p>
  <ul>
    <li>Complete your profile</li>
    <li>Explore our features</li>
    <li>Connect with other members</li>
  </ul>
  <p style="margin-top: 20px;">
    <a href="#" style="background-color: #2563eb; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Get Started</a>
  </p>
</div>`,
      format: 'html'
    },
    from: 'welcome@service.com'
  }
};

export const SideBySideComparison: Story = {
  render: () => {
    const email: Email = {
      to: 'demo@example.com',
      subject: 'Demo Email',
      content: 'This is a demo email to show the preview component.',
      format: 'text'
    };

    return (
      <div className="grid grid-cols-2 gap-4">
        <div>
          <h3 className="mb-2 text-sm font-medium">Default Sender</h3>
          <EmailPreview email={email} />
        </div>
        <div>
          <h3 className="mb-2 text-sm font-medium">Custom Sender</h3>
          <EmailPreview email={email} from="custom@sender.com" />
        </div>
      </div>
    );
  }
};
