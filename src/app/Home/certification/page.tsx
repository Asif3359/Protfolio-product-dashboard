import CertificationSection from "@/app/components/CertificationSection";
import HeroSection from "@/app/components/SecondHeroSection";
import { getData } from "@/utils/getData";
import React from "react";

async function CertificationPage() {

  const profileData = await getData("profile");
  const secondHeroTitle = {
    seeroTitle :'About Certification -'
  };

  const certificationsList = await getData("certification");

  const isPage = {
    isItPage: true,
  };
  

  return (
    <div className="min-h-screen bg-base-100">
    <HeroSection profileData={profileData} secondHeroTitle={secondHeroTitle} backgroundImageForProfilePage={profileData.backgroundImageForCertificationsPage}></HeroSection>
    <CertificationSection certificationsTitle="Certifications" certificationsList={certificationsList} isPage={isPage} />
    {/* </Box> */}
  </div>  
  )
}

export default CertificationPage;