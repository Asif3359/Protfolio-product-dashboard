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
import { LocalizationProvider } from "@mui/x-date-pickers";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";

type Award = {
  _id?: string;
  title: string;
  issuer: string;
  date: string | Date;
  description?: string;
  category: "Academic" | "Professional" | "Research" | "Other";
  link?: string;
  ownerEmail?: string;
  image?: string;
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
    ownerEmail: localStorage.getItem("ownerEmail") || "",
    image: undefined
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  useEffect(() => {
    if (initialData) {
      setFormData({
        ...initialData,
        date: new Date(initialData.date),
        image: initialData.image
      });
      setImagePreview(initialData.image || null);
    } else {
      const ownerEmail = localStorage.getItem("ownerEmail");
      if (ownerEmail) {
        setFormData((prev) => ({ ...prev, ownerEmail }));
      }
      setImagePreview(null);
    }
  }, [initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, files } = e.target;
    if (type === "file" && files && files[0]) {
      setImageFile(files[0]);
      setFormData((prev) => ({ ...prev, image: files[0].name }));
      const reader = new FileReader();
      reader.onload = (ev) => {
        setImagePreview(ev.target?.result as string);
      };
      reader.readAsDataURL(files[0]);
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
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
      const body: FormData | string = new FormData();
      let headers: Record<string, string> = {
        Authorization: `Bearer ${token}`,
      };
  
      body.append("title", formData.title || "");
      body.append("issuer", formData.issuer || "");
      body.append("date", formData.date ? new Date(formData.date).toISOString() : "");
      body.append("description", formData.description || "");
      body.append("category", formData.category || "Academic");
      body.append("link", formData.link || "");
      body.append("ownerEmail", formData.ownerEmail || "");
      if (imageFile) {
        body.append("image", imageFile);
      } else if (formData.image) {
        body.append("image", formData.image);
      }
      headers = { Authorization: `Bearer ${token}` };
  
      const response = await fetch(url, {
        method,
        headers,
        body,
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
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                label="Date"
                format="dd/MM/yyyy"
                value={formData.date ? new Date(formData.date) : null}
                onChange={(date) => {
                  setFormData((prev) => ({
                    ...prev,
                    date: date ? date.toISOString() : ""
                  }));
                }}
                slotProps={{
                  textField: {
                    fullWidth: true,
                    required: true,
                    size: "small",
                  }
                }}
              />
            </LocalizationProvider>
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
            <TextField fullWidth label="Description" name="description" value={formData.description} onChange={handleChange} multiline rows={10} size="small" />
          </Grid>
          <Grid container spacing={2}>
            <TextField fullWidth label="Link" name="link" value={formData.link} onChange={handleChange} size="small" />
          </Grid>
          <Grid container spacing={2}>
            <TextField name="ownerEmail" label="Owner Email" value={formData.ownerEmail} onChange={handleChange} fullWidth size="small" disabled />
          </Grid>
          <Grid container spacing={2}>
            <Box sx={{ display: "flex", flexDirection: isMobile ? "column" : "column", alignItems: isMobile ? "flex-start" : "center", gap: 2, width: "100%" }}>
              <input
                accept="image/*"
                type="file"
                name="image"
                id="award-image-upload"
                style={{ display: "none", cursor: "pointer", width: "100%" }}
                onChange={handleChange}
              />
              <label htmlFor="award-image-upload" style={{ width: "100%" }}>
                <Button
                  variant="outlined"
                  component="span"
                  sx={{ borderRadius: 2, fontWeight: 600, width: "100%", textAlign: "center" }}
                >
                  {imagePreview ? "Change Image" : "Upload Image"}
                </Button>
              </label>
              {imagePreview && (
                <Box sx={{ ml: isMobile ? 0 : 2, mt: isMobile ? 2 : 0, border: "1px solid #eee", borderRadius: 2, p: 1, bgcolor: "#fafbfc", display: "flex", alignItems: "center", justifyContent: "center", width: "100%", minHeight: 80 }}>
                  <img
                    src={imagePreview}
                    alt="Preview"
                    style={{ maxHeight: 200, width: "100%", borderRadius: 8, objectFit: "cover" }}
                  />
                </Box>
              )}

            </Box>
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
        {award.image && (
          <Box sx={{ display: "flex", justifyContent: "center", mb: 2 }}>
            <img
              src={award.image}
              alt={award.title}
              style={{ maxHeight: 250, width: "100%", maxWidth: "100%", borderRadius: 8, objectFit: "cover" }}
            />
          </Box>
        )}
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
          <Typography variant="body2" paragraph sx={{ mb: 2, fontSize: isMobile ? "0.9rem" : "1rem", whiteSpace: "pre-line", wordBreak: "break-word" }}>
            {award.description}
          </Typography>
        )}
        {award.link && (
          <Typography variant="body2" sx={{ mb: 1, fontSize: isMobile ? "0.9rem" : "1rem" }}>
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