'use client';
import React, { useEffect, useState, ChangeEvent } from 'react';
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  CircularProgress,
  Alert,
  AlertTitle,
  Grid,
  Container,
  Checkbox,
  FormControlLabel,
  Chip,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Card,
  CardContent,
  CardActions,
  Dialog,
  DialogTitle,
  DialogContent,
  useTheme,
  useMediaQuery,
  Stack,
  InputLabel,
  FormControl,
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  CloudUpload,
} from '@mui/icons-material';
import { useAuth } from '@/context/AuthContext';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { styled } from '@mui/material/styles';
import ImageDisplay from '@/app/components/ImageDisplay';

const API_URL = 'https://protfolio-product-backend.vercel.app/api/experience';

interface Experience {
  _id?: string;
  title: string;
  company: string;
  location: string;
  startDate: string;
  endDate: string;
  isCurrent: boolean;
  description: string;
  images?: string[];
  responsibilities: string[];
  achievements: string[];
  technologies: string[];
  ownerEmail: string;
}

type ExperienceArrayField = 'responsibilities' | 'achievements' | 'technologies';

const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  whiteSpace: "nowrap",
  width: 1,
});

function ExperienceForm({ initialData, onSuccess, onCancel, token }: { initialData: Experience | null, onSuccess: () => void, onCancel: () => void, token: string }) {
  const [form, setForm] = useState<Experience>(
    initialData || {
      title: '', company: '', location: '', startDate: '', endDate: '',
      isCurrent: false, description: '', images: [''], responsibilities: [''],
      achievements: [''], technologies: [''], ownerEmail: localStorage.getItem("ownerEmail") || ''
    }
  );
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    if (initialData && initialData.images) {
      setImagePreviews(initialData.images);
    }
  }, [initialData]);

  React.useEffect(() => {
    if (!initialData) {
      // Get ownerEmail from localStorage
      const ownerEmail = localStorage.getItem("ownerEmail");
      if (ownerEmail) {
        setForm((prev) => ({
          ...prev,
          ownerEmail,
        }));
      }
    }
  }, [initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleArrayChange = (name: ExperienceArrayField, idx: number, value: string) => {
    setForm((prev) => {
      const arr = [...(prev[name] as string[])];
      arr[idx] = value;
      return { ...prev, [name]: arr };
    });
  };

  const addArrayItem = (name: ExperienceArrayField) => {
    setForm((prev) => ({
      ...prev,
      [name]: [...(prev[name] as string[]), ''],
    }));
  };

  const removeArrayItem = (name: ExperienceArrayField, idx: number) => {
    setForm((prev) => {
      const arr = [...(prev[name] as string[])];
      arr.splice(idx, 1);
      return { ...prev, [name]: arr };
    });
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const files = Array.from(e.target.files);
    setImageFiles((prev) => [...prev, ...files]);
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreviews((prev) => [...prev, reader.result as string]);
      };
      reader.readAsDataURL(file);
    });
  };

  const handleRemoveImage = (idx: number) => {
    setImageFiles((prev) => prev.filter((_, i) => i !== idx));
    setImagePreviews((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const formData = new FormData();
      formData.append("title", form.title);
      formData.append("company", form.company);
      formData.append("location", form.location);
      formData.append("startDate", form.startDate);
      if (form.endDate) formData.append("endDate", form.endDate);
      formData.append("isCurrent", form.isCurrent.toString());
      formData.append("description", form.description);
      form.responsibilities.forEach((resp, i) => formData.append(`responsibilities[${i}]`, resp));
      form.achievements.forEach((ach, i) => formData.append(`achievements[${i}]`, ach));
      form.technologies.forEach((tech, i) => formData.append(`technologies[${i}]`, tech));
      formData.append("ownerEmail", form.ownerEmail);
      imageFiles.forEach((file) => formData.append("images", file));
      
      const method = form._id ? "put" : "post";
      const url = form._id ? `${API_URL}/${form._id}` : API_URL;
      const res = await fetch(url, {
        method: method.toUpperCase(),
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });
      if (!res.ok) {
        throw new Error('Error saving experience');
      }
      onSuccess();
      if (!form._id) {
        setForm({
          title: '', company: '', location: '', startDate: '', endDate: '',
          isCurrent: false, description: '', images: [''], responsibilities: [''],
          achievements: [''], technologies: [''], ownerEmail: form.ownerEmail
        });
        setImageFiles([]);
        setImagePreviews([]);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  };

  const renderArrayField = (field: ExperienceArrayField) => (
    <Box sx={{ backgroundColor: 'background.paper', borderRadius: 1, width: '100%', maxWidth: '100%' }}>
      <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 'medium' }}>
        {field.charAt(0).toUpperCase() + field.slice(1)}
      </Typography>
      {(form[field] as string[]).map((item, idx) => (
        <Box key={idx} sx={{ display: 'flex', alignItems: 'center', mb: 1, gap: 1 }}>
          <TextField
            value={item}
            onChange={(e) => handleArrayChange(field, idx, e.target.value)}
            placeholder={`Enter ${field.slice(0, -1)}`}
            fullWidth
            size="small"
            variant="outlined"
            sx={{ flexGrow: 1 }}
          />
          <IconButton
            onClick={() => removeArrayItem(field, idx)}
            disabled={(form[field] as string[]).length === 1}
            color="error"
            size="small"
          >
            <DeleteIcon fontSize="small" />
          </IconButton>
        </Box>
      ))}
      <Button
        startIcon={<AddIcon />}
        onClick={() => addArrayItem(field)}
        variant="outlined"
        size="small"
        sx={{ mt: 1 }}
      >
        Add {field.slice(0, -1)}
      </Button>
    </Box>
  );

  const handleDateChange = (name: string) => (date: Date | null) => {
    setForm((prev) => ({ ...prev, [name]: date ? date.toISOString() : null }));
  };

  return (
    <Paper elevation={0} sx={{ p: 0, mb: 4, borderRadius: 2 }}>
      <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', mb: 3 }}>
        {form._id ? 'Edit Experience' : 'Add New Experience'}
      </Typography>
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          <AlertTitle>Error</AlertTitle>
          {error}
        </Alert>
      )}
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <Grid container spacing={4} style={{ display: 'grid', gridTemplateColumns: isMobile ? 'repeat(1, 1fr)' : 'repeat(1, 1fr)', gap: '16px' }}>
          <Grid container spacing={2}>
            <TextField
              name="title"
              label="Job Title"
              value={form.title}
              onChange={handleChange}
              fullWidth
              required
              size="small"
              variant="outlined"
            />
          </Grid>
          <Grid container spacing={2}>
            <TextField
              name="company"
              label="Company"
              value={form.company}
              onChange={handleChange}
              fullWidth
              required
              size="small"
            />
          </Grid>
          <Grid container spacing={2}>
            <TextField
              name="location"
              label="Location"
              value={form.location}
              onChange={handleChange}
              fullWidth
              size="small"
            />
          </Grid>

          <Grid container spacing={2}>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                format="dd/MM/yyyy"
                label="Start Date"
                value={form.startDate ? new Date(form.startDate) : null}
                onChange={handleDateChange('startDate')}
                slotProps={{
                  textField: {
                    fullWidth: true,
                    required: true,
                    size: 'small',
                  }
                }}
              />
            </LocalizationProvider>
          </Grid>
          <Grid container spacing={2}>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                format="dd/MM/yyyy"
                label="End Date"
                value={form.endDate ? new Date(form.endDate) : null}
                onChange={handleDateChange('endDate')}
                slotProps={{
                  textField: {
                    fullWidth: true,
                    disabled: form.isCurrent,
                    size: 'small',
                  }
                }}
              />
            </LocalizationProvider>
          </Grid>

          <Grid container spacing={2}>
            <FormControlLabel
              control={
                <Checkbox
                  name="isCurrent"
                  checked={form.isCurrent}
                  onChange={handleChange}
                  color="primary"
                />
              }
              label="Currently working here"
            />
          </Grid>

          <Grid container spacing={2}>
            <TextField
              name="description"
              label="Description"
              value={form.description}
              onChange={handleChange}
              fullWidth
              multiline
              rows={10}
              required
              size="small"
              sx={{ width: '100%', maxWidth: '100%' }}
              style={{ flex: 1, flexGrow: 1 }}
            />
          </Grid>

          <Grid container spacing={2}>
            <FormControl fullWidth margin="normal">
              <InputLabel shrink sx={{ mb: 1 }}>Experience Images (max size 1MB for each image)</InputLabel>
              <Stack direction="column" spacing={2} alignItems="flex-start">
                <Button
                  component="label"
                  variant="outlined"
                  color="secondary"
                  startIcon={<CloudUpload />}
                  sx={{ textTransform: "none", width: "100%" }}
                >
                  Upload Images
                  <VisuallyHiddenInput
                    type="file"
                    name="images"
                    accept="image/*"
                    multiple
                    onChange={handleImageChange}
                  />
                </Button>
                <Grid container spacing={2} sx={{ display: "grid", gridTemplateColumns: isMobile ? 'repeat(1, 1fr)' : 'repeat(3, 1fr)', gap: '16px' }}>
                  {imagePreviews.map((preview, idx) => (
                    <Grid key={idx} component="div">
                      <Box
                        sx={{
                          width: "100%",
                          position: "relative",
                          borderRadius: 2,
                          overflow: "hidden",
                          boxShadow: 1,
                          bgcolor: "background.paper",
                          minHeight: 80,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <img
                          src={preview}
                          alt={`Experience preview ${idx + 1}`}
                          style={{
                            width: "100%",
                            height: "300px",
                            objectFit: "cover",
                            display: "block",
                            maxHeight: 200,
                          }}
                        />
                        <IconButton
                          size="small"
                          color="error"
                          sx={{ position: "absolute", top: 2, right: 2, background: "#fff" }}
                          onClick={() => handleRemoveImage(idx)}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Box>
                    </Grid>
                  ))}
                </Grid>
              </Stack>
            </FormControl>
          </Grid>

          <Grid container spacing={2}>
            <TextField
              name="ownerEmail"
              label="Owner Email"
              value={form.ownerEmail}
              onChange={handleChange}
              fullWidth
              size="small"
              disabled
            />
          </Grid>
          <Grid container spacing={2}>
            {renderArrayField('responsibilities')}
          </Grid>
          <Grid container spacing={2}>
            {renderArrayField('achievements')}
          </Grid>
          <Grid container spacing={2}>
            {renderArrayField('technologies')}
          </Grid>
        </Grid>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 4, gap: 2 , flexDirection: isMobile ? 'column' : 'row' }}>
          <Button
            onClick={onCancel}
            variant="outlined"
            color="secondary"
            startIcon={<CancelIcon />}
            disabled={loading}
            sx={{ px: 3 }}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            startIcon={loading ? <CircularProgress size={20} /> : <SaveIcon />}
            disabled={loading}
            sx={{ px: 3 }}
          >
            {form._id ? 'Update' : 'Create'} Experience
          </Button>
        </Box>
      </form>
    </Paper>
  );
}

