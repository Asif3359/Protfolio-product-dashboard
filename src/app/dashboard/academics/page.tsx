"use client";
import React, { useEffect, useState } from 'react';
import { 
  Container, Box, Typography, Button, Dialog, DialogTitle, DialogContent, 
  CircularProgress, Alert, AlertTitle, Paper, TextField, Grid, 
  Chip, InputAdornment, Card, CardContent, CardActions 
} from '@mui/material';
import { Add as AddIcon, Delete as DeleteIcon, Cancel as CancelIcon, Save as SaveIcon, Edit as EditIcon } from '@mui/icons-material';
import { useAuth } from '@/context/AuthContext';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { useTheme } from '@mui/material/styles';
import { useMediaQuery } from '@mui/material';

type Academic = {
  _id?: string;
  degree: string;
  institution: string;
  field: string;
  startDate: string | Date;
  endDate?: string | Date | null;
  description?: string;
  achievements?: string[];
  gpa?: number;
  ownerEmail?: string;
};

// AcademicForm component
function AcademicForm({ initialData, onSuccess, onCancel, token }: { 
  initialData: Academic | null, 
  onSuccess: () => void, 
  onCancel: () => void, 
  token: string 
}) {
  const [formData, setFormData] = useState<Partial<Academic>>({
    degree: '',
    institution: '',
    field: '',
    startDate: new Date(),
    endDate: null,
    description: '',
    achievements: [],
    gpa: undefined,
    ownerEmail: ''
  });
  const [achievementInput, setAchievementInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    if (initialData) {
      setFormData({
        degree: initialData.degree,
        institution: initialData.institution,
        field: initialData.field,
        startDate: new Date(initialData.startDate),
        endDate: initialData.endDate ? new Date(initialData.endDate) : null,
        description: initialData.description || '',
        achievements: initialData.achievements || [],
        gpa: initialData.gpa,
        ownerEmail: initialData.ownerEmail || ''
      });
    } else if (token) {
      // Fetch ownerEmail from admin profile
      (async () => {
        try {
          const res = await fetch('https://protfolio-product-backend.vercel.app/api/admin/profile', {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (res.ok) {
            const data = await res.json();
            setFormData((prev) => ({ ...prev, ownerEmail: data.email || '' }));
          }
        } catch {
          // ignore
        }
      })();
    }
  }, [initialData, token]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev: Partial<Academic>) => ({ ...prev, [name]: value }));
  };

  const handleDateChange = (name: string) => (date: Date | null) => {
    setFormData((prev: Partial<Academic>) => ({ ...prev, [name]: date }));
  };

  const handleAddAchievement = () => {
    if (achievementInput.trim()) {
      setFormData((prev: Partial<Academic>) => ({
        ...prev,
        achievements: [...(prev.achievements || []), achievementInput.trim()]
      }));
      setAchievementInput('');
    }
  };

  const handleRemoveAchievement = (index: number) => {
    setFormData((prev: Partial<Academic>) => ({
      ...prev,
      achievements: prev.achievements?.filter((_, i) => i !== index) || []
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const url = initialData 
        ? `https://protfolio-product-backend.vercel.app/api/academic/${initialData._id}` 
        : 'https://protfolio-product-backend.vercel.app/api/academic';
      const method = initialData ? 'PUT' : 'POST';
      // Always include ownerEmail
      const body = { ...formData, ownerEmail: formData.ownerEmail };
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(body)
      });

      if (!response.ok) {
        throw new Error(initialData ? 'Failed to update academic' : 'Failed to create academic');
      }

      onSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper elevation={0} sx={{ p: 0, mb: 4, borderRadius: 2 }}>
      <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', mb: 3 }}>
        {initialData ? 'Edit Academic Record' : 'Add New Academic Record'}
      </Typography>
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          <AlertTitle>Error</AlertTitle>
          {error}
        </Alert>
      )}
      <form onSubmit={handleSubmit}>
        <Grid container spacing={4} style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, 1fr)', gap: '16px' }}>
          <Grid container spacing={2}>
            <TextField
              fullWidth
              label="Degree"
              name="degree"
              value={formData.degree}
              onChange={handleChange}
              required
              size="small"
              variant="outlined"
            />
          </Grid>
          <Grid container spacing={2}>
            <TextField
              fullWidth
              label="Institution"
              name="institution"
              value={formData.institution}
              onChange={handleChange}
              required
              size="small"
            />
          </Grid>
          <Grid container spacing={2}>
            <TextField
              fullWidth
              label="Field of Study"
              name="field"
              value={formData.field}
              onChange={handleChange}
              required
              size="small"
            />
          </Grid>
          <Grid container spacing={2}>
            <TextField
              fullWidth
              label="GPA"
              name="gpa"
              type="number"
              inputProps={{ step: "0.01", min: "0", max: "4.0" }}
              value={formData.gpa || ''}
              onChange={handleChange}
              InputProps={{
                endAdornment: <InputAdornment position="end">/4.0</InputAdornment>,
              }}
              size="small"
            />
          </Grid>
          <Grid container spacing={2}>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                label="Start Date"
                value={formData.startDate ? new Date(formData.startDate) : null}
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
                label="End Date (or expected)"
                value={formData.endDate ? new Date(formData.endDate) : null}
                onChange={handleDateChange('endDate')}
                slotProps={{
                  textField: {
                    fullWidth: true,
                    size: 'small',
                  }
                }}
              />
            </LocalizationProvider>
          </Grid>
          <Grid container spacing={2}>
            <TextField
              fullWidth
              label="Description"
              name="description"
              multiline
              rows={3}
              value={formData.description}
              onChange={handleChange}
              size="small"
            />
          </Grid>
          <Grid container spacing={2}>
            <TextField
              name="ownerEmail"
              label="Owner Email"
              value={formData.ownerEmail}
              onChange={handleChange}
              fullWidth
              size="small"
              disabled
            />
          </Grid>
          <Grid container spacing={2}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1, width: '100%' }}>
              <TextField
                label="Add Achievement"
                value={achievementInput}
                onChange={(e) => setAchievementInput(e.target.value)}
                fullWidth
                size="small"
              />
              <Button 
                variant="outlined" 
                onClick={handleAddAchievement}
                disabled={!achievementInput.trim()}
                size="small"
              >
                Add
              </Button>
            </Box>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {formData.achievements?.map((ach: string, index: number) => (
                <Chip
                  key={index}
                  label={ach}
                  onDelete={() => handleRemoveAchievement(index)}
                  deleteIcon={<DeleteIcon />}
                  size="small"
                  color="primary"
                  variant="outlined"
                />
              ))}
            </Box>
          </Grid>
        </Grid>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 4, gap: 2, flexDirection: isMobile ? 'column' : 'row' }}>
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
            {initialData ? 'Update' : 'Create'} Academic
          </Button>
        </Box>
      </form>
    </Paper>
  );
}

