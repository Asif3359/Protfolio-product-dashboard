import { getDataById } from '@/utils/getData';
import { Typography, Box, Chip, Stack, Divider, Paper, Avatar } from '@mui/material';
import { Work, CalendarToday, LocationOn } from '@mui/icons-material';

interface ExperiencePageProps {
  params: Promise<{ id: string }>;
}

export default async function ExperiencePage({ params }: ExperiencePageProps) {
  const { id } = await params;
  const experienceData = await getDataById("experience", id);

  if (!experienceData) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <Typography variant="h6" color="error">Experience not found.</Typography>
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
      <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
        <Avatar sx={{ bgcolor: 'primary.main', color: 'primary.contrastText', width: 48, height: 48 }}>
          <Work />
        </Avatar>
        <Box>
          <Typography variant="h4" fontWeight={700} sx={{ color: 'primary.main', fontSize: { xs: '1.3rem', sm: '2rem' } }}>
            {experienceData.title}
          </Typography>
          <Typography variant="h6" color="primary" sx={{ fontWeight: 600, mb: 0.5 }}>
            {experienceData.company}
          </Typography>
        </Box>
      </Stack>

      <Stack   sx={{ mb: 2, display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, alignItems: {xs:'flex-start',sm:'center'} ,gap:2 }}>
        <Chip
          label={experienceData.isCurrent ? 'Current' : 'Past'}
          color={experienceData.isCurrent ? 'success' : 'default'}
          size="small"
        />
        <Chip
          icon={<CalendarToday fontSize="small" />}
          label={`${new Date(experienceData.startDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short' })} - ${experienceData.isCurrent ? 'Present' : experienceData.endDate ? new Date(experienceData.endDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short' }) : 'Present'}`}
          size="small"
        />
        <Chip
          icon={<LocationOn fontSize="small" />}
          label={experienceData.location}
          size="small"
        />
      </Stack>

      <Divider sx={{ my: 2 }} />

      <Box sx={{ mb: 3 }}>
        <Typography
          variant="body1"
          sx={{
            whiteSpace: 'pre-line',
            wordBreak: 'break-word',
            lineHeight: 1.8,
            fontSize: { xs: '1rem', sm: '1.1rem' },
            color: 'text.secondary',
          }}
        >
          {experienceData.description}
        </Typography>
      </Box>

      {experienceData.responsibilities && experienceData.responsibilities.length > 0 && (
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 600, color: 'text.primary', mb: 1 }}>
            Key Responsibilities:
          </Typography>
          <Box component="ul" sx={{ m: 0, p: 0, pl: 2, listStyleType: 'none' }}>
            {experienceData.responsibilities.map((responsibility: string, i: number) => (
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
                  {responsibility}
                </Typography>
              </Box>
            ))}
          </Box>
        </Box>
      )}

      {experienceData.achievements && experienceData.achievements.length > 0 && (
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 600, color: 'text.primary', mb: 1 }}>
            Key Achievements:
          </Typography>
          <Box component="ul" sx={{ m: 0, p: 0, pl: 2, listStyleType: 'none' }}>
            {experienceData.achievements.map((achievement: string, i: number) => (
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
                  {achievement}
                </Typography>
              </Box>
            ))}
          </Box>
        </Box>
      )}

      {experienceData.technologies && experienceData.technologies.length > 0 && (
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 600, color: 'text.primary', mb: 1 }}>
            Technologies Used:
          </Typography>
          <Box component="ul" sx={{ m: 0, p: 0, pl: 2, listStyleType: 'none' }}>
            {experienceData.technologies.map((tech: string, i: number) => (
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
                  {tech}
                </Typography>
              </Box>
            ))}
          </Box>
        </Box>
      )}

      {experienceData.ownerEmail && (
        <Typography variant="caption" color="text.secondary" sx={{ mt: 2 }}>
          Owner: {experienceData.ownerEmail}
        </Typography>
      )}
    </Paper>
  );
}