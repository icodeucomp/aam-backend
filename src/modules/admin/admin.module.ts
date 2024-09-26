import { Module } from '@nestjs/common';

import { AdminController } from '@modules/admin/admin.controller';
import { AdminService } from '@modules/admin/admin.service';

@Module({
  providers: [AdminService],
  controllers: [AdminController],
})
export class AdminModule {}
