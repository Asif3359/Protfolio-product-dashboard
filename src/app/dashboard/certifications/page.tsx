"use client";
import React, { useEffect, useState } from "react";
import {
  Container, Box, Typography, Button, Dialog, DialogTitle, DialogContent,
  CircularProgress, Alert, AlertTitle, Paper, TextField, Grid,
  Card, CardContent, CardActions
} from "@mui/material";
import { Add as AddIcon, Delete as DeleteIcon, Cancel as CancelIcon, Save as SaveIcon, Edit as EditIcon } from "@mui/icons-material";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@mui/material/styles";
import { useMediaQuery } from "@mui/material";

type Certification = {
  _id?: string;
  title: string;
  issuer: string;
  date: string | Date;
  expiryDate?: string | Date | null;
  credentialId?: string;
  credentialUrl?: string;
  description?: string;
  ownerEmail?: string;
};

function CertificationForm({ initialData, onSuccess, onCancel, token }: {
  initialData: Certification | null,
  onSuccess: () => void,
  onCancel: () => void,
  token: string
}) {
  const [formData, setFormData] = useState<Partial<Certification>>({
    title: "",
    issuer: "",
    date: new Date(),
    expiryDate: null,
    credentialId: "",
    credentialUrl: "",
    description: "",
    ownerEmail: ""
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
        expiryDate: initialData.expiryDate ? new Date(initialData.expiryDate) : null,
      });
    } else if (token) {
      (async () => {
        try {
          const res = await fetch("https://protfolio-product-backend.vercel.app/api/admin/profile", {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (res.ok) {
            const data = await res.json();
            setFormData((prev) => ({ ...prev, ownerEmail: data.email || "" }));
          }
        } catch { }
      })();
    }
  }, [initialData, token]);

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
        ? `https://protfolio-product-backend.vercel.app/api/certification/${initialData._id}`
        : "https://protfolio-product-backend.vercel.app/api/certification";
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
        throw new Error(initialData ? "Failed to update certification" : "Failed to create certification");
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
        {initialData ? "Edit Certification" : "Add New Certification"}
      </Typography>
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          <AlertTitle>Error</AlertTitle>
          {error}
        </Alert>
      )}
      <form onSubmit={handleSubmit}>
        <Grid container spacing={4} style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(2, 1fr)", gap: "16px" }}>
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
            <TextField fullWidth label="Expiry Date" name="expiryDate" type="date" value={formData.expiryDate ? new Date(formData.expiryDate).toISOString().slice(0, 10) : ""} onChange={handleChange} size="small" InputLabelProps={{ shrink: true }} />
          </Grid>
          <Grid container spacing={2}>
            <TextField fullWidth label="Credential ID" name="credentialId" value={formData.credentialId} onChange={handleChange} size="small" />
          </Grid>
          <Grid container spacing={2}>
            <TextField fullWidth label="Credential URL" name="credentialUrl" value={formData.credentialUrl} onChange={handleChange} size="small" />
          </Grid>
          <Grid container spacing={2}>
            <TextField fullWidth label="Description" name="description" value={formData.description} onChange={handleChange} multiline rows={3} size="small" />
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
            {initialData ? "Update" : "Create"} Certification
          </Button>
        </Box>
      </form>
    </Paper>
  );
}

function CertificationCard({ certification, onEdit, onDelete }: {
  certification: Certification,
  onEdit: (c: Certification) => void,
  onDelete: (id: string) => void
}) {
  return (
    <Card sx={{ mb: 3, borderRadius: 2, boxShadow: 2 }}>
      <CardContent>
        <Typography variant="h6" component="div" sx={{ fontWeight: "bold", mb: 1 }}>
          {certification.title}
        </Typography>
        <Typography color="primary" gutterBottom sx={{ fontWeight: "medium", mb: 2 }}>
          {certification.issuer}
        </Typography>
        <Typography variant="body2" sx={{ mb: 2, color: "text.secondary" }}>
          {new Date(certification.date).toLocaleDateString("en-US", { year: "numeric", month: "short" })}
          {certification.expiryDate && ` - Expires: ${new Date(certification.expiryDate).toLocaleDateString("en-US", { year: "numeric", month: "short" })}`}
        </Typography>
        {certification.description && (
          <Typography variant="body2" paragraph sx={{ mb: 2 }}>
            {certification.description}
          </Typography>
        )}
        {certification.credentialId && (
          <Typography variant="body2" sx={{ mb: 1 }}>
            Credential ID: {certification.credentialId}
          </Typography>
        )}
        {certification.credentialUrl && (
          <Typography variant="body2" sx={{ mb: 1 }}>
            Credential URL: <a href={certification.credentialUrl} target="_blank" rel="noopener noreferrer">{certification.credentialUrl}</a>
          </Typography>
        )}
      </CardContent>
      <CardActions sx={{ justifyContent: "flex-end", p: 2 }}>
        <Button size="small" startIcon={<EditIcon />} onClick={() => onEdit(certification)} sx={{ color: "primary.main" }}>
          Edit
        </Button>
        <Button onClick={() => onDelete(certification._id || "")} size="small" color="error" startIcon={<DeleteIcon />}>
          Delete
        </Button>
      </CardActions>
    </Card>
  );
}

export default function CertificationsPage() {
  const [certifications, setCertifications] = useState<Certification[]>([]);
  const [selected, setSelected] = useState<Certification | null>(null);
  const { token } = useAuth() as { token: string };
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const fetchCertifications = async () => {
    setLoading(true);
    try {
      const res = await fetch("https://protfolio-product-backend.vercel.app/api/certification");
      if (!res.ok) throw new Error("Failed to fetch certifications");
      const data = await res.json();
      setCertifications(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this certification?")) return;
    try {
      const res = await fetch(`https://protfolio-product-backend.vercel.app/api/certification/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) throw new Error("Failed to delete certification");
      fetchCertifications();
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    }
  };

  useEffect(() => { fetchCertifications(); }, []);

  return (
    <Container maxWidth="md" sx={{ py: 0 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 4, flexDirection: isMobile ? "column" : "row" }}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: "bold", color: "primary.main", textAlign: isMobile ? "center" : "left" }}>
          Certifications
        </Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => { setSelected(null); setOpenDialog(true); }} sx={{ borderRadius: 2 }}>
          Add New Certification
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
          {selected ? "Edit Certification" : "Add New Certification"}
        </DialogTitle>
        <DialogContent sx={{ py: 0 }}>
          <CertificationForm
            initialData={selected}
            onSuccess={() => { fetchCertifications(); setOpenDialog(false); }}
            onCancel={() => setOpenDialog(false)}
            token={token || ""}
          />
        </DialogContent>
      </Dialog>
      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
          <CircularProgress />
        </Box>
      ) : certifications.length === 0 ? (
        <Paper elevation={0} sx={{ p: 4, textAlign: "center", borderRadius: 2 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>No certifications found</Typography>
          <Typography variant="body1" color="text.secondary">
            Add your first certification to get started!
          </Typography>
          <Button variant="outlined" startIcon={<AddIcon />} onClick={() => { setSelected(null); setOpenDialog(true); }} sx={{ mt: 3 }}>
            Add Certification
          </Button>
        </Paper>
      ) : (
        <Box sx={{ "& > *": { mb: 3 } }}>
          {certifications.map((certification) => (
            <CertificationCard
              key={certification._id}
              certification={certification}
              onEdit={(certification) => { setSelected(certification); setOpenDialog(true); }}
              onDelete={handleDelete}
            />
          ))}
        </Box>
      )}
    </Container>
  );
}