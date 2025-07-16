"use client";
import React, { useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Divider,
  Chip,
  Grid,
  Container,
  Avatar,
  Button,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import {
  Work,
  CalendarToday,
  LocationOn,
  ExpandMore,
  ExpandLess,
} from "@mui/icons-material";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

interface Job {
  _id: string;
  title: string;
  company: string;
  location: string;
  startDate: string;
  endDate?: string;
  isCurrent: boolean;
  description: string;
  responsibilities?: string[];
  technologies?: string[];
  achievements?: string[];
  ownerEmail?: string;
}
interface isPage {
  isItPage: boolean;
}

interface ExperienceSectionProps {
  isPage: isPage;
  experienceTitle: string;
  experienceJobs: Job[];
}

const truncate = (text: string, maxLength: number) => {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + "...";
};

const ExperienceSection: React.FC<ExperienceSectionProps> = ({
  experienceTitle,
  experienceJobs,
  isPage: isPage,
}) => {
  const [expandedJob] = useState<string | null>(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const router = useRouter();

  if (!experienceJobs?.length) {
    return null;
  }
  const { isItPage } = isPage;

  const showAll = false; // always show only first 2 for now
  const visibleExperiences = showAll
    ? experienceJobs
    : isItPage ? experienceJobs : experienceJobs.slice(0, 2);
  const hasMore = experienceJobs.length > 2;

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
          {isItPage ? (
            <></>
          ) : (
            <Typography
              variant="h3"
              sx={{
                fontWeight: 700,
                mb: 4,
                color: theme.palette.text.primary,
                fontSize: { xs: "1.8rem", md: "2.2rem" },
                textAlign: "center",
              }}
            >
              {experienceTitle}
            </Typography>
          )}

          {
            isItPage ? <></> : <Divider sx={{ mb: 6, borderColor: theme.palette.divider }} />
          }

          <Grid
            container
            spacing={4}
            sx={{
              display: "grid",
              gridTemplateColumns: isMobile
                ? "repeat(1, 1fr)"
                : "repeat(2, 1fr)",
              gap: 4,
            }}
          >
            {visibleExperiences.map((job, index) => (
              <Grid
                key={job._id}
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true, margin: "-50px" }}
                  style={{ width: "100%" }}
                >
                  <Paper
                    elevation={3}
                    sx={{
                      p: { xs: 2.5, md: 3 },
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
                    {/* Header: Icon, Title, Company, Status */}
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "flex-start",
                        gap: 2,
                        mb: 2,
                      }}
                    >
                      <Avatar
                        sx={{
                          bgcolor: theme.palette.primary.main,
                          color: theme.palette.primary.contrastText,
                          width: 40,
                          height: 40,
                        }}
                      >
                        <Work />
                      </Avatar>
                      <Box sx={{ flex: 1 }}>
                        <Typography
                          variant="h5"
                          sx={{
                            fontWeight: 700,
                            lineHeight: 1.2,
                            color: theme.palette.text.primary,
                            fontSize: { xs: "1.2rem", md: "1.3rem" },
                          }}
                        >
                          {job.title}
                        </Typography>
                        <Typography
                          variant="h6"
                          color="primary"
                          sx={{ fontWeight: 600, mb: 0.5 }}
                        >
                          {job.company}
                        </Typography>
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1,
                            mt: 0.5,
                            flexWrap: "wrap",
                          }}
                        >
                          <Chip
                            label={job.isCurrent ? "Current" : "Past"}
                            size="small"
                            color={job.isCurrent ? "success" : "default"}
                            sx={{ fontWeight: 600 }}
                          />
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 0.5,
                            }}
                          >
                            <CalendarToday fontSize="small" color="action" />
                            <Typography variant="body2" color="textSecondary">
                              {new Date(job.startDate).toLocaleDateString(
                                "en-US",
                                { year: "numeric", month: "short" }
                              )}{" "}
                              -{" "}
                              {job.isCurrent
                                ? "Present"
                                : job.endDate
                                  ? new Date(job.endDate).toLocaleDateString(
                                    "en-US",
                                    { year: "numeric", month: "short" }
                                  )
                                  : "Present"}
                            </Typography>
                          </Box>
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 0.5,
                            }}
                          >
                            <LocationOn fontSize="small" color="action" />
                            <Typography variant="body2" color="textSecondary">
                              {job.location}
                            </Typography>
                          </Box>
                        </Box>
                      </Box>
                    </Box>

                    {/* Description with Read More */}
                    <Typography
                      variant="body1"
                      sx={{
                        color: theme.palette.text.secondary,
                        lineHeight: 1.7,
                        mb: 2,
                        display: "-webkit-box",
                        WebkitLineClamp: expandedJob === job._id ? "unset" : 3,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                        whiteSpace: "pre-line",
                        wordBreak: "break-word",
                      }}
                    >
                      {expandedJob === job._id
                        ? job.description
                        : truncate(job.description, 160)}
                    </Typography>


                    {/* Responsibilities */}
                    {job.responsibilities &&
                      job.responsibilities.length > 0 && (
                        <Box sx={{ mb: 2 }}>
                          <Typography
                            variant="subtitle2"
                            sx={{
                              fontWeight: 600,
                              color: theme.palette.text.primary,
                              mb: 1,
                            }}
                          >
                            Key Responsibilities:
                          </Typography>
                          <Box
                            component="ul"
                            sx={{ m: 0, p: 0, pl: 2, listStyleType: "none" }}
                          >
                            {job.responsibilities.slice(0, 2).map((responsibility, i) => (
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
                                  },
                                }}
                              >
                                <Typography
                                  variant="body2"
                                  sx={{
                                    color: theme.palette.text.secondary,
                                    lineHeight: 1.6,
                                    // width: "100%",
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                    whiteSpace: "nowrap",
                                  }}
                                >
                                  {responsibility}
                                </Typography>
                              </Box>
                            ))}
                          </Box>
                        </Box>
                      )}

                    {/* Achievements */}
                    {job.achievements && job.achievements.length > 0 && (
                      <Box sx={{ mb: 2 }}>
                        <Typography
                          variant="subtitle2"
                          sx={{
                            fontWeight: 600,
                            color: theme.palette.text.primary,
                            mb: 1,
                          }}
                        >
                          Key Achievements:
                        </Typography>
                        <Box
                          component="ul"
                          sx={{ m: 0, p: 0, pl: 2, listStyleType: "none" }}
                        >
                          {job.achievements.slice(0, 2).map((achievement, i) => (
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
                                },
                              }}
                            >
                              <Typography
                                variant="body2"
                                sx={{
                                  color: theme.palette.text.secondary,
                                  lineHeight: 1.6,
                                  width: "100%",
                                  overflow: "hidden",
                                  textOverflow: "ellipsis",
                                  whiteSpace: "nowrap",
                                }}
                              >
                                {achievement}
                              </Typography>
                            </Box>
                          ))}
                        </Box>
                      </Box>
                    )}

                    {/* Technologies */}
                    {job.technologies && job.technologies.length > 0 && (
                      <Box sx={{ mb: 2 }}>
                        <Typography
                          variant="subtitle2"
                          sx={{
                            fontWeight: 600,
                            color: theme.palette.text.primary,
                            mb: 1,
                          }}
                        >
                          Technologies Used:
                        </Typography>
                        <Box
                          component="ul"
                          sx={{ m: 0, p: 0, pl: 2, listStyleType: "none" }}
                        >
                          {job.technologies.slice(0, 2).map((tech, i) => (
                            <Box
                              component="li"
                              key={i}
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                mb: 1,
                                "&:before": {
                                  content: '"•"',
                                  color: theme.palette.primary.main,
                                  mr: 1,
                                  fontSize: "1.2rem",
                                  lineHeight: 1,
                                },
                              }}
                            >
                              <Typography
                                variant="body2"
                                sx={{
                                  color: theme.palette.text.secondary,
                                  lineHeight: 1.6,
                                  width: "100%",
                                  overflow: "hidden",
                                  textOverflow: "ellipsis",
                                  whiteSpace: "nowrap",
                                }}
                              >
                                {tech}
                              </Typography>
                            </Box>
                          ))}
                        </Box>
                      </Box>
                    )}

                    <Button
                      onClick={() =>
                        // setExpandedJob(
                        //   expandedJob === job._id ? null : job._id
                        // )
                        router.push(`/Home/experience/${job._id}`)
                      }
                      size="small"
                      sx={{
                        alignSelf: "flex-start",
                        px: 1,
                        minWidth: 0,
                        color: theme.palette.primary.main,
                        mb: 2,
                        "&:hover": { background: "none" },
                      }}
                    >
                      {expandedJob === job._id ? (
                        <>
                          Show less <ExpandLess sx={{ ml: 0.5 }} />
                        </>
                      ) : (
                        <>
                          Read more <ExpandMore sx={{ ml: 0.5 }} />
                        </>
                      )}
                    </Button>

                    {/* Owner Email (optional) */}
                    {job.ownerEmail && (
                      <Typography
                        variant="caption"
                        color="textSecondary"
                        sx={{ mt: 1 }}
                      >
                        Owner: {job.ownerEmail}
                      </Typography>
                    )}
                  </Paper>
                </motion.div>
              </Grid>
            ))}
          </Grid>

          {!isItPage && hasMore && !showAll && (
            <Box sx={{ display: "flex", justifyContent: "center", mt: 6 }}>
              <Button
                variant="outlined"
                color="primary"
                endIcon={<ExpandMore />}
                onClick={() => router.push("/Home/experience")}
                sx={{
                  borderRadius: 50,
                  textTransform: "none",
                  fontWeight: 600,
                  fontSize: "1rem",
                }}
              >
                Show More Experiences
              </Button>
            </Box>
          )}
        </motion.div>
      </Container>
    </Box>
  );
};

export default ExperienceSection;
