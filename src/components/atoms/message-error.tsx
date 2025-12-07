import { AlertCircle } from 'lucide-react';

export const MessageError = ({
  reload,
  error
}: {
  reload: () => void;
  error: string;
}) => {
  return (
    <div className="flex cursor-pointer items-center gap-6 rounded-md p-2 text-red-950">
      <AlertCircle className="size-8" />
      <div>
        <p>{error} </p>
        <button type="button" onClick={reload} className="font-bold">
          Try again
        </button>
      </div>
    </div>
  );
};
