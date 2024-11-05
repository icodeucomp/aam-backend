import {
  BadRequestException,
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import {
  UploadApiErrorResponse,
  UploadApiResponse,
  v2 as cloudinary,
} from 'cloudinary';
import * as fs from 'fs';
import { ReadStream } from 'fs';

@Injectable()
export class CloudinaryService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(CloudinaryService.name);

  async onModuleInit() {
    try {
      this.logger.log('Cloudinary client connected successfully.');
    } catch (error) {
      this.logger.error('Failed to connect to Cloudinary:', error);
    }
  }

  async onModuleDestroy() {
    try {
      this.logger.log('Cloudinary client disconnected successfully.');
    } catch (error) {
      this.logger.error('Failed to disconnect from Cloudinary:', error);
    }
  }

  async uploadFile(
    file: Express.Multer.File,
    folder: string,
  ): Promise<UploadApiResponse | UploadApiErrorResponse> {
    return new Promise((resolve, reject) => {
      const upload = cloudinary.uploader.upload_stream(
        {
          public_id: file.filename,
          folder: folder,
          overwrite: true,
        },
        (error, result) => {
          if (error) return reject(error);
          resolve(result);
        },
      );

      const stream: ReadStream = fs.createReadStream(file.path);
      stream.pipe(upload);

      stream.on('error', (err) => {
        reject(new BadRequestException('Error reading file: ' + err.message));
      });

      stream.on('end', () => {
        fs.unlink(file.path, (err) => {
          if (err) console.error('Failed to delete temporary file:', err);
        });
      });
    });
  }

  downloadFile(url: string): string {
    const filePublicId = this.getPublicIdFromUrl(url);
    const fileName = filePublicId.split('/').slice(-1)[0];

    const downloadUrl = cloudinary.url(filePublicId, {
      flags: `attachment:${fileName}`,
    });

    return downloadUrl;
  }

  private getPublicIdFromUrl(url: string): string {
    const matches = url.match(/\/upload\/(?:v\d+\/)?([^\.]+)/);

    if (!matches) {
      throw new BadRequestException('Invalid url');
    }

    return matches[1];
  }
}
