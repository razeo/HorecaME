import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { RFQCard } from '@horecame/ui/inquiry';
import { Card, CardContent, CardHeader, CardTitle } from '@horecame/ui/primitives';
import { FileText } from 'lucide-react';

interface InquiriesPageProps {
  params: Promise<{ lang: 'me' | 'en' }>;
}

export default async function InquiriesPage({ params }: InquiriesPageProps) {
  const { lang } = await params;
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    redirect(`/${lang}/auth/sign-in?redirect=/${lang}/inquiries`);
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('company_id')
    .eq('id', user.id)
    .single();

  const companyId = (profile as any)?.company_id;

  let baskets: any[] = [];
  if (companyId) {
    const { data } = await supabase
      .from('inquiry_baskets')
      .select(`
        *,
        inquiry_items(
          *,
          products(id, slug, product_translations(name), companies(name))
        ),
        supplier_rfqs(
          *,
          companies!supplier_rfqs_supplier_id_fkey(id, name, slug),
          rfq_items(*)
        )
      `)
      .eq('buyer_id', companyId)
      .neq('status', 'draft')
      .order('created_at', { ascending: false });
    baskets = data ?? [];
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="mb-2 text-3xl font-bold text-white">
        {lang === 'me' ? 'Upiti' : 'Inquiries'}
      </h1>
      <p className="mb-8 text-slate-400">
        {lang === 'me'
          ? `${baskets.length} upita`
          : `${baskets.length} inquiries`}
      </p>

      {baskets.length > 0 ? (
        <div className="space-y-6">
          {baskets.map((basket) => (
            <Card key={basket.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">
                    {lang === 'me' ? 'Upit' : 'Inquiry'} #{basket.id.slice(0, 8)}
                  </CardTitle>
                  <span className="text-sm text-slate-500">
                    {new Date(basket.created_at).toLocaleDateString(lang === 'me' ? 'sr-ME' : 'en-GB')}
                  </span>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-slate-400">
                  {basket.inquiry_items?.length ?? 0} {lang === 'me' ? 'stavki' : 'items'} · {lang === 'me' ? 'Status' : 'Status'}: {basket.status}
                </p>
                {basket.supplier_rfqs?.map((rfq: any) => (
                  <div key={rfq.id} className="mt-4">
                    <RFQCard rfq={rfq} lang={lang} />
                  </div>
                ))}
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="py-24 text-center">
          <FileText className="mx-auto h-12 w-12 text-slate-600" />
          <h2 className="mt-4 text-xl font-semibold text-white">
            {lang === 'me' ? 'Nema upita' : 'No inquiries'}
          </h2>
          <p className="mt-2 text-slate-500">
            {lang === 'me'
              ? 'Vaši upiti će se pojaviti ovdje'
              : 'Your inquiries will appear here'}
          </p>
        </div>
      )}
    </div>
  );
}
