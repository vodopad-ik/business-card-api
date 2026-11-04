# 🪪 Digital Business Card API

> **GraphQL API цифровой визитки Fullstack/Backend инженера (Влад Бышкало / Uladzislau Byshkala)**  
> Построено на **NestJS 12**, **Apollo Server 5**, **Prisma ORM 7**, **PostgreSQL 16** и **Docker Compose**.

🌐 **Live Demo (Apollo Sandbox): [https://business-card-api-a6tb.onrender.com/graphql](https://business-card-api-a6tb.onrender.com/graphql)**

---

## ⚡ Быстрый старт (One-command Launch)

Приложение полностью готово к запуску «с нуля». База данных поднимается, автоматически накатывает схему и заполняется актуальными данными:

```bash
# 1. Клонируйте репозиторий
git clone https://github.com/vodopad-ik/business-card-api.git
cd business-card-api

# 2. Запустите в Docker Compose
docker compose up --build
```

После старта перейдите в интерактивный **Apollo Sandbox**:
🔗 **[http://localhost:3000/graphql](http://localhost:3000/graphql)** *(или просто [http://localhost:3000](http://localhost:3000) — настроен авторедирект)*.

---

## ☁️ Развертывание в облаке (Render / Railway)

В репозитории уже настроен Blueprint [`render.yaml`](./render.yaml) для бесплатного 1-click развертывания PostgreSQL + Docker Web Service на **Render**:

1. Зарегистрируйтесь на [render.com](https://render.com) (через GitHub).
2. Перейдите в **Blueprints** → **New Blueprint Instance**.
3. Выберите репозиторий `vodopad-ik/business-card-api`.
4. Нажмите **Apply** — Render автоматически создаст PostgreSQL, соберет Docker-образ, накатит миграции и сид данных!

---

## 🧭 Пример запроса к GraphQL API

Вставьте этот запрос в Apollo Sandbox для получения профиля со всеми вложенными сущностями:

```graphql
query GetMyProfile {
  profile {
    id
    name
    title
    description
    location
    email
    socialLinks {
      platform
      url
    }
    skills {
      name
      category
    }
    experience {
      company
      position
      startDate
      endDate
      achievements
    }
    projects {
      name
      description
      repositoryUrl
    }
  }
}
```

### Дополнительные прямые запросы:

```graphql
# Получение навыков с фильтрацией по категории (FRAMEWORK, DATABASE, CLOUD, MESSAGING и др.)
query GetFrameworkSkills {
  skills(category: FRAMEWORK) {
    name
    category
  }
}

# Получение коммерческого опыта работы
query GetExperience {
  experience {
    company
    position
    achievements
  }
}

# Получение проектов
query GetProjects {
  projects {
    name
    repositoryUrl
  }
}
```

---

## 🏗️ Обоснование принятых архитектурных решений

### 1. 3-слойная архитектура с жестким разделением ответственности

В приложении реализовано строгое разделение на 3 изолированных слоя:

```
┌────────────────────────────────────────┐
│      Presentation Layer: Resolvers     │  *.resolver.ts
│ (GraphQL эндпоинты, типы, валидация)   │  Никогда не импортируют PrismaService!
└───────────────────┬────────────────────┘
                    │
┌───────────────────▼────────────────────┐
│       Business Logic: Services         │  *.service.ts
│  (Бизнес-правила, вызовы DataLoader)   │  Никаких GraphQL декораторов!
└───────────────────┬────────────────────┘
                    │
┌───────────────────▼────────────────────┐
│      Data Access: PrismaService        │  prisma.service.ts
│   (Тонкая обёртка над PrismaClient)    │  Пул соединений PostgreSQL, адаптер
└────────────────────────────────────────┘
```

- **Resolvers** отвечают исключительно за транспортный уровень GraphQL и маппинг полей через `@ResolveField()`.
- **Services** инкапсулируют бизнес-правила и оркестрацию очередей DataLoader. Они полностью отвязаны от GraphQL (нет декораторов `@Query` или `@Field`).
- **PrismaService** изолирует работу с базой данных и управляет жизненным циклом соединений (`onModuleInit`, `onModuleDestroy`).

---

### 2. Оптимизация N+1 через DataLoader

В GraphQL стандартный обход дерева связей приводит к классической **проблеме N+1**: при выборке списка профилей для каждого профиля движок отдельно вызывал бы `SELECT * FROM skills WHERE profile_id = ...`.

Для исключения избыточных запросов реализован `DataloaderService`:
- **Пакетная выборка (Batching)**: DataLoader аккумулирует все идентификаторы профилей в рамках одного тика Event Loop Node.js и делает **ровно 1 SQL-запрос** через оператор `WHERE profile_id IN (...)`.
- **Изоляция контекста (`Scope.REQUEST`)**: Экземпляр `DataloaderService` создается заново на каждый входящий HTTP-запрос. Это исключает утечки кэша между разными клиентами и предотвращает неконтролируемый рост памяти (memory leak).
- **Сортировка на уровне БД**: Использован композитный индекс `@@index([profileId, createdAt(sort: Desc)])`, благодаря чему выборка связей в батче происходит за минимальное время по B-Tree индексу.

---

### 3. Code-First подход в GraphQL

Вместо Schema-First (ручного написания `.graphql` файлов) применен **Code-First** с декораторами `@ObjectType()` и `@Field()`:
- **Единый источник правды (Single Source of Truth)**: TypeScript-классы моделей являются одновременно типами данных приложения и спецификацией схемы GraphQL.
- **100% Type-Safety**: Исключен человеческий фактор рассинхронизации между `.graphql` схемой и runtime TypeScript типами.
- Автоматическая генерация SDL-схемы в [`src/schema.gql`](./src/schema.gql) при сборке.

---

### 4. Дизайн схемы базы данных (Prisma 7 + PostgreSQL 16)

- **Идентификаторы CUID**: Использованы коллизионно-устойчивые упорядоченные идентификаторы (`cuid()`) вместо числовых автоинкрементов (защита от ID enumeration attacks).
- **Нативные массивы строк (`String[]`)**: Для поля `achievements` в опыте работы задействован нативный массив PostgreSQL `TEXT[]`, что исключило избыточную таблицу связей.
- **Каскадное удаление (`onDelete: Cascade`)**: Гарантирует ссылочную целостность — при удалении профиля все дочерние сущности (навыки, ссылки, опыт, проекты) удаляются атомарно на уровне БД.
- **Driver Adapter (`@prisma/adapter-pg` + `pg.Pool`)**: Использован современный стандарт Prisma 7 для эффективного пулинга соединений.

---

### 5. Идемпотентный сидинг базы данных (`prisma/seed.ts`)

Скрипт заполнения данных спроектирован так, чтобы гарантировать корректную работу при повторных запусках:
1. `Profile` синхронизируется через `upsert` по уникальному полю `email`.
2. Связанные коллекции (`skills`, `experience`, `projects`, `socialLinks`) обновляются внутри единой **ACID-транзакции** (`prisma.$transaction`):
   - Очистка устаревших записей профиля: `deleteMany({ where: { profileId } })`
   - Пакетная вставка актуальных данных: `createMany({ data: [...] })`
   - Это гарантирует, что в базе всегда находится **актуальный и точный слепок резюме**, без дубликатов и "хвостов" удаленных навыков.

---

### 6. Контейнеризация и Docker Compose

- **Multi-Stage Build**:
  - `builder`: компиляция TypeScript, генерация Prisma Client, `npm prune --production`.
  - `runner`: минимальный образ на базе `node:24-alpine`, содержащий только `dist` и runtime-зависимости.
- **Автоматический Entrypoint (`docker-entrypoint.sh`)**:
  - При старте контейнера скрипт синхронизирует схему (`prisma db push`), прогоняет сид (`prisma db seed`) и запускает скомпилированное NestJS приложение.
- **Healthcheck базы данных**: Контейнер приложения стартует только после того, как PostgreSQL переходит в состояние `healthy` (`pg_isready`).

---

## 🛠️ Стек технологий

| Технология | Версия / Назначение |
|------------|---------------------|
| **Node.js** | v24.x LTS (Alpine Linux) |
| **TypeScript** | v6.x (Strict ESM, `"type": "module"`) |
| **NestJS** | v12.x Core / Common / GraphQL |
| **GraphQL** | Apollo Server 5, Code-First, Apollo Sandbox |
| **ORM** | Prisma 7.x (`@prisma/adapter-pg`, `pg.Pool`) |
| **Database** | PostgreSQL 16 (Alpine) |
| **N+1 Optimization** | DataLoader 2.x (Request-Scoped) |
| **Containerization** | Docker, Docker Compose (Multi-stage build) |
| **Code Style** | Prettier, Oxlint |

---

## 📂 Структура репозитория

```
business-card-api/
├── docker-compose.yml          # Оркестрация сервисов (app + PostgreSQL)
├── Dockerfile                  # Многоэтапная сборка Docker
├── docker-entrypoint.sh        # Скрипт автоматических миграций и сидинга
├── package.json
├── tsconfig.json
├── prisma.config.ts            # Конфигурация Prisma 7
│
├── prisma/
│   ├── schema.prisma           # Модели базы данных и индексы
│   └── seed.ts                 # Идемпотентный сид персональных данных
│
└── src/
    ├── main.ts                 # Точка входа, CORS, Apollo Sandbox
    ├── app.module.ts           # Корневой модуль, регистрация GraphQL
    ├── schema.gql              # Автогенерированная GraphQL SDL схема
    │
    ├── prisma/                 # Доступ к БД
    │   ├── prisma.service.ts
    │   └── prisma.module.ts
    │
    ├── common/dataloader/      # Защита от N+1 проблемы
    │   ├── dataloader.service.ts
    │   └── dataloader.module.ts
    │
    ├── profile/                # Доменный модуль профиля
    │   ├── models/             # GraphQL ObjectTypes (Profile, SocialLink)
    │   ├── profile.service.ts  # Бизнес-логика и вызов DataLoader
    │   ├── profile.resolver.ts # GraphQL Query и @ResolveField
    │   └── profile.module.ts
    │
    ├── skill/                  # Доменный модуль навыков
    ├── experience/             # Доменный модуль опыта работы
    └── project/                # Доменный модуль проектов
```

---

## 👨‍💻 Автор

**Влад Бышкало (Uladzislau Byshkala)**  
- **Title**: Middle Fullstack / Backend Engineer (Node.js, TypeScript, NestJS)  
- **GitHub**: [github.com/vodopad-ik](https://github.com/vodopad-ik)  
- **LinkedIn**: [Влад Бышкало](https://www.linkedin.com/in/%D0%B2%D0%BB%D0%B0%D0%B4-%D0%B1%D1%8B%D1%88%D0%BA%D0%B0%D0%BB%D0%BE-97530b37b)  
- **Email**: [byskalovlad@gmail.com](mailto:byskalovlad@gmail.com)
