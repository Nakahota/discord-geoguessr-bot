import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const location = await prisma.location.create({
    data: {
      prefecture: "神奈川県",
      city: "厚木市",
      latitude: 35.450254,
      longitude: 139.358608,
    },
  });

  const image = await prisma.image.create({
    data: {
      url: "./images/IMG_6335.jpg",
    },
  });

  await prisma.question.create({
    data: {
      locationId: location.id,
      imageId: image.id,
    },
  });
}


main()
  .finally(async () => {
    await prisma.$disconnect();
  });