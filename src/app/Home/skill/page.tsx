import HeroSection from "@/app/components/SecondHeroSection";
import SkillsSection from "@/app/components/SkillsSection";
import { getData } from "@/utils/getData";
import React from "react";

async function SkillPage() {

  const profileData = await getData("profile");
  const skillTechnical = await getData("skill");
  const secondHeroTitle = {
    seeroTitle :'About Skills -'
  };
  const isPage ={
    isItPage:true
  };

  

  return (
    <div className="min-h-screen bg-base-100">
    <HeroSection profileData={profileData} secondHeroTitle={secondHeroTitle}></HeroSection>
    <SkillsSection skillTitle="Skills" skillTechnical={skillTechnical} isPage={isPage} />
    {/* </Box> */}
  </div>  
  )
}

export default SkillPage;