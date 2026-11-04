import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { Skill, SkillCategory } from '../../generated/prisma/client.js';

@Injectable()
export class SkillService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(category?: SkillCategory): Promise<Skill[]> {
    return this.prisma.skill.findMany({
      where: category ? { category } : undefined,
      orderBy: { createdAt: 'desc' },
    });
  }
}
