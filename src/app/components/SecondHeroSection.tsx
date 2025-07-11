"use client";
import React from "react";
import {
  Box,
  Typography,
  useTheme,
  useMediaQuery,
  // IconButton,
  Container,
} from "@mui/material";
import {
  // LinkedIn,
  // Twitter,
  // YouTube,
  // Facebook,
  // Email,
  // Phone,
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
interface secondHeroTitle{
  seeroTitle:string;
}

interface HeroSectionProps {
  profileData: ProfileData;
  secondHeroTitle:secondHeroTitle;
}

const HeroSection: React.FC<HeroSectionProps> = ({ profileData, secondHeroTitle:secondHeroTitle }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  // Add global style for colorful, bold best three words
  // This will be rendered at the top level of the component
  // Use a fixed font size for mobile and desktop
  const bestWordsStyle = `
    .typewriter-best-words {
      font-weight: bold;
      font-size: 2rem;
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
    // heroTitle,
    // heroDescription,
    bestThreeWords,
    // currentJobTitle,
    // socialMedia,
    // contact,
    heroPicture,
  } = profileData;

  const {
  seeroTitle
  } = secondHeroTitle;

  const heroPic = heroPicture;
//   const profilePic = `https://protfolio-product-backend.vercel.app${profilePicture}`;

  // Set image dimensions based on device

  return (
    <>
      <style jsx global>{bestWordsStyle}</style>
      <Box
        sx={{
          position: "relative",
          minHeight: "45vh",
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
                  variant={isMobile ? "h1" : "h1"}
                  component="h1"
                  gutterBottom
                  sx={{
                    fontSize:'2.5rem',
                    fontWeight: 800,
                    lineHeight: 1,
                    color: theme.palette.primary.dark,
                    textShadow: "1px 1px 2px rgba(0,0,0,0.1)",
                  }}
                >
                 {seeroTitle}
                </Typography>

                <Box sx={{ my: 3, ml:5 }}>
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

              </motion.div>
            </Box>
          </Box>
        </Container>
      </Box>
    </>
  );
};

export default HeroSection;
