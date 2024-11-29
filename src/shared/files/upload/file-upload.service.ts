import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';

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
    this.validateUploadInput(file, type, category);

    const folderName = this.getUploadFolderName(type, category);

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
    this.validateUploadsInput(files, type, businessSlug, businessType);

    const folderName =
      type === MediaType.Business
        ? `${type}/${businessSlug}/${businessType}`
        : `album/${album}/${type}`;

    const uploadedFiles = await Promise.all(
      files.map(async (file) => {
        try {
          const result = await this.cloudinaryService.uploadFile(
            file,
            folderName,
          );

          return {
            name: result.public_id,
            url: result.secure_url,
            size: generateFileSize(file.size),
          };
        } catch (error) {
          console.error(
            `Error uploading file ${file.originalname}: ${error.message}`,
          );
          throw new InternalServerErrorException(
            `Failed to upload file ${file.originalname}`,
          );
        }
      }),
    );

    return { uploadedFiles };
  }

  private validateUploadInput(
    file: Express.Multer.File,
    type: MediaType,
    category: BusinessSlug | DocumentCategory | string,
  ): void {
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
  }

  private validateUploadsInput(
    files: Express.Multer.File[],
    type: MediaType,
    businessSlug: string,
    businessType: BusinessType,
  ): void {
    if (!files || files.length === 0) {
      throw new BadRequestException('Please input file(s)');
    }

    if (type !== MediaType.Business && type !== MediaType.Media) {
      throw new BadRequestException(
        'Only media, product, and project can upload multiple',
      );
    }

    if (type === MediaType.Business) {
      if (!businessSlug) {
        throw new BadRequestException('Please input business name');
      }
      if (!businessType) {
        throw new BadRequestException('Please input business type');
      }
    }
  }

  private getUploadFolderName(type: MediaType, category: string): string {
    switch (type) {
      case MediaType.Business:
        return `${type}/${category}/header`;
      case MediaType.Document:
        return `${type}/${category.toLowerCase()}`;
      case MediaType.Album:
        return `${type}/${category}/header`;
      case MediaType.Project:
        return `business/${category}/${type}/header`;
      default:
        return type;
    }
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
