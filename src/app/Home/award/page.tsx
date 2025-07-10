import AwardsSection from "@/app/components/AwardsSection";
import HeroSection from "@/app/components/SecondHeroSection";
import { getData } from "@/utils/getData";
import React from "react";

async function AwardPage() {

  const profileData = await getData("profile");
  const secondHeroTitle = {
    seeroTitle :'About Awards -'
  };

  const awardsList = await getData("award");

  const isPage = {
    isItPage: true,
  };
  

  return (
    <div className="min-h-screen bg-base-100">
    <HeroSection profileData={profileData} secondHeroTitle={secondHeroTitle}></HeroSection>
    <AwardsSection title="Awards" list={awardsList} isPage={isPage} />
    {/* </Box> */}
  </div>  
  )
}

export default AwardPage;