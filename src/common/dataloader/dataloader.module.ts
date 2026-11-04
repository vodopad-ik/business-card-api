import { Module } from '@nestjs/common';
import { DataloaderService } from './dataloader.service.js';

@Module({
  providers: [DataloaderService],
  exports: [DataloaderService],
})
export class DataloaderModule {}
