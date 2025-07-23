import AboutSection from "@/app/components/SecondAboutSection";
import HeroSection from "@/app/components/SecondHeroSection";
import { getData } from "@/utils/getData";
import React from "react";

async function ProfilePage() {
  const profileData = await getData("profile");
  const secondHeroTitle = {
    seeroTitle :'About Me'
  };
  
  // Add null checking for profileData
  if (!profileData) {
    return (
      <div className="min-h-screen bg-base-100 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-700 mb-4">Loading...</h1>
          <p className="text-gray-500">Unable to load profile data</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-base-100">
      <HeroSection 
        profileData={profileData} 
        secondHeroTitle={secondHeroTitle} 
        backgroundImageForProfilePage={profileData?.backgroundImageForProfilePage || ''} 
      />
      {/* <Box className="container mx-auto" sx={{ position: "absolute" }}> */}
        <AboutSection profileData={profileData} />
      {/* </Box> */}
    </div>
  );
}

export default ProfilePage;

