"use client";
import { useEffect, useState, ChangeEvent, FormEvent } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  Avatar,
  Stack,
  InputLabel,
  FormControl,
  CircularProgress,
  Alert,
  AlertTitle,
  Card,
  CardMedia,
  CardContent,
  Grid,
  Container,
} from "@mui/material";
import axios from "axios";
import { useAuth } from "@/context/AuthContext";
import { CloudUpload, Save } from "@mui/icons-material";
import { styled } from "@mui/material/styles";

interface SocialMedia {
  facebook: string;
  twitter: string;
  linkedin: string;
  youtube: string;
}

interface Contact {
  email: string;
  mobile: string;
}

interface ProfileData {
  name: string;
  heroTitle: string;
  heroDescription: string;
  bestThreeWords: string;
  aboutMe: string;
  currentJobTitle: string;
  socialMedia: SocialMedia;
  contact: Contact;
  ownerEmail: string;
  heroPicture: string;
  profilePicture: string;
}

const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  whiteSpace: "nowrap",
  width: 1,
});

const SectionPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  marginBottom: theme.spacing(3),
  background: theme.palette.background.paper,
  borderRadius: theme.shape.borderRadius,
  boxShadow: theme.shadows[2],
  '&:hover': {
    boxShadow: theme.shadows[4],
  },
}));

const SectionTitle = styled(Typography)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  color: theme.palette.primary.main,
  fontWeight: 600,
  display: 'flex',
  alignItems: 'center',
  '&:before': {
    content: '""',
    display: 'inline-block',
    width: '8px',
    height: '20px',
    backgroundColor: theme.palette.primary.main,
    marginRight: theme.spacing(1.5),
    borderRadius: '4px',
  },
}));

