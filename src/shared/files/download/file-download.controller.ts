import { Controller, Get, Query } from '@nestjs/common';

import { FileDownloadService } from '@shared/files/download/file-download.service';

@Controller('download')
export class FileDownloadController {
  constructor(private fileDownloadService: FileDownloadService) {}

  @Get()
  downloadFile(@Query('url') url: string): string {
    const downloadUrl = this.fileDownloadService.download(url);

    return downloadUrl;
  }
}
