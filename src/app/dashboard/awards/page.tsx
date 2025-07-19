"use client";
import React, { useEffect, useState } from "react";
import {
  Container, Box, Typography, Button, Dialog, DialogTitle, DialogContent,
  CircularProgress, Alert, AlertTitle, Paper, TextField, Grid,
  Card, CardContent, CardActions, MenuItem
} from "@mui/material";
import { Add as AddIcon, Delete as DeleteIcon, Cancel as CancelIcon, Save as SaveIcon, Edit as EditIcon } from "@mui/icons-material";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@mui/material/styles";
import { useMediaQuery } from "@mui/material";

type Award = {
  _id?: string;
  title: string;
  issuer: string;
  date: string | Date;
  description?: string;
  category: "Academic" | "Professional" | "Research" | "Other";
  link?: string;
  ownerEmail?: string;
};

function AwardForm({ initialData, onSuccess, onCancel, token }: {
  initialData: Award | null,
  onSuccess: () => void,
  onCancel: () => void,
  token: string
}) {
  const [formData, setFormData] = useState<Partial<Award>>({
    title: "",
    issuer: "",
    date: new Date(),
    description: "",
    category: "Academic",
    link: "",
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
        date: new Date(initialData.date),
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const url = initialData
        ? `https://protfolio-product-backend.vercel.app/api/award/${initialData._id}`
        : "https://protfolio-product-backend.vercel.app/api/award";
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
        throw new Error(initialData ? "Failed to update award" : "Failed to create award");
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
        {initialData ? "Edit Award" : "Add New Award"}
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
            <TextField fullWidth label="Title" name="title" value={formData.title} onChange={handleChange} required size="small" />
          </Grid>
          <Grid container spacing={2}>
            <TextField fullWidth label="Issuer" name="issuer" value={formData.issuer} onChange={handleChange} required size="small" />
          </Grid>
          <Grid container spacing={2}>
            <TextField fullWidth label="Date" name="date" type="date" value={formData.date ? new Date(formData.date).toISOString().slice(0, 10) : ""} onChange={handleChange} required size="small" InputLabelProps={{ shrink: true }} />
          </Grid>
          <Grid container spacing={2}>
            <TextField select fullWidth label="Category" name="category" value={formData.category} onChange={handleChange} required size="small">
              <MenuItem value="Academic">Academic</MenuItem>
              <MenuItem value="Professional">Professional</MenuItem>
              <MenuItem value="Research">Research</MenuItem>
              <MenuItem value="Other">Other</MenuItem>
            </TextField>
          </Grid>
          <Grid container spacing={2}>
            <TextField fullWidth label="Description" name="description" value={formData.description} onChange={handleChange} multiline rows={3} size="small" />
          </Grid>
          <Grid container spacing={2}>
            <TextField fullWidth label="Link" name="link" value={formData.link} onChange={handleChange} size="small" />
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
            {initialData ? "Update" : "Create"} Award
          </Button>
        </Box>
      </form>
    </Paper>
  );
}

function AwardCard({ award, onEdit, onDelete }: {
  award: Award,
  onEdit: (a: Award) => void,
  onDelete: (a: Award) => void
}) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  return (
    <Card sx={{ mb: 3, borderRadius: 2, boxShadow: 2, width: "100%" }}>
      <CardContent>
        <Typography variant={isMobile ? "h6" : "h5"} component="div" sx={{ fontWeight: "bold", mb: 1, fontSize: isMobile ? "1.2rem" : "1.5rem" }}>
          {award.title}
        </Typography>
        <Typography color="primary" gutterBottom sx={{ fontWeight: "medium", mb: 2, fontSize: isMobile ? "1rem" : "1.2rem" }}>
          {award.issuer}
        </Typography>
        <Typography variant="body2" sx={{ mb: 2, color: "text.secondary", fontSize: isMobile ? "0.9rem" : "1rem" }}>
          {new Date(award.date).toLocaleDateString("en-US", { year: "numeric", month: "short" })} • {award.category}
        </Typography>
        {award.description && (
          <Typography variant="body2" paragraph sx={{ mb: 2, fontSize: isMobile ? "0.9rem" : "1rem", whiteSpace: "pre-line" , wordBreak: "break-word" }}>
            {award.description}
          </Typography>
        )}
        {award.link && (
          <Typography variant="body2" sx={{ mb: 1, fontSize: isMobile ? "0.9rem" : "1rem"  }}>
            Link: <a href={award.link} target="_blank" style={{ wordWrap: "break-word", wordBreak: "break-all", overflowWrap: "break-word" }} rel="noopener noreferrer">{award.link}</a>
          </Typography>
        )}
      </CardContent>
      <CardActions sx={{ justifyContent: "flex-end", p: 2 }}>
        <Button size="small" startIcon={<EditIcon />} onClick={() => onEdit(award)} sx={{ color: "primary.main" }}>
          Edit
        </Button>
        <Button onClick={() => onDelete(award)} size="small" color="error" startIcon={<DeleteIcon />}>
          Delete
        </Button>
      </CardActions>
    </Card>
  );
}

export default function AwardsPage() {
  const [awards, setAwards] = useState<Award[]>([]);
  const [selected, setSelected] = useState<Award | null>(null);
  const { token } = useAuth() as { token: string };
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [awardToDelete, setAwardToDelete] = useState<Award | null>(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const fetchAwards = async () => {
    setLoading(true);
    try {
      const res = await fetch("https://protfolio-product-backend.vercel.app/api/award");
      if (!res.ok) throw new Error("Failed to fetch awards");
      const data = await res.json();
      setAwards(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!awardToDelete) return;
    
    setLoading(true);
    try {
      const res = await fetch(`https://protfolio-product-backend.vercel.app/api/award/${awardToDelete._id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) throw new Error("Failed to delete award");
      await fetchAwards();
      setDeleteDialog(false);
      setAwardToDelete(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (award: Award) => {
    setAwardToDelete(award);
    setDeleteDialog(true);
  };

  useEffect(() => { fetchAwards(); }, []);

  return (
    <Container maxWidth="md" sx={{ py: 0 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 4, flexDirection: isMobile ? "column" : "row" }}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: "bold", color: "primary.main", textAlign: isMobile ? "center" : "left" }}>
          Awards
        </Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => { setSelected(null); setOpenDialog(true); }} sx={{ borderRadius: 2 }}>
          Add New Award
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
          {selected ? "Edit Award" : "Add New Award"}
        </DialogTitle>
        <DialogContent sx={{ py: 0 }}>
          <AwardForm
            initialData={selected}
            onSuccess={() => { fetchAwards(); setOpenDialog(false); }}
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
            Are you sure you want to delete the award &apos;{awardToDelete?.title}&apos;?
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
      ) : awards.length === 0 ? (
        <Paper elevation={0} sx={{ p: 0, textAlign: "center", borderRadius: 2 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>No awards found</Typography>
          <Typography variant="body1" color="text.secondary">
            Add your first award to get started!
          </Typography>
          <Button variant="outlined" startIcon={<AddIcon />} onClick={() => { setSelected(null); setOpenDialog(true); }} sx={{ mt: 3 }}>
            Add Award
          </Button>
        </Paper>
      ) : (
        <Box sx={{ "& > *": { mb: 3 } }}>
          {awards.map((award) => (
            <AwardCard
              key={award._id}
              award={award}
              onEdit={(award) => { setSelected(award); setOpenDialog(true); }}
              onDelete={handleDeleteClick}
            />
          ))}
        </Box>
      )}
    </Container>
  );
}