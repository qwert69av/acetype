import TypingTest from '@/components/TypingTest';
import {Toaster} from '@/components/ui/toaster';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <TypingTest />
      <Toaster />
      <Footer />
    </div>
  );
}

