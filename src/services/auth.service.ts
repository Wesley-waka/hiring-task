/** @format */

import { User } from "@prisma/client";
import { prisma } from "../setup/database.setup";
import { CreateUserRequestType } from "@/types";

export const createUser = async ({
  name,
  hashedPassword,
  role,
}: CreateUserRequestType): Promise<User | null> => {
  const existingUser = await prisma.user.findUnique({ where: { name } });

  if (existingUser) {
    return null;
  }

  const newUser = await prisma.user.create({
    data: {
      name,
      hashedPassword,
      role: role ?? "USER",
      walletAddress: "",
      // Use the default if not provided
    },
  });

  return newUser;
};

export const getUser = async ({ name }: { name: string }): Promise<User | null> => {
  const user = await prisma.user.findUnique({
    where: { name },
  });

  return user;
};