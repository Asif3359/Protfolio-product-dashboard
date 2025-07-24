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
  logo?: string; // Added logo field
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
    ownerEmail: localStorage.getItem("ownerEmail") || '',
    logo: undefined,
  });
  const [achievementInput, setAchievementInput] = useState('');
  const [logoFile, setLogoFile] = useState<File | null>(null); // New state for file
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
        ownerEmail: initialData.ownerEmail || '',
        logo: initialData.logo,
      });
      setLogoFile(null); // Reset file input on edit
    } else {
      // Get ownerEmail from localStorage
      const ownerEmail = localStorage.getItem("ownerEmail");
      if (ownerEmail) {
        setFormData((prev) => ({ ...prev, ownerEmail }));
      }
      setLogoFile(null);
    }
  }, [initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev: Partial<Academic>) => ({ ...prev, [name]: value }));
  };

  const handleDateChange = (name: string) => (date: Date | null) => {
    setFormData((prev: Partial<Academic>) => ({ ...prev, [name]: date }));
  };

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setLogoFile(e.target.files[0]);
    }
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
      const form = new FormData();
      form.append('degree', formData.degree || '');
      form.append('institution', formData.institution || '');
      form.append('field', formData.field || '');
      form.append('startDate', formData.startDate ? new Date(formData.startDate).toISOString() : '');
      if (formData.endDate) form.append('endDate', new Date(formData.endDate).toISOString());
      if (formData.description) form.append('description', formData.description);
      if (formData.gpa !== undefined) form.append('gpa', String(formData.gpa));
      if (formData.ownerEmail) form.append('ownerEmail', formData.ownerEmail);
      if (formData.achievements && formData.achievements.length > 0) {
        formData.achievements.forEach((ach, idx) => form.append(`achievements[${idx}]`, ach));
      }
      // Logo: required for create, optional for edit
      if (!initialData && !logoFile) {
        setError('Logo is required.');
        setLoading(false);
        return;
      }
      if (logoFile) {
        form.append('logo', logoFile);
      }
      const response = await fetch(url, {
        method,
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: form
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
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <Grid container spacing={4} style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(1, 1fr)', gap: '16px' }}>
          {/* Move logo upload to the very top and improve labeling */}
          <Grid container spacing={2} alignItems="center">
            <Box sx={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', alignItems: isMobile ? 'flex-start' : 'center', gap: 2, width: '100%' }}>
              <Box>
                <Typography variant="subtitle1" sx={{ fontWeight: 500, mb: 1 }}>
                  Institution Logo {(!initialData && <span style={{ color: '#d32f2f' }}>*</span>)}
                </Typography>
                <Button
                  variant="contained"
                  component="label"
                  sx={{ minWidth: 140 }}
                >
                  {logoFile ? 'Change Logo' : (formData.logo ? 'Change Logo' : 'Upload Logo')}
                  <input
                    type="file"
                    accept="image/*"
                    hidden
                    onChange={handleLogoChange}
                  />
                </Button>
                {!initialData && (
                  <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                    * Logo is required
                  </Typography>
                )}
              </Box>
              {(logoFile || formData.logo) && (
                <Box sx={{ ml: isMobile ? 0 : 2, mt: isMobile ? 2 : 0 }}>
                  <img
                    src={logoFile ? URL.createObjectURL(logoFile) : (formData.logo as string)}
                    alt="Logo Preview"
                    style={{ width: 64, height: 64, objectFit: 'contain', borderRadius: 6, border: '1px solid #eee', background: '#fafafa' }}
                  />
                </Box>
              )}
            </Box>
            <Box sx={{ width: '100%', mt: 2 }}>
              <hr style={{ border: 0, borderTop: '1px solid #eee', margin: 0 }} />
            </Box>
          </Grid>
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
              inputProps={{ step: "0.01", min: "0", max: "5.00" }}
              value={formData.gpa || ''}
              onChange={handleChange}
              InputProps={{
                endAdornment: <InputAdornment position="end">/5.00</InputAdornment>,
              }}
              size="small"
            />
          </Grid>
          <Grid container spacing={2}>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                format="dd/MM/yyyy"
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
                format="dd/MM/yyyy"
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
              rows={10}
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
  onDelete: (a: Academic) => void 
}) {
  const formatDate = (dateString: string | Date) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
  };

  return (
    <Card sx={{ mb: 3, borderRadius: 2, boxShadow: 2 }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          {academic.logo && (
            <img
              src={academic.logo}
              alt="Logo"
              style={{ width: 40, height: 40, objectFit: 'contain', borderRadius: 4, marginRight: 12, border: '1px solid #eee' }}
            />
          )}
          <Typography variant="h6" component="div" sx={{ fontWeight: 'bold', mb: 0 }}>
            {academic.degree} in {academic.field}
          </Typography>
        </Box>
        <Typography color="primary" gutterBottom sx={{ fontWeight: 'medium', mb: 2 }}>
          {academic.institution}
        </Typography>
        <Typography variant="body2" sx={{ mb: 2, color: 'text.secondary' }}>
          {formatDate(academic.startDate)} - {academic.endDate ? formatDate(academic.endDate) : 'Present'}
          {academic.gpa && ` • GPA: ${academic.gpa}`}
        </Typography>
        {academic.description && (
          <Typography variant="body2" paragraph sx={{ mb: 2, whiteSpace: "pre-line" , wordBreak: "break-word" }}>
            {academic.description}
          </Typography>
        )}
        {academic.achievements && academic.achievements.length > 0 && (
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1, fontSize: "14px" }}>Achievements:</Typography>
            <ul style={{ marginTop: 4, marginBottom: 0, paddingLeft: 20 }}>
              {academic.achievements?.map((ach: string, i: number) => (
                <li style={{ wordBreak: "break-word" , whiteSpace: "pre-line", fontSize: "12px" }}  key={i}>{ach}</li>
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
          onClick={() => onDelete(academic)} 
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
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [academicToDelete, setAcademicToDelete] = useState<Academic | null>(null);
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

  const handleDelete = async () => {
    if (!academicToDelete) return;
    
    setLoading(true);
    try {
      const res = await fetch(`https://protfolio-product-backend.vercel.app/api/academic/${academicToDelete._id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!res.ok) throw new Error('Failed to delete academic');
      await fetchAcademics();
      setDeleteDialog(false);
      setAcademicToDelete(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (academic: Academic) => {
    setAcademicToDelete(academic);
    setDeleteDialog(true);
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
            Are you sure you want to delete the academic record &apos;{academicToDelete?.degree} in {academicToDelete?.field}&apos; at {academicToDelete?.institution}?
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
              onDelete={handleDeleteClick}
            />
          ))}
        </Box>
      )}
    </Container>
  );
}
