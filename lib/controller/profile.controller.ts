import { NextResponse } from "next/server";
import { ProfileService } from "../service/profile.service";

export const ProfileController = {
  async updateProfile(request: Request, userId: string) {
    try {
    
      const { operatorName, themeColor } = await request.json();
      if (!userId) {
        return NextResponse.json({ error: "Missing userId" }, { status: 400 });
      }
      if (!operatorName) {
        return NextResponse.json(
          { error: "Missing operatorName" },
          { status: 400 },
        );
      }
      if (!themeColor) {
        return NextResponse.json(
          { error: "Missing themeColor" },
          { status: 400 },
        );
      }
      const updatedProfile = await ProfileService.updateProfile(userId, {
        operatorName,
        themeColor,
      });
      return NextResponse.json(updatedProfile, { status: 200 });
    } catch (error) {
      console.error("Error updating profile:", error);
      return NextResponse.json(
        { error: "Failed to update profile" },
        { status: 500 },
      );
    }
  },
  async getProfile(request: Request, userId: string) {
    try {
   
      if (!userId) {
        return NextResponse.json({ error: "Missing userId" }, { status: 400 });
      }
      const profile = await ProfileService.getProfile(userId);
      if (!profile) {
        return NextResponse.json(
          { error: "Profile not found" },
          { status: 404 },
        );
      }
      return NextResponse.json(profile, { status: 200 });
    } catch (error) {
      console.error("Error fetching profile:", error);
      return NextResponse.json(
        { error: "Failed to fetch profile" },
        { status: 500 },
      );
    }
  },
    async getAllProfiles() {
        try{
            const profiles = await ProfileService.getAllProfiles();
            return NextResponse.json(profiles, { status: 200 });
        }catch (error) {
            console.error("Error fetching profiles:", error);
            return NextResponse.json(
                { error: "Failed to fetch profiles" },
                { status: 500 },
            );
        }
    },
    async getProfileByOperatorName(request: Request) {
        try {
            const {operatorName} = await request.json();
            if (!operatorName) {
                return NextResponse.json(
                    { error: "Missing operatorName" },
                    { status: 400 },
                );
            }
            const profile = await ProfileService.getProfileByOperatorName(operatorName);
            if (!profile) {
                return NextResponse.json(
                    { error: "Profile not found" },
                    { status: 404 },
                );
            }
            return NextResponse.json(profile, { status: 200 });
        } catch (error) {
            console.error("Error fetching profile by operator name:", error);
            return NextResponse.json(
                { error: "Failed to fetch profile" },
                { status: 500 },
            );
        }
    }

};
