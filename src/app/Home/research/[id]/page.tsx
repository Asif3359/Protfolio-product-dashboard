import { getData } from "@/utils/getData";
import React from "react";
import { Typography, Box, Chip, Stack, Divider, Paper, Link } from "@mui/material";
import { CalendarToday, People, Description, Link as LinkIcon } from '@mui/icons-material';

export default async function ResearchPage({ params }: { params: { id: string } }) {
  const { id } = await params;
  const researchData = await getData("research");
  const research = researchData.find((research: any) => research._id === id);

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
      <Typography 
        variant="h3" 
        fontWeight={600} 
        gutterBottom
        sx={{
          color: 'primary.main',
          mb: 3,
          fontSize: { xs: '1.8rem', sm: '2.2rem' }
        }}
      >
        {research.title}
      </Typography>

      <Stack direction="row" spacing={2} sx={{ mb: 3 }}>
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
            whiteSpace: "pre-line", 
            lineHeight: 1.8,
            fontSize: '1.1rem'
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