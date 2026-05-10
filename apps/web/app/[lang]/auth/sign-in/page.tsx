import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { Button, Input, Label, Card, CardContent, CardHeader, CardTitle, CardDescription } from '@horecame/ui/primitives';
import { cookies } from 'next/headers';

interface SignInPageProps {
  params: Promise<{ lang: 'me' | 'en' }>;
}

export default async function SignInPage({ params }: SignInPageProps) {
  const { lang } = await params;

  async function signIn(formData: FormData) {
    'use server';
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const redirectTo = (formData.get('redirect') as string) || `/${lang}/dashboard`;

    const supabase = await createClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      redirect(`/${lang}/auth/sign-in?error=${encodeURIComponent(error.message)}`);
    }

    redirect(redirectTo);
  }

  return (
    <div className="flex min-h-[60vh] items-center justify-center px-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl">
            {lang === 'me' ? 'Prijava' : 'Sign In'}
          </CardTitle>
          <CardDescription>
            {lang === 'me'
              ? 'Unesite svoje podatke za prijavu'
              : 'Enter your credentials to sign in'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form action={signIn} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">{lang === 'me' ? 'Email' : 'Email'}</Label>
              <Input id="email" name="email" type="email" required placeholder="email@example.com" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">{lang === 'me' ? 'Lozinka' : 'Password'}</Label>
              <Input id="password" name="password" type="password" required />
            </div>
            <Button type="submit" className="w-full">
              {lang === 'me' ? 'Prijavite se' : 'Sign In'}
            </Button>
          </form>
          <p className="mt-4 text-center text-sm text-slate-500">
            {lang === 'me' ? 'Nemate nalog?' : "Don't have an account?"}{' '}
            <a href={`/${lang}/auth/sign-up`} className="text-sky hover:underline">
              {lang === 'me' ? 'Registrujte se' : 'Sign Up'}
            </a>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
