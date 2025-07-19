"use client";
import React, { useEffect, useState } from "react";
import {
  Container, Box, Typography, Button, Dialog, DialogTitle, DialogContent,
  CircularProgress, Alert, AlertTitle, Paper, TextField, Grid,
  Card, CardContent, CardActions, MenuItem, IconButton
} from "@mui/material";
import { Add as AddIcon, Delete as DeleteIcon, Cancel as CancelIcon, Save as SaveIcon, Edit as EditIcon } from "@mui/icons-material";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@mui/material/styles";
import { useMediaQuery } from "@mui/material";

type Research = {
  _id?: string;
  type: "Publication" | "Current Research";
  title: string;
  description: string;
  authors: string[];
  publicationDate?: string | Date | null;
  journal?: string;
  doi?: string;
  link?: string;
  status?: "In Progress" | "Completed" | "Published";
  ownerEmail?: string;
};

function ResearchForm({ initialData, onSuccess, onCancel, token }: {
  initialData: Research | null,
  onSuccess: () => void,
  onCancel: () => void,
  token: string
}) {
  const [formData, setFormData] = useState<Partial<Research>>({
    type: "Publication",
    title: "",
    description: "",
    authors: [""],
    publicationDate: null,
    journal: "",
    doi: "",
    link: "",
    status: "In Progress",
    ownerEmail: localStorage.getItem("ownerEmail") || ""
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  useEffect(() => {
    if (initialData) {
      setFormData({
        ...initialData,
        publicationDate: initialData.publicationDate ? new Date(initialData.publicationDate) : null,
        authors: initialData.authors && initialData.authors.length > 0 ? initialData.authors : [""],
      });
    } else {
      // Get ownerEmail from localStorage
      const ownerEmail = localStorage.getItem("ownerEmail");
      if (ownerEmail) {
        setFormData((prev) => ({ ...prev, ownerEmail }));
      }
    }
  }, [initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleArrayChange = (idx: number, value: string) => {
    setFormData((prev) => {
      const authors = [...(prev.authors || [""])];
      authors[idx] = value;
      return { ...prev, authors };
    });
  };

  const addAuthor = () => {
    setFormData((prev) => ({
      ...prev,
      authors: [...(prev.authors || []), ""],
    }));
  };

  const removeAuthor = (idx: number) => {
    setFormData((prev) => {
      const authors = [...(prev.authors || [])];
      authors.splice(idx, 1);
      return { ...prev, authors: authors.length ? authors : [""] };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const url = initialData
        ? `https://protfolio-product-backend.vercel.app/api/research/${initialData._id}`
        : "https://protfolio-product-backend.vercel.app/api/research";
      const method = initialData ? "PUT" : "POST";
      const body = { ...formData, ownerEmail: formData.ownerEmail };
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });
      if (!response.ok) {
        throw new Error(initialData ? "Failed to update research" : "Failed to create research");
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
      <Typography variant="h5" gutterBottom sx={{ fontWeight: "bold", mb: 3 }}>
        {initialData ? "Edit Research" : "Add New Research"}
      </Typography>
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          <AlertTitle>Error</AlertTitle>
          {error}
        </Alert>
      )}
      <form onSubmit={handleSubmit}>
        <Grid container spacing={4} style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(1, 1fr)", gap: "16px" }}>
          <Grid container spacing={2}>
            <TextField select fullWidth label="Type" name="type" value={formData.type} onChange={handleChange} required size="small">
              <MenuItem value="Publication">Publication</MenuItem>
              <MenuItem value="Current Research">Current Research</MenuItem>
            </TextField>
          </Grid>
          <Grid container spacing={2}>
            <TextField fullWidth label="Title" name="title" value={formData.title} onChange={handleChange} required size="small" />
          </Grid>
          <Grid container spacing={2}>
            <TextField fullWidth label="Description" name="description" value={formData.description} onChange={handleChange} required multiline rows={3} size="small" />
          </Grid>
          <Grid container spacing={2}>
            <Box sx={{ width: "100%" }}>
              <Typography variant="subtitle2" sx={{ mb: 1 }}>Authors</Typography>
              {(formData.authors || [""]).map((author, idx) => (
                <Box key={idx} sx={{ display: "flex", alignItems: "center", mb: 1, gap: 1 }}>
                  <TextField
                    value={author}
                    onChange={e => handleArrayChange(idx, e.target.value)}
                    placeholder="Author name"
                    fullWidth
                    size="small"
                  />
                  <IconButton onClick={() => removeAuthor(idx)} disabled={(formData.authors || []).length === 1} color="error" size="small">
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </Box>
              ))}
              <Button startIcon={<AddIcon />} onClick={addAuthor} variant="outlined" size="small" sx={{ mt: 1 }}>
                Add Author
              </Button>
            </Box>
          </Grid>
          <Grid container spacing={2}>
            <TextField fullWidth label="Publication Date" name="publicationDate" type="date" value={formData.publicationDate ? new Date(formData.publicationDate).toISOString().slice(0, 10) : ""} onChange={handleChange} size="small" InputLabelProps={{ shrink: true }} />
          </Grid>
          <Grid container spacing={2}>
            <TextField fullWidth label="Journal" name="journal" value={formData.journal} onChange={handleChange} size="small" />
          </Grid>
          <Grid container spacing={2}>
            <TextField fullWidth label="DOI" name="doi" value={formData.doi} onChange={handleChange} size="small" />
          </Grid>
          <Grid container spacing={2}>
            <TextField fullWidth label="Link" name="link" value={formData.link} onChange={handleChange} size="small" />
          </Grid>
          <Grid container spacing={2}>
            <TextField select fullWidth label="Status" name="status" value={formData.status} onChange={handleChange} size="small">
              <MenuItem value="In Progress">In Progress</MenuItem>
              <MenuItem value="Completed">Completed</MenuItem>
              <MenuItem value="Published">Published</MenuItem>
            </TextField>
          </Grid>
          <Grid container spacing={2}>
            <TextField name="ownerEmail" label="Owner Email" value={formData.ownerEmail} onChange={handleChange} fullWidth size="small" disabled />
          </Grid>
        </Grid>
        <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 4, gap: 2, flexDirection: isMobile ? "column" : "row" }}>
          <Button onClick={onCancel} variant="outlined" color="secondary" startIcon={<CancelIcon />} disabled={loading} sx={{ px: 3 }}>
            Cancel
          </Button>
          <Button type="submit" variant="contained" color="primary" startIcon={loading ? <CircularProgress size={20} /> : <SaveIcon />} disabled={loading} sx={{ px: 3 }}>
            {initialData ? "Update" : "Create"} Research
          </Button>
        </Box>
      </form>
    </Paper>
  );
}

function ResearchCard({ research, onEdit, onDelete }: {
  research: Research,
  onEdit: (r: Research) => void,
  onDelete: (r: Research) => void
}) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  return (
    <Card sx={{ mb: 3, borderRadius: 2, boxShadow: 2 }}>
      <CardContent>
        <Typography variant="h6" component="div" sx={{ fontWeight: "bold", mb: 1, fontSize: isMobile ? "1.2rem" : "1.5rem" }}>
          {research.title}
        </Typography>
        <Typography color="primary" gutterBottom sx={{ fontWeight: "medium", mb: 2, fontSize: isMobile ? "1rem" : "1.2rem" }}>
          {research.type}
        </Typography>
        <Typography variant="body2" sx={{ mb: 2, color: "text.secondary", fontSize: isMobile ? "0.9rem" : "1rem" }}>
          {research.publicationDate && new Date(research.publicationDate).toLocaleDateString("en-US", { year: "numeric", month: "short" })} • {research.status}
        </Typography>
        <Typography variant="body2" sx={{ mb: 2, fontSize: isMobile ? "0.9rem" : "1rem" }}>
          Authors: {(research.authors || []).join(", ")}
        </Typography>
        {research.description && (
          <Typography variant="body2" paragraph sx={{ mb: 2, fontSize: isMobile ? "0.9rem" : "1rem" , whiteSpace: "pre-line" , wordBreak: "break-word" }}>
            {research.description}
          </Typography>
        )}
        {research.journal && (
          <Typography variant="body2" sx={{ mb: 1, fontSize: isMobile ? "0.9rem" : "1rem" }}>
            Journal: {research.journal}
          </Typography>
        )}
        {research.doi && (
          <Typography variant="body2" sx={{ mb: 1, fontSize: isMobile ? "0.9rem" : "1rem" }}>
            DOI: {research.doi}
          </Typography>
        )}
        {research.link && (
          <Typography variant="body2" sx={{ mb: 1, fontSize: isMobile ? "0.9rem" : "1rem" }}>
            Link: <a href={research.link} target="_blank" style={{ wordWrap: "break-word", wordBreak: "break-all", overflowWrap: "break-word" }} rel="noopener noreferrer">{research.link}</a>
          </Typography>
        )}
      </CardContent>
      <CardActions sx={{ justifyContent: "flex-end", p: 2 }}>
        <Button size="small" startIcon={<EditIcon />} onClick={() => onEdit(research)} sx={{ color: "primary.main" }}>
          Edit
        </Button>
        <Button onClick={() => onDelete(research)} size="small" color="error" startIcon={<DeleteIcon />}>
          Delete
        </Button>
      </CardActions>
    </Card>
  );
}

