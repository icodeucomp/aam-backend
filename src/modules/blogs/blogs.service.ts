import { Injectable } from '@nestjs/common';
import { Blog } from '@prisma/client';

import { CreateBlogDto, GetBlogDto, UpdateBlogDto } from './dto';
import {
  generateDateRange,
  generatePagination,
  generateSlug,
} from '../../common/utils';
import { PrismaService } from '../../shared/prisma/prisma.service';

@Injectable()
export class BlogsService {
  constructor(private prisma: PrismaService) {}

  async getAllBlog(query: GetBlogDto): Promise<Blog[]> {
    const {
      title,
      author,
      dateCreateStart,
      dateCreateEnd,
      dateUpdateStart,
      dateUpdateEnd,
      sort,
      order,
      page,
      limit,
    } = query;
    const { skip, take } = generatePagination(page, limit);

    const { start: dateCreatedStart } = generateDateRange(dateCreateStart);
    const { end: dateCreatedEnd } = generateDateRange(dateCreateEnd);
    const { start: dateUpdatedStart } = generateDateRange(dateUpdateStart);
    const { end: dateUpdatedEnd } = generateDateRange(dateUpdateEnd);

    const blogs = await this.prisma.blog.findMany({
      where: {
        ...(title && { title: { contains: title, mode: 'insensitive' } }),
        ...(author && {
          authorId: Number(author),
        }),
        ...(dateCreateStart &&
          dateCreateEnd && {
            uploadedAt: {
              gte: dateCreatedStart,
              lt: dateCreatedEnd,
            },
          }),
        ...(dateUpdateStart &&
          dateUpdateEnd && {
            uploadedAt: {
              gte: dateUpdatedStart,
              lt: dateUpdatedEnd,
            },
          }),
      },
      include: {
        author: {
          select: {
            username: true,
          },
        },
      },
      orderBy: { [sort]: order },
      skip,
      take,
    });

    return blogs;
  }

  async getBlogById(blogId: number): Promise<Blog> {
    const blog = await this.prisma.blog.findUnique({
      where: {
        id: blogId,
      },
      include: {
        author: {
          select: {
            username: true,
          },
        },
      },
    });

    return blog;
  }

  async createBlog(authorId: number, dto: CreateBlogDto): Promise<Blog> {
    const slug = generateSlug(dto.title);

    const blog = await this.prisma.blog.create({
      data: {
        title: dto.title,
        slug,
        content: dto.content,
        authorId: authorId,
      },
    });

    return blog;
  }

  async updateBlogById(blogId: number, dto: UpdateBlogDto) {
    const updatedData: UpdateBlogDto = { ...dto };

    if (dto.title) {
      updatedData.slug = generateSlug(updatedData.title);
    }

    const blog = await this.prisma.blog.update({
      where: {
        id: blogId,
      },
      data: updatedData,
    });

    return blog;
  }

  async deleteBlogById(BlogId: number): Promise<Blog> {
    const Blog = await this.prisma.blog.delete({
      where: {
        id: BlogId,
      },
    });

    return Blog;
  }
}
