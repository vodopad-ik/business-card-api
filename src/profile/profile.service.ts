import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { DataloaderService } from '../common/dataloader/dataloader.service.js';
import {
  Experience,
  Profile,
  Project,
  Skill,
  SocialLink,
} from '../../generated/prisma/client.js';

@Injectable()
export class ProfileService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly dataloader: DataloaderService,
  ) {}

  async findProfile(): Promise<Profile | null> {
    return this.prisma.profile.findFirst({ orderBy: { createdAt: 'desc' } });
  }

  async getSocialLinks(profileId: string): Promise<SocialLink[]> {
    return this.dataloader.socialLinksByProfileId.load(profileId);
  }

  async getSkills(profileId: string): Promise<Skill[]> {
    return this.dataloader.skillsByProfileId.load(profileId);
  }

  async getExperience(profileId: string): Promise<Experience[]> {
    return this.dataloader.experienceByProfileId.load(profileId);
  }

  async getProjects(profileId: string): Promise<Project[]> {
    return this.dataloader.projectsByProfileId.load(profileId);
  }
}
