import { getProductBySlug } from '@horecame/db/queries';
import { Badge } from '@horecame/ui/primitives';
import { Button } from '@horecame/ui/primitives';
import { Card, CardContent, CardHeader, CardTitle } from '@horecame/ui/primitives';
import { Check, ShoppingCart, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

interface ProductDetailPageProps {
  params: Promise<{ lang: 'me' | 'en'; slug: string }>;
}

const stockLabels = {
  in_stock: { me: 'Na stanju', en: 'In Stock' },
  low_stock: { me: 'Malo na stanju', en: 'Low Stock' },
  out_of_stock: { me: 'Nema na stanju', en: 'Out of Stock' },
  on_order: { me: 'Po narudžbi', en: 'On Order' },
};

export default async function ProductDetailPage({ params }: ProductDetailPageProps) {
  const { lang, slug } = await params;

  const { data: product, error } = await getProductBySlug(slug, lang);

  if (error || !product) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-24 text-center sm:px-6 lg:px-8">
        <h1 className="text-2xl font-bold text-white">
          {lang === 'me' ? 'Proizvod nije pronađen' : 'Product not found'}
        </h1>
        <Link href={`/${lang}/products`}>
          <Button variant="outline" className="mt-6">
            <ArrowLeft className="mr-2 h-4 w-4" />
            {lang === 'me' ? 'Nazad na proizvode' : 'Back to products'}
          </Button>
        </Link>
      </div>
    );
  }

  const translation = (product as any).product_translations?.[0];
  const name = translation?.name ?? slug;
  const description = translation?.description;
  const company = (product as any).companies;
  const variants = (product as any).product_variants ?? [];
  const tieredPricing = (product as any).tiered_pricing ?? [];
  const images = Array.isArray((product as any).images) ? (product as any).images : [];
  const image = images.length > 0 ? images[0] : '/placeholder-product.png';

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <Link href={`/${lang}/products`} className="mb-6 inline-flex items-center text-sm text-slate-400 hover:text-sky">
        <ArrowLeft className="mr-1 h-4 w-4" />
        {lang === 'me' ? 'Nazad na proizvode' : 'Back to products'}
      </Link>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Image */}
        <div className="relative aspect-square overflow-hidden rounded-xl bg-surface-raised">
          <img src={image} alt={name} className="h-full w-full object-cover" />
        </div>

        {/* Details */}
        <div>
          <div className="mb-2 flex items-center gap-2">
            <Badge variant={
              (product as any).stock_status === 'in_stock' ? 'success' :
              (product as any).stock_status === 'low_stock' ? 'warning' :
              (product as any).stock_status === 'out_of_stock' ? 'error' : 'secondary'
            }>
              {stockLabels[(product as any).stock_status as keyof typeof stockLabels]?.[lang] ?? (product as any).stock_status}
            </Badge>
          </div>

          <h1 className="text-3xl font-bold text-white">{name}</h1>

          {company && (
            <Link href={`/${lang}/suppliers/${company.slug}`} className="mt-2 inline-flex items-center gap-1 text-sm text-slate-400 hover:text-sky">
              {company.name}
              {company.is_verified && <Check className="h-3 w-3 text-sky" />}
            </Link>
          )}

          <div className="mt-6 flex items-baseline gap-4">
            {(product as any).base_price !== null && (
              <p className="text-3xl font-bold text-white">
                {(product as any).base_price.toFixed(2)} {(product as any).currency}
              </p>
            )}
            <p className="text-sm text-slate-500">
              {lang === 'me' ? `Min. količina: ${(product as any).moq} ${(product as any).unit}` : `Min. quantity: ${(product as any).moq} ${(product as any).unit}`}
            </p>
          </div>

          {description && (
            <p className="mt-6 text-slate-300 leading-relaxed">{description}</p>
          )}

          {/* Tiered pricing */}
          {tieredPricing.length > 0 && (
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="text-base">
                  {lang === 'me' ? 'Stepene cijene' : 'Tiered Pricing'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {tieredPricing.map((tier: any) => (
                    <div key={tier.id} className="flex justify-between text-sm">
                      <span className="text-slate-400">
                        {tier.min_quantity}+ {lang === 'me' ? 'kom' : 'units'}
                        {tier.max_quantity && ` - ${tier.max_quantity}`}
                      </span>
                      <span className="font-medium text-white">{tier.price.toFixed(2)} {(product as any).currency}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Variants */}
          {variants.length > 0 && (
            <div className="mt-6">
              <h3 className="mb-3 text-sm font-semibold text-white">
                {lang === 'me' ? 'Varijante' : 'Variants'}
              </h3>
              <div className="grid gap-2">
                {variants.map((variant: any) => (
                  <div key={variant.id} className="flex items-center justify-between rounded-lg border border-teal/10 bg-surface-raised p-3">
                    <span className="text-sm text-white">{variant.variant_name}</span>
                    <span className="text-sm font-medium text-white">{variant.price.toFixed(2)} {(product as any).currency}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="mt-8">
            <Button size="lg" className="w-full" disabled={(product as any).stock_status === 'out_of_stock'}>
              <ShoppingCart className="mr-2 h-4 w-4" />
              {lang === 'me' ? 'Dodaj u korpu' : 'Add to Basket'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
