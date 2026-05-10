import { Button } from '@horecame/ui/primitives';
import { Search, Home } from 'lucide-react';
import Link from 'next/link';

interface NotFoundPageProps {
  params?: Promise<{ lang?: string }>;
}

export default async function NotFound({ params }: NotFoundPageProps) {
  const lang = params ? (await params).lang ?? 'me' : 'me';

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      <Search className="h-16 w-16 text-slate-600" />
      <h1 className="mt-6 text-2xl font-bold text-white">
        {lang === 'me' ? 'Stranica nije pronađena' : 'Page not found'}
      </h1>
      <p className="mt-2 max-w-md text-slate-400">
        {lang === 'me'
          ? 'Stranica koju tražite ne postoji ili je premještena.'
          : 'The page you are looking for does not exist or has been moved.'}
      </p>
      <Link href={`/${lang}`}>
        <Button variant="outline" className="mt-8">
          <Home className="mr-2 h-4 w-4" />
          {lang === 'me' ? 'Nazad na početnu' : 'Back to home'}
        </Button>
      </Link>
    </div>
  );
}
