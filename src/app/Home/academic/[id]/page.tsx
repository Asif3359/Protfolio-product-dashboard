import ImageDisplay from '@/app/components/ImageDisplay';
import { getDataById } from '@/utils/getData';
import { CalendarToday, Verified, Star } from '@mui/icons-material';
import { Box, Chip, Divider, Link, Paper, Stack, Typography } from '@mui/material';
import React from 'react';

async function page({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const academic = await getDataById("academic", id);

    if (!academic) {
        return (
            <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
                <Typography variant="h6" color="error">
                    Academic record not found.
                </Typography>
            </Box>
        );
    }

    // Calculate duration if end date exists
    const duration = academic.endDate
        ? `${new Date(academic.startDate).getFullYear()} - ${new Date(academic.endDate).getFullYear()}`
        : `Since ${new Date(academic.startDate).getFullYear()}`;

    return (
        <Box sx={{ maxWidth: 1200, mx: 'auto', px: { xs: 2, md: 4 }, py: 4 }}>
            <Paper
                elevation={2}
                sx={{
                    borderRadius: 4,
                    overflow: 'hidden',
                    bgcolor: 'background.paper',
                    boxShadow: '0 8px 32px rgba(0,0,0,0.05)',
                }}
            >
                {/* Header Section */}
                <Box sx={{
                    bgcolor: 'primary.light',
                    p: { xs: 2, md: 4 },
                    background: 'linear-gradient(135deg, #e4e8f0 100%, #e4e8f0 100%)',
                }}>
                    {/* Logo and Institution Name - Responsive Layout */}
                    <Box sx={{
                        display: 'flex',
                        flexDirection: { xs: 'column', md: 'row' },
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: { xs: 2, md: 4 },
                        mb: { xs: 2, md: 3 }
                    }}>
                        <Box sx={{
                            width: { xs: 120, md: 150 },
                            height: { xs: 120, md: 150 },
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            bgcolor: 'white',
                            borderRadius: 2,
                            p: 1,
                            boxShadow: 1,
                            flexShrink: 0
                        }}>
                            <ImageDisplay
                                src={academic.logo}
                                alt={academic.institution}
                                width="100%"
                                height="100%"
                                objectFit="contain"
                            />
                        </Box>

                        <Box sx={{
                            textAlign: { xs: 'center', md: 'left' },
                            flex: 1
                        }}>
                            <Typography
                                variant="h3"
                                fontWeight={700}
                                sx={{
                                    color: "primary.dark",
                                    mb: 1,
                                    fontSize: { xs: '1.3rem', sm: '1.5rem', md: '1.8rem' },
                                    lineHeight: 1.2
                                }}
                            >
                                {academic.institution}
                            </Typography>

                            <Typography
                                variant="h5"
                                sx={{
                                    color: 'text.secondary',
                                    mb: 2,
                                    fontSize: { xs: '1rem', sm: '1.2rem', md: '1.5rem' }
                                }}
                            >
                                {academic.degree} in {academic.field}
                            </Typography>

                            <Stack
                                direction={{ xs: 'column', sm: 'row' }}
                                spacing={1}
                                sx={{
                                    mb: 2,
                                    justifyContent: { xs: 'center', md: 'flex-start' }
                                }}
                            >
                                <Chip
                                    label={duration}
                                    color="primary"
                                    size="small"
                                    icon={<CalendarToday fontSize="small" />}
                                    sx={{ fontWeight: 500 }}
                                />
                                {(academic.gpa && academic.outOf) && (
                                    <Chip
                                        label={` ${academic.outOf === 4 ? "CGPA" : "GPA"}: ${academic.gpa.toFixed(2)} out of ${academic.outOf.toFixed(2)}`}
                                        color="secondary"
                                        size="small"
                                        icon={<Star fontSize="small" />}
                                    />
                                )}
                            </Stack>
                        </Box>
                    </Box>
                </Box>

                {/* Main Content */}
                <Box sx={{ p: { xs: 2, sm: 3, md: 4 } }}>
                    {/* Description */}
                    {academic.description && (
                        <>
                            <Typography variant="h6" sx={{
                                fontWeight: 600,
                                mb: 2,
                                color: 'primary.main',
                                fontSize: { xs: '1.1rem', md: '1.25rem' }
                            }}>
                                About This Program
                            </Typography>
                            <Typography
                                variant="body1"
                                sx={{
                                    whiteSpace: "pre-line",
                                    lineHeight: 1.8,
                                    fontSize: { xs: "0.9rem", sm: "1rem", md: "1.1rem" },
                                    color: "text.secondary",
                                    mb: 4,
                                }}
                            >
                                {academic.description}
                            </Typography>
                            <Divider sx={{ my: 3 }} />
                        </>
                    )}

                    {/* Achievements */}
                    {academic.achievements && academic.achievements.length > 0 && (
                        <>
                            <Typography variant="h6" sx={{
                                fontWeight: 600,
                                mb: 2,
                                color: 'primary.main',
                                fontSize: { xs: '1.1rem', md: '1.25rem' }
                            }}>
                                Key Achievements
                            </Typography>
                            <Box component="ul" sx={{
                                pl: { xs: 2, md: 3 },
                                mb: 4,
                                '& li': {
                                    mb: { xs: 0.5, md: 1 }
                                }
                            }}>
                                {academic.achievements.map((achievement: string, index: number) => (
                                    <Box component="li" key={index} sx={{ mb: 1 }}>
                                        <Typography variant="body1" sx={{
                                            fontSize: { xs: "0.9rem", sm: "1rem", md: "1.1rem" }
                                        }}>
                                            {achievement}
                                        </Typography>
                                    </Box>
                                ))}
                            </Box>
                            <Divider sx={{ my: 3 }} />
                        </>
                    )}

                    {/* Credential */}
                    {academic.credentialUrl && academic.credentialUrl !== "N/A" && (
                        <Box sx={{ mb: 2 }}>
                            <Typography variant="h6" sx={{
                                fontWeight: 600,
                                mb: 2,
                                color: 'primary.main',
                                fontSize: { xs: '1.1rem', md: '1.25rem' }
                            }}>
                                Official Credential
                            </Typography>
                            <Link
                                href={academic.credentialUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                underline="hover"
                                sx={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: 1,
                                    color: 'secondary.main',
                                    fontWeight: 500,
                                    '&:hover': {
                                        color: 'secondary.dark'
                                    }
                                }}
                            >
                                <Verified fontSize="small" />
                                View Certificate
                            </Link>
                        </Box>
                    )}
                </Box>

                {/* Footer */}
                <Box sx={{
                    bgcolor: 'grey.50',
                    px: { xs: 2, md: 4 },
                    py: 2,
                    borderTop: '1px solid',
                    borderColor: 'divider'
                }}>
                    <Typography variant="caption" color="text.secondary" sx={{
                        fontSize: { xs: '0.7rem', md: '0.75rem' },
                        textAlign: { xs: 'center', md: 'left' }
                    }}>
                        Verified academic record • Owner: {academic.ownerEmail}
                    </Typography>
                </Box>
            </Paper>
        </Box>
    );
}

export default page;