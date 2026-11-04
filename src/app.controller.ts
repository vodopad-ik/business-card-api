import { Controller, Get, Res } from '@nestjs/common';
import type { Response } from 'express';

@Controller()
export class AppController {
  @Get()
  root(@Res() res: Response): void {
    res.redirect('/graphql');
  }

  @Get('health')
  health(): { status: string; timestamp: string } {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
    };
  }
}
