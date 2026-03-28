# AGENTS.md — HorecaMe

## Project Overview

HorecaMe is a B2B HORECA marketplace for Montenegro and the Adriatic region. Monorepo using **pnpm workspaces + Turborepo**.

- `apps/web` — Next.js 15 (App Router), React 19, Tailwind CSS
- `packages/db` — Supabase client, typed queries, migrations
- `packages/shared` — Shared types, Zod schemas, utils, i18n constants
- `packages/ui` — Radix UI primitives, CVA variants, layout components
- `packages/tsconfig` — Shared TypeScript configs

## Build / Lint / Test Commands

```bash
# Install dependencies (from root)
pnpm install

# Development (starts all apps)
pnpm dev

# Build all packages and apps
pnpm build

# Lint all packages
pnpm lint

# Type-check all packages
pnpm typecheck

# Format code
pnpm format

# Run commands for a single package
pnpm --filter @horecame/web dev
pnpm --filter @horecame/web lint
pnpm --filter @horecame/web typecheck
pnpm --filter @horecame/shared typecheck
pnpm --filter @horecame/ui typecheck
pnpm --filter @horecame/db typecheck

# Database commands
pnpm db:generate    # Generate Supabase types
pnpm db:migrate     # Run migrations
pnpm db:seed        # Seed database
```

There is **no test framework** currently configured. If you add tests, use Vitest for packages and the web app.

## Architecture

- **Routing**: Next.js App Router with `[lang]` segment for i18n (`me`, `en`)
- **Auth**: Supabase Auth with SSR via `@supabase/ssr`; middleware refreshes sessions
- **DB Access**: Supabase JS client with generated `Database` types; queries in `packages/db/src/queries/`
- **Validation**: Zod schemas in `packages/shared/src/schemas/`
- **Styling**: Tailwind CSS with custom dark theme colors (`teal`, `sky`, `navy`, `surface`); `cn()` utility from `clsx` + `tailwind-merge`
- **UI Components**: Radix primitives wrapped with CVA variants in `packages/ui/src/primitives/`
- **i18n**: next-intl; locale dictionaries inline in page components for now

## Code Style

### TypeScript

- **Strict mode** enabled with `noUncheckedIndexedAccess`
- Use `type` for unions/interfaces; prefer `interface` for object shapes that may be extended
- Always type function parameters and return values explicitly for public APIs
- Use `as` type assertions sparingly — prefer type narrowing

### Imports

```ts
// External libraries first
import { createClient } from "@supabase/supabase-js";
import type { Database } from "./types";

// Workspace packages
import { Button } from "@horecame/ui/primitives";
import { cn } from "@horecame/shared/utils";

// Local aliases (@/* for apps/web)
import { createClient } from "@/lib/supabase/server";
```

- Use `import type` for type-only imports
- Destructure named exports; avoid default exports except for React components and Next.js pages/layouts

### Naming

- **Files**: kebab-case (`product-card.tsx`, `search-command.tsx`)
- **Components**: PascalCase (`ProductCard`, `SearchCommand`)
- **Functions/variables**: camelCase (`getProducts`, `formatCurrency`)
- **Types**: PascalCase (`PaginationParams`, `StockStatus`)
- **Constants**: UPPER_SNAKE_CASE for true constants; camelCase for config objects
- **Zod schemas**: PascalCase ending in `Schema` (`ProductCreateSchema`, `PaginationSchema`)

### React Components

- Use `React.forwardRef` for primitives that need ref forwarding
- Export both the component and its variants/props: `export { Button, buttonVariants }`
- Server components by default in App Router; add `'use client'` only when needed (interactivity, hooks, browser APIs)
- Props interfaces named `{Component}Props` (e.g., `ButtonProps`)

### Error Handling

- Use try/catch for cookie/session operations that may fail in Server Components
- Supabase queries return `{ data, error }` — always destructure and check `error`
- Throw `Error` with descriptive messages for missing env vars or config
- API routes return `NextResponse.json()` with appropriate HTTP status codes

### Tailwind CSS

- Use the custom color palette: `teal`, `sky`, `navy`, `surface`, `success`, `warning`, `error`
- Use `cn()` from `@horecame/ui` or `@horecame/shared/utils` for conditional classes
- Responsive design: mobile-first with `sm:`, `lg:`, `xl:` breakpoints
- Animations: `animate-fade-in`, `animate-slide-up`, `animate-slide-down`

### Zod Validation

- Define schemas in `packages/shared/src/schemas/` for cross-package use
- Use `z.coerce.number()` for query params and form inputs
- Use `.default()` for optional fields with defaults
- Mirror TypeScript types with corresponding Zod schemas

## Environment Variables

Required in `apps/web/.env.local`:

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

## Commit Convention

No enforced convention yet. Use descriptive messages: `feat:`, `fix:`, `refactor:`, `chore:`.
