"use client";
import React, { useEffect, useState, ChangeEvent, FormEvent } from "react";
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
  Chip,
  Card,
  CardContent,
  CardActions,
  Dialog,
  DialogTitle,
  DialogContent,
  MenuItem,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import {
  Add as AddIcon,
  Edit as EditIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  Delete as DeleteIcon,
} from "@mui/icons-material";
import { useAuth } from "@/context/AuthContext";

const API_URL = "http://localhost:3000/api/skill";

interface Skill {
  _id?: string;
  name: string;
  type: string;
  category: string;
  description?: string;
  ownerEmail: string;
  logo: string;
}

const types = [
  "Technical",
  "Soft",
  "Language",
  "Other",
];

const categories = [
  "Programming",
  "Framework",
  "Database",
  "Tool",
  "Language",
  "Design",
  "DevOps",
  "Cloud",
  "Other",
];

function SkillForm({ initialData, onSuccess, onCancel, token }: { initialData: Skill | null, onSuccess: () => void, onCancel: () => void, token: string | null }) {
  const [form, setForm] = useState<Skill>(
    initialData || {
      name: "",
      type: "Technical",
      category: "Programming",
      description: "",
      ownerEmail: localStorage.getItem("ownerEmail") || "",
      logo: "",
    }
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [logoFile, setLogoFile] = useState<File | null>(null);

  useEffect(() => {
    if (initialData) setForm(initialData);
  }, [initialData]);

  useEffect(() => {
    if (!initialData) {
      const ownerEmail = localStorage.getItem("ownerEmail");
      if (ownerEmail) {
        setForm((prev) => ({ ...prev, ownerEmail }));
      }
    }
  }, [initialData]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const method = form._id ? "put" : "post";
      const url = form._id ? `${API_URL}/${form._id}` : API_URL;
      const formData = new FormData();
      formData.append("name", form.name);
      formData.append("type", form.type);
      formData.append("category", form.category);
      formData.append("description", form.description || "");
      formData.append("ownerEmail", form.ownerEmail);
      if (logoFile) {
        formData.append("logo", logoFile);
      }
      // console.log(formData);
      const res = await fetch(url, {
        method: method.toUpperCase(),
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });
      if (!res.ok) throw new Error("Error saving skill");
      onSuccess();
      if (!form._id) {
        setForm({
          name: "",
          type: "Technical",
          category: "Programming",
          description: "",
          ownerEmail: form.ownerEmail,
          logo: "",
        });
        setLogoFile(null);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper elevation={0} sx={{ p: 0, mb: 4, borderRadius: 2 }}>
      <Typography variant="h5" gutterBottom sx={{ fontWeight: "bold", mb: 3 }}>
        {form._id ? "Edit Skill" : "Add New Skill"}
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
              name="name"
              label="Skill Name"
              value={form.name}
              onChange={handleChange}
              fullWidth
              required
              size="small"
              variant="outlined"
            />
          </Grid>
          <Grid container spacing={2}>
            <TextField
              name="type"
              label="Type"
              value={form.type}
              onChange={handleChange}
              fullWidth
              select
              size="small"
              variant="outlined"
              required
            >
              {types.map((t) => (
                <MenuItem key={t} value={t}>{t}</MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid container spacing={2}>
            <TextField
              name="category"
              label="Category"
              value={form.category}
              onChange={handleChange}
              fullWidth
              select
              size="small"
              variant="outlined"
            >
              {categories.map((cat) => (
                <MenuItem key={cat} value={cat}>{cat}</MenuItem>
              ))}
            </TextField>
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
              size="small"
              variant="outlined"
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
            <Button
              variant="outlined"
              component="label"
              fullWidth
              sx={{ textAlign: "left" }}
            >
              {logoFile ? logoFile.name : (form.logo ? "Change Logo" : "Upload Logo")}
              <input
                type="file"
                accept="image/*"
                hidden
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    setLogoFile(e.target.files[0]);
                  }
                }}
              />
            </Button>
            {form.logo && !logoFile && (
              <Box sx={{ mt: 1 }}>
                <img src={form.logo} alt="Logo" style={{ maxHeight: 40 }} />
              </Box>
            )}
          </Grid>
        </Grid>
        <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 4, gap: 2, flexDirection: { xs: "column", sm: "row" } }}>
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
            {form._id ? "Update" : "Create"} Skill
          </Button>
        </Box>
      </form>
    </Paper>
  );
}

