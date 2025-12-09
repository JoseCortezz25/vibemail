'use client';

export const ChatEmptyState = () => {
  return (
    <div className="flex h-full w-full flex-col items-start justify-center gap-4 px-4 py-8">
      <div className="bg-muted flex h-16 w-16 items-center justify-center rounded-full">
        <img src="/logo.svg" alt="logo" />
      </div>
      <div className="flex flex-col items-start gap-2 text-start">
        <h3 className="text-foreground text-2xl font-bold md:text-[40px]">
          What will you build today?
        </h3>
        <p className="text-muted-foreground max-w-[280px] text-sm">
          Send a message to begin creating your email with AI assistance.
        </p>
      </div>
    </div>
  );
};
