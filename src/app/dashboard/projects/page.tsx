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
  IconButton,
  Card,
  CardContent,
  CardActions,
  Dialog,
  DialogTitle,
  DialogContent,
  Stack,
  InputLabel,
  FormControl,
  useMediaQuery,
} from "@mui/material";
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  CloudUpload,
  Link as LinkIcon,
  GitHub as GitHubIcon,
} from "@mui/icons-material";
import { useAuth } from "@/context/AuthContext";
import { styled, useTheme } from "@mui/material/styles";

// const API_URL = "https://protfolio-product-backend.vercel.app/api/project";
const API_URL = "http://localhost:3000/api/project";  
interface Project {
  _id?: string;
  title: string;
  description: string;
  technologies: string[];
  images?: string[]; // <-- changed
  startDate: string;
  endDate?: string;
  link?: string;
  githubLink?: string;
  features: string[];
  status: "In Progress" | "Completed" | "On Hold";
  ownerEmail: string;
}

type ProjectArrayField = "technologies" | "features";

const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  whiteSpace: "nowrap",
  width: 1,
});

function ProjectForm({ initialData, onSuccess, onCancel, token }: { initialData: Project | null, onSuccess: () => void, onCancel: () => void, token: string | null }) {
  const [form, setForm] = useState<Project>(
    initialData || {
      title: "",
      description: "",
      technologies: [""],
      images: [""],
      startDate: "",
      endDate: "",
      link: "",
      githubLink: "",
      features: [""],
      status: "In Progress",
      ownerEmail: localStorage.getItem("ownerEmail") || "",
    }
  );
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    if (initialData && initialData.images) {
      setImagePreviews(initialData.images);
    }
  }, [initialData]);

  useEffect(() => {
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
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleArrayChange = (name: ProjectArrayField, idx: number, value: string) => {
    setForm((prev) => {
      const arr = [...(prev[name] as string[])];
      arr[idx] = value;
      return { ...prev, [name]: arr };
    });
  };

  const addArrayItem = (name: ProjectArrayField) => {
    setForm((prev) => ({ ...prev, [name]: [...(prev[name] as string[]), ""] }));
  };

  const removeArrayItem = (name: ProjectArrayField, idx: number) => {
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

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const formData = new FormData();
      formData.append("title", form.title);
      formData.append("description", form.description);
      form.technologies.forEach((tech, i) => formData.append(`technologies[${i}]`, tech));
      form.features.forEach((feat, i) => formData.append(`features[${i}]`, feat));
      formData.append("startDate", form.startDate);
      if (form.endDate) formData.append("endDate", form.endDate);
      if (form.link) formData.append("link", form.link);
      if (form.githubLink) formData.append("githubLink", form.githubLink);
      formData.append("status", form.status);
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
      if (!res.ok) throw new Error("Error saving project");
      onSuccess();
      if (!form._id) {
        setForm({
          title: "",
          description: "",
          technologies: [""],
          images: [""],
          startDate: "",
          endDate: "",
          link: "",
          githubLink: "",
          features: [""],
          status: "In Progress",
          ownerEmail: form.ownerEmail,
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

  const renderArrayField = (field: ProjectArrayField, label: string) => (
    <Box sx={{ backgroundColor: "background.paper", borderRadius: 1, width: "100%", maxWidth: "100%" }}>
      <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: "medium" }}>{label}</Typography>
      {(form[field] as string[]).map((item, idx) => (
        <Box key={idx} sx={{ display: "flex", alignItems: "center", mb: 1, gap: 1 }}>
          <TextField
            value={item}
            onChange={(e) => handleArrayChange(field, idx, e.target.value)}
            placeholder={`Enter ${label.slice(0, -1)}`}
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
        Add {label.slice(0, -1)}
      </Button>
    </Box>
  );

  return (
    <Paper elevation={0} sx={{ p: 0, mb: 4, borderRadius: 2 }}>
      <Typography variant="h5" gutterBottom sx={{ fontWeight: "bold", mb: 3 }}>
        {form._id ? "Edit Project" : "Add New Project"}
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
              label="Project Title"
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
              name="status"
              label="Status"
              value={form.status}
              onChange={handleChange}
              fullWidth
              select
              SelectProps={{ native: true }}
              size="small"
              variant="outlined"
            >
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
              <option value="On Hold">On Hold</option>
            </TextField>
          </Grid>
          <Grid container spacing={2}>
            <TextField
              name="startDate"
              label="Start Date"
              type="date"
              value={form.startDate?.slice(0, 10) || ""}
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
              value={form.endDate?.slice(0, 10) || ""}
              onChange={handleChange}
              fullWidth
              size="small"
              InputLabelProps={{ shrink: true }}
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
              sx={{ width: "100%", maxWidth: "100%" }}
            />
          </Grid>
          <Grid container spacing={2}>
            <TextField
              name="link"
              label="Live Link"
              value={form.link}
              onChange={handleChange}
              fullWidth
              size="small"
            />
          </Grid>
          <Grid container spacing={2}>
            <TextField
              name="githubLink"
              label="GitHub Link"
              value={form.githubLink}
              onChange={handleChange}
              fullWidth
              size="small"
            />
          </Grid>
          <Grid container spacing={2}>
            {renderArrayField("technologies", "Technologies")}
          </Grid>
          <Grid container spacing={2}>
            {renderArrayField("features", "Features")}
          </Grid>
          <Grid container spacing={2}>
            <FormControl fullWidth margin="normal">
              <InputLabel shrink sx={{ mb: 1 }}>Project Images</InputLabel>
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
                    <Grid  key={idx} component="div">
                      <Box
                        sx={{
                          width: "100%",
                          position: "relative",
                          borderRadius: 2,
                          overflow: "hidden",
                          boxShadow: 1,
                          bgcolor: "background.paper",
                          minHeight: 80, // Optional: ensures some height for empty images
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <img
                          src={preview}
                          alt={`Project preview ${idx + 1}`}
                          style={{
                            width: "100%",
                            height: "300px",
                            objectFit: "cover",
                            display: "block",
                            maxHeight: 200, // Optional: limit max height
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
            {form._id ? "Update" : "Create"} Project
          </Button>
        </Box>
      </form>
    </Paper>
  );
}

function ProjectCard({ project, onEdit, onDelete }: { project: Project; onEdit: (p: Project) => void; onDelete: (p: Project) => void }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  return (
    <Card sx={{ mb: 3, borderRadius: 2, boxShadow: 2 }}>
      <CardContent>
        <Typography variant="h6" component="div" sx={{ fontWeight: "bold", mb: 1, wordBreak: "break-word", whiteSpace: "pre-line" }}>
          {project.title}
        </Typography>
        <Typography color="primary" gutterBottom sx={{ fontWeight: "medium", mb: 2 }}>
          {project.status} • {new Date(project.startDate).toLocaleDateString()} {project.endDate ? `- ${new Date(project.endDate).toLocaleDateString()}` : ""}
        </Typography>
        <Typography variant="body2" paragraph sx={{ mb: 2, whiteSpace: "pre-line", wordBreak: "break-word" }}>
          {project.description}
        </Typography>
        {project.technologies.length > 0 && (
          <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1 }}>Technologies:</Typography>
            <Box component="ul" style={{ display: "flex", flexDirection: "column", flexWrap: "wrap", gap: 1, listStyle: "disc", marginLeft: isMobile ? 30 : 30 }}>
              {project.technologies.map((tech, idx) => (
                <Typography component="li" key={idx} style={{ fontSize: 14,}}>{tech}</Typography >
              ))}
            </Box>
          </Box>  
        )}
        {project.features.length > 0 && (
          <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle2" sx={{ fontWeight:700, mb: 1 }}>Features :</Typography>
            <Box component="ul" style={{ display: "flex", flexDirection: "column", flexWrap: "wrap", gap: 1, listStyle: "disc", marginLeft: isMobile ? 30 : 30 }}>
              {project.features.map((feat, idx) => (
                <Typography component="li" key={idx} style={{ fontSize: 14,}}>{feat}</Typography >
              ))}
            </Box>
          </Box>
        )}
        {project.images && project.images.length > 0 && (
          <Box sx={{ mt: 2, display: "grid", gridTemplateColumns: isMobile ? 'repeat(1, 1fr)' : 'repeat(3, 1fr)', gap: '16px' }}>
            {project.images.map((img, idx) => (
              <img
                key={idx}
                src={img}
                alt={`${project.title} ${idx + 1}`}
                style={{ width: "100%", maxHeight: 100, objectFit: "cover", borderRadius: 8 }}
              />
            ))}
          </Box>
        )}
        <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
          {project.link && (
            <Button
              href={project.link}
              target="_blank"
              rel="noopener noreferrer"
              startIcon={<LinkIcon />}
              size="small"
              variant="outlined"
            >
              Live
            </Button>
          )}
          {project.githubLink && (
            <Button
              href={project.githubLink}
              target="_blank"
              rel="noopener noreferrer"
              startIcon={<GitHubIcon />}
              size="small"
              variant="outlined"
            >
              GitHub
            </Button>
          )}
        </Box>
      </CardContent>
      <CardActions sx={{ justifyContent: "flex-end", p: 2 }}>
        <Button
          size="small"
          startIcon={<EditIcon />}
          onClick={() => onEdit(project)}
          sx={{ color: "primary.main" }}
        >
          Edit
        </Button>
        <Button
          size="small"
          startIcon={<DeleteIcon />}
          onClick={() => onDelete(project)}
          sx={{ color: "error.main" }}
        >
          Delete
        </Button>
      </CardActions>
    </Card>
  );
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [selected, setSelected] = useState<Project | null>(null);
  const { token } = useAuth() as { token: string };
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState<Project | null>(null);
  const fetchProjects = async () => {
    setLoading(true);
    try {
      const res = await fetch(API_URL);
      if (!res.ok) throw new Error("Failed to fetch projects");
      const data: Project[] = await res.json();
      setProjects(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!projectToDelete) return;
    
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/${projectToDelete._id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      if (!res.ok) throw new Error("Failed to delete project");
      
      await fetchProjects();
      setDeleteDialog(false);
      setProjectToDelete(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (project: Project) => {
    setProjectToDelete(project);
    setDeleteDialog(true);
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  return (
    <Container maxWidth="md" sx={{ py: { xs: 1, sm: 1.5, md: 2 } }}>
      <Box sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        mb: { xs: 3, sm: 3.5, md: 4 },
        flexDirection: { xs: "column", sm: "row" },
        gap: { xs: 2, sm: 0 }
      }}>
        <Typography
          variant="h4"
          component="h1"
          sx={{
            fontWeight: "bold",
            color: "primary.main",
            textAlign: { xs: "center", sm: "left" },
            fontSize: { xs: '1.75rem', sm: '2rem', md: '2.5rem' }
          }}
        >
          Projects
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => {
            setSelected(null);
            setOpenDialog(true);
          }}
          sx={{
            borderRadius: 2,
            width: { xs: '100%', sm: 'auto' },
            minWidth: { xs: 'auto', sm: 140, md: 160 }
          }}
        >
          Add New Project
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
        <DialogTitle sx={{ fontWeight: "bold", borderBottom: "1px solid", borderColor: "divider", py: 2 }}>
          {selected ? "Edit Project" : "Add New Project"}
        </DialogTitle>
        <DialogContent sx={{ py: 0 }}>
          <ProjectForm
            initialData={selected}
            onSuccess={() => {
              fetchProjects();
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
            Are you sure you want to delete the project &apos;{projectToDelete?.title}&apos;?
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
      ) : projects.length === 0 ? (
        <Paper elevation={0} sx={{ p: 0, textAlign: "center", borderRadius: 2 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>No projects found</Typography>
          <Typography variant="body1" color="text.secondary">
            Add your first project to get started!
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
            Add Project
          </Button>
        </Paper>
      ) : (
        <Box sx={{ '& > *': { mb: 3 } }}>
          {projects.map((proj) => (
            <ProjectCard
              key={proj._id}
              project={proj}
              onEdit={(proj) => {
                setSelected(proj);
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