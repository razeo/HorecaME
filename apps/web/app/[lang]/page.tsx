import { getProducts, getCategories } from '@horecame/db/queries';
import { ProductCard } from '@horecame/ui/marketplace/product-card';
import { CategoryCard } from '@horecame/ui/marketplace/category-card';
import { Button } from '@horecame/ui/primitives';
import { ArrowRight, Search } from 'lucide-react';
import Link from 'next/link';

interface HomePageProps {
  params: Promise<{ lang: 'me' | 'en' }>;
}

export default async function HomePage({ params }: HomePageProps) {
  const { lang } = await params;

  const [productsRes, categoriesRes] = await Promise.all([
    getProducts({ lang, page: 1, pageSize: 8 }),
    getCategories(lang),
  ]);

  const products = productsRes.data ?? [];
  const categories = categoriesRes.data ?? [];

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      {/* Hero Section */}
      <section className="py-16 text-center">
        <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
          {lang === 'me' ? 'B2B HORECA Marketplace' : 'B2B HORECA Marketplace'}
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-400">
          {lang === 'me'
            ? 'Pronađite dobavljače hrane, pića i opreme za vaš hotel, restoran ili kafić u Crnoj Gori i regionu.'
            : 'Find suppliers of food, beverages and equipment for your hotel, restaurant or cafe in Montenegro and the region.'}
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <Link href={`/${lang}/products`}>
            <Button size="lg">
              {lang === 'me' ? 'Pregledaj proizvode' : 'Browse Products'}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
          <Link href={`/${lang}/auth/sign-up`}>
            <Button variant="outline" size="lg">
              {lang === 'me' ? 'Registrujte se' : 'Sign Up'}
            </Button>
          </Link>
        </div>
      </section>

      {/* Categories Section */}
      {categories.length > 0 && (
        <section className="py-12">
          <div className="mb-8 flex items-center justify-between">
            <h2 className="text-2xl font-semibold text-white">
              {lang === 'me' ? 'Kategorije' : 'Categories'}
            </h2>
            <Link href={`/${lang}/categories`}>
              <Button variant="ghost" size="sm">
                {lang === 'me' ? 'Pogledaj sve' : 'View All'}
                <ArrowRight className="ml-1 h-4 w-4" />
              </Button>
            </Link>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {categories.slice(0, 6).map((category: any) => (
              <CategoryCard
                key={category.id}
                category={{
                  id: category.id,
                  slug: category.slug,
                  icon: category.icon,
                  image_url: category.image_url,
                  translations: {
                    name: category.category_translations?.[0]?.name ?? category.slug,
                    description: category.category_translations?.[0]?.description ?? null,
                  },
                }}
                lang={lang}
              />
            ))}
          </div>
        </section>
      )}

      {/* Featured Products Section */}
      {products.length > 0 && (
        <section className="py-12">
          <div className="mb-8 flex items-center justify-between">
            <h2 className="text-2xl font-semibold text-white">
              {lang === 'me' ? 'Istaknuti proizvodi' : 'Featured Products'}
            </h2>
            <Link href={`/${lang}/products`}>
              <Button variant="ghost" size="sm">
                {lang === 'me' ? 'Pogledaj sve' : 'View All'}
                <ArrowRight className="ml-1 h-4 w-4" />
              </Button>
            </Link>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {products.slice(0, 8).map((product: any) => (
              <ProductCard
                key={product.id}
                product={{
                  id: product.id,
                  slug: product.slug,
                  base_price: product.base_price,
                  currency: product.currency,
                  moq: product.moq,
                  unit: product.unit,
                  stock_status: product.stock_status,
                  images: product.images,
                  translations: {
                    name: product.product_translations?.[0]?.name ?? product.slug,
                    description: product.product_translations?.[0]?.description ?? null,
                  },
                  companies: {
                    name: product.companies?.name ?? '',
                    slug: product.companies?.slug ?? '',
                    logo_url: product.companies?.logo_url ?? null,
                    is_verified: product.companies?.is_verified ?? false,
                  },
                  categories: product.categories ?? null,
                }}
                lang={lang}
              />
            ))}
          </div>
        </section>
      )}

      {/* Empty state when no data */}
      {products.length === 0 && categories.length === 0 && (
        <section className="py-24 text-center">
          <Search className="mx-auto h-12 w-12 text-slate-600" />
          <h2 className="mt-4 text-xl font-semibold text-white">
            {lang === 'me' ? 'Nema podataka' : 'No data available'}
          </h2>
          <p className="mt-2 text-slate-500">
            {lang === 'me'
              ? 'Povežite Supabase bazu i pokrenite seed skriptu da vidite proizvode.'
              : 'Connect your Supabase database and run the seed script to see products.'}
          </p>
        </section>
      )}
    </div>
  );
}
