import { PrismaClient, PlayerRole } from "@prisma/client";

const prisma = new PrismaClient();

function readUsername() {
  const username = process.argv[2]?.trim();

  if (!username) {
    console.error("Uso: npm run db:promote-operator -- <username>");
    process.exit(1);
  }

  return username;
}

async function main() {
  const username = readUsername();
  const player = await prisma.player.findUnique({
    where: { username },
    select: {
      id: true,
      username: true,
      displayName: true,
      role: true,
    },
  });

  if (!player) {
    console.error(`Usuario "${username}" nao encontrado.`);
    process.exit(1);
  }

  if (player.role === PlayerRole.operator) {
    console.log(
      `Usuario ${player.username} (${player.displayName}) ja possui role operator.`,
    );
    return;
  }

  const updatedPlayer = await prisma.player.update({
    where: { id: player.id },
    data: { role: PlayerRole.operator },
    select: {
      username: true,
      displayName: true,
      role: true,
    },
  });

  console.log(
    `Usuario ${updatedPlayer.username} (${updatedPlayer.displayName}) promovido para ${updatedPlayer.role}.`,
  );
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
