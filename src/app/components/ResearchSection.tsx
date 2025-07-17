'use client'
import React, { useState } from 'react';
import { Box, Typography, Paper, Divider, Chip, Container, Avatar, Button, useTheme, Link } from '@mui/material';
import { Science, Article, CalendarToday, Language, ExpandMore, ExpandLess } from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';

interface Research {
  _id: string;
  type: 'Current Research' | 'Publication';
  title: string;
  description: string;
  authors: string[];
  publicationDate: string;
  journal?: string;
  doi?: string;
  link?: string;
  status?: string;
  ownerEmail?: string;
}

interface ResearchSectionProps {
  researchDataTitle: string;
  researchList: Research[];
  isPage: {
    isItPage: boolean;
  };
}

const ResearchSection: React.FC<ResearchSectionProps> = ({ researchDataTitle, researchList, isPage }) => {
  const [expandedResearch] = useState<string | null>(null);
  const theme = useTheme();
  const router = useRouter();
  if (!researchList?.length) {
    return null;
  }

  // For non-page view, show only one current research and one publication
  const currentResearch = researchList.find(r => r.type === 'Current Research');
  const publication = researchList.find(r => r.type === 'Publication');
  
  // For page view, show all research items
  const visibleResearch = isPage.isItPage 
    ? researchList 
    : [currentResearch, publication].filter((item): item is Research => item !== undefined);
  const hasMore = researchList.length > 2;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
  };

  // Determine grid columns: 1 if only one item, 2 otherwise
  const gridColumns = visibleResearch.length === 1
    ? { xs: '1fr' }
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
                  width: "180px",
                  height: "4px",
                  background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                  margin: "16px auto 0",
                  borderRadius: "2px",
                },
              }}
            >
              {researchDataTitle}
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
              gridTemplateColumns: gridColumns,
              gap: { xs: 3, sm: 4, md: 4 },
              width: "100%",
            }}
          >
            {visibleResearch.map((research, index) => (
              <motion.div
                key={research._id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true, margin: '-50px' }}
                style={{ width: '100%' }}
              >
                <Paper
                  elevation={3}
                  sx={{
                    p: { xs: 2.5, sm: 3, md: 3 },
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
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2, mb: 2 }}>
                    <Avatar 
                      sx={{ 
                        bgcolor: theme.palette.primary.main, 
                        color: theme.palette.primary.contrastText, 
                        width: 40, 
                        height: 40,
                        flexShrink: 0,
                      }}
                    >
                      {research.type === 'Current Research' ? <Science /> : <Article />}
                    </Avatar>
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Typography 
                        variant="h5" 
                        sx={{ 
                          fontWeight: 700, 
                          lineHeight: 1.2, 
                          color: theme.palette.text.primary, 
                          fontSize: { xs: '1.2rem', md: '1.3rem' },
                          wordBreak: 'break-word',
                        }}
                      >
                        {research.title}
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5, flexWrap: 'wrap' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <CalendarToday fontSize="small" color="action" />
                          <Typography variant="body2" color="textSecondary">
                            {research.type === 'Current Research' 
                              ? `${formatDate(research.publicationDate)} - Present`
                              : formatDate(research.publicationDate)
                            }
                          </Typography>
                        </Box>
                        <Chip 
                          label={research.type} 
                          size="small" 
                          color={research.type === 'Current Research' ? 'success' : 'info'}
                          sx={{ fontSize: { xs: '0.75rem', sm: '0.8rem' } }}
                        />
                      </Box>
                    </Box>
                  </Box>

                  <Typography
                    variant="body1"
                    sx={{
                      color: theme.palette.text.secondary,
                      lineHeight: 1.7,
                      mb: 2,
                      display: '-webkit-box',
                      WebkitLineClamp: expandedResearch === research._id ? 'unset' : 3,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                      fontSize: { xs: '0.9rem', sm: '1rem' },
                    }}
                  >
                    {research.description.slice(0, 160)}...
                  </Typography>

                  {research.description.length > 180 && (
                    <Button
                      // onClick={() => setExpandedResearch(expandedResearch === research._id ? null : research._id)}
                      onClick={() => {
                        console.log("clicked");
                        router.push(`/Home/research/${research._id}`)
                      }}

                      size="small"
                      sx={{ 
                        alignSelf: 'flex-start', 
                        px: 1, 
                        minWidth: 0, 
                        color: theme.palette.primary.main, 
                        mb: 2, 
                        '&:hover': { background: 'none' },
                        fontSize: { xs: '0.8rem', sm: '0.9rem' },
                      }}
                    >
                      {expandedResearch === research._id ? (
                        <>
                          Show less <ExpandLess sx={{ ml: 0.5 }} />
                        </>
                      ) : (
                        <>
                          Read more <ExpandMore sx={{ ml: 0.5 }} />
                        </>
                      )}
                    </Button>
                  )}

                  {/* Authors */}
                  {research.authors && research.authors.length > 0 && (
                    <Box sx={{ mb: 2 }}>
                      <Typography 
                        variant="subtitle2" 
                        sx={{ 
                          fontWeight: 600, 
                          color: theme.palette.text.primary, 
                          mb: 1,
                          fontSize: { xs: '0.9rem', sm: '1rem' },
                        }}
                      >
                        Authors:
                      </Typography>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                        {research.authors.map((author, i) => (
                          <Chip 
                            key={i} 
                            label={author.trim()} 
                            size="small" 
                            variant="outlined"
                            sx={{ fontSize: { xs: '0.75rem', sm: '0.8rem' } }}
                          />
                        ))}
                      </Box>
                    </Box>
                  )}

                  {/* Journal, DOI, Link */}
                  {research.journal && (
                    <Typography 
                      variant="subtitle2" 
                      color="primary" 
                      sx={{ 
                        mb: 1,
                        fontSize: { xs: '0.9rem', sm: '1rem' },
                        wordBreak: 'break-word',
                      }}
                    >
                      {research.journal}
                    </Typography>
                  )}

                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mt: 'auto' }}>
                    {research.doi && (
                      <Link 
                        href={`https://doi.org/${research.doi}`} 
                        target="_blank" 
                        sx={{ 
                          display: 'flex', 
                          alignItems: 'center', 
                          gap: 0.5,
                          fontSize: { xs: '0.8rem', sm: '0.9rem' },
                        }}
                      >
                        <Language fontSize="small" />
                        <Typography variant="body2">DOI: {research.doi}</Typography>
                      </Link>
                    )}
                    {research.link && (
                      <Link 
                        href={research.link} 
                        target="_blank" 
                        sx={{ 
                          display: 'flex', 
                          alignItems: 'center', 
                          gap: 0.5,
                          fontSize: { xs: '0.8rem', sm: '0.9rem' },
                        }}
                      >
                        <Language fontSize="small" />
                        <Typography variant="body2">
                          View {research.type === 'Current Research' ? 'Research' : 'Paper'}
                        </Typography>
                      </Link>
                    )}
                  </Box>

                  {/* Owner Email (optional) */}
                  {research.ownerEmail && (
                    <Typography 
                      variant="caption" 
                      color="textSecondary" 
                      sx={{ 
                        mt: 1,
                        fontSize: { xs: '0.7rem', sm: '0.75rem' },
                      }}
                    >
                      Owner: {research.ownerEmail}
                    </Typography>
                  )}
                </Paper>
              </motion.div>
            ))}
          </Box>

          {hasMore && !isPage.isItPage && (
                <Box sx={{ display: "flex", justifyContent: "center", mt: 6 }}>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    variant="contained"
                    color="primary"
                    endIcon={<ExpandMore />}
                    onClick={() => router.push("/Home/research")}
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
                    Explore All Research
                  </Button>
                </motion.div>
              </Box>
          )}
        </motion.div>
      </Container>
    </Box>
  );
};

export default ResearchSection; 