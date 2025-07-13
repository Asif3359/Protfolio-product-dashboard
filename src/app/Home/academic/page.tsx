import AcademicsSection from "@/app/components/AcademicsSection";
import HeroSection from "@/app/components/SecondHeroSection";
import { getData } from "@/utils/getData";
import React from "react";

async function AcademicPage() {

  const profileData = await getData("profile");
  const secondHeroTitle = {
    seeroTitle :'About Educations -'
  };

  const academicsEducations = await getData("academic");

  const isPage = {
    isItPage: true,
  };
  

  return (
    <div className="min-h-screen bg-base-100">
    <HeroSection profileData={profileData} secondHeroTitle={secondHeroTitle} backgroundImageForProfilePage={profileData.backgroundImageForEducationPage}></HeroSection>
    <AcademicsSection academicsTitle="Academics" academicsEducations={academicsEducations} isPage={isPage} />
    {/* </Box> */}
  </div>  
  )
}

export default AcademicPage;