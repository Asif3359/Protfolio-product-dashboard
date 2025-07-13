import ExperienceSection from "@/app/components/ExperienceSection";
import HeroSection from "@/app/components/SecondHeroSection";
import { getData } from "@/utils/getData";
import React from "react";

async function ExperiencePage() {

  const profileData = await getData("profile");
  const experienceJobs = await getData("experience");

  const secondHeroTitle = {
    seeroTitle :'About Experience -'
  };
  const isPage ={
    isItPage:true
  };
  

  return (
    <div className="min-h-screen bg-base-100">
    <HeroSection profileData={profileData} secondHeroTitle={secondHeroTitle} backgroundImageForProfilePage={profileData.backgroundImageForExperiencePage}></HeroSection>
    <ExperienceSection experienceTitle="Experience" experienceJobs={experienceJobs} isPage={isPage} />
    {/* </Box> */}
  </div>  
  )
}

export default ExperiencePage;