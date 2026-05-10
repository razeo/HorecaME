import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { RFQCard } from '@horecame/ui/inquiry';
import { FileText } from 'lucide-react';

interface RFQsPageProps {
  params: Promise<{ lang: 'me' | 'en' }>;
}

export default async function RFQsPage({ params }: RFQsPageProps) {
  const { lang } = await params;
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    redirect(`/${lang}/auth/sign-in?redirect=/${lang}/dashboard/rfqs`);
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('company_id')
    .eq('id', user.id)
    .single();

  const companyId = (profile as any)?.company_id;

  let rfqs: any[] = [];
  if (companyId) {
    const { data } = await supabase
      .from('supplier_rfqs')
      .select(`
        *,
        inquiry_baskets(id, notes, created_at),
        companies!supplier_rfqs_buyer_id_fkey(id, name, slug),
        rfq_items(
          *,
          products(id, slug, product_translations(name)),
          product_variants(id, variant_name)
        )
      `)
      .eq('supplier_id', companyId)
      .order('created_at', { ascending: false });
    rfqs = data ?? [];
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="mb-2 text-3xl font-bold text-white">
        {lang === 'me' ? 'Zahtjevi za ponudu' : 'RFQs'}
      </h1>
      <p className="mb-8 text-slate-400">
        {lang === 'me'
          ? `${rfqs.length} zahtjeva`
          : `${rfqs.length} requests`}
      </p>

      {rfqs.length > 0 ? (
        <div className="space-y-6">
          {rfqs.map((rfq) => (
            <RFQCard key={rfq.id} rfq={rfq} lang={lang} isSupplier />
          ))}
        </div>
      ) : (
        <div className="py-24 text-center">
          <FileText className="mx-auto h-12 w-12 text-slate-600" />
          <h2 className="mt-4 text-xl font-semibold text-white">
            {lang === 'me' ? 'Nema zahtjeva' : 'No RFQs'}
          </h2>
          <p className="mt-2 text-slate-500">
            {lang === 'me'
              ? 'Zahtjevi za ponudu će se pojaviti ovdje'
              : 'RFQs will appear here'}
          </p>
        </div>
      )}
    </div>
  );
}
