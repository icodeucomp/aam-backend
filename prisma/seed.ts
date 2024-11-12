import { PrismaClient } from '@prisma/client';
import * as argon from 'argon2';
import { generateSlug } from '../src/common/utils';
import { BusinessSlug } from '../src/common/enums';

const prisma = new PrismaClient();

async function main() {
  const totalBusinessItem: number = 5;

  const documentCategories = ['Legality', 'Certification', 'Award'];

  const businessData = [
    {
      title: 'Civil & Construction',
      slug: BusinessSlug.CivilConstruction,
      description: "This is description for business 'civil & construction'",
      header: {
        slug: `${BusinessSlug.CivilConstruction}-business-header`,
        url: 'https://res.cloudinary.com/dkyazovdn/image/upload/v1731316670/amanah-aulia-mandiri/default/default-image.png',
      },
      productHeader: {
        slug: `${BusinessSlug.CivilConstruction}-business-product-header`,
        url: 'https://res.cloudinary.com/dkyazovdn/image/upload/v1731316670/amanah-aulia-mandiri/default/default-image.png',
      },
    },
    {
      title: 'Electrical',
      slug: BusinessSlug.Electrical,
      description: "This is description for business 'electrical'",
      header: {
        slug: `${BusinessSlug.Electrical}-business-header`,
        url: 'https://res.cloudinary.com/dkyazovdn/image/upload/v1731316670/amanah-aulia-mandiri/default/default-image.png',
      },
      productHeader: {
        slug: `${BusinessSlug.Electrical}-business-product-header`,
        url: 'https://res.cloudinary.com/dkyazovdn/image/upload/v1731316670/amanah-aulia-mandiri/default/default-image.png',
      },
    },
    {
      title: 'Fabrication',
      slug: BusinessSlug.Fabrication,
      description: "This is description for business 'fabrication'",
      header: {
        slug: `${BusinessSlug.Fabrication}-business-header`,
        url: 'https://res.cloudinary.com/dkyazovdn/image/upload/v1731316670/amanah-aulia-mandiri/default/default-image.png',
      },
      productHeader: {
        slug: `${BusinessSlug.Fabrication}-business-product-header`,
        url: 'https://res.cloudinary.com/dkyazovdn/image/upload/v1731316670/amanah-aulia-mandiri/default/default-image.png',
      },
    },
    {
      title: 'General Supplier',
      slug: BusinessSlug.GeneralSupplier,
      description: "This is description for business 'general supplier'",
      header: {
        slug: `${BusinessSlug.GeneralSupplier}-business-header`,
        url: 'https://res.cloudinary.com/dkyazovdn/image/upload/v1731316670/amanah-aulia-mandiri/default/default-image.png',
      },
      productHeader: {
        slug: `${BusinessSlug.GeneralSupplier}-business-product-header`,
        url: 'https://res.cloudinary.com/dkyazovdn/image/upload/v1731316670/amanah-aulia-mandiri/default/default-image.png',
      },
    },
    {
      title: 'Machining',
      slug: BusinessSlug.Machining,
      description: "This is description for business 'machining'",
      header: {
        slug: `${BusinessSlug.Machining}-business-header`,
        url: 'https://res.cloudinary.com/dkyazovdn/image/upload/v1731316670/amanah-aulia-mandiri/default/default-image.png',
      },
      productHeader: {
        slug: `${BusinessSlug.Machining}-business-product-header`,
        url: 'https://res.cloudinary.com/dkyazovdn/image/upload/v1731316670/amanah-aulia-mandiri/default/default-image.png',
      },
    },
    {
      title: 'Mechanical',
      slug: BusinessSlug.Mechanical,
      description: "This is description for business 'mechanical'",
      header: {
        slug: `${BusinessSlug.Mechanical}-business-header`,
        url: 'https://res.cloudinary.com/dkyazovdn/image/upload/v1731316670/amanah-aulia-mandiri/default/default-image.png',
      },
      productHeader: {
        slug: `${BusinessSlug.Mechanical}-business-product-header`,
        url: 'https://res.cloudinary.com/dkyazovdn/image/upload/v1731316670/amanah-aulia-mandiri/default/default-image.png',
      },
    },
  ];

  await prisma.admin.upsert({
    where: { username: `master` },
    update: {},
    create: {
      username: `master`,
      email: `master@mail.com`,
      password: await argon.hash(`Master0123Pass`),
    },
  });

  await prisma.album.upsert({
    where: { slug: `company-album` },
    update: {},
    create: {
      name: `Company Album`,
      slug: generateSlug('Company Album'),
      header:
        'https://res.cloudinary.com/dkyazovdn/image/upload/v1731316670/amanah-aulia-mandiri/default/default-image.png',
      creatorId: 1,
    },
  });

  await prisma.album.upsert({
    where: { slug: `project-album` },
    update: {},
    create: {
      name: `Project Album`,
      slug: generateSlug('Project Album'),
      header:
        'https://res.cloudinary.com/dkyazovdn/image/upload/v1731316670/amanah-aulia-mandiri/default/default-image.png',
      creatorId: 1,
    },
  });

  for (let i = 1; i <= businessData.length; i++) {
    const index = (i - 1) % documentCategories.length;
    const albumId = Math.floor(Math.random() * 2) + 1;

    await prisma.admin.upsert({
      where: { username: `admin${i}` },
      update: {},
      create: {
        username: `admin${i}`,
        email: `admin${i}@mail.com`,
        password: await argon.hash(`Admin${i}Pass`),
      },
    });

    // Blog
    await prisma.blog.upsert({
      where: { id: i },
      update: {},
      create: {
        title: `Blog ${i}`,
        slug: generateSlug(`Blog ${i}`),
        content: `Content for blog ${i}`,
        header:
          'https://res.cloudinary.com/dkyazovdn/image/upload/v1731316670/amanah-aulia-mandiri/default/default-image.png',
        authorId: i,
      },
    });

    // Document
    await prisma.document.upsert({
      where: { id: i },
      update: {},
      create: {
        name: `Document ${i}`,
        slug: generateSlug(`Document ${i}`),
        category: documentCategories[index],
        url: `https://res.cloudinary.com/dkyazovdn/image/upload/v1731382358/amanah-aulia-mandiri/document/default-document.pdf`,
        size: `${String(Math.floor(Math.random() * (999 - 500 + 1)) + 500)} KB`,
        uploaderId: i,
      },
    });

    await prisma.media.upsert({
      where: { id: i },
      update: {},
      create: {
        name: `Media ${i}`,
        slug: generateSlug(`media ${i}`),
        url: `https://res.cloudinary.com/dkyazovdn/image/upload/v1731316670/amanah-aulia-mandiri/default/default-image.png`,
        size: `${String(Math.floor(Math.random() * (999 - 500 + 1)) + 500)} KB`,
        albumId,
        uploaderId: i,
      },
    });

    // Business
    await prisma.business.upsert({
      where: { id: i },
      update: {},
      create: {
        title: businessData[i - 1].title,
        slug: businessData[i - 1].slug,
        description: businessData[i - 1].description,
        header: businessData[i - 1].header,
        productHeader: businessData[i - 1].productHeader,
      },
    });

    for (let j = 1; j <= totalBusinessItem; j++) {
      // Product
      await prisma.product.upsert({
        where: { id: (i - 1) * totalBusinessItem + j },
        update: {},
        create: {
          title: `${businessData[i - 1].title} Product ${j}`,
          slug: `${businessData[i - 1].slug}-product-${j}`,
          description: `${businessData[i - 1].title} product ${j}`,
          media: [
            {
              slug: `${businessData[i - 1].slug}-product-image${i}`,
              url: 'https://res.cloudinary.com/dkyazovdn/image/upload/v1731316670/amanah-aulia-mandiri/default/default-image.png',
            },
            {
              slug: `${businessData[i - 1].slug}-product-image${i + 1}`,
              url: 'https://res.cloudinary.com/dkyazovdn/image/upload/v1731316670/amanah-aulia-mandiri/default/default-image.png',
            },
            {
              slug: `${businessData[i - 1].slug}-product-image${i + 1}`,
              url: 'https://res.cloudinary.com/dkyazovdn/image/upload/v1731316670/amanah-aulia-mandiri/default/default-image.png',
            },
          ],
          businessId: i,
        },
      });

      // Project
      await prisma.project.upsert({
        where: { id: (i - 1) * totalBusinessItem + j },
        update: {},
        create: {
          title: `${businessData[i - 1].title} Project ${j}`,
          slug: `${businessData[i - 1].slug}-project-${j}`,
          description: `${businessData[i - 1].title} project ${j}`,
          header: {
            slug: `${businessData[i - 1].slug}-project-${j}-header`,
            url: 'https://res.cloudinary.com/dkyazovdn/image/upload/v1731316670/amanah-aulia-mandiri/default/default-image.png',
          },
          media: [
            {
              slug: `${businessData[i - 1].slug}-project-image${i}`,
              url: 'https://res.cloudinary.com/dkyazovdn/image/upload/v1731316670/amanah-aulia-mandiri/default/default-image.png',
            },
            {
              slug: `${businessData[i - 1].slug}-project-image${i + 1}`,
              url: 'https://res.cloudinary.com/dkyazovdn/image/upload/v1731316670/amanah-aulia-mandiri/default/default-image.png',
            },
            {
              slug: `${businessData[i - 1].slug}-project-image${i + 1}`,
              url: 'https://res.cloudinary.com/dkyazovdn/image/upload/v1731316670/amanah-aulia-mandiri/default/default-image.png',
            },
          ],
          businessId: i,
        },
      });
    }
  }
  console.log('Seeding completed');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
