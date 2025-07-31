"use client";
import React from "react";
import {
  Box,
  Typography,
  Divider,
  Stack,
  Chip,
  useTheme,
  Container,
  Button,
  IconButton,
  Tooltip,
} from "@mui/material";
import {
  Email,
  // Phone,
  LinkedIn,
  Twitter,
  ExpandMore,
  Facebook,
  YouTube,
  InsertDriveFile,
} from "@mui/icons-material";
import { motion } from "framer-motion";
import Image from "next/image";
import { useRouter } from "next/navigation";

interface ProfileData {
  name: string;
  aboutMe: string;
  profilePicture: string;
  heroTitle: string;
  contact?: {
    email?: string;
    mobile?: string;
    cvLink?: string;
  };
  socialMedia?: {
    linkedin?: string;
    twitter?: string;
    facebook?: string;
    youtube?: string;
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

  const { name, aboutMe, profilePicture, contact, socialMedia } =
    profileData;
  const profilePic = profilePicture;

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
              {/* <Typography
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
              </Typography> */}

              <Divider
                sx={{
                  width: "100%",
                  my: 2,
                  borderColor: theme.palette.primary.light,
                  opacity: 0.5,
                }}
              />

              {/* Contact Info */}
              <Box
                sx={{
                  width: "100%",
                  display: "grid",
                  gridTemplateColumns: {
                    xs: "1fr",
                    sm: "1fr",
                    md: "1fr",
                  },
                  gap: 1,
                  justifyItems: "center",
                  alignItems: "center",
                  mt: 1,
                }}
              >
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
                      width: "100%",
                      maxWidth: "100%",
                      overflow: "hidden",
                      "& .MuiChip-label": {
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      },
                      "& .MuiChip-icon": {
                        color: theme.palette.primary.contrastText,
                      },
                    }}
                  />
                )}
                {/* {contact?.mobile && (
                  <Chip
                    icon={<Phone fontSize="small" />}
                    label={contact.mobile}
                    sx={{
                      justifyContent: "flex-start",
                      borderRadius: 2,
                      bgcolor: "rgba(255,255,255,0.08)",
                      color: theme.palette.primary.contrastText,
                      height: 40,
                      width: "100%",
                      maxWidth: "100%",
                      "& .MuiChip-icon": {
                        color: theme.palette.primary.contrastText,
                      },
                    }}
                  />
                )} */}
                {contact?.cvLink && (
                  <Tooltip title="CV" arrow>
                    <Chip
                      component="a"
                      href={contact.cvLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ cursor: "pointer" }}
                      icon={<InsertDriveFile fontSize="small" />}
                      label="View my CV"
                      sx={{
                        justifyContent: "flex-start",
                        borderRadius: 2,
                        bgcolor: "rgba(255,255,255,0.08)",
                        color: theme.palette.primary.contrastText,
                        height: 40,
                        width: "100%",
                        maxWidth: "100%",
                        "& .MuiChip-icon": {
                          color: theme.palette.primary.contrastText,
                        },
                      }}
                    />
                  </Tooltip>
                )}
              </Box>
              <Divider
                sx={{
                  width: "100%",
                  my: 2,
                  borderColor: theme.palette.primary.light,
                  opacity: 0.5,
                }}
              />
              {/* Social Links */}
              <Box
                sx={{
                  width: "100%",
                  display: "grid",
                  gridTemplateColumns: {
                    xs: "1fr 1fr 1fr 1fr",
                    sm: "1fr 1fr 1fr 1fr",
                    md: "1fr 1fr 1fr 1fr",
                  },
                  gap: 1,
                  justifyItems: "center",
                  alignItems: "center",
                  mt: 1,
                }}
              >
                {socialMedia?.linkedin && (
                  <IconButton
                    component="a"
                    href={socialMedia.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ cursor: "pointer" }}
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
                      "& .MuiChip-icon": {
                        color: theme.palette.primary.contrastText,
                      },
                    }}
                  >
                    <LinkedIn fontSize="small" />
                  </IconButton>
                )}
                {socialMedia?.facebook && (
                  <IconButton
                    component="a"
                    href={socialMedia.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ cursor: "pointer" }}
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
                      "& .MuiChip-icon": {
                        color: theme.palette.primary.contrastText,
                      },
                    }}
                  >
                    <Facebook fontSize="small" />
                  </IconButton>
                )}
                {socialMedia?.twitter && (
                  <IconButton
                    component="a"
                    href={socialMedia.twitter}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ cursor: "pointer" }}
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
                      "& .MuiChip-icon": {
                        color: theme.palette.primary.contrastText,
                      },
                    }}
                  >
                    <Twitter fontSize="small" />
                  </IconButton>
                )}
                {socialMedia?.youtube && (
                  <IconButton
                    component="a"
                    href={socialMedia.youtube}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ cursor: "pointer" }}
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
                      "& .MuiChip-icon": {
                        color: theme.palette.primary.contrastText,
                      },
                    }}
                  >
                    <YouTube fontSize="small" />
                  </IconButton>
                )}
              </Box>
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
                        whiteSpace: "pre-line",
                        wordBreak: "break-word",
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
