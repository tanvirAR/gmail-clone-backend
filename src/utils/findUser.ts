import prisma from "../prismaclient/prismaClient";

async function findSingleUser(email: string) {
  const user = await prisma.user.findUnique({
    where: {
      email: email,
    },
  });

  return user;
}

export default findSingleUser;