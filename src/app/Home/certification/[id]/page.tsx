import { getDataById } from "@/utils/getData";
import {
  Typography,
  Box,
  Chip,
  Stack,
  Divider,
  Paper,
  Link,
} from "@mui/material";
import { CalendarToday, Verified } from "@mui/icons-material";
import ImageDisplay from "@/app/components/ImageDisplay";

interface CertificationPageProps {
  params: Promise<{ id: string }>;
}

export default async function CertificationPage({
  params,
}: CertificationPageProps) {
  const { id } = await params;
  const certificationData = await getDataById("certification", id);

  if (!certificationData) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
        <Typography variant="h6" color="error">
          Certification not found.
        </Typography>
      </Box>
    );
  }

  return (
    <Paper
      elevation={3}
      sx={{
        maxWidth: 1000,
        mx: "auto",
        mt: { xs: 2, md: 6 },
        mb: { xs: 2, md: 6 },
        p: { xs: 2, sm: 4 },
        borderRadius: 3,
        bgcolor: "background.paper",
      }}
    >
      <ImageDisplay
        src={certificationData.image}
        alt={certificationData.title}
        // height="350px"
        // maxHeight="300px"
      />
      <Typography
        variant="h4"
        fontWeight={700}
        sx={{ color: "primary.main", mb: 2 }}
      >
        {certificationData.title}
      </Typography>
      <Stack
        sx={{
          mb: 2,
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          alignItems: { xs: "flex-start", sm: "center" },
          gap: 2,
        }}
      >
        <Chip
          label={certificationData.issuer}
          color="primary"
          size="small"
          icon={<Verified fontSize="small" />}
        />
        <Chip
          icon={<CalendarToday fontSize="small" />}
          label={`Issued: ${new Date(certificationData.date).toLocaleDateString(
            "en-US",
            { year: "numeric", month: "short" }
          )}`}
          size="small"
        />
        {certificationData.expiryDate && (
          <Chip
            icon={<CalendarToday fontSize="small" />}
            label={`Expiry: ${new Date(
              certificationData.expiryDate
            ).toLocaleDateString("en-US", {
              year: "numeric",
              month: "short",
            })}`}
            size="small"
            color="warning"
          />
        )}
      </Stack>

      {certificationData.credentialUrl &&
        certificationData.credentialUrl !== "N/A" && (
          <Box sx={{ mb: 2 }}>
            <Typography
              variant="subtitle2"
              sx={{ fontWeight: 600, color: "text.primary", mb: 1 }}
            >
              Credential:
            </Typography>
            <Link
              href={certificationData.credentialUrl}
              target="_blank"
              rel="noopener noreferrer"
              underline="hover"
            >
              View Certificate
            </Link>
          </Box>
        )}

      <Divider sx={{ my: 2 }} />

      <Typography
        variant="body1"
        sx={{
          whiteSpace: "pre-line",
          wordBreak: "break-word",
          lineHeight: 1.8,
          fontSize: { xs: "1rem", sm: "1.1rem" },
          color: "text.secondary",
          mb: 3,
        }}
      >
        {certificationData.description}
      </Typography>

      <Typography variant="caption" color="text.secondary">
        Owner: {certificationData.ownerEmail}
      </Typography>
    </Paper>
  );
}
