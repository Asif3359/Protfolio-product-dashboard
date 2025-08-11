"use client";
import React, { useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Divider,
  Chip,
  Button,
  useTheme,
  Container,
  CardMedia,
} from "@mui/material";
import {
  // School,
  CalendarToday,
  Grade,
  ExpandMore,
  ArrowForward,
} from "@mui/icons-material";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

interface Education {
  _id: string;
  degree: string;
  institution: string;
  field: string;
  startDate: string;
  endDate: string;
  description: string;
  achievements?: string[];
  gpa?: number;
  outOf?: number;
  logo?: string;
}

interface AcademicsSectionProps {
  academicsTitle?: string;
  academicsEducations: Education[];
  isPage: {
    isItPage: boolean;
  };
}

const AcademicsSection: React.FC<AcademicsSectionProps> = ({
  academicsTitle = "Education",
  academicsEducations = [],
  isPage,
}) => {
  const [showAll] = useState(false);
  const theme = useTheme();
  const router = useRouter();

  if (!academicsEducations?.length) {
    return null;
  }

  const visibleEducations = showAll
    ? academicsEducations
    : isPage.isItPage ? academicsEducations : academicsEducations.slice(0, 2);
  const hasMore = academicsEducations.length > 2;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
    });
  };

  return (
    <Box
      component="section"
      sx={{
        py: { xs: 2, md: 4 },
        backgroundColor: theme.palette.background.default,
      }}
    >
      <Container maxWidth="xl" sx={{ maxWidth: "1200px" }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true, margin: "-50px" }}
        >
          {isPage.isItPage ? (
            <></>
          ) : (
            <Typography
              variant="h3"
              sx={{
                fontWeight: 800,
                mb: 2,
                color: theme.palette.text.primary,
                fontSize: { xs: "2rem", md: "2.8rem" },
                textAlign: "center",
                background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                textShadow: "0 2px 4px rgba(0,0,0,0.1)",
                position: "relative",
                "&::after": {
                  content: '""',
                  display: "block",
                  width: "200px",
                  height: "4px",
                  background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                  margin: "16px auto 0",
                  borderRadius: "2px",
                },
              }}
            >
              {academicsTitle}
            </Typography>
          )}

          {isPage.isItPage ? (
            <></>
          ) : (
            <Divider sx={{ mb: 6, borderColor: theme.palette.divider }} />
          )}

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                sm: "repeat(1, 1fr)",
                md: "repeat(2, 1fr)",
                lg: "repeat(2, 1fr)",
              },
              gap: { xs: 3, sm: 4, md: 4 },
              width: "100%",
            }}
          >
            {visibleEducations.map((education, index) => (
              <motion.div
                key={education._id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true, margin: "-50px" }}
                style={{ width: "100%" }}
              >
                <Paper
                  elevation={2}
                  sx={{
                    p: { xs: 2.5, sm: 3, md: 3.5 },
                    borderRadius: 3,
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    background: theme.palette.background.paper,
                    transition: "transform 0.3s ease, box-shadow 0.3s ease",
                    "&:hover": {
                      transform: "translateY(-5px)",
                      boxShadow: theme.shadows[6],
                    },
                  }}
                >
                  <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
                    <CardMedia
                      component="img"
                      image={education.logo}
                      alt={education.institution}
                      sx={{ width: 40, height: 40, objectFit: "contain", borderRadius: 2, marginRight: 2, cursor: "pointer", "&:hover": { transform: "scale(1.05)" } }}
                      onClick={() => router.push(`/Home/academic/${education._id}`)}
                    />
                    <Box sx={{ minWidth: 0, flex: 1 }}>
                      <Typography
                        variant="h5"
                        sx={{
                          fontWeight: 700,
                          lineHeight: 1.2,
                          color: theme.palette.text.primary,
                          fontSize: { xs: "1.2rem", md: "1.4rem" },
                          wordBreak: "break-word",
                          cursor: "pointer",
                          "&:hover": {
                            color: theme.palette.primary.main,
                          },
                        }}
                        onClick={() => router.push(`/Home/academic/${education._id}`)}
                      >
                        {education.institution}
                      </Typography>
                      <Typography
                        variant="subtitle1"
                        sx={{
                          fontWeight: 600,
                          color: theme.palette.primary.main,
                          fontSize: { xs: "1rem", md: "1.1rem" },
                          wordBreak: "break-word",
                        }}
                      >
                        <span>{education.degree}</span> in <span>{education.field}</span>
                      </Typography>
                      {/* <Typography
                        variant="body2"
                        sx={{
                          color: theme.palette.text.secondary,
                          mt: 0.5,
                          wordBreak: "break-word",
                        }}
                      >
                        
                      </Typography> */}
                    </Box>
                  </Box>

                  <Box
                    sx={{
                      display: "flex",
                      flexWrap: "wrap",
                      gap: 1.5,
                      mb: 3,
                      mt: 1,
                    }}
                  >
                    <Chip
                      icon={<CalendarToday fontSize="small" />}
                      label={`${formatDate(education.startDate)} - ${education.endDate
                        ? formatDate(education.endDate)
                        : "Present"
                        }`}
                      size="small"
                      sx={{
                        bgcolor: theme.palette.action.selected,
                        color: theme.palette.text.primary,
                        fontSize: { xs: "0.75rem", sm: "0.8rem" },
                      }}
                    />
                    {education.gpa && (
                      <Chip
                        icon={<Grade fontSize="small" />}
                        label={`${education.gpa === 4 ? "CGPA" : "GPA"} : ${education.gpa && education.gpa.toFixed(2)} ${education.outOf ? ` out of ${education.outOf.toFixed(2)}` : ''}`}
                        size="small"
                        color="primary"
                        sx={{
                          bgcolor: theme.palette.primary.light,
                          color: theme.palette.primary.contrastText,
                          fontSize: { xs: "0.75rem", sm: "0.8rem" },
                        }}
                      />
                    )}
                    {/* {!education.gpa && (
                      <Chip
                        icon={<Grade fontSize="small" />}
                        label={`GPA: Not Available`}
                        size="small"
                        color="primary"
                        sx={{
                          bgcolor: theme.palette.primary.light,
                          color: theme.palette.primary.contrastText,
                          fontSize: { xs: "0.75rem", sm: "0.8rem" },
                        }}
                    />
                    )} */}
                  </Box>

                  <Typography
                    variant="body1"
                    sx={{
                      color: theme.palette.text.secondary,
                      lineHeight: 1.7,
                      mb: 3,
                      flexGrow: 1,
                      fontSize: { xs: "0.9rem", sm: "1rem" },
                      whiteSpace: "pre-line",
                      wordBreak: "break-word",
                    }}
                  >
                    {education.description.slice(0, 200)}...
                  </Typography>

                  {education.achievements?.length ? (
                    <Box sx={{ mt: "auto" }}>
                      <Typography
                        variant="subtitle2"
                        sx={{
                          fontWeight: 600,
                          color: theme.palette.text.primary,
                          mb: 1,
                          fontSize: { xs: "0.9rem", sm: "1rem" },
                        }}
                      >
                        Notable Achievements:
                      </Typography>
                      <Box
                        component="ul"
                        sx={{
                          m: 0,
                          p: 0,
                          pl: 2,
                          listStyleType: "none",
                        }}
                      >
                        {education.achievements.slice(0, 1).map((achievement, i) => (
                          <Box
                            component="li"
                            key={i}
                            sx={{
                              display: "flex",
                              alignItems: "flex-start",
                              mb: 1,
                              "&:before": {
                                content: '"•"',
                                color: theme.palette.primary.main,
                                mr: 1,
                                fontSize: "1.2rem",
                                lineHeight: 1,
                                flexShrink: 0,
                              },
                            }}
                          >
                            <Typography
                              variant="body2"
                              sx={{
                                color: theme.palette.text.secondary,
                                lineHeight: 1.6,
                                fontSize: { xs: "0.8rem", sm: "0.9rem" },
                                wordBreak: "break-word",
                              }}
                            >
                              {achievement}
                            </Typography>
                          </Box>
                        ))}
                      </Box>
                    </Box>
                  ) : null}
                  <Button
                    onClick={() =>
                      router.push(`/Home/academic/${education._id}`)
                    }
                    size="small"
                    variant="outlined"
                    startIcon={<ArrowForward sx={{ fontSize: '0.9rem' }} />}
                    sx={{
                      alignSelf: "flex-end",
                      mt: 1,
                      px: 2,
                      py: 0.75,
                      minWidth: 0,
                      color: theme.palette.primary.main,
                      borderColor: theme.palette.primary.main,
                      backgroundColor: 'transparent',
                      mb: 0,
                      "&:hover": {
                        backgroundColor: theme.palette.primary.main,
                        color: theme.palette.primary.contrastText,
                        borderColor: theme.palette.primary.main,
                        transform: 'translateY(-1px)',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
                      },
                      fontSize: "0.75rem",
                      fontWeight: 600,
                      textTransform: "none",
                      borderRadius: "8px",
                      transition: 'all 0.2s ease-in-out',
                      '&:active': {
                        transform: 'translateY(0)',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                      }
                    }}
                  >
                    View Details
                  </Button>

                </Paper>
              </motion.div>
            ))}
          </Box>

          {hasMore && !showAll && !isPage.isItPage && (
            <Box sx={{ display: "flex", justifyContent: "center", mt: 6 }}>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  variant="contained"
                  color="primary"
                  endIcon={<ExpandMore />}
                  onClick={() => router.push("/Home/academic")}
                  sx={{
                    borderRadius: "12px",
                    textTransform: "none",
                    fontWeight: 600,
                    fontSize: "1rem",
                    px: 4,
                    py: 1.5,
                    background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                    boxShadow: `0 4px 12px ${theme.palette.primary.main}40`,
                    "&:hover": {
                      boxShadow: `0 6px 16px ${theme.palette.primary.main}60`,
                    },
                  }}
                >
                  Explore All Educations
                </Button>
              </motion.div>
            </Box>
          )}
        </motion.div>
      </Container>
    </Box>
  );
};

export default AcademicsSection;
