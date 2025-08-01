'use client'
import React, { useState } from 'react';
import { Box, Typography, Paper, Divider, Chip, Grid, Container, Avatar, Button, useTheme, useMediaQuery } from '@mui/material';
import { EmojiEvents, CalendarToday, ExpandMore, ExpandLess } from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';

interface Award {
  _id: string;
  title: string;
  issuer: string;
  date: string;
  description: string;
  category?: string;
  link?: string;
  image?: string;
  ownerEmail?: string;
}

interface AwardsSectionProps {
  title: string;
  list: Award[];
  isPage: {
    isItPage: boolean;
  };
}

const AwardsSection: React.FC<AwardsSectionProps> = ({ title, list, isPage }) => {
  const [expandedAward] = useState<string | null>(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const router = useRouter();

  if (!list?.length) {
    return null;
  }

  const showAll = false;
  const visibleAwards = showAll ? list : isPage.isItPage ? list : list.slice(0, 2);
  const hasMore = list.length > 2;

  // Determine grid columns: 1 if only one item, 2 otherwise
  const gridColumns = visibleAwards.length === 1
    ? '1fr'
    : isMobile
      ? 'repeat(1, 1fr)'
      : { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(2, 1fr)', lg: 'repeat(2, 1fr)' };

  return (
    <Box component="section" sx={{ py: { xs: 2, md: 4 }, backgroundColor: theme.palette.background.default }}>
      <Container maxWidth="xl" sx={{ maxWidth: '1200px' }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true, margin: '-50px' }}
        >
          {
            isPage.isItPage ? (
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
                {title}
              </Typography>
            )
          }

          {
            isPage.isItPage ? (
              <></>
            ) : (
              <Divider sx={{ mb: 6, borderColor: theme.palette.divider }} />
            )
          }

          <Grid container spacing={4} sx={{ display: 'grid', gridTemplateColumns: gridColumns, gap: 4 }}>
            {visibleAwards.map((award, index) => (
              <Grid key={award._id} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true, margin: '-50px' }}
                  style={{ width: '100%' }}
                >
                  <Paper
                    elevation={3}
                    sx={{
                      p: { xs: 2.5, md: 3 },
                      borderRadius: 3,
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      background: theme.palette.background.paper,
                      transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-5px)',
                        boxShadow: theme.shadows[6],
                      },
                    }}
                  >
                    {/* Header: Icon, Title, Issuer */}
                    {award.image && (
                      <Box sx={{ width: '100%', height: '300px', overflow: 'hidden', mb: 2, cursor: 'pointer' }}
                        onClick={() => {
                          router.push(`/Home/award/${award._id}`);
                        }}
                      >
                        <img src={award.image} alt={award.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      </Box>
                    )}
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2, mb: 2 }}>
                      <Avatar sx={{ bgcolor: theme.palette.primary.main, color: theme.palette.primary.contrastText, width: 40, height: 40 }}>
                        <EmojiEvents />
                      </Avatar>
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="h5" sx={{ fontWeight: 700, lineHeight: 1.2, color: theme.palette.text.primary, fontSize: { xs: '1.2rem', md: '1.3rem' }, cursor: 'pointer', '&:hover': { color: theme.palette.primary.main } }}
                          onClick={() => {
                            router.push(`/Home/award/${award._id}`);
                          }}
                        >{award.title}
                        </Typography>
                        <Typography variant="h6" color="primary" sx={{ fontWeight: 600, mb: 0.5 }}>{award.issuer}</Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5, flexWrap: 'wrap' }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <CalendarToday fontSize="small" color="action" />
                            <Typography variant="body2" color="textSecondary">
                              {new Date(award.date).toLocaleDateString('en-US', { year: 'numeric', month: 'short' })}
                            </Typography>
                          </Box>
                          {award.category && (
                            <Chip label={award.category} size="small" variant="outlined" />
                          )}
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
                        display: '-webkit-box',
                        WebkitLineClamp: expandedAward === award._id ? 'unset' : 3,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                      }}
                    >
                      {award.description.slice(0, 160)}
                    </Typography>

                    <Button
                      onClick={() => {
                        router.push(`/Home/award/${award._id}`);
                      }}
                      size="small"
                      sx={{ alignSelf: 'flex-start', px: 1, minWidth: 0, color: theme.palette.primary.main, mb: 2, '&:hover': { background: 'none' } }}
                    >
                      {expandedAward === award._id ? (
                        <>
                          Show less <ExpandLess sx={{ ml: 0.5 }} />
                        </>
                      ) : (
                        <>
                          Read more <ExpandMore sx={{ ml: 0.5 }} />
                        </>
                      )}
                    </Button>

                    {/* Award Link */}
                    {award.link && (
                      <Box sx={{ mt: 'auto' }}>
                        <Chip
                          label="View Details"
                          size="small"
                          color="primary"
                          variant="outlined"
                          clickable
                          component="a"
                          href={award.link}
                          target="_blank"
                        />
                      </Box>
                    )}

                    {/* Owner Email (optional) */}
                    {award.ownerEmail && (
                      <Typography variant="caption" color="textSecondary" sx={{ mt: 1 }}>
                        Owner: {award.ownerEmail}
                      </Typography>
                    )}
                  </Paper>
                </motion.div>
              </Grid>
            ))}
          </Grid>

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
                  onClick={() => router.push("/Home/award")}
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
                  Explore All Awards
                </Button>
              </motion.div>
            </Box>
          )}
        </motion.div>
      </Container>
    </Box>
  );
};

export default AwardsSection; 