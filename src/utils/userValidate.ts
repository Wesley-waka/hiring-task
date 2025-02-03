export const validateUser = async (name: string): Promise<User> => {
  const user = await prisma.user.findUnique({
    where: { name: String(name) },
  });

  if (!user) {
    throw new Error("User not found");
  }

  return user;
};
