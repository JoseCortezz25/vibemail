export const DOWNLOAD_EMAIL_TEXT = {
  button: {
    ariaLabel: 'Download email as HTML file',
    tooltip: 'Download email'
  },
  feedback: {
    success: 'Email downloaded successfully',
    error: 'Failed to download email. Please try again.'
  },
  fileName: {
    prefix: 'email',
    fallback: 'generated-email'
  }
} as const;
