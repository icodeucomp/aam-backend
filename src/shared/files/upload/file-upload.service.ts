import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import * as fs from 'fs';

import {
  BusinessSlug,
  BusinessType,
  DocumentCategory,
  MediaType,
} from '@common/enums';
import { generateFileSize } from '@common/utils';
import { CloudinaryService } from '@shared/cloudinary/cloudinary.service';

@Injectable()
export class FileUploadService {
  constructor(private cloudinaryService: CloudinaryService) {}

  async uploadFile(
    file: Express.Multer.File,
    type: MediaType,
    category: BusinessSlug | DocumentCategory | string,
  ): Promise<{ name: string; url: string; size: string }> {
    if (!file) {
      throw new BadRequestException('please input file');
    }

    if (
      (type === MediaType.Business || type === MediaType.Project) &&
      !this.isValidBusinessSlug(category)
    ) {
      throw new BadRequestException(
        `Upload failed, no business named ${category}`,
      );
    }

    if (
      type === MediaType.Document &&
      !this.isValidDocumentCategory(category)
    ) {
      throw new BadRequestException(
        `Upload failed, no document with category ${category}`,
      );
    }

    const folderName =
      type === MediaType.Business
        ? `${type}/${category}/header`
        : type === MediaType.Document
          ? `${type}/${category.toLowerCase()}`
          : type === MediaType.Album
            ? `${type}/${category}/header`
            : type === MediaType.Project
              ? `business/${category}/${type}/header`
              : `${type}`;

    const result = await this.cloudinaryService.uploadFile(file, folderName);

    return {
      name: result.public_id,
      url: result.secure_url,
      size: generateFileSize(file.size),
    };
  }

  async uploadFiles(
    files: Express.Multer.File[],
    type: MediaType,
    businessSlug: BusinessSlug,
    businessType: BusinessType,
    album: string,
  ): Promise<{ uploadedFiles: { name: string; url: string; size: string }[] }> {
    const uploadedFiles = [];

    if (!files) {
      throw new BadRequestException('please input file');
    }

    if (type !== MediaType.Business && type !== MediaType.Media) {
      throw new BadRequestException(
        'Only media, product, and project can upload multiple',
      );
    }

    if (type == MediaType.Business) {
      if (!businessSlug) {
        throw new BadRequestException('Please input business name');
      }
      if (!businessType) {
        throw new BadRequestException('Please input business type');
      }
    }

    const folderName =
      type === MediaType.Business
        ? `${type}/${businessSlug}/${businessType}`
        : `album/${album}/${type}`;

    for (const file of files) {
      const fileStream = fs.createReadStream(file.path);

      if (!fileStream) {
        throw new BadRequestException('Failed to create file stream');
      }

      try {
        const result = await this.cloudinaryService.uploadFile(
          file,
          folderName,
        );

        uploadedFiles.push({
          name: result.public_id,
          url: result.secure_url,
          size: generateFileSize(file.size),
        });
      } catch (error) {
        console.error({ error });
        throw new InternalServerErrorException(
          `Failed to upload file: ${error.message}`,
        );
      } finally {
        fs.unlinkSync(file.path);
      }
    }

    return { uploadedFiles };
  }

  private isValidBusinessSlug(businessSlug: string): boolean {
    return Object.values(BusinessSlug).includes(businessSlug as BusinessSlug);
  }

  private isValidDocumentCategory(documentCategory: string): boolean {
    return Object.values(DocumentCategory).includes(
      documentCategory as DocumentCategory,
    );
  }
}
