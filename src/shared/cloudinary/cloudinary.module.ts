import { Global, Module } from '@nestjs/common';

import { CloudinaryProvider } from '@shared/cloudinary/cloudinary.provider';
import { CloudinaryService } from '@shared/cloudinary/cloudinary.service';

@Global()
@Module({
  providers: [CloudinaryProvider, CloudinaryService],
  exports: [CloudinaryProvider, CloudinaryService],
})
export class CloudinaryModule {}