interface ExperienceCardProps {
  experience: Experience;
  onEdit: (exp: Experience) => void;
  onDelete: (exp: Experience) => void;
}

function ExperienceCard({ experience, onEdit, onDelete }: ExperienceCardProps) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  return (
    <Card sx={{ mb: 3, borderRadius: 2, boxShadow: 2 }}>
      <CardContent>
        <Typography variant="h6" component="div" sx={{ fontWeight: 'bold', mb: 1 }}>
          {experience.title}
        </Typography>
        <Typography color="primary" gutterBottom sx={{ fontWeight: 'medium', mb: 2 }}>
          {experience.company} • {experience.location}
        </Typography>
        <Typography variant="body2" sx={{ mb: 2, color: 'text.secondary' }}>
          {new Date(experience.startDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short' })} -{' '}
          {experience.isCurrent ? 'Present' : new Date(experience.endDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short' })}
        </Typography>
        
        <Typography variant="body2" paragraph sx={{ mb: 2, whiteSpace: "pre-line" , wordBreak: "break-word" }}>
          {experience.description}
        </Typography>
        
        {experience.responsibilities.length > 0 && (
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 'medium', mb: 1 }}>Responsibilities:</Typography>
            <List dense sx={{ py: 0 }}>
              {experience.responsibilities.map((item, idx) => (
                <ListItem key={idx} sx={{ py: 0, pl: 2 }}>
                  <ListItemText primary={`• ${item}`} sx={{ my: 0 }} />
                </ListItem>
              ))}
            </List>
          </Box>
        )}
        
        {experience.achievements.length > 0 && (
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 'medium', mb: 1 }}>Achievements:</Typography>
            <List dense sx={{ py: 0 }}>
              {experience.achievements.map((item, idx) => (
                <ListItem key={idx} sx={{ py: 0, pl: 2 }}>
                  <ListItemText primary={`• ${item}`} sx={{ my: 0 }} />
                </ListItem>
              ))}
            </List>
          </Box>
        )}
        
        {experience.technologies.length > 0 && (
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 2 }}>
            {experience.technologies.map((tech, idx) => (
              <Chip 
                key={idx} 
                label={tech} 
                size="small" 
                color="primary"
                variant="outlined"
              />
            ))}
          </Box>
        )}
        
        {experience.images && experience.images.length > 0 && (
          <Box sx={{ mt: 2, display: "grid", gridTemplateColumns: isMobile ? 'repeat(1, 1fr)' : 'repeat(3, 1fr)', gap: '16px' }}>
            {experience.images.map((img, idx) => (
              <ImageDisplay
                key={idx}
                src={img}
                alt={`${experience.title} ${idx + 1}`}
                height="110px"
                maxHeight="100px"
              />
            ))}
          </Box>
        )}
      </CardContent>
      <CardActions sx={{ justifyContent: 'flex-end', p: 2 }}>
        <Button
          size="small"
          startIcon={<EditIcon />}
          onClick={() => onEdit(experience)}
          sx={{ color: 'primary.main' }}
        >
          Edit
        </Button>
        <Button
          size="small"
          startIcon={<DeleteIcon />}
          onClick={() => onDelete(experience)}
          sx={{ color: 'error.main' }}
        >
          Delete
        </Button>
      </CardActions>
    </Card>
  );
}

