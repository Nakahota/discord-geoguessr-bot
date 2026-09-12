import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const location = await prisma.location.create({
    data: {
      prefecture: "千葉県",
      city: "浦安市",
      latitude: 35.65272222,
      longitude: 139.91205556,
    },
  });

  const image = await prisma.image.create({
    data: {
      url: "https://cdn.discordapp.com/ephemeral-attachments/1528437535678660648/1548360031219490956/2026-09-12_235204.png?ex=6aa6c626&is=6aa574a6&hm=c0fd76b1b34d2774f899c8edccfa79b057b516ae7934852f88dc889c2a141b93&",
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