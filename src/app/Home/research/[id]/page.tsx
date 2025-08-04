import { getDataById } from "@/utils/getData";
import { Typography, Box, Chip, Stack, Divider, Paper, Link } from "@mui/material";
import { CalendarToday, People, Description, Link as LinkIcon } from '@mui/icons-material';
import ImageDisplay from "@/app/components/ImageDisplay";

interface ResearchPageProps {
  params: Promise<{ id: string }>;
}

export default async function ResearchPage({ params }: ResearchPageProps) {
  const { id } = await params;
  const researchData = await getDataById("research", id);
  const research = researchData;

  if (!research) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <Typography variant="h6" color="error">Research not found.</Typography>
      </Box>
    );
  }

  return (
    <Paper 
      elevation={3} 
      sx={{ 
        maxWidth: 1000, 
        mx: "auto", 
        mt: 6, 
        mb: 6, 
        p: 4, 
        borderRadius: 2,
        bgcolor: "background.paper"
      }}
    >
      <ImageDisplay
        src={research.image}
        alt={research.title}
        // height="350px"
        // maxHeight="300px"
      />
      <Typography 
        variant="h3" 
        fontWeight={600} 
        gutterBottom
        sx={{
          color: 'primary.main',
          mb: 3,
          fontSize: { xs: '1.5rem', sm: '2.2rem' },
          whiteSpace: 'pre-line',
          wordBreak: 'break-word'
        }}
      >
        {research.title}
      </Typography>

      <Stack    sx={{ mb: 3, display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, alignItems: 'center' ,gap:2  }}>
        <Chip 
          label={research.type} 
          color="primary" 
          variant="outlined"
          size="small"
        />
        <Chip 
          label={research.status} 
          color={research.status === 'Published' ? 'success' : 'warning'} 
          size="small"
        />
        {research.publicationDate && (
          <Chip 
            icon={<CalendarToday fontSize="small" />}
            label={new Date(research.publicationDate).toLocaleDateString()} 
            size="small"
          />
        )}
      </Stack>

      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <People color="action" fontSize="small" sx={{ mr: 1 }} />
        <Typography variant="subtitle1" color="text.secondary">
          {research.authors?.join(", ")}
        </Typography>
      </Box>

      <Divider sx={{ my: 3 }} />

      <Box sx={{ mb: 4 }}>
        <Typography 
          variant="body1" 
          sx={{ 
            wordBreak: 'break-word',
            whiteSpace: 'pre-line',
            lineHeight: 1.8,
            fontSize: '1rem'
          }}
        >
          {research.description}
        </Typography>
      </Box>

      <Paper elevation={0} sx={{ p: 2, mb: 3, bgcolor: 'background.default' }}>
        <Stack spacing={1.5}>
          {research.journal && (
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Description color="action" fontSize="small" sx={{ mr: 1.5 }} />
              <Typography variant="body2">
                <strong>Journal:</strong> {research.journal}
              </Typography>
            </Box>
          )}
          
          {research.doi && (
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Description color="action" fontSize="small" sx={{ mr: 1.5 }} />
              <Typography variant="body2">
                <strong>DOI:</strong> {research.doi}
              </Typography>
            </Box>
          )}
          
          {research.link && (
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <LinkIcon color="action" fontSize="small" sx={{ mr: 1.5 }} />
              <Typography variant="body2">
                <strong>Link:</strong> {' '}
                <Link href={research.link} target="_blank" rel="noopener noreferrer" underline="hover">
                  {research.link}
                </Link>
              </Typography>
            </Box>
          )}
        </Stack>
      </Paper>
    </Paper>
  );
}