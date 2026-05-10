import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { BasketItem, BasketSummary } from '@horecame/ui/inquiry';
import { Card, CardContent } from '@horecame/ui/primitives';
import { ShoppingCart } from 'lucide-react';

interface BasketPageProps {
  params: Promise<{ lang: 'me' | 'en' }>;
}

export default async function BasketPage({ params }: BasketPageProps) {
  const { lang } = await params;
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    redirect(`/${lang}/auth/sign-in?redirect=/${lang}/basket`);
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('company_id')
    .eq('id', user.id)
    .single();

  const companyId = (profile as any)?.company_id;

  let basket = null;
  if (companyId) {
    const { data } = await supabase
      .from('inquiry_baskets')
      .select(`
        *,
        inquiry_items(
          *,
          products(id, slug, base_price, currency, moq, unit, images,
            product_translations(name),
            companies(id, name, slug)
          ),
          product_variants(id, variant_name, price)
        )
      `)
      .eq('buyer_id', companyId)
      .eq('status', 'draft')
      .single();
    basket = data;
  }

  const items = basket?.inquiry_items ?? [];

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="mb-2 text-3xl font-bold text-white">
        {lang === 'me' ? 'Korpa' : 'Basket'}
      </h1>
      <p className="mb-8 text-slate-400">
        {lang === 'me'
          ? `${items.length} stavki u korpi`
          : `${items.length} items in basket`}
      </p>

      {items.length > 0 ? (
        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-4">
            {items.map((item: any) => (
              <BasketItem
                key={item.id}
                item={item}
                lang={lang}
              />
            ))}
          </div>
          <div>
            <BasketSummary
              items={items}
              lang={lang}
            />
          </div>
        </div>
      ) : (
        <div className="py-24 text-center">
          <ShoppingCart className="mx-auto h-12 w-12 text-slate-600" />
          <h2 className="mt-4 text-xl font-semibold text-white">
            {lang === 'me' ? 'Vaša korpa je prazna' : 'Your basket is empty'}
          </h2>
          <p className="mt-2 text-slate-500">
            {lang === 'me'
              ? 'Dodajte proizvode iz kataloga'
              : 'Add products from the catalog'}
          </p>
        </div>
      )}
    </div>
  );
}