export default function ExperiencePage() {
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [selected, setSelected] = useState<Experience | null>(null);
  const { token } = useAuth() as { token: string };
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [experienceToDelete, setExperienceToDelete] = useState<Experience | null>(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const fetchExperiences = async () => {
    setLoading(true);
    try {
      const res = await fetch('https://protfolio-product-backend.vercel.app/api/experience');
      if (!res.ok) throw new Error('Failed to fetch experiences');
      const data: Experience[] = await res.json();
      setExperiences(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!experienceToDelete) return;
    
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/${experienceToDelete._id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      if (!res.ok) throw new Error("Failed to delete experience");
      
      await fetchExperiences();
      setDeleteDialog(false);
      setExperienceToDelete(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (experience: Experience) => {
    setExperienceToDelete(experience);
    setDeleteDialog(true);
  };

  useEffect(() => {
    fetchExperiences();
  }, []);

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4, flexDirection: isMobile ? 'column' : 'row' }}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold', color: 'primary.main', textAlign: isMobile ? 'center' : 'left' }}>
          Work Experience
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => {
            setSelected(null);
            setOpenDialog(true);
          }}
          sx={{ borderRadius: 2 }}
        >
          Add New Experience
        </Button>
      </Box>
      
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          <AlertTitle>Error</AlertTitle>
          {error}
        </Alert>
      )}
      
      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        fullWidth
        maxWidth="md"
        PaperProps={{ sx: { borderRadius: 2 } }}
      >
        <DialogTitle sx={{ fontWeight: 'bold', borderBottom: '1px solid', borderColor: 'divider', py: 2 }}>
          {selected ? 'Edit Experience' : 'Add New Experience'}
        </DialogTitle>
        <DialogContent sx={{ py: 3 }}>
          <ExperienceForm
            initialData={selected}
            onSuccess={() => {
              fetchExperiences();
              setOpenDialog(false);
            }}
            onCancel={() => setOpenDialog(false)}
            token={token || ''}
          />
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialog}
        onClose={() => setDeleteDialog(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{ sx: { borderRadius: 2 } }}
      >
        <DialogTitle sx={{ fontWeight: 'bold', borderBottom: '1px solid', borderColor: 'divider', py: 2 }}>
          Confirm Delete
        </DialogTitle>
        <DialogContent sx={{ py: 3 }}>
          <Typography variant="body1" sx={{ mb: 2 }}>
            Are you sure you want to delete the experience &apos;{experienceToDelete?.title}&apos; at {experienceToDelete?.company}?
          </Typography>
          <Typography variant="body2" color="text.secondary">
            This action cannot be undone.
          </Typography>
        </DialogContent>
        <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2, p: 3, pt: 0 }}>
          <Button
            onClick={() => setDeleteDialog(false)}
            variant="outlined"
            color="secondary"
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            onClick={handleDelete}
            variant="contained"
            color="error"
            startIcon={loading ? <CircularProgress size={20} /> : <DeleteIcon />}
            disabled={loading}
          >
            Delete
          </Button>
        </Box>
      </Dialog>
      
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress />
        </Box>
      ) : experiences.length === 0 ? (
        <Paper elevation={0} sx={{ p: 4, textAlign: 'center', borderRadius: 2 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>No experiences found</Typography>
          <Typography variant="body1" color="text.secondary">
            Add your first experience to get started!
          </Typography>
          <Button
            variant="outlined"
            startIcon={<AddIcon />}
            onClick={() => {
              setSelected(null);
              setOpenDialog(true);
            }}
            sx={{ mt: 3 }}
          >
            Add Experience
          </Button>
        </Paper>
      ) : (
        <Box sx={{ '& > *': { mb: 3 } }}>
          {experiences.map((exp) => (
            <ExperienceCard
              key={exp._id}
              experience={exp}
              onEdit={(exp) => {
                setSelected(exp);
                setOpenDialog(true);
              }}
              onDelete={handleDeleteClick}
            />
          ))}
        </Box>
      )}
    </Container>
  );
}