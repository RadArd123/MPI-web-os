import {prisma} from "@/lib/prisma";
import bcrypt from "bcrypt";

export const AuthService = {
  createUser: async (email: string, password: string, operatorName: string) => {

    const hashedPassword = await bcrypt.hash(password, 10);

    return await prisma.user.create({
        data: {
            email,
            password: hashedPassword,
            profile: {
                create: {
                    operatorName,
                    themeColor: "mono",
                }
            }
        },
    })
  },
    findUserByEmail: async (email: string) => {
        return await prisma.user.findUnique({
            where: { email }

        })
    },
    verifyOperator: async (email:string, password: string) => {
        const user = await prisma.user.findUnique({
            where: { email },
            include: { profile: true }
        });
        if (!user) {
            return null;
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return null;
        }
        const userData={id: user.id, email: user.email, operatorName: user.profile?.operatorName};
        return userData;
    },
    deleteUser: async (userId: string) => {
    return await prisma.user.delete({
      where: { id: userId },
    });
  },

};
