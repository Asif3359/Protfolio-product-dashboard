import HeroSection from "@/app/components/SecondHeroSection";
import SkillsSection from "@/app/components/SkillsSection";
import { getData } from "@/utils/getData";
import React from "react";

async function SkillPage() {

  const profileData = await getData("profile");
  const skillTechnical = await getData("skill");
  const secondHeroTitle = {
    seeroTitle :'About Skills'
  };
  const isPage ={
    isItPage:true
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
      backgroundImageForProfilePage={profileData?.backgroundImageForSkillsPage || ''} 
    />
    <SkillsSection skillTitle="Skills" skillTechnical={skillTechnical} isPage={isPage} />
    {/* </Box> */}
  </div>  
  )
}

export default SkillPage;