export default function ProfilePage() {
  const { token } = useAuth();
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [form, setForm] = useState<ProfileData>({
    name: "",
    heroTitle: "",
    heroDescription: "",
    bestThreeWords: "",
    aboutMe: "",
    currentJobTitle: "",
    socialMedia: { facebook: "", twitter: "", linkedin: "", youtube: "" },
    contact: { email: "", mobile: "" },
    ownerEmail: localStorage.getItem("ownerEmail") || "",
    heroPicture: "",
    profilePicture: "",
  });
  const [profilePicture, setProfilePicture] = useState<File | null>(null);
  const [heroPicture, setHeroPicture] = useState<File | null>(null);
  const [message, setMessage] = useState<{
    text: string;
    severity: "success" | "error" | "info" | "warning";
  } | null>(null);
  const [preview, setPreview] = useState({
    profile: "",
    hero: "",
  });

  // // Set ownerEmail from localStorage on mount
  // useEffect(() => {
  //   const fetchOwnerEmail = async () => {
  //     try {
  //       const res = await axios.get("http://localhost:3000/api/admin/profile", {
  //         headers: { Authorization: `Bearer ${token}` }
  //       });
  //       setForm((prev) => ({
  //         ...prev,
  //         ownerEmail: res.data.email || "",
  //       }));
  //     } catch {
  //       // fallback or error handling
  //     }
  //   };
  //   if (token) fetchOwnerEmail();
  // }, [token]);

  // Fetch profile on mount
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const res = await axios.get("http://localhost:3000/api/profile");
        setProfile(res.data);
        if (res.data) {
          setForm({
            name: res.data.name || "",
            heroTitle: res.data.heroTitle || "",
            heroDescription: res.data.heroDescription || "",
            bestThreeWords: res.data.bestThreeWords || "",
            aboutMe: res.data.aboutMe || "",
            currentJobTitle: res.data.currentJobTitle || "",
            socialMedia: res.data.socialMedia || { facebook: "", twitter: "", linkedin: "", youtube: "" },
            contact: res.data.contact || { email: "", mobile: "" },
            ownerEmail: localStorage.getItem("ownerEmail") || "",
            heroPicture: res.data.heroPicture || "",
            profilePicture: res.data.profilePicture || "",
          });

          if (res.data.profilePicture) {
            setPreview((prev) => ({
              ...prev,
              profile: res.data.profilePicture,
            }));
          }

          if (res.data.heroPicture) {
            setPreview((prev) => ({
              ...prev,
              hero: res.data.heroPicture,
            }));
          }
        }
      } catch {
        setMessage({
          text: "Could not fetch profile data.",
          severity: "error",
        });
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  // Handle input changes
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (name.startsWith("socialMedia")) {
      const field = name.split(".")[1];
      setForm({
        ...form,
        socialMedia: { ...form.socialMedia, [field]: value },
      });
    } else if (name.startsWith("contact")) {
      const field = name.split(".")[1].replace("]", "");
      setForm({
        ...form,
        contact: { ...form.contact, [field]: value },
      });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  // Handle file changes and create preview
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;

    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onloadend = () => {
      if (e.target.name === "profilePicture") {
        setProfilePicture(file);
        setPreview({ ...preview, profile: reader.result as string });
      } else if (e.target.name === "heroPicture") {
        setHeroPicture(file);
        setPreview({ ...preview, hero: reader.result as string });
      }
    };

    reader.readAsDataURL(file);
  };

  // Handle form submit
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    if (!form.contact.email || !form.contact.mobile) {
      setMessage({ text: "Email and mobile are required.", severity: "error" });
      setLoading(false);
      return;
    }

    try {
      const formData = new FormData();
      
      // Append all fields
      formData.append("name", form.name);
      formData.append("heroTitle", form.heroTitle);
      formData.append("heroDescription", form.heroDescription);
      const bestThreeWordsValue = Array.isArray(form.bestThreeWords)
        ? form.bestThreeWords
        : form.bestThreeWords.split(",");
      formData.append("bestThreeWords", JSON.stringify(bestThreeWordsValue));
      formData.append("aboutMe", form.aboutMe);
      formData.append("currentJobTitle", form.currentJobTitle);
      formData.append("ownerEmail", form.ownerEmail);

      // Append contact and socialMedia as JSON strings
      formData.append("contact", JSON.stringify(form.contact));
      formData.append("socialMedia", JSON.stringify(form.socialMedia));

      // Append files if they exist
      if (profilePicture) formData.append("profilePicture", profilePicture);
      if (heroPicture) formData.append("heroPicture", heroPicture);

      // Use PUT for update, POST for create
      const method = profile ? "put" : "post";
      console.log("Submitting profile:", form);
      const res = await axios({
        method,
        url: "http://localhost:3000/api/profile",
        data: formData,
        headers: {
          Authorization: `Bearer ${token}`,
          // "Content-Type": "multipart/form-data",
        },
      });

      setProfile(res.data);
      setMessage({
        text: "Profile updated successfully!",
        severity: "success",
      });

      // Reset file states after successful upload
      setProfilePicture(null);
      setHeroPicture(null);
    } catch (error) {
      const err = error as { response?: { data?: { error?: string } } };
      console.error('PUT /api/profile error:', error);
      setMessage({
        text: err?.response?.data?.error || "Failed to update profile.",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom sx={{ 
        fontWeight: 700,
        color: 'text.primary',
        mb: 4,
        display: 'flex',
        alignItems: 'center',
        gap: 2,
      }}>
        Profile Management
      </Typography>

      {message && (
        <Alert severity={message.severity} sx={{ mb: 3 }}>
          <AlertTitle>
            {message.severity === "success" ? "Success" : "Error"}
          </AlertTitle>
          {message.text}
        </Alert>
      )}

      <form onSubmit={handleSubmit} encType="multipart/form-data">
        {/* Hero Section */}
        <SectionPaper elevation={0}>
          <SectionTitle variant="h6">Hero Section</SectionTitle>
          <Grid container spacing={3}>
            <Grid container spacing={2}>
              <TextField
                label="Hero Title"
                name="heroTitle"
                value={form.heroTitle}
                onChange={handleChange}
                fullWidth
                required
                margin="normal"
                variant="outlined"
                size="small"
              />
              <TextField
                label="Hero Description"
                name="heroDescription"
                value={form.heroDescription}
                onChange={handleChange}
                fullWidth
                multiline
                minRows={3}
                margin="normal"
                variant="outlined"
                size="small"
              />
            </Grid>
            <Grid container spacing={2}>
              <FormControl fullWidth margin="normal">
                <InputLabel shrink sx={{ mb: 1 }}>Hero Image</InputLabel>
                <Stack direction="column" spacing={2} alignItems="flex-start">
                  <Button
                    component="label"
                    variant="outlined"
                    color="secondary"
                    startIcon={<CloudUpload />}
                    sx={{ textTransform: 'none' }}
                  >
                    Upload Hero Image
                    <VisuallyHiddenInput
                      type="file"
                      name="heroPicture"
                      accept="image/*"
                      onChange={handleFileChange}
                    />
                  </Button>
                  {(preview.hero || profile?.heroPicture) && (
                    <Card sx={{ width: '100%', borderRadius: 2 }}>
                      <CardMedia
                        component="img"
                        height="180"
                        image={preview.hero || profile?.heroPicture}
                        alt="Hero preview"
                        sx={{ objectFit: 'cover' }}
                      />
                      <CardContent sx={{ p: 2 }}>
                        <Typography variant="body2" color="text.secondary">
                          Current Hero Image
                        </Typography>
                      </CardContent>
                    </Card>
                  )}
                </Stack>
              </FormControl>
            </Grid>
          </Grid>
        </SectionPaper>

        {/* Personal Information */}
        <SectionPaper elevation={0}>
          <SectionTitle variant="h6">Personal Information</SectionTitle>
          <Grid container spacing={3}>
            <Grid container spacing={2}>
              <TextField
                label="Full Name"
                name="name"
                value={form.name}
                onChange={handleChange}
                fullWidth
                required
                margin="normal"
                variant="outlined"
                size="small"
              />
              <TextField
                label="Current Job Title"
                name="currentJobTitle"
                value={form.currentJobTitle}
                onChange={handleChange}
                fullWidth
                margin="normal"
                variant="outlined"
                size="small"
              />
              <TextField
                label="Best Three Words"
                name="bestThreeWords"
                value={form.bestThreeWords}
                onChange={handleChange}
                fullWidth
                margin="normal"
                helperText="Three words that best describe you (comma separated)"
                variant="outlined"
                size="small"
              />
            </Grid>
            <Grid container spacing={2}>
              <FormControl fullWidth margin="normal">
                <InputLabel shrink sx={{ mb: 1 }}>Profile Picture</InputLabel>
                <Stack direction="column" spacing={2} alignItems="flex-start">
                  <Button
                    component="label"
                    variant="outlined"
                    color="secondary"
                    startIcon={<CloudUpload />}
                    sx={{ textTransform: 'none' }}
                  >
                    Upload Profile Picture
                    <VisuallyHiddenInput
                      type="file"
                      name="profilePicture"
                      accept="image/*"
                      onChange={handleFileChange}
                    />
                  </Button>
                  {(preview.profile || profile?.profilePicture) && (
                    <Avatar
                      src={preview.profile || profile?.profilePicture}
                      sx={{ 
                        width: 120, 
                        height: 120,
                        border: '2px solid',
                        borderColor: 'primary.main'
                      }}
                    />
                  )}
                </Stack>
              </FormControl>
            </Grid>
            <Grid container spacing={2} sx={{ width: '100%' }}>
              <TextField
                label="About Me"
                name="aboutMe"
                value={form.aboutMe}
                onChange={handleChange}
                fullWidth
                multiline
                minRows={6}
                maxRows={12}
                margin="normal"
                variant="outlined"
                size="small"
                sx={{
                  width: '100%',
                  '& .MuiInputBase-root': {
                    overflow: 'auto',
                    maxHeight: '300px',
                    minWidth: '100%',
                  },
                  '& .MuiInputBase-input': {
                    overflow: 'auto',
                    minWidth: '100%',
                  },
                }}
              />
            </Grid>
          </Grid>
        </SectionPaper>

        {/* Contact Information */}
        <SectionPaper elevation={0}>
          <SectionTitle variant="h6">Contact Information</SectionTitle>
          <Grid container spacing={3}>
            <Grid container spacing={2}>
              <TextField
                label="Email"
                name="contact.email"
                value={form.contact.email}
                onChange={handleChange}
                fullWidth
                margin="normal"
                type="email"
                required
                variant="outlined"
                size="small"
              />
            </Grid>
            <Grid container spacing={2}>
              <TextField
                label="Mobile"
                name="contact.mobile"
                value={form.contact.mobile}
                onChange={handleChange}
                fullWidth
                margin="normal"
                required
                variant="outlined"
                size="small"
              />
            </Grid>
              <Grid container spacing={2}>
              <TextField
                label="Owner Email"
                name="ownerEmail"
                value={form.ownerEmail}
                onChange={handleChange}
                fullWidth
                margin="normal"
                InputProps={{ readOnly: true }}
                helperText="This is your account email and cannot be changed"
                variant="outlined"
                size="small"
              />
            </Grid>
          </Grid>
        </SectionPaper>

        {/* Social Media */}
        <SectionPaper elevation={0}>
          <SectionTitle variant="h6">Social Media Links</SectionTitle>
          <Grid container spacing={3}>
            <Grid container spacing={2}>
              <TextField
                label="Facebook URL"
                name="socialMedia.facebook"
                value={form.socialMedia.facebook}
                onChange={handleChange}
                fullWidth
                margin="normal"
                variant="outlined"
                size="small"
                placeholder="https://facebook.com/username"
              />
            </Grid>
            <Grid container spacing={2}>
              <TextField
                label="Twitter URL"
                name="socialMedia.twitter"
                value={form.socialMedia.twitter}
                onChange={handleChange}
                fullWidth
                margin="normal"
                variant="outlined"
                size="small"
                placeholder="https://twitter.com/username"
              />
            </Grid>
              <Grid container spacing={2}>
              <TextField
                label="LinkedIn URL"
                name="socialMedia.linkedin"
                value={form.socialMedia.linkedin}
                onChange={handleChange}
                fullWidth
                margin="normal"
                variant="outlined"
                size="small"
                placeholder="https://linkedin.com/in/username"
              />
            </Grid>
            <Grid container spacing={2}>
              <TextField
                label="YouTube URL"
                name="socialMedia.youtube"
                value={form.socialMedia.youtube}
                onChange={handleChange}
                fullWidth
                margin="normal"
                variant="outlined"
                size="small"
                placeholder="https://youtube.com/username"
              />
            </Grid>
          </Grid>
        </SectionPaper>

        {/* Submit Button */}
        <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end' }}>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={loading}
            size="large"
            startIcon={loading ? <CircularProgress size={20} /> : <Save />}
            sx={{
              px: 4,
              py: 1.5,
              borderRadius: 2,
              textTransform: 'none',
              fontSize: '1rem',
              boxShadow: 'none',
              '&:hover': {
                boxShadow: 'none',
              },
            }}
          >
            {loading ? "Saving..." : "Save Profile"}
          </Button>
        </Box>
      </form>
    </Container>
  );
}