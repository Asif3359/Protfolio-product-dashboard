import { Box, Container, Typography, IconButton, Stack, Divider } from "@mui/material";
import React, { useEffect, useState } from "react";
import FacebookIcon from "@mui/icons-material/Facebook";
import TwitterIcon from "@mui/icons-material/Twitter";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import YouTubeIcon from "@mui/icons-material/YouTube";
import EmailIcon from "@mui/icons-material/Email";
// import PhoneIcon from "@mui/icons-material/Phone";
import { getData } from "../../utils/getData";
import PersonIcon from "@mui/icons-material/Person";

interface SocialMedia {
  facebook?: string;
  twitter?: string;
  linkedin?: string;
  youtube?: string;
}

interface Contact {
  email?: string;
  mobile?: string;
}

interface ProfileData {
  name?: string;
  socialMedia?: SocialMedia;
  contact?: Contact;
}

function FooterSection() {
  const [profile, setProfile] = useState<ProfileData | null>(null);

  useEffect(() => {
    async function fetchProfile() {
      const data = await getData("profile");
      setProfile(data);
    }
    fetchProfile();
  }, []);

  return (
    <Box
      component="footer"
      sx={{
        py: 3,
        px: 2,
        mt: "auto",
        backgroundColor: "background.paper",
        borderTop: "1px solid #e0e0e0",
      }}
    >
      <Container maxWidth="lg">
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={2}
          justifyContent="space-between"
          alignItems="center"
          sx={{ mb: 1 }}
        >
          {/* Contact Info */}
          <Stack direction="column" spacing={2} alignItems="flex-start">
            {profile?.name && (
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ display: "flex", alignItems: "center", gap: 0.5 }}
              >
                <PersonIcon fontSize="small" /> {profile.name}
              </Typography>
            )}
            {profile?.contact?.email && (
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ display: "flex", alignItems: "center", gap: 0.5 }}
              >
                <EmailIcon fontSize="small" /> {profile.contact.email}
              </Typography>
            )}
            {/* {profile?.contact?.mobile && (
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ display: "flex", alignItems: "center", gap: 0.5 }}
              >
                <PhoneIcon fontSize="small" /> {profile.contact.mobile}
              </Typography>
            )} */}
          </Stack>

          {/* Social Media */}
          <Stack direction="row" spacing={1}>
            {profile?.socialMedia?.facebook && (
              <IconButton
                color="primary"
                component="a"
                href={profile.socialMedia.facebook}
                target="_blank"
                aria-label="Facebook"
              >
                <FacebookIcon />
              </IconButton>
            )}
            {profile?.socialMedia?.twitter && (
              <IconButton
                color="primary"
                component="a"
                href={profile.socialMedia.twitter}
                target="_blank"
                aria-label="Twitter"
              >
                <TwitterIcon />
              </IconButton>
            )}
            {profile?.socialMedia?.linkedin && (
              <IconButton
                color="primary"
                component="a"
                href={profile.socialMedia.linkedin}
                target="_blank"
                aria-label="LinkedIn"
              >
                <LinkedInIcon />
              </IconButton>
            )}
            {profile?.socialMedia?.youtube && (
              <IconButton
                color="primary"
                component="a"
                href={profile.socialMedia.youtube}
                target="_blank"
                aria-label="YouTube"
              >
                <YouTubeIcon />
              </IconButton>
            )}
          </Stack>
        </Stack>
        <Divider sx={{mt:3}}>

        </Divider>
        <Typography variant="body2" color="text.secondary" align="center" sx={{ mt: 3 }}>
          © {new Date().getFullYear()} Md. Mehedi Hasan Sagar &mdash; Mechanical Engineer.<br />
          This professional portfolio was crafted with passion using Next.js and Material-UI.<br />
          All rights reserved.
        </Typography>
      </Container>
    </Box>
  );
}

export default FooterSection;
