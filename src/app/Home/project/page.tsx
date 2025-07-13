import ProjectsSection from "@/app/components/ProjectsSection";
import HeroSection from "@/app/components/SecondHeroSection";
import { getData } from "@/utils/getData";
import React from "react";

async function ProjectPage() {

  const profileData = await getData("profile");
  const projectsDataList = await getData("project");
  const secondHeroTitle = {
    seeroTitle :'About Project -'
  };
  const isPage ={
    isItPage:true
  };
  

  return (
    <div className="min-h-screen bg-base-100">
    <HeroSection profileData={profileData} secondHeroTitle={secondHeroTitle} backgroundImageForProfilePage={profileData.backgroundImageForProjectsPage}></HeroSection>
    <ProjectsSection projectsDataTitle="Projects" projectsDataList={projectsDataList} isPage={isPage} />
    {/* </Box> */}
  </div>  
  )
}

export default ProjectPage;