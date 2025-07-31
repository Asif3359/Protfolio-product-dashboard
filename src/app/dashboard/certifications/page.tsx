"use client";
import React, { useEffect, useState } from "react";
import {
  Container,
  Box,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  CircularProgress,
  Alert,
  AlertTitle,
  Paper,
  TextField,
  Grid,
  Card,
  CardContent,
  CardActions,
  Link,
  IconButton,
} from "@mui/material";
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Cancel as CancelIcon,
  Save as SaveIcon,
  Edit as EditIcon,
  CloudUpload as CloudUploadIcon,
} from "@mui/icons-material";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@mui/material/styles";
import { useMediaQuery } from "@mui/material";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import ImageModal from "@/app/components/ImageModal";
  
type Certification = {
  _id?: string;
  title: string;
  issuer: string;
  image?: string;
  date: string | Date;
  expiryDate?: string | Date | null;
  credentialId?: string;
  credentialUrl?: string;
  description?: string;
  ownerEmail?: string;
};

function CertificationForm({
  initialData,
  onSuccess,
  onCancel,
  token,
}: {
  initialData: Certification | null;
  onSuccess: () => void;
  onCancel: () => void;
  token: string;
}) {
  const [formData, setFormData] = useState<Partial<Certification>>({
    title: "",
    issuer: "",
    image: "",
    date: new Date(),
    expiryDate: null,
    credentialId: "",
    credentialUrl: "",
    description: "",
    ownerEmail: localStorage.getItem("ownerEmail") || "",
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  useEffect(() => {
    if (initialData) {
      setFormData({
        ...initialData,
        date: new Date(initialData.date),
        expiryDate: initialData.expiryDate
          ? new Date(initialData.expiryDate)
          : null,
      });
      if (initialData.image) {
        setPreviewUrl(initialData.image);
      }
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const clearImage = () => {
    setSelectedFile(null);
    setPreviewUrl("");
    setFormData((prev) => ({ ...prev, image: "" }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const formDataToSend = new FormData();
      
      // Add all form fields
      Object.keys(formData).forEach(key => {
        const value = formData[key as keyof typeof formData];
        if (value !== null && value !== undefined) {
          if (key === 'date' || key === 'expiryDate') {
            formDataToSend.append(key, value instanceof Date ? value.toISOString() : String(value));
          } else {
            formDataToSend.append(key, String(value));
          }
        }
      });

      // Add file if selected
      if (selectedFile) {
        formDataToSend.append('image', selectedFile);
      }

      const url = initialData
        ? `https://protfolio-product-backend.vercel.app/api/certification/${initialData._id}`
        : "https://protfolio-product-backend.vercel.app/api/certification";
      const method = initialData ? "PUT" : "POST";
      
      const response = await fetch(url, {
        method,
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formDataToSend,
      });
      
      if (!response.ok) {
        throw new Error(
          initialData
            ? "Failed to update certification"
            : "Failed to create certification"
        );
      }
      onSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  };

  const handleDateChange = (name: string) => (date: Date | null) => {
    setFormData((prev) => ({ ...prev, [name]: date ? date.toISOString() : null }));
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
        <Grid
          container
          spacing={4}
          style={{
            display: "grid",
            gridTemplateColumns: isMobile ? "1fr" : "repeat(1, 1fr)",
            gap: "16px",
          }}
        >
          <Grid container spacing={2}>
            <TextField
              fullWidth
              label="Title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              size="small"
            />
          </Grid>
          <Grid container spacing={2}>
            <TextField
              fullWidth
              label="Issuer"
              name="issuer"
              value={formData.issuer}
              onChange={handleChange}
              required
              size="small"
            />
          </Grid>
          <Grid container spacing={2}>
            <Box sx={{ width: '100%' }}>
              <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 'medium' }}>
                Certification Image
              </Typography>
              <Box sx={{ display: 'flex', justifyContent: 'center', width: '100%', alignItems: 'center', gap: 2, mb: 2 }}>
                <Button
                  variant="outlined"
                  component="label"
                  startIcon={<CloudUploadIcon />}
                  sx={{ minWidth: '200px', width: '100%' }}
                >
                  {selectedFile ? selectedFile.name : 'Upload Image'}
                  <input
                    type="file"
                    hidden
                    accept="image/*"
                    onChange={handleFileChange}
                  />
                </Button>
                {previewUrl && (
                  <IconButton onClick={clearImage} color="error" size="small">
                    <DeleteIcon />
                  </IconButton>
                )}
              </Box>
              {previewUrl && (
                <Box sx={{ mt: 2, textAlign: 'center', width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                  <img
                    src={previewUrl}
                    alt="Preview"
                    style={{
                      maxWidth: '100%',
                      maxHeight: '200px',
                      objectFit: 'contain',
                      borderRadius: '8px',
                      border: '1px solid #ddd',
                    }}
                  />
                </Box>
              )}
            </Box>
          </Grid>
          <Grid container spacing={2}>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                format="dd/MM/yyyy"
                label="Date"
                value={formData.date ? new Date(formData.date) : null}
                onChange={handleDateChange('date')}
                slotProps={{
                  textField: {
                    fullWidth: true,
                    required: true,
                    size: 'small',
                    InputLabelProps: {
                      shrink: true,
                    },
                  }
                }}
              />
            </LocalizationProvider>
          </Grid>
          <Grid container spacing={2}>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                format="dd/MM/yyyy"
                label="Expiry Date"
                value={formData.expiryDate ? new Date(formData.expiryDate) : null}
                onChange={handleDateChange('expiryDate')}
                slotProps={{
                  textField: {
                    fullWidth: true,
                    size: 'small',
                    InputLabelProps: {
                      shrink: true,
                    },
                  }
                }}
              />
            </LocalizationProvider>
          </Grid>
          <Grid container spacing={2}>
            <TextField
              fullWidth
              label="Credential ID"
              name="credentialId"
              value={formData.credentialId}
              onChange={handleChange}
              size="small"
            />
          </Grid>
          <Grid container spacing={2}>
            <TextField
              fullWidth
              label="Credential URL"
              name="credentialUrl"
              value={formData.credentialUrl}
              onChange={handleChange}
              size="small"
            />
          </Grid>
          <Grid container spacing={2}>
            <TextField
              fullWidth
              label="Description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              multiline
              rows={10}
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
        </Grid>
        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            mt: 4,
            gap: 2,
            flexDirection: isMobile ? "column" : "row",
          }}
        >
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
            {initialData ? "Update" : "Create"} Certification
          </Button>
        </Box>
      </form>
    </Paper>
  );
}
function CertificationCard({
  certification,
  onEdit,
  onDelete,
}: {
  certification: Certification;
  onEdit: (c: Certification) => void;
  onDelete: (c: Certification) => void;
}) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [imageModalOpen, setImageModalOpen] = useState(false);
  return (
    <Card
      sx={{
        mb: 3,
        borderRadius: 2,
        boxShadow: 2,
        width: "100%",
      }}
    >
      <CardContent>
        <Box>
          <Box sx={{ mb: 2, textAlign: "center", display: "flex", justifyContent: "center", alignItems: "center", height: "300px", width: "100%", objectFit: "cover", backgroundColor: "grey.100" }}>
            {certification.image && (
              <img
                onClick={() => setImageModalOpen(true)}
                src={certification.image}
                alt={certification.title}
                title="Click to view full image"
                style={{
                  maxWidth: "100%",
                  maxHeight: "250px",
                  objectFit: "cover",
                  borderRadius: "8px",
                  cursor: "pointer",
                  transition: "transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "scale(1.1)";
                  e.currentTarget.style.boxShadow = "0 8px 25px rgba(0,0,0,0.3)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "scale(1)";
                  e.currentTarget.style.boxShadow = "none";
                }}
              />
            )}
          </Box>
          <Typography
            variant={isMobile ? "subtitle1" : "h6"}
            component="div"
            sx={{
              fontWeight: "bold",
              mb: 1,
              wordBreak: "break-word",
            }}
          >
            {certification.title}
          </Typography>
        </Box>
        <Typography
          color="primary"
          gutterBottom
          sx={{
            fontWeight: "medium",
            mb: 2,
            fontSize: isMobile ? "0.875rem" : "1rem",
          }}
        >
          {certification.issuer}
        </Typography>
        <Typography
          variant="body2"
          sx={{
            mb: 2,
            color: "text.secondary",
            fontSize: isMobile ? "0.75rem" : "0.875rem",
          }}
        >
          {new Date(certification.date).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
          })}
          {certification.expiryDate &&
            ` - Expires: ${new Date(
              certification.expiryDate
            ).toLocaleDateString("en-US", {
              year: "numeric",
              month: "short",
            })}`}
        </Typography>
        {certification.description && (
          <Typography
            variant="body2"
            paragraph
            sx={{
              mb: 2,
              fontSize: isMobile ? "0.75rem" : "0.875rem",
              wordBreak: "break-word",
              whiteSpace: "pre-line",
            }}
          >
            {certification.description}
          </Typography>
        )}
        {certification.credentialId && (
          <Typography
            variant="body2"
            sx={{
              mb: 1,
              fontSize: isMobile ? "0.75rem" : "0.875rem",
              wordBreak: "break-word",
            }}
          >
            Credential ID: {certification.credentialId}
          </Typography>
        )}
        {certification.credentialUrl && (
          <Typography
            variant="body2"
            sx={{
              mb: 1,
              fontSize: isMobile ? "0.75rem" : "0.875rem",
              wordBreak: "break-word",
            }}
          >
            Credential URL:{" "}
            <Link
              href={certification.credentialUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                wordBreak: "break-all",
                display: "inline-block",
                maxWidth: isMobile ? "200px" : "none",
                color: "primary.main",
              }}
            >
              {certification.credentialUrl}
            </Link>
          </Typography>
        )}
      </CardContent>
      <CardActions
        sx={{
          justifyContent: "flex-end",
          p: 2,
          flexDirection: "row",
          gap: isMobile ? 1 : 2,
        }}
      >
        <Button
          size={isMobile ? "small" : "medium"}
          startIcon={<EditIcon fontSize={isMobile ? "small" : "medium"} />}
          onClick={() => onEdit(certification)}
          sx={{
            color: "primary.main",
            width: isMobile ? "100%" : "auto",
          }}
        >
          Edit
        </Button>
        <Button
          onClick={() => onDelete(certification)}
          size={isMobile ? "small" : "medium"}
          color="error"
          startIcon={<DeleteIcon fontSize={isMobile ? "small" : "medium"} />}
          sx={{
            width: isMobile ? "100%" : "auto",
          }}
        >
          Delete
        </Button>
      </CardActions>
      <ImageModal
        open={imageModalOpen}
        onClose={() => setImageModalOpen(false)}
        imageUrl={certification.image || ""}
        imageAlt={certification.title}
      />
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
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [certificationToDelete, setCertificationToDelete] = useState<Certification | null>(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const fetchCertifications = async () => {
    setLoading(true);
    try {
      const res = await fetch(
        "https://protfolio-product-backend.vercel.app/api/certification"
      );
      if (!res.ok) throw new Error("Failed to fetch certifications");
      const data = await res.json();
      setCertifications(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!certificationToDelete) return;
    
    setLoading(true);
    try {
      const res = await fetch(
        `https://protfolio-product-backend.vercel.app/api/certification/${certificationToDelete._id}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (!res.ok) throw new Error("Failed to delete certification");
      await fetchCertifications();
      setDeleteDialog(false);
      setCertificationToDelete(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (certification: Certification) => {
    setCertificationToDelete(certification);
    setDeleteDialog(true);
  };

  useEffect(() => {
    fetchCertifications();
  }, []);

  return (
    <Container
      maxWidth="md"
      sx={{
        py: isMobile ? 2 : 4,
        px: isMobile ? 2 : 3,
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: isMobile ? 3 : 4,
          flexDirection: isMobile ? "column" : "row",
          gap: isMobile ? 2 : 0,
        }}
      >
        <Typography
          variant={isMobile ? "h5" : "h4"}
          component="h1"
          sx={{
            fontWeight: "bold",
            color: "primary.main",
            textAlign: isMobile ? "center" : "left",
            mb: isMobile ? 1 : 0,
          }}
        >
          Certifications
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon fontSize={isMobile ? "small" : "medium"} />}
          onClick={() => {
            setSelected(null);
            setOpenDialog(true);
          }}
          sx={{
            borderRadius: 2,
            width: isMobile ? "100%" : "auto",
          }}
        >
          Add New
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
        fullScreen={isMobile}
        PaperProps={{ sx: { borderRadius: isMobile ? 0 : 2 } }}
      >
        <DialogTitle
          sx={{
            fontWeight: "bold",
            borderBottom: "1px solid",
            borderColor: "divider",
            py: 2,
            fontSize: isMobile ? "1.25rem" : "1.5rem",
          }}
        >
          {selected ? "Edit Certification" : "Add New Certification"}
        </DialogTitle>
        <DialogContent sx={{ py: isMobile ? 1 : 3 }}>
          <CertificationForm
            initialData={selected}
            onSuccess={() => {
              fetchCertifications();
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
            Are you sure you want to delete the certification &apos;{certificationToDelete?.title}&apos;?
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
      ) : certifications.length === 0 ? (
        <Paper
          elevation={0}
          sx={{
            p: isMobile ? 2 : 4,
            textAlign: "center",
            borderRadius: 2,
            mt: isMobile ? 2 : 4,
          }}
        >
          <Typography variant={isMobile ? "subtitle1" : "h6"} sx={{ mb: 2 }}>
            No certifications found
          </Typography>
          <Typography
            variant="body1"
            color="text.secondary"
            sx={{
              fontSize: isMobile ? "0.875rem" : "1rem",
              mb: isMobile ? 1 : 2,
            }}
          >
            Add your first certification to get started!
          </Typography>
          <Button
            variant="outlined"
            startIcon={<AddIcon fontSize={isMobile ? "small" : "medium"} />}
            onClick={() => {
              setSelected(null);
              setOpenDialog(true);
            }}
            sx={{
              mt: 3,
              width: isMobile ? "100%" : "auto",
            }}
          >
            Add Certification
          </Button>
        </Paper>
      ) : (
        <Box
          sx={{
            "& > *": { mb: 3 },
            mt: isMobile ? 2 : 0,
          }}
        >
          {certifications.map((certification) => (
            <CertificationCard
              key={certification._id}
              certification={certification}
              onEdit={(certification) => {
                setSelected(certification);
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
