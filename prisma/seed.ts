import 'dotenv/config';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';
import { PrismaClient, SkillCategory } from '../generated/prisma/client.js';

const connectionString = process.env.DATABASE_URL ?? '';
const pool = new pg.Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main(): Promise<void> {
  console.log('Starting database seed...');

  const profile = await prisma.profile.upsert({
    where: { email: 'byskalovlad@gmail.com' },
    update: {
      name: 'Uladzislau Byshkala',
      title: 'Middle Fullstack Developer · Node.js / TypeScript',
      description:
        'Middle Fullstack Developer with 3 years of commercial experience engineering high-performance Node.js backend systems and reactive web interfaces. Strong expertise in NestJS, TypeScript, React, and Next.js. Experienced in designing resilient event-driven architectures (Kafka, BullMQ), multi-tenant data schemas (PostgreSQL, MongoDB), distributed locking with Redis, and serverless AWS integrations. Committed to clean architecture, 80%+ test coverage, automated CI/CD pipelines, and modern AI engineering tools (Claude Code, Cursor) to maximize delivery speed.',
      location: 'Minsk, Belarus',
    },
    create: {
      name: 'Uladzislau Byshkala',
      title: 'Middle Fullstack Developer · Node.js / TypeScript',
      description:
        'Middle Fullstack Developer with 3 years of commercial experience engineering high-performance Node.js backend systems and reactive web interfaces. Strong expertise in NestJS, TypeScript, React, and Next.js. Experienced in designing resilient event-driven architectures (Kafka, BullMQ), multi-tenant data schemas (PostgreSQL, MongoDB), distributed locking with Redis, and serverless AWS integrations. Committed to clean architecture, 80%+ test coverage, automated CI/CD pipelines, and modern AI engineering tools (Claude Code, Cursor) to maximize delivery speed.',
      email: 'byskalovlad@gmail.com',
      location: 'Minsk, Belarus',
    },
  });

  console.log(`Profile synced: ${profile.name} (${profile.id})`);

  await prisma.$transaction(async (tx) => {

    await tx.socialLink.deleteMany({ where: { profileId: profile.id } });
    await tx.socialLink.createMany({
      data: [
        {
          profileId: profile.id,
          platform: 'GitHub',
          url: 'https://github.com/vodopad-ik',
        },
        {
          profileId: profile.id,
          platform: 'LinkedIn',
          url: 'https://www.linkedin.com/in/%D0%B2%D0%BB%D0%B0%D0%B4-%D0%B1%D1%8B%D1%88%D0%BA%D0%B0%D0%BB%D0%BE-97530b37b',
        },
      ],
    });

    await tx.skill.deleteMany({ where: { profileId: profile.id } });
    await tx.skill.createMany({
      data: [
        { profileId: profile.id, name: 'TypeScript', category: SkillCategory.LANGUAGE },
        { profileId: profile.id, name: 'JavaScript', category: SkillCategory.LANGUAGE },
        { profileId: profile.id, name: 'SQL', category: SkillCategory.LANGUAGE },
        { profileId: profile.id, name: 'Node.js', category: SkillCategory.LANGUAGE },
        { profileId: profile.id, name: 'NestJS', category: SkillCategory.FRAMEWORK },
        { profileId: profile.id, name: 'Express.js', category: SkillCategory.FRAMEWORK },
        { profileId: profile.id, name: 'React', category: SkillCategory.FRAMEWORK },
        { profileId: profile.id, name: 'Next.js', category: SkillCategory.FRAMEWORK },
        { profileId: profile.id, name: 'Redux Toolkit', category: SkillCategory.FRAMEWORK },
        { profileId: profile.id, name: 'Tailwind CSS', category: SkillCategory.FRAMEWORK },
        { profileId: profile.id, name: 'PostgreSQL', category: SkillCategory.DATABASE },
        { profileId: profile.id, name: 'MongoDB', category: SkillCategory.DATABASE },
        { profileId: profile.id, name: 'Redis', category: SkillCategory.DATABASE },
        { profileId: profile.id, name: 'Apache Kafka', category: SkillCategory.MESSAGING },
        { profileId: profile.id, name: 'RabbitMQ', category: SkillCategory.MESSAGING },
        { profileId: profile.id, name: 'BullMQ', category: SkillCategory.MESSAGING },
        { profileId: profile.id, name: 'AWS Lambda', category: SkillCategory.CLOUD },
        { profileId: profile.id, name: 'AWS API Gateway', category: SkillCategory.CLOUD },
        { profileId: profile.id, name: 'AWS S3', category: SkillCategory.CLOUD },
        { profileId: profile.id, name: 'AWS DynamoDB', category: SkillCategory.CLOUD },
        { profileId: profile.id, name: 'AWS SQS/SNS', category: SkillCategory.CLOUD },
        { profileId: profile.id, name: 'Docker', category: SkillCategory.DEVOPS },
        { profileId: profile.id, name: 'Docker Compose', category: SkillCategory.DEVOPS },
        { profileId: profile.id, name: 'GitHub Actions', category: SkillCategory.DEVOPS },
        { profileId: profile.id, name: 'Git', category: SkillCategory.DEVOPS },
        { profileId: profile.id, name: 'Jest', category: SkillCategory.TESTING },
        { profileId: profile.id, name: 'Supertest', category: SkillCategory.TESTING },
        { profileId: profile.id, name: 'Prisma', category: SkillCategory.TOOL },
        { profileId: profile.id, name: 'TypeORM', category: SkillCategory.TOOL },
        { profileId: profile.id, name: 'GraphQL', category: SkillCategory.TOOL },
        { profileId: profile.id, name: 'Claude Code', category: SkillCategory.TOOL },
        { profileId: profile.id, name: 'Cursor', category: SkillCategory.TOOL },
        { profileId: profile.id, name: 'Swagger / OpenAPI', category: SkillCategory.TOOL },
      ],
    });

    await tx.experience.deleteMany({ where: { profileId: profile.id } });
    await tx.experience.createMany({
      data: [
        {
          profileId: profile.id,
          company: 'Innowise Group',
          position: 'Fullstack Engineer',
          description: 'B2B Commerce & Order Orchestration Platform',
          startDate: new Date('2025-06-01'),
          endDate: null,
          achievements: [
            'Architected NestJS checkout services isolating inventory reservations under peak concurrent traffic',
            'Implemented distributed locking via Redis (RedLock) and idempotent SQS consumers to prevent double-allocations',
            'Optimized PostgreSQL queries via Prisma indexing, cutting p95 query latency from 340ms to 85ms',
            'Built AWS Lambda + API Gateway webhook handlers for automated partner supplier catalog ingestion',
            'Developed responsive order management UI in React/Next.js with real-time stock status and form validation',
          ],
        },
        {
          profileId: profile.id,
          company: 'Innowise Group',
          position: 'Backend Engineer',
          description: 'Event-Driven Notification & Telemetry Microservices',
          startDate: new Date('2024-08-01'),
          endDate: new Date('2025-05-31'),
          achievements: [
            'Designed decoupled Kafka producers and consumer groups partitioned by tenant keys for reliable message delivery',
            'Created fault-tolerant task queues with BullMQ, featuring exponential backoff retries and Dead Letter Queues',
            'Reduced p95 notification dispatch latency from 2.6s to 0.9s across enterprise channels',
            'Configured Prometheus metrics and health checks; automated testing and deployment via GitHub Actions CI/CD',
          ],
        },
        {
          profileId: profile.id,
          company: 'Innowise Group',
          position: 'Software Engineer',
          description: 'Workflow & Asset Management System API',
          startDate: new Date('2023-11-01'),
          endDate: new Date('2024-07-31'),
          achievements: [
            'Built RESTful backend for enterprise asset tracking, status transition workflows, and role governance',
            'Engineered modular REST APIs with Express.js supporting complex state machine transitions and audit logging',
            'Secured endpoints via JWT and granular Role-Based Access Control (RBAC); hardened API with rate limiting',
            'Restructured MongoDB compound indexes, decreasing p95 asset retrieval times from 710ms to 230ms',
            'Achieved 80%+ test coverage via Jest and Supertest; generated OpenAPI 3.0 documentation',
          ],
        },
      ],
    });

    await tx.project.deleteMany({ where: { profileId: profile.id } });
    await tx.project.createMany({
      data: [
        {
          profileId: profile.id,
          name: 'Digital Business Card API',
          description:
            'NestJS GraphQL API serving professional profile data with Prisma ORM, DataLoader optimization, and Docker containerization',
          url: null,
          repositoryUrl: 'https://github.com/vodopad-ik/business-card-api',
        },
      ],
    });
  });

  console.log('Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error('Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });