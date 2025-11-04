import { PromptTextarea } from '../molecules/prompt-textarea';
import { ChatContainerRoot, ChatContainerContent } from '../ui/chat-container';

export const Chat = () => {
  return (
    <div className="border-border relative flex h-full min-h-[calc(100dvh-57px)] w-full max-w-[400px] flex-col justify-between border-r p-2">
      {/* Messages list  */}
      <ChatContainerRoot className="h-full">
        <ChatContainerContent className="space-y-4">
          {/* Your chat messages here */}
          <div>Message 1</div>
          <div>Message 2</div>
          <div>Message 3</div>
        </ChatContainerContent>
      </ChatContainerRoot>

      {/* Input prompt */}
      <PromptTextarea />
    </div>
  );
};
