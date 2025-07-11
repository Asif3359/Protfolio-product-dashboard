"use client";
import React from "react";
import {
  Box,
  Typography,
  useTheme,
  useMediaQuery,
  IconButton,
  Container,
} from "@mui/material";
import {
  LinkedIn,
  Twitter,
  YouTube,
  Facebook,
  Email,
  Phone,
} from "@mui/icons-material";
import { motion } from "framer-motion";
import Typewriter from "typewriter-effect";

interface ProfileData {
  profilePicture: string;
  heroTitle: string;
  heroDescription: string;
  bestThreeWords: string[];
  currentJobTitle: string;
  socialMedia?: {
    facebook?: string;
    twitter?: string;
    linkedin?: string;
    youtube?: string;
  };
  contact?: {
    email?: string;
    mobile?: string;
  };
  heroPicture: string;
  aboutMe: string;
  ownerEmail: string;
}

interface HeroSectionProps {
  profileData: ProfileData;
}

const HeroSection: React.FC<HeroSectionProps> = ({ profileData }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  // Add global style for colorful, bold best three words
  // This will be rendered at the top level of the component
  // Use a fixed font size for mobile and desktop
  const bestWordsStyle = `
    .typewriter-best-words {
      font-weight: bold;
      font-size: 2.5rem;
      background: linear-gradient(90deg,rgb(109, 47, 255),rgb(36, 110, 221), #1fa2ff,rgb(250, 188, 18), #a6ffcb);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      text-fill-color: transparent;
      display: inline-block;
      margin-bottom: 1rem;
    }
    @media (max-width: 600px) {
      .typewriter-best-words {
        font-size: 1.5rem;
      }
    }
  `;

  if (!profileData) {
    return <Typography>Error loading profile data</Typography>;
  }

  const {
    // profilePicture,
    heroTitle,
    heroDescription,
    bestThreeWords,
    currentJobTitle,
    socialMedia,
    contact,
    heroPicture,
  } = profileData;

  const heroPic = heroPicture;
  // const profilePic = profilePicture;

  // Set image dimensions based on device

  return (
    <>
      <style jsx global>{bestWordsStyle}</style>
      <Box
        sx={{
          position: "relative",
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          overflow: "hidden",
          "&::before": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundImage: `url(${heroPic})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            opacity: 0.2,
            zIndex: 0,
            filter: "blur(1px) brightness(1.1)",
          },
          "&::after": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background:
              "linear-gradient(to right, rgba(211, 211, 211, 0.12) 0%, rgba(29, 49, 116, 0.32) 100%)",
            zIndex: 0,
          },
        }}
      >
        <Container maxWidth="xl" sx={{ position: "relative", zIndex: 1 }}>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", md: "2fr 1fr" }, // Swapped the columns
              gap: 6,
              alignItems: "center",
              py: 8,
            }}
          >
            {/* Content - now on the left side */}
            <Box>
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
              >
                <Typography
                  variant={isMobile ? "h2" : "h1"}
                  component="h1"
                  gutterBottom
                  sx={{
                    fontWeight: 800,
                    lineHeight: 1.2,
                    color: theme.palette.primary.dark,
                    textShadow: "1px 1px 2px rgba(0,0,0,0.1)",
                  }}
                >
                  {heroTitle}
                </Typography>

                <Typography
                  variant={isMobile ? "h3" : "h2"}
                  color="textSecondary"
                  gutterBottom
                  sx={{
                    fontWeight: 500,
                    mb: 3,
                  }}
                >
                  {currentJobTitle}
                </Typography>

                <Box sx={{ my: 3 }}>
                  <span className="typewriter-best-words">
                    <Typewriter
                      options={{
                        strings: bestThreeWords.map((word: string) =>
                          word.replace(/"/g, "")
                        ),
                        autoStart: true,
                        loop: true,
                        cursor: "|",
                        delay: 50,
                        deleteSpeed: 30,
                      }}
                      onInit={(typewriter) => {
                        typewriter.changeDelay(50).pauseFor(1000).start();
                      }}
                    />
                  </span>
                </Box>

                <Typography
                  paragraph
                  color="textSecondary"
                  sx={{
                    fontSize: isMobile ? "0.8rem" : "1rem", // Increased font size for desktop
                    lineHeight: 1.6,
                    maxWidth: "600px",
                    fontWeight: 300,
                    mb: 4,
                  }}
                >
                  {heroDescription}
                </Typography>

                {/* Social Media Links */}
                <Box
                  sx={{
                    display: "flex",
                    gap: 1,
                    flexWrap: "wrap",
                    "& .MuiIconButton-root": {
                      transition: "all 0.3s ease",
                      "&:hover": {
                        transform: "translateY(-3px)",
                        color: theme.palette.primary.main,
                      },
                    },
                  }}
                >
                  {socialMedia?.linkedin && (
                    <IconButton
                      href={socialMedia.linkedin}
                      target="_blank"
                      sx={{
                        backgroundColor: "rgba(25, 118, 210, 0.1)",
                        "&:hover": {
                          backgroundColor: "rgba(25, 118, 210, 0.2)",
                        },
                      }}
                    >
                      <LinkedIn color="primary" />
                    </IconButton>
                  )}
                  {socialMedia?.twitter && (
                    <IconButton
                      href={socialMedia.twitter}
                      target="_blank"
                      sx={{
                        backgroundColor: "rgba(29, 161, 242, 0.1)",
                        "&:hover": {
                          backgroundColor: "rgba(29, 161, 242, 0.2)",
                        },
                      }}
                    >
                      <Twitter color="primary" />
                    </IconButton>
                  )}
                  {socialMedia?.facebook && (
                    <IconButton
                      href={socialMedia.facebook}
                      target="_blank"
                      sx={{
                        backgroundColor: "rgba(66, 103, 178, 0.1)",
                        "&:hover": {
                          backgroundColor: "rgba(66, 103, 178, 0.2)",
                        },
                      }}
                    >
                      <Facebook color="primary" />
                    </IconButton>
                  )}
                  {socialMedia?.youtube && (
                    <IconButton
                      href={socialMedia.youtube}
                      target="_blank"
                      sx={{
                        backgroundColor: "rgba(255, 0, 0, 0.1)",
                        "&:hover": {
                          backgroundColor: "rgba(255, 0, 0, 0.2)",
                        },
                      }}
                    >
                      <YouTube color="primary" />
                    </IconButton>
                  )}
                  {contact?.email && (
                    <IconButton
                      href={`mailto:${contact.email}`}
                      sx={{
                        backgroundColor: "rgba(0, 0, 0, 0.1)",
                        "&:hover": {
                          backgroundColor: "rgba(0, 0, 0, 0.2)",
                        },
                      }}
                    >
                      <Email color="primary" />
                    </IconButton>
                  )}
                  {contact?.mobile && (
                    <IconButton
                      href={`tel:${contact.mobile}`}
                      sx={{
                        backgroundColor: "rgba(0, 0, 0, 0.1)",
                        "&:hover": {
                          backgroundColor: "rgba(0, 0, 0, 0.2)",
                        },
                      }}
                    >
                      <Phone color="primary" />
                    </IconButton>
                  )}
                </Box>
              </motion.div>
            </Box>

            {/* Profile Image - now on the right side */}
            {/* <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                order: isMobile ? -1 : 1, // Move to top on mobile
                width: "100%",
                height: "100%",
              }}
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5 }}
                whileHover={{ scale: 1.05 }}
              >
                <img
                  src={profilePic}
                  alt="Profile"
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    borderRadius: "10%",
                  }}
                />
              </motion.div>
            </Box> */}
          </Box>
        </Container>
      </Box>
    </>
  );
};

export default HeroSection;
