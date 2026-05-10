import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { Button, Input, Label, Card, CardContent, CardHeader, CardTitle, CardDescription } from '@horecame/ui/primitives';

interface SignUpPageProps {
  params: Promise<{ lang: 'me' | 'en' }>;
}

export default async function SignUpPage({ params }: SignUpPageProps) {
  const { lang } = await params;

  async function signUp(formData: FormData) {
    'use server';
    const fullName = formData.get('full_name') as string;
    const companyName = formData.get('company_name') as string;
    const companyType = formData.get('company_type') as string;
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    const supabase = await createClient();
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          company_name: companyName,
          company_type: companyType,
        },
      },
    });

    if (error) {
      redirect(`/${lang}/auth/sign-up?error=${encodeURIComponent(error.message)}`);
    }

    redirect(`/${lang}/auth/sign-in?message=${encodeURIComponent(lang === 'me' ? 'Provjerite email za potvrdu' : 'Check your email for confirmation')}`);
  }

  return (
    <div className="flex min-h-[60vh] items-center justify-center px-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl">
            {lang === 'me' ? 'Registracija' : 'Sign Up'}
          </CardTitle>
          <CardDescription>
            {lang === 'me'
              ? 'Kreirajte nalog za vašu kompaniju'
              : 'Create an account for your company'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form action={signUp} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="full_name">{lang === 'me' ? 'Puno ime' : 'Full Name'}</Label>
              <Input id="full_name" name="full_name" required placeholder={lang === 'me' ? 'Marko Marković' : 'John Doe'} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="company_name">{lang === 'me' ? 'Naziv kompanije' : 'Company Name'}</Label>
              <Input id="company_name" name="company_name" required placeholder={lang === 'me' ? 'Hotel Primjer d.o.o.' : 'Hotel Example LLC'} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="company_type">{lang === 'me' ? 'Tip kompanije' : 'Company Type'}</Label>
              <select
                id="company_type"
                name="company_type"
                defaultValue="buyer"
                className="flex h-10 w-full rounded-lg border border-teal/20 bg-surface-raised px-3 text-sm text-white"
              >
                <option value="buyer">{lang === 'me' ? 'Kupac' : 'Buyer'}</option>
                <option value="supplier">{lang === 'me' ? 'Dobavljač' : 'Supplier'}</option>
                <option value="both">{lang === 'me' ? 'Dobavljač i Kupac' : 'Supplier & Buyer'}</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" required placeholder="email@example.com" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">{lang === 'me' ? 'Lozinka' : 'Password'}</Label>
              <Input id="password" name="password" type="password" required minLength={6} />
            </div>
            <Button type="submit" className="w-full">
              {lang === 'me' ? 'Registrujte se' : 'Sign Up'}
            </Button>
          </form>
          <p className="mt-4 text-center text-sm text-slate-500">
            {lang === 'me' ? 'Već imate nalog?' : 'Already have an account?'}{' '}
            <a href={`/${lang}/auth/sign-in`} className="text-sky hover:underline">
              {lang === 'me' ? 'Prijavite se' : 'Sign In'}
            </a>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
