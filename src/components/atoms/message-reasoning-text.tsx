interface MessageReasoningTextProps {
  text: string;
}

export function MessageReasoningText({ text }: MessageReasoningTextProps) {
  return <div className="text-foreground bg-transparent">{text}</div>;
}
