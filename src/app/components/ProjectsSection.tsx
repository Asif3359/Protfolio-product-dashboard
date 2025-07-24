"use client";
import React, { useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Divider,
  Chip,
  Button,
  Grid,
  useTheme,
  Container,
  IconButton,
  Tooltip,
  Avatar,
  useMediaQuery,
} from "@mui/material";
import {
  Code,
  GitHub,
  Launch,
  ExpandMore,
  ExpandLess,
} from "@mui/icons-material";
import { motion } from "framer-motion";
import Image from "next/image";
import { useRouter } from "next/navigation";

interface Project {
  _id: string;
  title: string;
  description: string;
  technologies: string[];
  images: string[];
  startDate: string;
  endDate: string;
  link: string;
  githubLink: string;
  features: string[];
  status: string;
}
interface isPage {
  isItPage: boolean;
}

interface ProjectsSectionProps {
  isPage: isPage;
  projectsDataTitle?: string;
  projectsDataList: Project[];
}

const ProjectsSection: React.FC<ProjectsSectionProps> = ({
  projectsDataTitle = "Projects",
  projectsDataList = [],
  isPage: isPage,
}) => {
  const [expandedProject] = useState<string | null>(null);
  const [showAll] = useState(false);
  const theme = useTheme();
  const router = useRouter();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  if (!projectsDataList?.length) {
    return null;
  }
  const { isItPage } = isPage;

  const visibleProjects = showAll
    ? projectsDataList
    : isItPage
      ? projectsDataList
      : projectsDataList.slice(0, 2);
  const hasMore = projectsDataList.length > 2;



  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
        return "success";
      case "ongoing":
        return "warning";
      case "planned":
        return "info";
      default:
        return "default";
    }
  };

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
          {isItPage ? (
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
                  width: "180px",
                  height: "4px",
                  background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                  margin: "16px auto 0",
                  borderRadius: "2px",
                },
              }}
            >
              {projectsDataTitle}
            </Typography>
          )}
          {isItPage ? (
            <></>
          ) : (
            <Divider sx={{ mb: 6, borderColor: theme.palette.divider }} />
          )}

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
            {visibleProjects.map((project, index) => (
              <Grid
                key={project._id}
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
                    {/* Project Image */}
                    {project.images && project.images.length > 0 && (
                      <Box
                        sx={{
                          position: "relative",
                          width: "100%",
                          height: { xs: 180, sm: 200, md: 220 },
                          mb: 3,
                          borderRadius: 2,
                          overflow: "hidden",
                          bgcolor: theme.palette.action.hover,
                          cursor: "pointer",
                        }}
                        onClick={() => router.push(`/Home/project/${project._id}`)}
                      >
                        <Image
                          src={project.images[0]}
                          alt={project.title}
                          fill
                          style={{ objectFit: "cover" }}
                          sizes="(max-width: 600px) 100vw, (max-width: 900px) 50vw, 33vw"
                        />
                      </Box>
                    )}

                    {/* Project Header */}
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
                        <Code />
                      </Avatar>
                      <Box sx={{ flex: 1 }}>
                        <Typography
                          variant="h5"
                          sx={{
                            fontWeight: 700,
                            lineHeight: 1.2,
                            color: theme.palette.text.primary,
                            fontSize: { xs: "1.2rem", md: "1.3rem" },
                            cursor: "pointer",
                            "&:hover": {
                              color: theme.palette.primary.main,
                            },
                          }}
                          onClick={() => router.push(`/Home/project/${project._id}`)}
                        >
                          {project.title}
                        </Typography>
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1,
                            mt: 0.5,
                          }}
                        >
                          <Chip
                            label={project.status}
                            size="small"
                            color={getStatusColor(project.status)}
                            sx={{
                              textTransform: "capitalize",
                              fontWeight: 600,
                            }}
                          />
                          <Typography
                            variant="body2"
                            sx={{
                              color: theme.palette.text.secondary,
                              fontSize: "0.8rem",
                            }}
                          >
                            {formatDate(project.startDate)} -{" "}
                            {project.endDate
                              ? formatDate(project.endDate)
                              : "Present"}
                          </Typography>
                        </Box>
                      </Box>
                    </Box>

                    {/* Project Description */}
                    <Typography
                      variant="body1"
                      sx={{
                        color: theme.palette.text.secondary,
                        lineHeight: 1.7,
                        mb: 2,
                        display: "-webkit-box",
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                      }}
                    >
                      {project.description.slice(0, 160)}...
                    </Typography>
                    <Box>
                      {/* Features */}
                      {project.features?.length > 0 && (
                        <Box sx={{ mb: 3 }}>
                          <Typography
                            variant="subtitle2"
                            sx={{
                              fontWeight: 600,
                              color: theme.palette.text.primary,
                              mb: 1,
                            }}
                          >
                            Key Features:
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
                            {project.features.slice(0, 2).map((feature, i) => (
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
                                  {feature}
                                </Typography>
                              </Box>
                            ))}
                          </Box>
                        </Box>
                      )}

                      {/* Technologies */}
                      {project.technologies?.length > 0 && (
                        <Box sx={{ mb: 3 }}>
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
                            sx={{
                              m: 0,
                              p: 0,
                              pl: 2,
                              listStyleType: "none",
                            }}
                          >
                            {project.technologies.slice(0, 2).map((tech, i) => (
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
                    </Box>

                    <Button
                      onClick={() => router.push(`/Home/project/${project._id}`)}
                      size="small"
                      sx={{
                        alignSelf: "flex-start",
                        px: 1,
                        minWidth: 0,
                        color: theme.palette.primary.main,
                        "&:hover": {
                          background: "none",
                        },
                        mb: 2,
                      }}
                    >
                      {expandedProject === project._id ? (
                        <>
                          Show less <ExpandLess sx={{ ml: 0.5 }} />
                        </>
                      ) : (
                        <>
                          Read more <ExpandMore sx={{ ml: 0.5 }} />
                        </>
                      )}
                    </Button>

                    {/* Action Buttons */}
                    <Box
                      sx={{
                        display: "flex",
                        gap: 2,
                        mt: "auto",
                        pt: 2,
                      }}
                    >
                      {project.githubLink && (
                        <Tooltip title="View on GitHub">
                          <IconButton
                            href={project.githubLink}
                            target="_blank"
                            sx={{
                              bgcolor: theme.palette.action.hover,
                              color: theme.palette.text.secondary,
                              "&:hover": {
                                bgcolor: theme.palette.primary.main,
                                color: theme.palette.primary.contrastText,
                              },
                              flex: 1,
                              py: 1,
                              borderRadius: 1,
                            }}
                          >
                            <GitHub fontSize="small" sx={{ mr: 1 }} />
                            <Typography
                              variant="button"
                              sx={{ fontSize: "0.75rem" }}
                            >
                              Code
                            </Typography>
                          </IconButton>
                        </Tooltip>
                      )}
                      {project.link && (
                        <Tooltip title="View Live Demo">
                          <IconButton
                            href={project.link}
                            target="_blank"
                            sx={{
                              bgcolor: theme.palette.primary.main,
                              color: theme.palette.primary.contrastText,
                              "&:hover": {
                                bgcolor: theme.palette.primary.dark,
                              },
                              flex: 1,
                              py: 1,
                              borderRadius: 1,
                            }}
                          >
                            <Launch fontSize="small" sx={{ mr: 1 }} />
                            <Typography
                              variant="button"
                              sx={{ fontSize: "0.75rem" }}
                            >
                              Demo
                            </Typography>
                          </IconButton>
                        </Tooltip>
                      )}
                    </Box>
                  </Paper>
                </motion.div>
              </Grid>
            ))}
          </Grid>

          {!isItPage && hasMore && !showAll && (
            <Box sx={{ display: "flex", justifyContent: "center", mt: 6 }}>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  variant="contained"
                  color="primary"
                  endIcon={<ExpandMore />}
                  onClick={() => router.push("/Home/project")}
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
                  Explore All Projects
                </Button>
              </motion.div>
            </Box>
          )}
        </motion.div>
      </Container>
    </Box>
  );
};

export default ProjectsSection;
