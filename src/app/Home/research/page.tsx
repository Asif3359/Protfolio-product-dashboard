import ResearchSection from "@/app/components/ResearchSection";
import HeroSection from "@/app/components/SecondHeroSection";
import { getData } from "@/utils/getData";
import React from "react";

async function ResearchPage() {

  const profileData = await getData("profile");
  const secondHeroTitle = {
    seeroTitle :'About Research -'
  };

  const researchData = await getData("research");

  const isPage = {
    isItPage: true,
  };

  return (
    <div className="min-h-screen bg-base-100">
    <HeroSection profileData={profileData} secondHeroTitle={secondHeroTitle}></HeroSection>
    <ResearchSection researchDataTitle="Research" researchList={researchData} isPage={isPage} />
    {/* </Box> */}
  </div>  
  )
}


export default ResearchPage;