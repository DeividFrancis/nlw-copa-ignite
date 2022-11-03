import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const user = await prisma.user.create({
    data: {
      name: "John Doe",
      email: "john@doe.com",
      avatarUrl: "https://github.com/deividfrancis.png",
    },
  });

  const pool = await prisma.pool.create({
    data: {
      title: "Example Pool",
      code: "ABC123",
      ownerId: user.id,

      participants: {
        create: {
          userId: user.id,
        },
      },
    },
  });

  await prisma.game.create({
    data: {
      date: "2022-11-02T12:18:45.803Z",
      firstTeamCountryCode: "DE",
      secondTeamContryCode: "BR",
    },
  });

  await prisma.game.create({
    data: {
      date: "2022-11-02T12:18:45.803Z",
      firstTeamCountryCode: "BR",
      secondTeamContryCode: "AR",

      guesses: {
        create: {
          firstTeamPoints: 3,
          secondTeamPoints: 1,
          participant: {
            connect: {
              userId_poolId: {
                userId: user.id,
                poolId: pool.id,
              },
            },
          },
        },
      },
    },
  });
}

main();
