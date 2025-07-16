import { getDataById } from '@/utils/getData';
import { Typography, Box, Chip, Stack, Divider, Paper, Link } from '@mui/material';
import { CalendarToday, EmojiEvents } from '@mui/icons-material';

interface AwardPageProps {
  params: Promise<{ id: string }>;
}

export default async function AwardPage({ params }: AwardPageProps) {
  const { id } = await params;
  const awardData = await getDataById("award", id);

  if (!awardData) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <Typography variant="h6" color="error">Award not found.</Typography>
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
      <Typography variant="h4" fontWeight={700} sx={{ color: 'primary.main', mb: 2 }}>
        {awardData.title}
      </Typography>
      <Stack direction="row" spacing={2} sx={{ mb: 2, flexWrap: 'wrap' }}>
        <Chip label={awardData.issuer} color="primary" size="small" icon={<EmojiEvents fontSize="small" />} />
        <Chip
          icon={<CalendarToday fontSize="small" />}
          label={`Date: ${new Date(awardData.date).toLocaleDateString('en-US', { year: 'numeric', month: 'short' })}`}
          size="small"
        />
        {awardData.category && (
          <Chip label={awardData.category} color="secondary" size="small" />
        )}
      </Stack>

      {awardData.link && awardData.link !== 'N/A' && (
        <Box sx={{ mb: 2 }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 600, color: 'text.primary', mb: 1 }}>
            Award Link:
          </Typography>
          <Link href={awardData.link} target="_blank" rel="noopener noreferrer" underline="hover">
            View Award
          </Link>
        </Box>
      )}

      <Divider sx={{ my: 2 }} />

      <Typography
        variant="body1"
        sx={{
          whiteSpace: 'pre-line',
          wordBreak: 'break-word',
          lineHeight: 1.8,
          fontSize: { xs: '1rem', sm: '1.1rem' },
          color: 'text.secondary',
          mb: 3,
        }}
      >
        {awardData.description}
      </Typography>

      <Typography variant="caption" color="text.secondary">
        Owner: {awardData.ownerEmail}
      </Typography>
    </Paper>
  );
}    