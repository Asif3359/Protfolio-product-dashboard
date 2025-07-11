"use client";
import React from "react";
import {
  Box,
  Typography,
  Divider,
  Stack,
  Chip,
  IconButton,
  useTheme,
  Container,
  Button,
} from "@mui/material";
import {
  Email,
  Phone,
  LinkedIn,
  Twitter,
  GitHub,
  ExpandMore,
} from "@mui/icons-material";
import { motion } from "framer-motion";
import Image from "next/image";
import { useRouter } from 'next/navigation';

interface ProfileData {
  name: string;
  aboutMe: string;
  profilePicture: string;
  heroTitle: string;
  contact?: {
    email?: string;
    mobile?: string;
  };
  socialMedia?: {
    linkedin?: string;
    twitter?: string;
    github?: string;
  };
}

const AboutSection: React.FC<{ profileData: ProfileData }> = ({
  profileData,
}) => {
  const theme = useTheme();
  const router = useRouter();

  if (!profileData?.aboutMe) {
    return null;
  }

  const { name, aboutMe, profilePicture, heroTitle, contact, socialMedia } =
    profileData;
  const profilePic = `http://localhost:3000${profilePicture}`;

  return (
    <Box
      component="section"
      sx={{
        py: { xs: 6, md: 10 },
        background: theme.palette.primary.dark,
        position: "relative",
        overflow: "hidden",
        marginTop: 4,
      }}
    >
      <Container maxWidth="xl" sx={{ px: { xs: 3, sm: 4 } }}>
        <Stack
          direction={{ xs: "column", md: "row" }}
          spacing={{ xs: 4, md: 8 }}
          alignItems={{ xs: "center", md: "flex-start" }}
          justifyContent="space-between"
        >
          {/* Profile Info - Left Side */}
          <Box
            sx={{
              width: { xs: "100%", md: 280 },
              position: { md: "sticky" },
              top: { md: 120 },
              flexShrink: 0,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true, margin: "-100px" }}
            >
              {/* Profile Image */}
              <Box
                sx={{
                  position: "relative",
                  width: { xs: 120, sm: 140, md: 160 },
                  height: { xs: 120, sm: 140, md: 160 },
                  mx: "auto",
                  mb: 3,
                  borderRadius: "50%",
                  overflow: "hidden",
                  border: `3px solid ${theme.palette.primary.main}`,
                  boxShadow: theme.shadows[4],
                }}
              >
                <Image
                  src={profilePic}
                  alt="Profile"
                  fill
                  sizes="(max-width: 600px) 120px, (max-width: 900px) 140px, 160px"
                  style={{
                    objectFit: "cover",
                    objectPosition: "center",
                  }}
                  priority
                />
              </Box>

              {/* Name */}
              <Typography
                variant="h5"
                sx={{
                  fontWeight: 700,
                  mb: 2,
                  color: theme.palette.primary.contrastText,
                  fontSize: { xs: "1.25rem", sm: "1.5rem" },
                  textAlign: "center",
                  lineHeight: 1.2,
                }}
              >
                {name}
              </Typography>
              {/* Name */}
              <Typography
                variant="h5"
                sx={{
                  fontWeight: 700,
                  mb: 2,
                  color: theme.palette.primary.contrastText,
                  fontSize: { xs: "0.8rem", sm: "1rem" },
                  textAlign: "center",
                  lineHeight: 1.2,
                }}
              >
                {heroTitle}
              </Typography>

              <Divider
                sx={{
                  width: "80%",
                  my: 2,
                  borderColor: theme.palette.primary.light,
                  opacity: 0.5,
                }}
              />

              {/* Contact Info */}
              <Stack spacing={1.5} sx={{ width: "100%", mb: 3 }}>
                {contact?.email && (
                  <Chip
                    icon={<Email fontSize="small" />}
                    label={contact.email}
                    sx={{
                      justifyContent: "flex-start",
                      borderRadius: 2,
                      bgcolor: "rgba(255,255,255,0.08)",
                      color: theme.palette.primary.contrastText,
                      height: 40,
                      maxWidth: "100%",
                      overflow: "hidden",
                      "& .MuiChip-label": {
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      },
                    }}
                  />
                )}
                {contact?.mobile && (
                  <Chip
                    icon={<Phone fontSize="small" />}
                    label={contact.mobile}
                    sx={{
                      justifyContent: "flex-start",
                      borderRadius: 2,
                      bgcolor: "rgba(255,255,255,0.08)",
                      color: theme.palette.primary.contrastText,
                      height: 40,
                      maxWidth: "100%",
                    }}
                  />
                )}
              </Stack>

              {/* Social Links */}
              <Stack
                direction="row"
                spacing={1}
                justifyContent="center"
                sx={{
                  width: "100%",
                  flexWrap: "wrap",
                }}
              >
                {socialMedia?.linkedin && (
                  <IconButton
                    href={socialMedia.linkedin}
                    target="_blank"
                    size="medium"
                    sx={{
                      bgcolor: "rgba(255,255,255,0.08)",
                      color: theme.palette.primary.contrastText,
                      "&:hover": {
                        bgcolor: theme.palette.primary.light,
                        color: theme.palette.primary.dark,
                      },
                      transition: theme.transitions.create([
                        "background-color",
                        "color",
                      ]),
                    }}
                  >
                    <LinkedIn fontSize="small" />
                  </IconButton>
                )}
                {socialMedia?.twitter && (
                  <IconButton
                    href={socialMedia.twitter}
                    target="_blank"
                    size="medium"
                    sx={{
                      bgcolor: "rgba(255,255,255,0.08)",
                      color: theme.palette.primary.contrastText,
                      "&:hover": {
                        bgcolor: theme.palette.primary.light,
                        color: theme.palette.primary.dark,
                      },
                      transition: theme.transitions.create([
                        "background-color",
                        "color",
                      ]),
                    }}
                  >
                    <Twitter fontSize="small" />
                  </IconButton>
                )}
                {socialMedia?.github && (
                  <IconButton
                    href={socialMedia.github}
                    target="_blank"
                    size="medium"
                    sx={{
                      bgcolor: "rgba(255,255,255,0.08)",
                      color: theme.palette.primary.contrastText,
                      "&:hover": {
                        bgcolor: theme.palette.primary.light,
                        color: theme.palette.primary.dark,
                      },
                      transition: theme.transitions.create([
                        "background-color",
                        "color",
                      ]),
                    }}
                  >
                    <GitHub fontSize="small" />
                  </IconButton>
                )}
              </Stack>
            </motion.div>
          </Box>
          {/* Vertical Divider for desktop */}
          <Divider
            orientation="vertical"
            flexItem
            sx={{
              display: { xs: "none", md: "block" },
              mx: 2,
              borderColor: theme.palette.primary.light,
              minHeight: 320,
              alignSelf: "stretch",
              opacity: 0.3,
            }}
          />
          {/* About Content - Right Side */}
          <Box
            sx={{
              flex: 1,
              minWidth: 0,
              maxWidth: { md: "calc(100% - 300px)" },
            }}
          >
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              viewport={{ once: true, margin: "-100px" }}
            >
              <Box>
                <Typography
                  variant="h4"
                  sx={{
                    fontWeight: 700,
                    color: theme.palette.primary.contrastText,
                    mb: 3,
                    fontSize: { xs: "1.5rem", sm: "1.75rem", md: "2rem" },
                    lineHeight: 1.2,
                  }}
                >
                  About Me
                </Typography>
                <Divider
                  sx={{
                    mb: 4,
                    borderColor: theme.palette.primary.light,
                    width: { xs: "100%", sm: "80%" },
                  }}
                />
                <Typography
                  component="div"
                  sx={{
                    color: theme.palette.grey[200],
                    lineHeight: 1.7,
                    fontSize: { xs: "1rem", sm: "1.05rem", md: "1.1rem" },
                    "& p": {
                      mb: 3,
                      "&:last-child": {
                        mb: 0,
                      },
                    },
                  }}
                >
                  {aboutMe.split("\n\n").map((paragraph, index) => (
                    <Typography
                      component="p"
                      key={index}
                      sx={{
                        mb: 3,
                        color: theme.palette.grey[100],
                        "&:last-child": {
                          mb: 0,
                        },
                      }}
                    >
                      {paragraph}
                    </Typography>
                  ))}
                </Typography>
                <Box sx={{ display: "flex", justifyContent: "end", mt: 6 }}>
                  <Button
                    variant="outlined"
                    endIcon={<ExpandMore />}
                    onClick={() => router.push("/Home/profile")}
                    sx={{
                      borderRadius: 50,
                      textTransform: "none",
                      fontWeight: 600,
                      fontSize: "1rem",
                    }}
                  >
                    <Typography
                      component="p"
                      sx={{
                        color: theme.palette.grey[100],
                      }}
                    >
                     See more
                    </Typography>
                  </Button>
                </Box>
              </Box>
            </motion.div>
          </Box>
        </Stack>
      </Container>
    </Box>
  );
};

export default AboutSection;
