import { getCategories } from '@horecame/db/queries';
import { CategoryCard } from '@horecame/ui/marketplace/category-card';

interface CategoriesPageProps {
  params: Promise<{ lang: 'me' | 'en' }>;
}

export default async function CategoriesPage({ params }: CategoriesPageProps) {
  const { lang } = await params;
  const { data: categories } = await getCategories(lang);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="mb-2 text-3xl font-bold text-white">
        {lang === 'me' ? 'Kategorije' : 'Categories'}
      </h1>
      <p className="mb-8 text-slate-400">
        {lang === 'me'
          ? 'Pregledajte sve kategorije proizvoda'
          : 'Browse all product categories'}
      </p>

      {categories && categories.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((category: any) => (
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
      ) : (
        <div className="py-24 text-center">
          <p className="text-slate-500">
            {lang === 'me' ? 'Nema kategorija' : 'No categories available'}
          </p>
        </div>
      )}
    </div>
  );
}
