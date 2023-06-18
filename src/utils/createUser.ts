import { HashedUser } from "../interface/User.interface";
import prisma from "../prismaclient/prismaClient";


export async function createUser(properties: HashedUser) {
  const  { firstName, lastName, email, hashedPassword} = properties;
  await prisma.user.create({
    data: {
      firstName: firstName,
      lastName: lastName,
      email: email,
      name: `${firstName} ${lastName}`,
      password: hashedPassword,
    },
  });
}

