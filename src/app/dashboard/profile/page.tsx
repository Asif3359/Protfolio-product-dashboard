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
  cvLink: string;
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
  backgroundImageForProfilePage: string;
  backgroundImageForExperiencePage: string;
  backgroundImageForProjectsPage: string;
  backgroundImageForSkillsPage: string;
  backgroundImageForEducationPage: string;
  backgroundImageForResearchPage: string;
  backgroundImageForAwardsPage: string;
  backgroundImageForCertificationsPage: string;
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
    contact: { email: "", mobile: "", cvLink: "" },
    ownerEmail: localStorage.getItem("ownerEmail") || "",
    heroPicture: "",
    profilePicture: "",
    backgroundImageForProfilePage: "",
    backgroundImageForExperiencePage: "",
    backgroundImageForProjectsPage: "",
    backgroundImageForSkillsPage: "",
    backgroundImageForEducationPage: "",
    backgroundImageForResearchPage: "",
    backgroundImageForAwardsPage: "",
    backgroundImageForCertificationsPage: "",
  });
  const [profilePicture, setProfilePicture] = useState<File | null>(null);
  const [heroPicture, setHeroPicture] = useState<File | null>(null);
  const [backgroundImages, setBackgroundImages] = useState<{
    profile: File | null;
    experience: File | null;
    projects: File | null;
    skills: File | null;
    education: File | null;
    research: File | null;
    awards: File | null;
    certifications: File | null;
  }>({
    profile: null,
    experience: null,
    projects: null,
    skills: null,
    education: null,
    research: null,
    awards: null,
    certifications: null,
  });
  const [message, setMessage] = useState<{
    text: string;
    severity: "success" | "error" | "info" | "warning";
  } | null>(null);
  const [preview, setPreview] = useState({
    profile: "",
    hero: "",
    backgroundProfile: "",
    backgroundExperience: "",
    backgroundProjects: "",
    backgroundSkills: "",
    backgroundEducation: "",
    backgroundResearch: "",
    backgroundAwards: "",
    backgroundCertifications: "",
  });

  // // Set ownerEmail from localStorage on mount
  // useEffect(() => {
  //   const fetchOwnerEmail = async () => {
  //     try {
  //       const res = await axios.get("https://protfolio-product-backend.vercel.app/api/admin/profile", {
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
        const res = await axios.get("https://protfolio-product-backend.vercel.app/api/profile");
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
            contact: {
              email: res.data.contact?.email || "",
              mobile: res.data.contact?.mobile || "",
              cvLink: res.data.contact?.cvLink || "",
            },
            ownerEmail: localStorage.getItem("ownerEmail") || "",
            heroPicture: res.data.heroPicture || "",
            profilePicture: res.data.profilePicture || "",
            backgroundImageForProfilePage: res.data.backgroundImageForProfilePage || "",
            backgroundImageForExperiencePage: res.data.backgroundImageForExperiencePage || "",
            backgroundImageForProjectsPage: res.data.backgroundImageForProjectsPage || "",
            backgroundImageForSkillsPage: res.data.backgroundImageForSkillsPage || "",
            backgroundImageForEducationPage: res.data.backgroundImageForEducationPage || "",
            backgroundImageForResearchPage: res.data.backgroundImageForResearchPage || "",
            backgroundImageForAwardsPage: res.data.backgroundImageForAwardsPage || "",
            backgroundImageForCertificationsPage: res.data.backgroundImageForCertificationsPage || "",
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

          // Set background image previews
          if (res.data.backgroundImageForProfilePage) {
            setPreview((prev) => ({
              ...prev,
              backgroundProfile: res.data.backgroundImageForProfilePage,
            }));
          }
          if (res.data.backgroundImageForExperiencePage) {
            setPreview((prev) => ({
              ...prev,
              backgroundExperience: res.data.backgroundImageForExperiencePage,
            }));
          }
          if (res.data.backgroundImageForProjectsPage) {
            setPreview((prev) => ({
              ...prev,
              backgroundProjects: res.data.backgroundImageForProjectsPage,
            }));
          }
          if (res.data.backgroundImageForSkillsPage) {
            setPreview((prev) => ({
              ...prev,
              backgroundSkills: res.data.backgroundImageForSkillsPage,
            }));
          }
          if (res.data.backgroundImageForEducationPage) {
            setPreview((prev) => ({
              ...prev,
              backgroundEducation: res.data.backgroundImageForEducationPage,
            }));
          }
          if (res.data.backgroundImageForResearchPage) {
            setPreview((prev) => ({
              ...prev,
              backgroundResearch: res.data.backgroundImageForResearchPage,
            }));
          }
          if (res.data.backgroundImageForAwardsPage) {
            setPreview((prev) => ({
              ...prev,
              backgroundAwards: res.data.backgroundImageForAwardsPage,
            }));
          }
          if (res.data.backgroundImageForCertificationsPage) {
            setPreview((prev) => ({
              ...prev,
              backgroundCertifications: res.data.backgroundImageForCertificationsPage,
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
      } else if (e.target.name === "backgroundImageForProfilePage") {
        setBackgroundImages(prev => ({ ...prev, profile: file }));
        setPreview({ ...preview, backgroundProfile: reader.result as string });
      } else if (e.target.name === "backgroundImageForExperiencePage") {
        setBackgroundImages(prev => ({ ...prev, experience: file }));
        setPreview({ ...preview, backgroundExperience: reader.result as string });
      } else if (e.target.name === "backgroundImageForProjectsPage") {
        setBackgroundImages(prev => ({ ...prev, projects: file }));
        setPreview({ ...preview, backgroundProjects: reader.result as string });
      } else if (e.target.name === "backgroundImageForSkillsPage") {
        setBackgroundImages(prev => ({ ...prev, skills: file }));
        setPreview({ ...preview, backgroundSkills: reader.result as string });
      } else if (e.target.name === "backgroundImageForEducationPage") {
        setBackgroundImages(prev => ({ ...prev, education: file }));
        setPreview({ ...preview, backgroundEducation: reader.result as string });
      } else if (e.target.name === "backgroundImageForResearchPage") {
        setBackgroundImages(prev => ({ ...prev, research: file }));
        setPreview({ ...preview, backgroundResearch: reader.result as string });
      } else if (e.target.name === "backgroundImageForAwardsPage") {
        setBackgroundImages(prev => ({ ...prev, awards: file }));
        setPreview({ ...preview, backgroundAwards: reader.result as string });
      } else if (e.target.name === "backgroundImageForCertificationsPage") {
        setBackgroundImages(prev => ({ ...prev, certifications: file }));
        setPreview({ ...preview, backgroundCertifications: reader.result as string });
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
      formData.append("cvLink", form.contact.cvLink);

      // Append contact and socialMedia as JSON strings
      formData.append("contact", JSON.stringify(form.contact));
      formData.append("socialMedia", JSON.stringify(form.socialMedia));

      // Append files if they exist
      if (profilePicture) formData.append("profilePicture", profilePicture);
      if (heroPicture) formData.append("heroPicture", heroPicture);
      
      // Append background images if they exist
      if (backgroundImages.profile) formData.append("backgroundImageForProfilePage", backgroundImages.profile);
      if (backgroundImages.experience) formData.append("backgroundImageForExperiencePage", backgroundImages.experience);
      if (backgroundImages.projects) formData.append("backgroundImageForProjectsPage", backgroundImages.projects);
      if (backgroundImages.skills) formData.append("backgroundImageForSkillsPage", backgroundImages.skills);
      if (backgroundImages.education) formData.append("backgroundImageForEducationPage", backgroundImages.education);
      if (backgroundImages.research) formData.append("backgroundImageForResearchPage", backgroundImages.research);
      if (backgroundImages.awards) formData.append("backgroundImageForAwardsPage", backgroundImages.awards);
      if (backgroundImages.certifications) formData.append("backgroundImageForCertificationsPage", backgroundImages.certifications);

      // Use PUT for update, POST for create
      const method = profile ? "put" : "post";
      console.log("Submitting profile:", form);
      const res = await axios({
        method,
        url: "https://protfolio-product-backend.vercel.app/api/profile",
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
      setBackgroundImages({
        profile: null,
        experience: null,
        projects: null,
        skills: null,
        education: null,
        research: null,
        awards: null,
        certifications: null,
      });
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
          <Grid container spacing={3} sx={{ width: '100%' ,flexDirection: 'column' }}>
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
                <InputLabel shrink sx={{ mb: 1 }}>Home Image</InputLabel>
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
                    <Card sx={{ width: '100%', borderRadius: 2, height: "300px" }}>
                      <CardMedia
                        component="img"
                        height="300"
                        image={preview.hero || profile?.heroPicture}
                        alt="Hero preview"
                        sx={{ objectFit: 'cover' , height: "300px" }}
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
          <Grid container spacing={3} sx={{ width: '100%' ,flexDirection: 'column' }}>
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
          <Grid container spacing={3} sx={{ width: '100%' ,flexDirection: 'column' }}>
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
                label="CV Link"
                name="contact.cvLink"
                value={form.contact.cvLink}
                onChange={handleChange}
                fullWidth
                margin="normal"
                required
                variant="outlined"
                size="small"
                placeholder="https://your-cv-link.com"
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

        {/* Background Images */}
        <SectionPaper elevation={0}>
          <SectionTitle variant="h6">Background Images for Pages</SectionTitle>
          <Box
            // container
            // spacing={2}
            sx={{
              width: "100%",
              flexDirection:'column',
              alignItems: "flex-center",
              justifyContent: "flex-center",
              gap: 2,
              display: "grid",
              gridTemplateColumns:{xs:"1fr",sm:"1fr",md:"1fr 1fr"},
            }}
          >
            {[
              {
                label: "Profile Page Background",
                name: "backgroundImageForProfilePage",
                preview: preview.backgroundProfile,
                profileImg: profile?.backgroundImageForProfilePage,
                alt: "Profile page background preview",
              },
              {
                label: "Experience Page Background",
                name: "backgroundImageForExperiencePage",
                preview: preview.backgroundExperience,
                profileImg: profile?.backgroundImageForExperiencePage,
                alt: "Experience page background preview",
              },
              {
                label: "Projects Page Background",
                name: "backgroundImageForProjectsPage",
                preview: preview.backgroundProjects,
                profileImg: profile?.backgroundImageForProjectsPage,
                alt: "Projects page background preview",
              },
              {
                label: "Skills Page Background",
                name: "backgroundImageForSkillsPage",
                preview: preview.backgroundSkills,
                profileImg: profile?.backgroundImageForSkillsPage,
                alt: "Skills page background preview",
              },
              {
                label: "Education Page Background",
                name: "backgroundImageForEducationPage",
                preview: preview.backgroundEducation,
                profileImg: profile?.backgroundImageForEducationPage,
                alt: "Education page background preview",
              },
              {
                label: "Research Page Background",
                name: "backgroundImageForResearchPage",
                preview: preview.backgroundResearch,
                profileImg: profile?.backgroundImageForResearchPage,
                alt: "Research page background preview",
              },
              {
                label: "Awards Page Background",
                name: "backgroundImageForAwardsPage",
                preview: preview.backgroundAwards,
                profileImg: profile?.backgroundImageForAwardsPage,
                alt: "Awards page background preview",
              },
              {
                label: "Certifications Page Background",
                name: "backgroundImageForCertificationsPage",
                preview: preview.backgroundCertifications,
                profileImg: profile?.backgroundImageForCertificationsPage,
                alt: "Certifications page background preview",
              },
            ].map((item) => (
              <Box
                key={item.name}
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  width: "100%",
                }}
              >
                <FormControl fullWidth margin="normal">
                  {/* <InputLabel shrink sx={{ mb: 1 , fontSize: { xs: "0.8rem", md: "1rem" } }}>
                    {item.label}
                  </InputLabel> */}
                  <Typography variant="h6" sx={{ mb: 1 , fontSize: { xs: "0.8rem", md: "1rem" } }}>{item.label}
                    
                  </Typography>
                  <Stack direction="column" spacing={1} alignItems="center">
                    <Button
                      component="label"
                      variant="outlined"
                      color="secondary"
                      startIcon={<CloudUpload />}
                      sx={{ textTransform: "none", }}
                    >
                      Upload
                      <VisuallyHiddenInput
                        type="file"
                        name={item.name}
                        accept="image/*"
                        onChange={handleFileChange}
                      />
                    </Button>
                    {(item.preview || item.profileImg) && (
                      <Card
                        sx={{
                          width: "100%",
                          height: 220,
                          borderRadius: 2,
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          justifyContent: "center",
                          boxShadow: 2,
                        }}
                      >
                        <CardMedia
                          component="img"
                          image={item.preview || item.profileImg}
                          alt={item.alt}
                          sx={{
                            width: "100%",
                            height: "200px",
                            objectFit: "cover",
                            borderRadius: 2,
                          }}
                        />
                        <CardContent>
                          <Typography
                            variant="caption"
                            color="text.secondary"
                            align="center"
                          >
                            {item.label}
                          </Typography>
                        </CardContent>
                      </Card>
                    )}
                  </Stack>
                </FormControl>
              </Box>
            ))}
          </Box>
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