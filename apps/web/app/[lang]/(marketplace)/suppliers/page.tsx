import { createClient } from '@/lib/supabase/server';
import { SupplierCard } from '@horecame/ui/marketplace/supplier-card';

interface SuppliersPageProps {
  params: Promise<{ lang: 'me' | 'en' }>;
}

export default async function SuppliersPage({ params }: SuppliersPageProps) {
  const { lang } = await params;
  const supabase = await createClient();

  const { data: companies } = await supabase
    .from('companies')
    .select('*')
    .in('company_type', ['supplier', 'both'])
    .order('name');

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="mb-2 text-3xl font-bold text-white">
        {lang === 'me' ? 'Dobavljači' : 'Suppliers'}
      </h1>
      <p className="mb-8 text-slate-400">
        {lang === 'me'
          ? 'Pregledajte sve registrovane dobavljače'
          : 'Browse all registered suppliers'}
      </p>

      {companies && companies.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {companies.map((company) => (
            <SupplierCard
              key={company.id}
              supplier={{
                id: company.id,
                name: company.name,
                slug: company.slug,
                logo_url: company.logo_url,
                description: company.description,
                city: company.city,
                country: company.country,
                phone: company.phone,
                email: company.email,
                is_verified: company.is_verified,
                company_type: company.company_type,
              }}
              lang={lang}
            />
          ))}
        </div>
      ) : (
        <div className="py-24 text-center">
          <p className="text-slate-500">
            {lang === 'me' ? 'Nema dobavljača' : 'No suppliers available'}
          </p>
        </div>
      )}
    </div>
  );
}
