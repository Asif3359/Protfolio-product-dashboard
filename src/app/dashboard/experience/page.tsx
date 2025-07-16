'use client';
import React, { useEffect, useState } from 'react';
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
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
} from '@mui/icons-material';
import { useAuth } from '@/context/AuthContext';

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
  responsibilities: string[];
  achievements: string[];
  technologies: string[];
  ownerEmail: string;
}

type ExperienceArrayField = 'responsibilities' | 'achievements' | 'technologies';

function ExperienceForm({ initialData, onSuccess, onCancel, token }: { initialData: Experience | null, onSuccess: () => void, onCancel: () => void, token: string }) {
  const [form, setForm] = useState<Experience>(
    initialData || {
      title: '', company: '', location: '', startDate: '', endDate: '',
      isCurrent: false, description: '', responsibilities: [''],
      achievements: [''], technologies: [''], ownerEmail: localStorage.getItem("ownerEmail") || ''
    }
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const method = form._id ? "put" : "post";
      const url = form._id ? `${API_URL}/${form._id}` : API_URL;
      const res = await fetch(url, {
        method: method.toUpperCase(),
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        throw new Error('Error saving experience');
      }
      onSuccess();
      if (!form._id) {
        setForm({
          title: '', company: '', location: '', startDate: '', endDate: '',
          isCurrent: false, description: '', responsibilities: [''],
          achievements: [''], technologies: [''], ownerEmail: form.ownerEmail
        });
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
      <form onSubmit={handleSubmit}>
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
            <TextField
              name="startDate"
              label="Start Date"
              type="date"
              value={form.startDate?.slice(0,10) || ''}
              onChange={handleChange}
              fullWidth
              required
              size="small"
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid container spacing={2}>
            <TextField
              name="endDate"
              label="End Date"
              type="date"
              value={form.endDate?.slice(0,10) || ''}
              onChange={handleChange}
              fullWidth
              size="small"
              disabled={form.isCurrent}
              InputLabelProps={{ shrink: true }}
            />
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
              rows={3}
              required
              size="small"
              sx={{ width: '100%', maxWidth: '100%' }}
              style={{ flex: 1, flexGrow: 1 }}
            />
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
}

function ExperienceCard({ experience, onEdit }: ExperienceCardProps) {
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
            />
          ))}
        </Box>
      )}
    </Container>
  );
}