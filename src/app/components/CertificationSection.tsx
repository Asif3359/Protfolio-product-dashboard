'use client'
import React, { useState } from 'react';
import { Box, Typography, Paper, Divider, Chip, Button, Grid, useTheme, Container, Avatar, useMediaQuery } from '@mui/material';
import { Verified, CalendarToday, Language, ExpandMore, ExpandLess } from '@mui/icons-material';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

interface Certification {
  _id: string;
  title: string;
  issuer: string;
  date: string;
  expiryDate?: string;
  credentialId?: string;
  credentialUrl?: string;
  image?: string;
  description?: string;
}

interface CertificationSectionProps {
  certificationsTitle: string;
  certificationsList: Certification[];
  isPage: {
    isItPage: boolean;
  };
}

const CertificationSection: React.FC<CertificationSectionProps> = ({
  certificationsTitle,
  certificationsList,
  isPage
}) => {
  const [expandedCert] = useState<string | null>(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const router = useRouter();
  if (!certificationsList?.length) {
    return null;
  }

  const visibleCerts = isPage.isItPage ? certificationsList : certificationsList.slice(0, 2); // Show only 2 by default
  const hasMore = certificationsList.length > 2;

  // Determine grid columns: 1 if only one item, 2 otherwise
  const gridColumns = visibleCerts.length === 1
    ? '1fr'
    : isMobile
      ? 'repeat(1, 1fr)'
      : { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(2, 1fr)', lg: 'repeat(2, 1fr)' };



  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
  };

  return (
    <Box
      component="section"
      sx={{
        py: { xs: 2, md: 4 },
        backgroundColor: theme.palette.background.default,
      }}
    >
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
                fontWeight: 700,
                mb: 4,
                color: theme.palette.text.primary,
                fontSize: { xs: '1.8rem', md: '2.2rem' },
                textAlign: 'center',
              }}
            >
              {certificationsTitle}
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
            {visibleCerts.map((cert, index) => (
              <Grid
                key={cert._id}
                sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}
              >
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
                    {/* Certification Image */}
                    {cert.image && (
                      <Box
                        sx={{
                          position: 'relative',
                          width: '100%',
                          height: { xs: 100, sm: 120, md: 140 },
                          mb: 3,
                          borderRadius: 2,
                          overflow: 'hidden',
                          bgcolor: theme.palette.action.hover,
                        }}
                      >
                        <Image
                          src={cert.image}
                          alt={cert.title}
                          fill
                          style={{ objectFit: 'contain' }}
                          sizes="(max-width: 600px) 100vw, (max-width: 900px) 50vw, 33vw"
                        />
                      </Box>
                    )}

                    {/* Certification Header */}
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2, mb: 2 }}>
                      <Avatar sx={{
                        bgcolor: theme.palette.primary.main,
                        color: theme.palette.primary.contrastText,
                        width: 40,
                        height: 40,
                      }}>
                        <Verified />
                      </Avatar>
                      <Box sx={{ flex: 1 }}>
                        <Typography
                          variant="h5"
                          sx={{
                            fontWeight: 700,
                            lineHeight: 1.2,
                            color: theme.palette.text.primary,
                            fontSize: { xs: '1.2rem', md: '1.3rem' },
                          }}
                        >
                          {cert.title}
                        </Typography>
                        <Typography
                          variant="subtitle1"
                          color="primary"
                          gutterBottom
                        >
                          {cert.issuer}
                        </Typography>
                      </Box>
                    </Box>

                    {/* Certification Dates */}
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <CalendarToday fontSize="small" color="action" />
                        <Typography variant="body2" color="textSecondary">
                          {formatDate(cert.date)}
                        </Typography>
                      </Box>
                      {cert.expiryDate && (
                        <Chip
                          label={`Expires: ${formatDate(cert.expiryDate)}`}
                          size="small"
                          color="warning"
                          variant="outlined"
                        />
                      )}
                    </Box>

                    {/* Certification Description */}
                    <Typography
                      variant="body1"
                      sx={{
                        color: theme.palette.text.secondary,
                        lineHeight: 1.7,
                        mb: 2,
                        display: '-webkit-box',
                        WebkitLineClamp: expandedCert === cert._id ? 'unset' : 3,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                      }}
                    >
                      {cert.description}
                    </Typography>

                    {/* Read More Button */}
                    {cert.description && cert.description.length > 120 && (
                      <Button
                        onClick={() => {
                          router.push(`/Home/certification/${cert._id}`);
                        }}
                        size="small"
                        sx={{
                          alignSelf: 'flex-start',
                          px: 1,
                          minWidth: 0,
                          color: theme.palette.primary.main,
                          '&:hover': {
                            background: 'none',
                          },
                          mb: 2,
                        }}
                      >
                        {expandedCert === cert._id ? (
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

                    {/* Credential ID */}
                    {cert.credentialId && (
                      <Box sx={{ mb: 2 }}>
                        <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 600 }}>
                          Credential ID:
                        </Typography>
                        <Chip label={cert.credentialId} size="small" variant="outlined" />
                      </Box>
                    )}

                    {/* Credential URL */}
                    {cert.credentialUrl && (
                      <Button
                        variant="contained"
                        size="small"
                        startIcon={<Language />}
                        href={cert.credentialUrl}
                        target="_blank"
                        sx={{ mt: 'auto' }}
                        fullWidth
                      >
                        View Credential
                      </Button>
                    )}
                  </Paper>
                </motion.div>
              </Grid>
            ))}
          </Grid>

          {hasMore && !isPage.isItPage && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 6 }}>
              <Button
                variant="outlined"
                color="primary"
                endIcon={<ExpandMore />}
                // You can add navigation or expand logic here
                onClick={() => router.push('/Home/certification')}
                sx={{
                  borderRadius: 50,
                  textTransform: 'none',
                  fontWeight: 600,
                  fontSize: '1rem',
                }}
              >
                Show More Certifications
              </Button>
            </Box>
          )}
        </motion.div>
      </Container>
    </Box>
  );
};

export default CertificationSection; 