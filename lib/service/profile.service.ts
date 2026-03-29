import { prisma } from "@/lib/prisma";

export const ProfileService = {
    
  updateProfile: async (userId: string, data: { operatorName?: string; themeColor?: string },) => {
    return await prisma.profile.update({
      where: { userId },
      data: {
        operatorName: data.operatorName,
        themeColor: data.themeColor,
      },
    });
  },
  getProfile: async (userId: string) => {
    return await prisma.profile.findUnique({
      where: { userId },
    });
  },

  getAllProfiles: async () => {
    return await prisma.profile.findMany({
      orderBy: { operatorName: "asc" },
    });
  },
  getProfileByOperatorName: async (operatorName: string) => {
    return await prisma.profile.findUnique({
      where: { operatorName },
    });
  },
};
