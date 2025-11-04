import { Chat } from '@/components/organisms/chat';
import { Header } from '@/components/layout/header';
import { Previewer } from '@/components/organisms/previewer';

export default function Home() {
  return (
    <div className="items-center justify-items-center">
      <Header />
      <main className="grid h-full w-full grid-cols-[400px_1fr]">
        <Chat />

        <Previewer />
      </main>
    </div>
  );
}
