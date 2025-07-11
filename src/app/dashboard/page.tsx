import ProtectedRoute from "@/components/ProtectedRoute";
import { getData } from "@/utils/getData";
import { Box, Typography, Avatar, Card } from "@mui/material";
import WorkIcon from "@mui/icons-material/Work";
import FolderIcon from "@mui/icons-material/Folder";
import StarIcon from "@mui/icons-material/Star";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import VerifiedIcon from "@mui/icons-material/Verified";
import ScienceIcon from "@mui/icons-material/Science";
import SchoolIcon from "@mui/icons-material/School";
import StatCard from "@/app/components/StatCard";

export default async function Home() {
  const profileData = await getData("profile");
  const experienceJobs = await getData("experience");
  const projectsDataList = await getData("project");
  const skillTechnical = await getData("skill");
  const awardsList = await getData("award");
  const certificationsList = await getData("certification");
  const researchList = await getData("research");
  const academicsEducations = await getData("academic");

  const getCount = (data: unknown[]): number =>
    Array.isArray(data) ? data.length : 0;
  const getFirst = (data: unknown[], key: string): string =>
    Array.isArray(data) &&
    data.length > 0 &&
    typeof data[0] === "object" &&
    data[0] !== null &&
    key in data[0]
      ? String((data[0] as Record<string, unknown>)[key])
      : "-";

  const stats = [
    {
      icon: <WorkIcon sx={{ fontSize: 32 }} color="primary" />,
      count: getCount(experienceJobs),
      title: "Experience",
      subtitle: getFirst(experienceJobs, "title"),
      color: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    },
    {
      icon: <FolderIcon sx={{ fontSize: 32 }} color="primary" />,
      count: getCount(projectsDataList),
      title: "Projects",
      subtitle: getFirst(projectsDataList, "title"),
      color: "linear-gradient(135deg, #11998e 0%, #38ef7d 100%)",
    },
    {
      icon: <StarIcon sx={{ fontSize: 32 }} color="primary" />,
      count: getCount(skillTechnical),
      title: "Skills",
      subtitle: getFirst(skillTechnical, "name"),
      color: "linear-gradient(135deg, #f46b45 0%, #eea849 100%)",
    },
    {
      icon: <EmojiEventsIcon sx={{ fontSize: 32 }} color="primary" />,
      count: getCount(awardsList),
      title: "Awards",
      subtitle: getFirst(awardsList, "title"),
      color: "linear-gradient(135deg, #4776E6 0%, #8E54E9 100%)",
    },
    {
      icon: <VerifiedIcon sx={{ fontSize: 32 }} color="primary" />,
      count: getCount(certificationsList),
      title: "Certifications",
      subtitle: getFirst(certificationsList, "title"),
      color: "linear-gradient(135deg, #DA22FF 0%, #9733EE 100%)",
    },
    {
      icon: <ScienceIcon sx={{ fontSize: 32 }} color="primary" />,
      count: getCount(researchList),
      title: "Research",
      subtitle: getFirst(researchList, "title"),
      color: "linear-gradient(135deg, #1FA2FF 0%, #12D8FA 100%)",
    },
    {
      icon: <SchoolIcon sx={{ fontSize: 32 }} color="primary" />,
      count: getCount(academicsEducations),
      title: "Academics",
      subtitle: getFirst(academicsEducations, "degree"),
      color: "linear-gradient(135deg, #FF512F 0%, #DD2476 100%)",
    },
  ];

  return (
    <ProtectedRoute>
      <Box
        sx={{
          p: { xs: 2, sm: 3, md: 4 },
          width: "100%",
          mx: "auto",
          minHeight: "100vh",
        }}
      >
        {/* Welcome Card */}
        <Card
          sx={{
            display: { xs: "block", sm: "flex" },
            alignItems: { xs: "center", sm: "center" },
            flexDirection: { xs: "column", sm: "row" },
            justifyContent: { xs: "center", sm: "center" },
            p: 4,
            mb: 4,
            borderRadius: "16px",
            background: "linear-gradient(135deg, #3a7bd5 0%, #00d2ff 100%)",
            color: "#fff",
            boxShadow: 3,
            width: "100%",
          }}
        >
          <Avatar
            src={profileData?.profilePicture}
            alt={profileData?.name}
            sx={{
              width: 90,
              height: 90,
              mr: 3,
              border: "3px solid rgba(255,255,255,0.3)",
            }}
          />
          <Box>
            <Typography
              variant="h4"
              fontWeight={700}
              sx={{ fontSize: { xs: "1.5rem", sm: "2rem" }, lineHeight: 1.2 }}
            >
              Welcome Back,{" "}
              <span style={{ fontWeight: 800, wordWrap: "break-word", wordBreak: "break-all", overflowWrap: "break-word", whiteSpace: "normal" }}>{profileData?.name}</span>
            </Typography>
            <Typography
              variant="subtitle1"
              sx={{
                opacity: 0.9,
                fontSize: { xs: "0.9rem", sm: "1.1rem" },
                mt: 0.5,
              }}
            >
              {profileData?.currentJobTitle}
            </Typography>
          </Box>
        </Card>

        {/* Stats Grid */}
        {/* Stats Grid */}
        <Box
          sx={{
            width: "100%",
            display: "grid",
            gridTemplateColumns: {
              xs: "repeat(1, 1fr)",
              sm: "repeat(1, 1fr)",
              md: "repeat(3, 1fr)",
              lg: "repeat(3, 1fr)",
            },
            gap: 3,
            mt: 4,
          }}
        >
          {stats.map((stat, index) => (
            <StatCard key={index} {...stat} />
          ))}
        </Box>
      </Box>
    </ProtectedRoute>
  );
}
