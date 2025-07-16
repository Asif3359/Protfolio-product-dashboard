import { getDataById } from '@/utils/getData';
import { Typography, Box, Chip, Stack, Divider, Paper, Link } from '@mui/material';
import { CalendarToday } from '@mui/icons-material';
import ProjectImageSlider from "../../../components/ProjectImageSlider";

interface ProjectPageProps {
  params: Promise<{ id: string }>;
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { id } = await params;
  const projectData = await getDataById("project", id);

  if (!projectData) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <Typography variant="h6" color="error">Project not found.</Typography>
      </Box>
    );
  }

  return (
    <Paper
      elevation={3}
      sx={{
        maxWidth: 1000,
        mx: 'auto',
        mt: { xs: 2, md: 6 },
        mb: { xs: 2, md: 6 },
        p: { xs: 2, sm: 4 },
        borderRadius: 3,
        bgcolor: 'background.paper',
      }}
    >
      {/* Title and Status */}
      <Typography variant="h4" fontWeight={700} sx={{ color: 'primary.main', mb: 2 }}>
        {projectData.title}
      </Typography>
      <Stack direction="row" spacing={2} sx={{ mb: 2, flexWrap: 'wrap' }}>
        <Chip label={projectData.status} color={projectData.status === 'Completed' ? 'success' : 'warning'} size="small" />
        <Chip
          icon={<CalendarToday fontSize="small" />}
          label={`${new Date(projectData.startDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short' })} - ${projectData.endDate ? new Date(projectData.endDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short' }) : 'Present'}`}
          size="small"
        />
      </Stack>

      {/* Image */}
      {projectData.images && projectData.images.length > 0 && (
        <ProjectImageSlider images={projectData.images} title={projectData.title} />
      )}

      {/* Description */}
      <Typography
        variant="body1"
        sx={{
          wordBreak: 'break-word',
          whiteSpace: 'pre-line',
          lineHeight: 1.8,
          fontSize: { xs: '1rem', sm: '1.1rem' },
          color: 'text.secondary',
          mb: 3,

        }}
      >
        {projectData.description}
      </Typography>

      {/* Features */}
      {projectData.features && projectData.features.length > 0 && (
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 600, color: 'text.primary', mb: 1 }}>
            Key Features:
          </Typography>
          <Box component="ul" sx={{ m: 0, p: 0, pl: 2, listStyleType: 'none' }}>
            {projectData.features.map((feature: string, i: number) => (
              <Box
                component="li"
                key={i}
                sx={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  mb: 1,
                  '&:before': {
                    content: '"•"',
                    color: 'primary.main',
                    mr: 1,
                    fontSize: '1.2rem',
                    lineHeight: 1,
                  },
                }}
              >
                <Typography variant="body2" sx={{ color: 'text.secondary', lineHeight: 1.6 }}>
                  {feature}
                </Typography>
              </Box>
            ))}
          </Box>
        </Box>
      )}

      {/* Technologies */}
      {projectData.technologies && projectData.technologies.length > 0 && (
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 600, color: 'text.primary', mb: 1 }}>
            Technologies Used:
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {projectData.technologies.map((tech: string, i: number) => (
              <Chip
                key={i}
                label={tech}
                size="small"
                variant="outlined"
                sx={{ borderColor: 'divider', color: 'text.secondary' }}
              />
            ))}
          </Box>
        </Box>
      )}

      {/* Links */}
      <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
        {projectData.link && projectData.link !== 'N/A' && (
          <Link href={projectData.link} target="_blank" rel="noopener noreferrer" underline="hover">
            Live Link
          </Link>
        )}
        {projectData.githubLink && projectData.githubLink !== 'N/A' && (
          <Link href={projectData.githubLink} target="_blank" rel="noopener noreferrer" underline="hover">
            GitHub
          </Link>
        )}
      </Stack>

      <Divider sx={{ my: 2 }} />

      {/* Owner and Timestamps */}
      <Typography variant="caption" color="text.secondary">
        Owner: {projectData.ownerEmail} <br />
        {/* Created: {new Date(projectData.createdAt).toLocaleString()} | Updated: {new Date(projectData.updatedAt).toLocaleString()} */}
      </Typography>
    </Paper>
  );
}