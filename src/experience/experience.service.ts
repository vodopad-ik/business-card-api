import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { Experience } from '../../generated/prisma/client.js';

@Injectable()
export class ExperienceService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(): Promise<Experience[]> {
    return this.prisma.experience.findMany({
      orderBy: { startDate: 'desc' },
    });
  }
}
