import { Injectable, Scope } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service.js';
import DataLoader from 'dataloader';
import {
  Experience,
  Skill,
  SocialLink,
  Project,
} from '../../../generated/prisma/client.js';

@Injectable({ scope: Scope.REQUEST })
export class DataloaderService {
  constructor(private readonly prisma: PrismaService) {}

  readonly socialLinksByProfileId = new DataLoader<string, SocialLink[]>(
    async (profileIds: readonly string[]) => {
      const links = await this.prisma.socialLink.findMany({
        where: { profileId: { in: [...profileIds] } },
        orderBy: { createdAt: 'desc' },
      });

      return profileIds.map((id) =>
        links.filter((link) => link.profileId === id),
      );
    },
  );

  readonly skillsByProfileId = new DataLoader<string, Skill[]>(
    async (profileIds: readonly string[]) => {
      const skills = await this.prisma.skill.findMany({
        where: { profileId: { in: [...profileIds] } },
        orderBy: { createdAt: 'desc' },
      });

      return profileIds.map((id) =>
        skills.filter((skill) => skill.profileId === id),
      );
    },
  );

  readonly experienceByProfileId = new DataLoader<string, Experience[]>(
    async (profileIds: readonly string[]) => {
      const experiences = await this.prisma.experience.findMany({
        where: { profileId: { in: [...profileIds] } },
        orderBy: { startDate: 'desc' },
      });

      return profileIds.map((id) =>
        experiences.filter((experience) => experience.profileId === id),
      );
    },
  );

  readonly projectsByProfileId = new DataLoader<string, Project[]>(
    async (profileId: readonly string[]) => {
      const projects = await this.prisma.project.findMany({
        where: { profileId: { in: [...profileId] } },
        orderBy: { createdAt: 'desc' },
      });

      return profileId.map((id) =>
        projects.filter((project) => project.profileId === id),
      );
    },
  );
}
