import { Button } from '@horecame/ui/primitives';
import { AlertTriangle, Home } from 'lucide-react';
import Link from 'next/link';

interface ErrorPageProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorPageProps) {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      <AlertTriangle className="h-16 w-16 text-error" />
      <h1 className="mt-6 text-2xl font-bold text-white">
        Nešto je pošlo po zlu
      </h1>
      <p className="mt-2 max-w-md text-slate-400">
        Došlo je do greške. Molimo pokušajte ponovo.
      </p>
      {error.digest && (
        <p className="mt-1 text-xs text-slate-600">Error ID: {error.digest}</p>
      )}
      <div className="mt-8 flex gap-4">
        <Button onClick={reset} variant="default">
          Pokušaj ponovo
        </Button>
        <Link href="/me">
          <Button variant="outline">
            <Home className="mr-2 h-4 w-4" />
            Početna
          </Button>
        </Link>
      </div>
    </div>
  );
}
