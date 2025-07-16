"use client";
import React, { useRef } from "react";
import {
  Box,
  Typography,
  Paper,
  Divider,
  Button,
  useTheme,
  useMediaQuery,
  Container,
} from "@mui/material";
import { ExpandMore } from "@mui/icons-material";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

interface Skill {
  _id: string;
  name: string;
  proficiency: number;
  description?: string;
  category?: string;
  logo?: string;
}

interface isPage {
  isItPage: boolean;
}

interface SkillsSectionProps {
  isPage: isPage;
  skillTitle: string;
  skillTechnical: Skill[];
}

const SkillsSection: React.FC<SkillsSectionProps> = ({
  skillTitle,
  skillTechnical,
  isPage: isPage,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const router = useRouter();
  const sliderRef = useRef<HTMLDivElement>(null);

  if (!skillTechnical?.length) {
    return null;
  }

  const { isItPage } = isPage;

  // Create duplicate skills for seamless infinite scroll
  const duplicatedSkills = [
    ...skillTechnical,
    ...skillTechnical,
    ...skillTechnical,
  ];

  return (
    <Box
      component="section"
      sx={{
        py: { xs: 2, md: 4 },
        backgroundColor: theme.palette.background.default,
        overflow: "hidden",
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
              {skillTitle}
            </Typography>
          )}
          {isItPage ? (
            <></>
          ) : (
            <Divider sx={{ mb: 6, borderColor: theme.palette.divider }} />
          )}

          {/* Infinity Slider Container */}
          {isItPage ? (
            <></>
          ) : (
            <Box
              sx={{
                position: "relative",
                width: "100%",
                overflow: "hidden",
                pt: 4,
                pb: 4,
                mb: 2,
                "&::before, &::after": {
                  content: '""',
                  position: "absolute",
                  top: 0,
                  bottom: 0,
                  width: "100px",
                  zIndex: 2,
                  pointerEvents: "none",
                },
                "&::before": {
                  left: 0,
                  background: `linear-gradient(to right, ${theme.palette.background.default}, transparent)`,
                },
                "&::after": {
                  right: 0,
                  background: `linear-gradient(to left, ${theme.palette.background.default}, transparent)`,
                },
              }}
            >
              <motion.div
                ref={sliderRef}
                style={{
                  display: "flex",
                  gap: isMobile ? "16px" : "24px",
                  width: "fit-content",
                }}
                animate={{
                  x: [0, isMobile ? -800 : -1200],
                }}
                transition={{
                  duration: 30,
                  repeat: Infinity,
                  ease: "linear",
                }}
              >
                {duplicatedSkills.map((skill, index) => (
                  <motion.div
                    key={`${skill._id}-${index}`}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.5,
                      delay: (index % skillTechnical.length) * 0.1,
                    }}
                    viewport={{ once: true, margin: "-50px" }}
                    style={{
                      minWidth: isMobile ? "260px" : "300px",
                      flexShrink: 0,
                    }}
                  >
                    <Paper
                      elevation={4}
                      sx={{
                        p: { xs: 2, sm: 2.5, md: 3 },
                        borderRadius: 3,
                        height: "100%",
                        width: isMobile ? "260px" : "300px",
                        background: theme.palette.background.paper,
                        transition: "transform 0.3s ease, box-shadow 0.3s ease",
                        "&:hover": {
                          transform: "translateY(-5px)",
                          boxShadow: theme.shadows[6],
                        },
                      }}
                    >
                      <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            mb: 1,
                          }}
                        >
                          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                            {skill.logo && (
                              <img
                                src={skill.logo}
                                alt={skill.name}
                                style={{ height: 32, width: 32, objectFit: "contain", borderRadius: 4, background: "#fff" }}
                              />
                            )}
                            <Typography
                              variant="h6"
                              sx={{
                                fontWeight: 600,
                                color: theme.palette.text.primary,
                                fontSize: { xs: "1rem", md: "1.1rem" },
                              }}
                            >
                              {skill.name}
                            </Typography>
                          </Box>
                          <Typography
                            color="primary"
                            sx={{
                              fontWeight: 600,
                              fontSize: { xs: "0.9rem", md: "1rem" },
                            }}
                          >
                            {skill.proficiency}%
                          </Typography>
                        </Box>

                        <Box
                          sx={{
                            width: "100%",
                            height: 8,
                            backgroundColor: theme.palette.action.hover,
                            borderRadius: 4,
                            overflow: "hidden",
                            mb: 1,
                          }}
                        >
                          <motion.div
                            initial={{ width: 0 }}
                            whileInView={{ width: `${skill.proficiency}%` }}
                            transition={{
                              duration: 1,
                              delay: (index % skillTechnical.length) * 0.1,
                            }}
                            viewport={{ once: true }}
                            style={{
                              height: "100%",
                              backgroundColor: theme.palette.primary.main,
                              borderRadius: 4,
                            }}
                          />
                        </Box>

                        {skill.description && (
                          <Typography
                            variant="body2"
                            color="textSecondary"
                            sx={{
                              lineHeight: 1.6,
                              fontSize: { xs: "0.8rem", md: "0.9rem" },
                              whiteSpace: "pre-line",
                              wordBreak: "break-word",
                            }}
                          >
                            {skill.description}
                          </Typography>
                        )}
                      </Box>
                    </Paper>
                  </motion.div>
                ))}
              </motion.div>
            </Box>
          )}

          {!isItPage ? (
            <></>
          ) : (
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: {
                  xs: "1fr",
                  sm: "repeat(2, 1fr)",
                  md: "repeat(3, 1fr)",
                  lg: "repeat(4, 1fr)",
                },
                gap: { xs: 2, sm: 3, md: 4 },
                width: "100%",
              }}
            >
              {skillTechnical.map((skill, index) => (
                <motion.div
                  key={`${skill._id}-${index}`}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.5,
                    delay: (index % skillTechnical.length) * 0.1,
                  }}
                  viewport={{ once: true, margin: "-50px" }}
                >
                  <Paper
                    elevation={4}
                    sx={{
                      p: { xs: 2.5, md: 3 },
                      borderRadius: 3,
                      height: "100%",
                      background: theme.palette.background.paper,
                      transition: "transform 0.3s ease, box-shadow 0.3s ease",
                      "&:hover": {
                        transform: "translateY(-5px)",
                        boxShadow: theme.shadows[6],
                      },
                    }}
                  >
                    <Box>

                      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
                        {skill.logo && (
                          <img
                            src={skill.logo}
                            alt={skill.name}
                            style={{ height: 32, width: 32, objectFit: "contain", borderRadius: 4, background: "#fff" }}
                          />
                        )}
                        <Typography
                          variant="h6"
                          sx={{
                            fontWeight: 600,
                            color: theme.palette.text.primary,
                            fontSize: { xs: "1rem", md: "1.1rem" },
                          }}
                        >
                          {skill.name}
                        </Typography>
                      </Box>
                      <Typography
                            color="primary"
                            sx={{
                              fontWeight: 600,
                              fontSize: { xs: "0.9rem", md: "1rem" },
                            }}
                          >
                            {skill.proficiency}%
                          </Typography>
                      </Box>

                      <Box
                        sx={{
                          width: "100%",
                          height: 8,
                          backgroundColor: theme.palette.action.hover,
                          borderRadius: 4,
                          overflow: "hidden",
                          mb: 1,
                        }}
                      >
                        <motion.div
                          initial={{ width: 0 }}
                          whileInView={{ width: `${skill.proficiency}%` }}
                          transition={{
                            duration: 1,
                            delay: (index % skillTechnical.length) * 0.1,
                          }}
                          viewport={{ once: true }}
                          style={{
                            height: "100%",
                            backgroundColor: theme.palette.primary.main,
                            borderRadius: 4,
                          }}
                        />
                      </Box>

                      {skill.description && (
                        <Typography
                          variant="body2"
                          color="textSecondary"
                          sx={{
                            lineHeight: 1.6,
                            fontSize: { xs: "0.8rem", md: "0.9rem" },
                          }}
                        >
                          {skill.description}
                        </Typography>
                      )}
                    </Box>
                  </Paper>
                </motion.div>
              ))}
            </Box>
          )}

          {/* Show More Button */}
          {isItPage ? (
            <></>
          ) : (
            <Box sx={{ display: "flex", justifyContent: "center", mt: 6 }}>
              <Button
                variant="outlined"
                color="primary"
                endIcon={<ExpandMore />}
                onClick={() => router.push("/Home/skill")}
                sx={{
                  borderRadius: 50,
                  textTransform: "none",
                  fontWeight: 600,
                  fontSize: "1rem",
                }}
              >
                Show More Skills
              </Button>
            </Box>
          )}
        </motion.div>
      </Container>
    </Box>
  );
};

export default SkillsSection;
