'use server'
import { currentUser } from "@clerk/nextjs/server";
import { client } from "@/lib/prisma";
export const onAuthenticateUser = async () => {
  try {
    const user = await currentUser();
    if (!user) return { status: 403 };

    const userExist = await client.user.findUnique({
      where: {
        clerk_id: user.id,
      },
      include: {
        PurchasedProducts: {
          select: {
            id: true,
          },
        },
      },
    });

    if (userExist) {
      return { status: 200, user: userExist };
    }
    const newUser = await client.user.create({
      data: {
        clerk_id: user.id,
        email: user.emailAddresses[0].emailAddress,
        name: user.firstName + " " + user.lastName,
        profileImage: user.imageUrl,
      },
    });
    if (newUser) {
      return { status: 201, user: newUser };
    }
    return {status:400}
  } catch (e) {
    console.log(e);
    return { status: 500 };
  }
};
