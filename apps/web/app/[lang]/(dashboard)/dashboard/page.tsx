import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@horecame/ui/primitives';
import { Building2, Package, ShoppingCart, FileText } from 'lucide-react';
import Link from 'next/link';

interface DashboardPageProps {
  params: Promise<{ lang: 'me' | 'en' }>;
}

export default async function DashboardPage({ params }: DashboardPageProps) {
  const { lang } = await params;
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    redirect(`/${lang}/auth/sign-in?redirect=/${lang}/dashboard`);
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('*, companies(*)')
    .eq('id', user.id)
    .single();

  const company = (profile as any)?.companies;

  const stats = [
    {
      label: lang === 'me' ? 'Kompanija' : 'Company',
      value: company?.name ?? (lang === 'me' ? 'Nije postavljeno' : 'Not set'),
      icon: Building2,
      href: `/${lang}/dashboard/settings`,
    },
    {
      label: lang === 'me' ? 'Proizvodi' : 'Products',
      value: lang === 'me' ? 'Upravljaj' : 'Manage',
      icon: Package,
      href: `/${lang}/dashboard/products`,
    },
    {
      label: lang === 'me' ? 'Korpa' : 'Basket',
      value: lang === 'me' ? 'Pogledaj' : 'View',
      icon: ShoppingCart,
      href: `/${lang}/basket`,
    },
    {
      label: lang === 'me' ? 'Upiti' : 'Inquiries',
      value: lang === 'me' ? 'Pogledaj' : 'View',
      icon: FileText,
      href: `/${lang}/inquiries`,
    },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="mb-2 text-3xl font-bold text-white">
        {lang === 'me' ? 'Kontrolna tabla' : 'Dashboard'}
      </h1>
      <p className="mb-8 text-slate-400">
        {lang === 'me'
          ? `Dobrodošli, ${profile?.full_name ?? user.email}`
          : `Welcome, ${profile?.full_name ?? user.email}`}
      </p>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Link key={stat.label} href={stat.href}>
            <Card className="transition-all hover:border-teal/30">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-slate-400">
                  {stat.label}
                </CardTitle>
                <stat.icon className="h-4 w-4 text-slate-500" />
              </CardHeader>
              <CardContent>
                <p className="text-lg font-semibold text-white">{stat.value}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