export default function ResearchPage() {
  const [researches, setResearches] = useState<Research[]>([]);
  const [selected, setSelected] = useState<Research | null>(null);
  const { token } = useAuth() as { token: string };
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [researchToDelete, setResearchToDelete] = useState<Research | null>(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const fetchResearches = async () => {
    setLoading(true);
    try {
      const res = await fetch("https://protfolio-product-backend.vercel.app/api/research");
      if (!res.ok) throw new Error("Failed to fetch research");
      const data = await res.json();
      setResearches(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!researchToDelete) return;
    
    setLoading(true);
    try {
      const res = await fetch(`https://protfolio-product-backend.vercel.app/api/research/${researchToDelete._id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) throw new Error("Failed to delete research");
      await fetchResearches();
      setDeleteDialog(false);
      setResearchToDelete(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (research: Research) => {
    setResearchToDelete(research);
    setDeleteDialog(true);
  };

  useEffect(() => { fetchResearches(); }, []);

  return (
    <Container maxWidth="md" sx={{ py: 0 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 4, flexDirection: isMobile ? "column" : "row" }}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: "bold", color: "primary.main", textAlign: isMobile ? "center" : "left" }}>
          Research
        </Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => { setSelected(null); setOpenDialog(true); }} sx={{ borderRadius: 2 }}>
          Add New Research
        </Button>
      </Box>
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          <AlertTitle>Error</AlertTitle>
          {error}
        </Alert>
      )}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} fullWidth maxWidth="md" PaperProps={{ sx: { borderRadius: 2 } }}>
        <DialogTitle sx={{ fontWeight: "bold", borderBottom: "1px solid", borderColor: "divider", py: 2 }}>
          {selected ? "Edit Research" : "Add New Research"}
        </DialogTitle>
        <DialogContent sx={{ py: 0 }}>
          <ResearchForm
            initialData={selected}
            onSuccess={() => { fetchResearches(); setOpenDialog(false); }}
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
            Are you sure you want to delete the research &apos;{researchToDelete?.title}&apos;?
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
      ) : researches.length === 0 ? (
        <Paper elevation={0} sx={{ p: 0, textAlign: "center", borderRadius: 2 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>No research found</Typography>
          <Typography variant="body1" color="text.secondary">
            Add your first research to get started!
          </Typography>
          <Button variant="outlined" startIcon={<AddIcon />} onClick={() => { setSelected(null); setOpenDialog(true); }} sx={{ mt: 3 }}>
            Add Research
          </Button>
        </Paper>
      ) : (
        <Box sx={{ "& > *": { mb: 3 } }}>
          {researches.map((research) => (
            <ResearchCard
              key={research._id}
              research={research}
              onEdit={(research) => { setSelected(research); setOpenDialog(true); }}
              onDelete={handleDeleteClick}
            />
          ))}
        </Box>
      )}
    </Container>
  );
}