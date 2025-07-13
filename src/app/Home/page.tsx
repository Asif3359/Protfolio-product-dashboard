import { getData } from "@/utils/getData";
import AcademicsSection from "@/app/components/AcademicsSection";
import AwardsSection from "@/app/components/AwardsSection";
import ExperienceSection from "@/app/components/ExperienceSection";
import HeroSection from "@/app/components/HeroSection";
import ProjectsSection from "@/app/components/ProjectsSection";
import SkillsSection from "@/app/components/SkillsSection";
import AboutSection from "@/app/components/AboutSection";
import CertificationSection from "@/app/components/CertificationSection";
import ResearchSection from "@/app/components/ResearchSection";

export default async function Home() {
  // Profile
  const profileData = await getData("profile");

  // Academics
  const academicsEducations = await getData("academic");

  // Experience
  const experienceJobs = await getData("experience");

  // Projects
  const projectsDataList = await getData("project");

  // Skills
  const skillTechnical = await getData("skill");

  // Awards
  const awardsList = await getData("award");

  // Certifications
  const certificationsList = await getData("certification");

  // Research
  const researchData = await getData("research");

  const isPage ={
    isItPage:false
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
      <HeroSection profileData={profileData} />
      <section className="container mx-auto">
        <AboutSection profileData={profileData} />
        <AcademicsSection academicsTitle="Academics" academicsEducations={academicsEducations} isPage={isPage} />
        <ResearchSection researchDataTitle="Research" researchList={researchData} isPage={isPage} />
        <ExperienceSection experienceTitle="Experience" experienceJobs={experienceJobs} isPage={isPage} />
        <ProjectsSection projectsDataTitle="Projects" projectsDataList={projectsDataList} isPage={isPage} />
        <CertificationSection certificationsTitle="Certifications" certificationsList={certificationsList} isPage={isPage} />
        <AwardsSection title="Awards" list={awardsList} isPage={isPage} />
        <SkillsSection skillTitle="Skills" skillTechnical={skillTechnical} isPage={isPage} />
      </section>
    </div>
  );
}