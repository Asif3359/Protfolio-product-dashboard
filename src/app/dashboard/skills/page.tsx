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
  Slider,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import {
  Add as AddIcon,
  Edit as EditIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
} from "@mui/icons-material";
import { useAuth } from "@/context/AuthContext";

const API_URL = "https://protfolio-product-backend.vercel.app/api/skill";

interface Skill {
  _id?: string;
  name: string;
  category: string;
  proficiency: number;
  description?: string;
  ownerEmail: string;
}

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
      category: "Programming",
      proficiency: 50,
      description: "",
      ownerEmail: localStorage.getItem("ownerEmail") || "",
    }
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    if (initialData) setForm(initialData);
  }, [initialData]);

  useEffect(() => {
    // Only fetch if adding a new skill (not editing)
    if (!initialData) {
      // Get ownerEmail from localStorage
      const ownerEmail = localStorage.getItem("ownerEmail");
      if (ownerEmail) {
        setForm((prev) => ({ ...prev, ownerEmail }));
      }
    }
  }, [initialData]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: name === "proficiency" ? Number(value) : value }));
  };

  const handleSliderChange = (_: Event, value: number | number[]) => {
    setForm((prev) => ({ ...prev, proficiency: value as number }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");
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
      if (!res.ok) throw new Error("Error saving skill");
      onSuccess();
      if (!form._id) {
        setForm({
          name: "",
          category: "Programming",
          proficiency: 50,
          description: "",
          ownerEmail: form.ownerEmail, // keep the current email
        });
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
            <Box sx={{ px: 1 }}>
              <Typography gutterBottom>Proficiency: {form.proficiency}</Typography>
              <Slider
                value={form.proficiency}
                onChange={handleSliderChange}
                min={1}
                max={100}
                step={1}
                valueLabelDisplay="auto"
                name="proficiency"
              />
            </Box>
          </Grid>
          <Grid container spacing={2}>
            <TextField
              name="description"
              label="Description"
              value={form.description}
              onChange={handleChange}
              fullWidth
              multiline
              rows={2}
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

function SkillCard({ skill, onEdit }: { skill: Skill; onEdit: (s: Skill) => void }) {
  return (
    <Card sx={{ mb: 3, borderRadius: 2, boxShadow: 2 }}>
      <CardContent>
        <Typography variant="h6" component="div" sx={{ fontWeight: "bold", mb: 1 }}>
          {skill.name}
        </Typography>
        <Typography color="primary" gutterBottom sx={{ fontWeight: "medium", mb: 2 }}>
          {skill.category} • Proficiency: {skill.proficiency}
        </Typography>
        {skill.description && (
          <Typography variant="body2" paragraph sx={{ mb: 2 , whiteSpace: "pre-line" , wordBreak: "break-word" }}>
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
            />
          ))}
        </Box>
      )}
    </Container>
  );
}