// AcademicCard component
function AcademicCard({ academic, onEdit, onDelete }: { 
  academic: Academic, 
  onEdit: (a: Academic) => void,
  onDelete: (id: string) => void 
}) {
  const formatDate = (dateString: string | Date) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
  };

  return (
    <Card sx={{ mb: 3, borderRadius: 2, boxShadow: 2 }}>
      <CardContent>
        <Typography variant="h6" component="div" sx={{ fontWeight: 'bold', mb: 1 }}>
          {academic.degree} in {academic.field}
        </Typography>
        <Typography color="primary" gutterBottom sx={{ fontWeight: 'medium', mb: 2 }}>
          {academic.institution}
        </Typography>
        <Typography variant="body2" sx={{ mb: 2, color: 'text.secondary' }}>
          {formatDate(academic.startDate)} - {academic.endDate ? formatDate(academic.endDate) : 'Present'}
          {academic.gpa && ` • GPA: ${academic.gpa}/4.0`}
        </Typography>
        {academic.description && (
          <Typography variant="body2" paragraph sx={{ mb: 2 }}>
            {academic.description}
          </Typography>
        )}
        {academic.achievements && academic.achievements.length > 0 && (
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 'medium', mb: 1 }}>Achievements:</Typography>
            <ul style={{ marginTop: 4, marginBottom: 0, paddingLeft: 20 }}>
              {academic.achievements?.map((ach: string, i: number) => (
                <li key={i}>{ach}</li>
              ))}
            </ul>
          </Box>
        )}
      </CardContent>
      <CardActions sx={{ justifyContent: 'flex-end', p: 2 }}>
        <Button
          size="small"
          startIcon={<EditIcon />}
          onClick={() => onEdit(academic)}
          sx={{ color: 'primary.main' }}
        >
          Edit
        </Button>
        <Button 
          onClick={() => onDelete(academic._id || '')} 
          size="small" 
          color="error"
          startIcon={<DeleteIcon />}
        >
          Delete
        </Button>
      </CardActions>
    </Card>
  );
}

export default function AcademicsPage() {
  const [academics, setAcademics] = useState<Academic[]>([]);
  const [selected, setSelected] = useState<Academic | null>(null);
  const { token } = useAuth() as { token: string };
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  // Responsive UI like ExperiencePage
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const fetchAcademics = async () => {
    setLoading(true);
    try {
      const res = await fetch('https://protfolio-product-backend.vercel.app/api/academic');
      if (!res.ok) throw new Error('Failed to fetch academics');
      const data = await res.json();
      setAcademics(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this academic record?')) return;
    
    try {
      const res = await fetch(`https://protfolio-product-backend.vercel.app/api/academic/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!res.ok) throw new Error('Failed to delete academic');
      fetchAcademics();
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    }
  };

  useEffect(() => {
    fetchAcademics();
  }, []);

  return (
    <Container maxWidth="md" sx={{ py: 0 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4, flexDirection: isMobile ? 'column' : 'row' }}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold', color: 'primary.main', textAlign: isMobile ? 'center' : 'left' }}>
          Academic Records
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
          Add New Record
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
          {selected ? 'Edit Academic Record' : 'Add New Academic Record'}
        </DialogTitle>
        <DialogContent sx={{ py: 3 }}>
          <AcademicForm
            initialData={selected}
            onSuccess={() => {
              fetchAcademics();
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
      ) : academics.length === 0 ? (
          <Paper elevation={0} sx={{ p: 0, textAlign: 'center', borderRadius: 2 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>No academic records found</Typography>
          <Typography variant="body1" color="text.secondary">
            Add your first academic record to get started!
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
            Add Academic Record
          </Button>
        </Paper>
      ) : (
        <Box sx={{ '& > *': { mb: 3 } }}>
          {academics.map((academic) => (
            <AcademicCard
              key={academic._id}
              academic={academic}
              onEdit={(academic) => {
                setSelected(academic);
                setOpenDialog(true);
              }}
              onDelete={handleDelete}
            />
          ))}
        </Box>
      )}
    </Container>
  );
}