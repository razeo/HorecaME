import { getProducts, getCategories } from '@horecame/db/queries';
import { ProductCard } from '@horecame/ui/marketplace/product-card';
import { Button } from '@horecame/ui/primitives';
import { Search, SlidersHorizontal } from 'lucide-react';
import { Input } from '@horecame/ui/primitives';

interface ProductsPageProps {
  params: Promise<{ lang: 'me' | 'en' }>;
  searchParams: Promise<{ q?: string; category?: string; page?: string }>;
}

export default async function ProductsPage({ params, searchParams }: ProductsPageProps) {
  const { lang } = await params;
  const { q, category, page: pageStr } = await searchParams;
  const page = pageStr ? parseInt(pageStr) : 1;

  const [productsRes, categoriesRes] = await Promise.all([
    getProducts({ lang, search: q, categoryId: category, page, pageSize: 24 }),
    getCategories(lang),
  ]);

  const products = productsRes.data ?? [];
  const categories = categoriesRes.data ?? [];
  const total = productsRes.count ?? 0;
  const totalPages = Math.ceil(total / 24);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">
          {lang === 'me' ? 'Proizvodi' : 'Products'}
        </h1>
        <p className="mt-2 text-slate-400">
          {lang === 'me'
            ? `Pronađite proizvode za vaš biznis (${total} proizvoda)`
            : `Find products for your business (${total} products)`}
        </p>
      </div>

      {/* Search and filters */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
          <Input
            type="search"
            name="q"
            defaultValue={q}
            placeholder={lang === 'me' ? 'Pretraži proizvode...' : 'Search products...'}
            className="pl-9"
          />
        </div>
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="h-4 w-4 text-slate-500" />
          <span className="text-sm text-slate-500">
            {lang === 'me' ? 'Kategorija:' : 'Category:'}
          </span>
          <select
            name="category"
            defaultValue={category ?? ''}
            className="h-10 rounded-lg border border-teal/20 bg-surface-raised px-3 text-sm text-white"
          >
            <option value="">{lang === 'me' ? 'Sve kategorije' : 'All categories'}</option>
            {categories.map((cat: any) => (
              <option key={cat.id} value={cat.id}>
                {cat.category_translations?.[0]?.name ?? cat.slug}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Products grid */}
      {products.length > 0 ? (
        <>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {products.map((product: any) => (
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

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-8 flex items-center justify-center gap-2">
              {Array.from({ length: Math.min(totalPages, 10) }, (_, i) => i + 1).map((p) => (
                <Button
                  key={p}
                  variant={p === page ? 'default' : 'ghost'}
                  size="sm"
                  asChild
                >
                  <a href={`?page=${p}${q ? `&q=${q}` : ''}${category ? `&category=${category}` : ''}`}>
                    {p}
                  </a>
                </Button>
              ))}
            </div>
          )}
        </>
      ) : (
        <div className="py-24 text-center">
          <Search className="mx-auto h-12 w-12 text-slate-600" />
          <h2 className="mt-4 text-xl font-semibold text-white">
            {lang === 'me' ? 'Nema rezultata' : 'No results found'}
          </h2>
          <p className="mt-2 text-slate-500">
            {lang === 'me'
              ? 'Pokušajte sa drugim pojmom za pretragu.'
              : 'Try a different search term.'}
          </p>
        </div>
      )}
    </div>
  );
}
