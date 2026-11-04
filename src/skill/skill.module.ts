import { Module } from '@nestjs/common';
import { SkillService } from './skill.service.js';
import { SkillResolver } from './skill.resolver.js';

@Module({
  providers: [SkillService, SkillResolver],
  exports: [SkillService],
})
export class SkillModule {}
