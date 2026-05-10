import type { ReactNode } from 'react';
import { Header } from '@horecame/ui/layout/header';
import { Footer } from '@horecame/ui/layout/footer';
import { ClientProviders } from '@/components/client-providers';

interface LangLayoutProps {
  children: ReactNode;
  params: Promise<{ lang: 'me' | 'en' }>;
}

export default async function LangLayout({ children, params }: LangLayoutProps) {
  const { lang } = await params;

  return (
    <div className="flex min-h-screen flex-col">
      <ClientProviders lang={lang}>
        <Header lang={lang} />
        <main className="flex-1">{children}</main>
        <Footer lang={lang} />
      </ClientProviders>
    </div>
  );
}