function SkillCard({ skill, onEdit, onDelete }: { skill: Skill; onEdit: (s: Skill) => void; onDelete: (s: Skill) => void }) {
  return (
    <Card sx={{ mb: 3, borderRadius: 2, boxShadow: 2 }}>
      <CardContent>
        <Box sx={{ mb: 2, display: "flex", alignItems: "center", gap: 2, justifyContent: "start" }}>
          {skill.logo && (
            <img src={skill.logo} alt={skill.name} style={{ maxHeight: 40 }} />
          )}
          <Typography variant="h6" component="div" sx={{ fontWeight: "bold", width: "100%" }}>
            {skill.name}
          </Typography>
        </Box>
        <Typography color="primary" gutterBottom sx={{ fontWeight: "medium", mb: 2 }}>
          {skill.type} • {skill.category}
        </Typography>
        {skill.description && (
          <Typography variant="body2" paragraph sx={{ mb: 2, whiteSpace: "pre-line", wordBreak: "break-word" }}>
            {skill.description}
          </Typography>
        )}
        <Chip label={skill.ownerEmail} size="small" color="secondary" variant="outlined" sx={{ mt: 1 }} />
      </CardContent>
      <CardActions sx={{ justifyContent: "flex-end", p: 2 }}>
        <Button
          size="small"
          startIcon={<EditIcon />}
          onClick={() => onEdit(skill)}
          sx={{ color: "primary.main" }}
        >
          Edit
        </Button>
        <Button
          size="small"
          startIcon={<DeleteIcon />}
          onClick={() => onDelete(skill)}
          sx={{ color: "error.main" }}
        >
          Delete
        </Button>
      </CardActions>
    </Card>
  );
}

export default function SkillsPage() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [selected, setSelected] = useState<Skill | null>(null);
  const { token } = useAuth() as { token: string };
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [skillToDelete, setSkillToDelete] = useState<Skill | null>(null);
  const fetchSkills = async () => {
    setLoading(true);
    try {
      const res = await fetch(API_URL);
      if (!res.ok) throw new Error("Failed to fetch skills");
      const data: Skill[] = await res.json();
      setSkills(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!skillToDelete) return;
    
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/${skillToDelete._id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      if (!res.ok) throw new Error("Failed to delete skill");
      
      await fetchSkills();
      setDeleteDialog(false);
      setSkillToDelete(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (skill: Skill) => {
    setSkillToDelete(skill);
    setDeleteDialog(true);
  };

  useEffect(() => {
    fetchSkills();
  }, []);

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 4, flexDirection: { xs: "column", sm: "row" } }}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: "bold", color: "primary.main", textAlign: { xs: "center", sm: "left" } }}>
          Skills
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
          Add New Skill
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
        maxWidth="sm"
        PaperProps={{ sx: { borderRadius: 2 } }}
      >
        <DialogTitle sx={{ fontWeight: "bold", borderBottom: "1px solid", borderColor: "divider", py: 2 }}>
          {selected ? "Edit Skill" : "Add New Skill"}
        </DialogTitle>
        <DialogContent sx={{ py: 3 }}>
          <SkillForm
            initialData={selected}
            onSuccess={() => {
              fetchSkills();
              setOpenDialog(false);
            }}
            onCancel={() => setOpenDialog(false)}
            token={token || ""}
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
        <DialogTitle sx={{ fontWeight: "bold", borderBottom: "1px solid", borderColor: "divider", py: 2 }}>
          Confirm Delete
        </DialogTitle>
        <DialogContent sx={{ py: 3 }}>
          <Typography variant="body1" sx={{ mb: 2 }}>
            Are you sure you want to delete the skill &apos;{skillToDelete?.name}&apos;?
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
        <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
          <CircularProgress />
        </Box>
      ) : skills.length === 0 ? (
        <Paper elevation={0} sx={{ p: 4, textAlign: "center", borderRadius: 2 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>No skills found</Typography>
          <Typography variant="body1" color="text.secondary">
            Add your first skill to get started!
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
            Add Skill
          </Button>
        </Paper>
      ) : (
        <Box sx={{ '& > *': { mb: 3 } }}>
          {skills.map((skill) => (
            <SkillCard
              key={skill._id}
              skill={skill}
              onEdit={(s) => {
                setSelected(s);
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