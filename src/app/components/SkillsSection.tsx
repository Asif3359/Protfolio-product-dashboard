"use client";
import React, { useRef } from "react";
import {
  Box,
  Typography,
  Paper,
  Button,
  useTheme,
  useMediaQuery,
  Container,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
  Avatar,
} from "@mui/material";
import { ExpandMore, Star } from "@mui/icons-material";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

interface Skill {
  _id: string;
  name: string;
  type: string; // <-- added
  description?: string;
  category?: string;
  logo?: string;
  yearsOfExperience?: number;
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

  // Modal state for skill details
  const [openModal, setOpenModal] = React.useState(false);
  const [selectedSkill, setSelectedSkill] = React.useState<Skill | null>(null);

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

  const skillTypes = ["Technical", "Soft", "Language", "Other"];
  const groupedSkills = skillTechnical.reduce((acc, skill) => {
    if (!acc[skill.type]) acc[skill.type] = [];
    acc[skill.type].push(skill);
    return acc;
  }, {} as Record<string, Skill[]>);

  return (
    <Box
      component="section"
      sx={{
        py: { xs: 4, md: 8 },
        backgroundColor: theme.palette.background.default,
        overflow: "hidden",
        position: "relative",
        "&::before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "100%",
          background: `radial-gradient(circle at 20% 50%, ${theme.palette.primary.light}20, transparent 40%)`,
          zIndex: 0,
        },
      }}
    >
      <Container maxWidth="xl" sx={{ maxWidth: "1200px", position: "relative", zIndex: 1 }}>
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true, margin: "-50px" }}
        >
          {!isItPage && (
            <>
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
                {skillTitle}
              </Typography>
              
              <Typography
                variant="subtitle1"
                sx={{
                  textAlign: "center",
                  maxWidth: "700px",
                  mx: "auto",
                  mb: 6,
                  color: theme.palette.text.secondary,
                  fontSize: { xs: "1rem", md: "1.1rem" },
                }}
              >
                Technologies I&apos;ve mastered and tools I use to bring ideas to life
              </Typography>
            </>
          )}

          {/* Infinity Slider Container */}
          {!isItPage && (
            <Box
              sx={{
                position: "relative",
                width: "100%",
                overflow: "hidden",
                py: 4,
                mb: 2,
                "&::before, &::after": {
                  content: '""',
                  position: "absolute",
                  top: 0,
                  bottom: 0,
                  width: "120px",
                  zIndex: 2,
                  pointerEvents: "none",
                },
                "&::before": {
                  left: 0,
                  background: `linear-gradient(to right, ${theme.palette.background.default}FF, ${theme.palette.background.default}00)`,
                },
                "&::after": {
                  right: 0,
                  background: `linear-gradient(to left, ${theme.palette.background.default}FF, ${theme.palette.background.default}00)`,
                },
              }}
            >
              <motion.div
                ref={sliderRef}
                style={{
                  display: "flex",
                  gap: isMobile ? "20px" : "30px",
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
                    initial={{ opacity: 0, y: 30, scale: 0.9 }}
                    whileInView={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{
                      duration: 0.5,
                      delay: (index % skillTechnical.length) * 0.1,
                    }}
                    viewport={{ once: true, margin: "-50px" }}
                    style={{
                      minWidth: isMobile ? "280px" : "320px",
                      flexShrink: 0,
                    }}
                    whileHover={{ scale: 1.03 }}
                  >
                    <Paper
                      elevation={4}
                      sx={{
                        p: { xs: 2, sm: 2.5, md: 3 },
                        borderRadius: "16px",
                        height: "100%",
                        width: isMobile ? "280px" : "320px",
                        background: `linear-gradient(135deg, ${theme.palette.background.paper}, ${theme.palette.background.default})`,
                        transition: "all 0.3s ease",
                        border: `1px solid ${theme.palette.divider}`,
                        boxShadow: `0 8px 24px -4px ${theme.palette.primary.main}20`,
                        "&:hover": {
                          transform: "translateY(-8px)",
                          boxShadow: `0 12px 28px -2px ${theme.palette.primary.main}30`,
                        },
                        cursor: "pointer",
                        position: "relative",
                        overflow: "hidden",
                      }}
                      onClick={() => {
                        setSelectedSkill(skill);
                        setOpenModal(true);
                      }}
                    >
                      <Box>
                        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                            {skill.logo && (
                              <Avatar
                                src={skill.logo}
                                alt={skill.name}
                                sx={{ 
                                  height: 40, 
                                  width: 40, 
                                  borderRadius: "8px",
                                  background: "#fff",
                                  boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
                                }}
                              />
                            )}
                            <Typography
                              variant="h6"
                              sx={{
                                fontWeight: 700,
                                color: theme.palette.text.primary,
                                fontSize: { xs: "1.1rem", md: "1.2rem" },
                              }}
                            >
                              {skill.name}
                            </Typography>
                          </Box>
                        </Box>
                        <Box sx={{ display: "flex", gap: 1, mb: 1 }}>
                          {skill.type && (
                            <Chip
                              label={skill.type}
                              size="small"
                              sx={{
                                backgroundColor: `${theme.palette.secondary.main}15`,
                                color: theme.palette.secondary.main,
                                fontSize: "0.7rem",
                                height: "24px",
                              }}
                            />
                          )}
                          {skill.category && (
                            <Chip
                              label={skill.category}
                              size="small"
                              sx={{
                                backgroundColor: `${theme.palette.primary.main}15`,
                                color: theme.palette.primary.main,
                                fontSize: "0.7rem",
                                height: "24px",
                              }}
                            />
                          )}
                        </Box>
                      </Box>
                    </Paper>
                  </motion.div>
                ))}
              </motion.div>
            </Box>
          )}

          {/* Grid Layout for Skills Page */}
          {isItPage && (
            <>
              {skillTypes.map(type => (
                groupedSkills[type]?.length > 0 && (
                  <Box key={type} sx={{ mb: 5 }}>
                    <Typography variant="h3" sx={{ fontWeight: 600, mb: 2, color: theme.palette.text.primary, fontSize: { xs: "1.5rem", md: "2rem" } }}>
                      {type} Skills
                    </Typography>
                    <Box
                      sx={{
                        display: "grid",
                        gridTemplateColumns: {
                          xs: "1fr",
                          sm: "repeat(2, 1fr)",
                          md: "repeat(3, 1fr)",
                          lg: "repeat(3, 1fr)",
                        },
                        gap: { xs: 2, sm: 3, md: 4 },
                      }}
                    >
                      {groupedSkills[type].map((skill, index) => (
                        <motion.div
                          key={`${skill._id}-${index}`}
                          initial={{ opacity: 0, y: 30, scale: 0.95 }}
                          whileInView={{ opacity: 1, y: 0, scale: 1 }}
                          transition={{
                            duration: 0.5,
                            delay: index * 0.05,
                          }}
                          viewport={{ once: true, margin: "-50px" }}
                          whileHover={{ scale: 1.02 }}
                        >
                          <Paper
                            elevation={4}
                            sx={{
                              p: { xs: 2.5, md: 3 },
                              borderRadius: "16px",
                              height: "100%",
                              background: `linear-gradient(135deg, ${theme.palette.background.paper}, ${theme.palette.background.default})`,
                              transition: "all 0.3s ease",
                              border: `1px solid ${theme.palette.divider}`,
                              boxShadow: `0 8px 24px -4px ${theme.palette.primary.main}20`,
                              "&:hover": {
                                transform: "translateY(-5px)",
                                boxShadow: `0 12px 28px -2px ${theme.palette.primary.main}30`,
                              },
                              cursor: "pointer",
                              position: "relative",
                              overflow: "hidden",
                            }}
                            onClick={() => {
                              setSelectedSkill(skill);
                              setOpenModal(true);
                            }}
                          >
                            <Box>
                              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "start", gap: 2, flexDirection: "column", mb: 2 }}>
                                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                                  {skill.logo && (
                                    <Avatar
                                      src={skill.logo}
                                      alt={skill.name}
                                      sx={{
                                        height: 40,
                                        width: 40,
                                        borderRadius: "8px",
                                        background: "#fff",
                                        boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
                                      }}
                                    />
                                  )}
                                  <Typography
                                    variant="h6"
                                    sx={{
                                      fontWeight: 700,
                                      color: theme.palette.text.primary,
                                      fontSize: { xs: "1.1rem", md: "1.2rem" },
                                    }}
                                  >
                                    {skill.name}
                                  </Typography>
                                </Box>
                              </Box>
                              <Box sx={{ display: "flex", gap: 1, mb: 1 }}>
                                {skill.type && (
                                  <Chip
                                    label={skill.type}
                                    size="small"
                                    sx={{
                                      backgroundColor: `${theme.palette.secondary.main}15`,
                                      color: theme.palette.secondary.main,
                                      fontSize: "0.7rem",
                                      height: "24px",
                                    }}
                                  />
                                )}
                                {skill.category && (
                                  <Chip
                                    label={skill.category}
                                    size="small"
                                    sx={{
                                      backgroundColor: `${theme.palette.primary.main}15`,
                                      color: theme.palette.primary.main,
                                      fontSize: "0.7rem",
                                      height: "24px",
                                    }}
                                  />
                                )}
                              </Box>
                            </Box>
                          </Paper>
                        </motion.div>
                      ))}
                    </Box>
                  </Box>
                )
              ))}
            </>
          )}

          {/* Show More Button */}
          {!isItPage && (
            <Box sx={{ display: "flex", justifyContent: "center", mt: 6 }}>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  variant="contained"
                  color="primary"
                  endIcon={<ExpandMore />}
                  onClick={() => router.push("/Home/skill")}
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
                  Explore All Skills
                </Button>
              </motion.div>
            </Box>
          )}
        </motion.div>

        {/* Skill Details Modal */}
        <Dialog
          open={openModal}
          onClose={() => setOpenModal(false)}
          maxWidth="sm"
          fullWidth
          PaperProps={{
            sx: {
              borderRadius: "16px",
              background: `linear-gradient(145deg, ${theme.palette.background.paper}, ${theme.palette.background.default})`,
              overflow: "hidden",
              border: `1px solid ${theme.palette.divider}`,
            },
          }}
        >
          <DialogTitle
            sx={{
              fontWeight: 700,
              fontSize: "1.5rem",
              display: "flex",
              alignItems: "center",
              gap: 2,
              background: `${theme.palette.primary.main}10`,
              borderBottom: `1px solid ${theme.palette.divider}`,
            }}
          >
            {selectedSkill?.logo && (
              <Avatar
                src={selectedSkill.logo}
                alt={selectedSkill.name}
                sx={{ 
                  height: 48, 
                  width: 48, 
                  borderRadius: "12px",
                  background: "#fff",
                  boxShadow: "0 2px 12px rgba(0,0,0,0.1)"
                }}
              />
            )}
            {selectedSkill?.name}
          </DialogTitle>
          <DialogContent dividers sx={{ py: 3 }}>
            <Box sx={{ mb: 3 }}>
              <Box sx={{ display: "flex", gap: 2, mb: 1 }}>
                {selectedSkill?.type && (
                  <Chip
                    label={selectedSkill.type}
                    sx={{
                      backgroundColor: `${theme.palette.secondary.main}15`,
                      color: theme.palette.secondary.main,
                      fontSize: "0.8rem",
                      height: "28px",
                      px: 1,
                    }}
                  />
                )}
                {selectedSkill?.category && (
                  <Chip
                    label={selectedSkill.category}
                    sx={{
                      backgroundColor: `${theme.palette.primary.main}15`,
                      color: theme.palette.primary.main,
                      fontSize: "0.8rem",
                      height: "28px",
                      px: 1,
                    }}
                  />
                )}
              </Box>
            </Box>
            {selectedSkill?.yearsOfExperience && (
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
                  Experience
                </Typography>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      sx={{
                        color: i < Math.min(5, Math.floor(selectedSkill.yearsOfExperience! / 2))
                          ? theme.palette.warning.main
                          : theme.palette.action.disabled,
                        fontSize: "1.2rem",
                      }}
                    />
                  ))}
                  <Typography variant="body2" sx={{ ml: 1 }}>
                    {selectedSkill.yearsOfExperience} {selectedSkill.yearsOfExperience === 1 ? "year" : "years"}
                  </Typography>
                </Box>
              </Box>
            )}
            {selectedSkill?.description && (
              <Box>
                <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
                  Description
                </Typography>
                <Typography 
                  variant="body1" 
                  sx={{ 
                    whiteSpace: "pre-line",
                    lineHeight: 1.7,
                    color: theme.palette.text.secondary,
                  }}
                >
                  {selectedSkill.description}
                </Typography>
              </Box>
            )}
          </DialogContent>
          <DialogActions sx={{ px: 3, py: 2, borderTop: `1px solid ${theme.palette.divider}` }}>
            <Button 
              onClick={() => setOpenModal(false)} 
              variant="outlined"
              sx={{
                borderRadius: "12px",
                textTransform: "none",
                fontWeight: 600,
                px: 3,
                py: 1,
              }}
            >
              Close
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </Box>
  );
};

export default SkillsSection;