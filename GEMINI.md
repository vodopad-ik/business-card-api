# Business Card API — Project Rules

## Project Overview

This is a **digital business card backend** — a NestJS GraphQL API that serves professional profile data for Uladzislau Byshkala (Влад Бышкало). The application uses PostgreSQL with Prisma ORM, GraphQL (code-first via Apollo), and runs in Docker.

## Architecture: 3-Layer Separation

Every domain module (profile, skill, experience, project) follows this strict separation:

| Layer | File | Responsibility |
|-------|------|----------------|
| **Resolver** | `*.resolver.ts` | GraphQL endpoint, input validation, `@ResolveField()` for relations |
| **Service** | `*.service.ts` | Business logic, orchestration, DataLoader batching |
| **Prisma** | `prisma.service.ts` | Database access only |

**Rules:**
- Resolvers NEVER import PrismaService directly
- Services NEVER contain GraphQL decorators
- PrismaService is a thin wrapper around `PrismaClient` — no business logic

## Tech Stack & Versions

- **Runtime**: Node.js 24.x
- **Language**: TypeScript 6.x (strict mode, ESM)
- **Module System**: ESM (`"type": "module"` in package.json, `nodenext` in tsconfig)
- **Framework**: NestJS 12.x
- **ORM**: Prisma 7.x
- **GraphQL**: @nestjs/graphql 14 + @nestjs/apollo 14 + @apollo/server 5
- **Database**: PostgreSQL 16
- **Testing**: Vitest 4.x (API-compatible with Jest)
- **Linting**: oxlint + Prettier
- **Containerization**: Docker + Docker Compose

## Code Conventions

### TypeScript
- Use `strict: true` in tsconfig
- Prefer `const` over `let`; never use `var`
- Use explicit return types on all public methods
- Use `readonly` for injected dependencies

### NestJS
- One module per domain entity
- Use `@Injectable()` for all services
- Use constructor injection (not property injection)
- Module imports should be explicit — no barrel re-exports across modules

### Prisma
- Schema file: `prisma/schema.prisma`
- Seed file: `prisma/seed.ts`
- Use `upsert` in seed for idempotency
- Migration naming: `npx prisma migrate dev --name descriptive_name`

### GraphQL (Code-First)
- Models in `models/*.model.ts` using `@ObjectType()` and `@Field()`
- Use `@ResolveField()` for all nested relations (never eager-load in service)
- Use DataLoader pattern for N+1 optimization
- Nullable fields must have `{ nullable: true }` in `@Field()`

### File Naming
- `kebab-case` for file names: `profile.resolver.ts`, `social-link.model.ts`
- `PascalCase` for classes: `ProfileResolver`, `SocialLinkModel`
- `camelCase` for variables and methods

### Imports
- ESM: all relative imports must include `.js` extension: `import { Foo } from './foo.service.js'`
- Group imports: 1) Node built-ins, 2) External packages, 3) Internal modules
- Use relative paths for internal modules

## Docker
- Multi-stage Dockerfile: build → production
- `docker-compose.yml` with `app` and `db` services
- DB healthcheck before app starts
- Entrypoint: migrate → seed → start

## Testing (if added)
- Vitest for unit tests (Jest-compatible API)
- Test files co-located: `*.spec.ts` next to source
- Mock PrismaService in unit tests

## Git
- Conventional commits: `feat:`, `fix:`, `chore:`, `docs:`
- `.gitignore` must include: `node_modules/`, `dist/`, `.env`, `prisma/*.db`
