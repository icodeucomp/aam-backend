import { Injectable } from '@nestjs/common';

import { CloudinaryService } from '@shared/cloudinary/cloudinary.service';

@Injectable()
export class FileDownloadService {
  constructor(private cloudinaryService: CloudinaryService) {}

  download(url: string) {
    return this.cloudinaryService.downloadFile(url);
  }
}
