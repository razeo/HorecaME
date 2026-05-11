import type { ReactNode } from 'react';
import type { Metadata } from 'next';
import { Header } from '@horecame/ui/layout/header';
import { Footer } from '@horecame/ui/layout/footer';
import { ClientProviders } from '@/components/client-providers';

interface Props {
  children: ReactNode;
  params: Promise<{ lang: string }>;
}

export const metadata: Metadata = {
  title: 'HorecaMe',
};

export default async function LangLayout({ children, params }: Props) {
  const { lang } = await params;

  return (
    <div className="flex min-h-screen flex-col">
      <ClientProviders lang={lang as 'me' | 'en'}>
        <Header lang={lang as 'me' | 'en'} />
        <main className="flex-1">{children}</main>
        <Footer lang={lang as 'me' | 'en'} />
      </ClientProviders>
    </div>
  );
}
