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
  MenuItem,
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
import ImageDisplay from "@/app/components/ImageDisplay";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";

type Research = {
  _id?: string;
  type: "Publication" | "Current Research";
  image: string;
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

function ResearchForm({
  initialData,
  onSuccess,
  onCancel,
  token,
}: {
  initialData: Research | null;
  onSuccess: () => void;
  onCancel: () => void;
  token: string;
}) {
  const [formData, setFormData] = useState<Partial<Research>>({
    type: "Publication",
    image: "",
    title: "",
    description: "",
    authors: [""],
    publicationDate: null,
    journal: "",
    doi: "",
    link: "",
    status: "In Progress",
    ownerEmail: localStorage.getItem("ownerEmail") || "",
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  useEffect(() => {
    if (initialData) {
      // Handle authors - they might come as a string or array
      let authors = [""];
      if (initialData.authors) {
        if (Array.isArray(initialData.authors)) {
          authors = initialData.authors.length > 0 ? initialData.authors : [""];
        } else if (typeof initialData.authors === "string") {
          try {
            const parsedAuthors = JSON.parse(initialData.authors);
            authors =
              Array.isArray(parsedAuthors) && parsedAuthors.length > 0
                ? parsedAuthors
                : [""];
          } catch {
            authors = [initialData.authors];
          }
        }
      }

      setFormData({
        ...initialData,
        publicationDate: initialData.publicationDate
          ? new Date(initialData.publicationDate)
          : null,
        authors: authors,
      });
      if (initialData.image) {
        setImagePreview(initialData.image);
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
    console.log("File selected:", file);
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setSelectedFile(null);
      setImagePreview("");
    }
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
    
    // Validate that an image is selected (only for new research)
    if (!initialData && !selectedFile) {
      setError("Please select an image for the research");
      setLoading(false);
      return;
    }
    
    // For updates, if no new image is selected, we'll keep the existing one
    if (initialData && !selectedFile) {
      console.log("No new image selected for update, keeping existing image");
    }
    
    try {
      const formDataToSend = new FormData();

      // Add all form fields
      Object.keys(formData).forEach((key) => {
        if (key === "authors") {
          // Send authors as JSON string - backend will parse it
          const authors = formData.authors || [];
          formDataToSend.append("authors", JSON.stringify(authors));
        } else if (key === "publicationDate" && formData.publicationDate) {
          formDataToSend.append(
            "publicationDate",
            new Date(formData.publicationDate).toISOString()
          );
        } else if (key === "image") {
          // Skip image field as it will be handled separately
          return;
        } else if (formData[key as keyof typeof formData] !== undefined) {
          formDataToSend.append(
            key,
            String(formData[key as keyof typeof formData])
          );
        }
      });

      // Add image file if selected
      if (selectedFile) {
        formDataToSend.append("image", selectedFile);
        console.log("Image file added to form data:", selectedFile.name, selectedFile.size);
      } else if (!initialData) {
        // For new research, we need an image
        console.log("No image file selected for new research");
        setError("Please select an image for the research");
        setLoading(false);
        return;
      } else {
        console.log("No new image selected for edit, keeping existing image");
      }

      const url = initialData
        ? `https://protfolio-product-backend.vercel.app/api/research/${initialData._id}`
        : "https://protfolio-product-backend.vercel.app/api/research";
      const method = initialData ? "PUT" : "POST";

      console.log("Submitting to:", url, "Method:", method);
      console.log("Form data keys:", Array.from(formDataToSend.keys()));
      console.log("Selected file:", selectedFile);
      console.log("Authors data:", formData.authors);
      console.log("Authors JSON:", JSON.stringify(formData.authors));

      const response = await fetch(url, {
        method,
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formDataToSend,
      });

      console.log("Response status:", response.status, response.statusText);

      if (!response.ok) {
        let errorMessage = initialData
          ? "Failed to update research"
          : "Failed to create research";
        try {
          const errorData = await response.json();
          errorMessage = errorData.error || errorMessage;
        } catch {
          // If response is not JSON, use status text
          errorMessage = `${errorMessage}: ${response.status} ${response.statusText}`;
        }
        throw new Error(errorMessage);
      }
      onSuccess();
    } catch (err) {
      console.error("Submit error:", err);
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
        {initialData ? "Edit Research" : "Add New Research"}
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
              select
              fullWidth
              label="Type"
              name="type"
              value={formData.type}
              onChange={handleChange}
              required
              size="small"
            >
              <MenuItem value="Publication">Completed</MenuItem>
              <MenuItem value="Current Research">Current Research</MenuItem>
            </TextField>
          </Grid>

          {/* Image Upload Section */}
          <Grid container spacing={2}>
            <Box sx={{ width: "100%" }}>
              <Typography variant="subtitle2" sx={{ mb: 1 }}>
                Research Image * 1200 x 800
              </Typography>
              <Button
                variant="outlined"
                component="label"
                startIcon={<CloudUploadIcon />}
                sx={{ mb: 2 }}
                fullWidth
                color={!selectedFile && !initialData ? "error" : "primary"}
              >
                Upload Image
                <input
                  type="file"
                  hidden
                  accept="image/*"
                  onChange={handleFileChange}
                  required={!initialData} // Only required for new research, not for updates
                />
              </Button>
              {imagePreview && (
                <Box
                  sx={{
                    mt: 2,
                    textAlign: "center",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <img
                    src={imagePreview}
                    alt="Preview"
                    style={{
                      maxWidth: "100%",
                      maxHeight: "200px",
                      objectFit: "contain",
                      borderRadius: "8px",
                    }}
                  />
                </Box>
              )}
            </Box>
          </Grid>

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
              label="Description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              multiline
              rows={10}
              size="small"
            />
          </Grid>
          <Grid container spacing={2}>
            <Box sx={{ width: "100%" }}>
              <Typography variant="subtitle2" sx={{ mb: 1 }}>
                Authors
              </Typography>
              {(formData.authors || [""]).map((author, idx) => (
                <Box
                  key={idx}
                  sx={{ display: "flex", alignItems: "center", mb: 1, gap: 1 }}
                >
                  <TextField
                    value={author}
                    onChange={(e) => handleArrayChange(idx, e.target.value)}
                    placeholder="Author name"
                    fullWidth
                    size="small"
                  />
                  <IconButton
                    onClick={() => removeAuthor(idx)}
                    disabled={(formData.authors || []).length === 1}
                    color="error"
                    size="small"
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </Box>
              ))}
              <Button
                startIcon={<AddIcon />}
                onClick={addAuthor}
                variant="outlined"
                size="small"
                sx={{ mt: 1 }}
              >
                Add Author
              </Button>
            </Box>
          </Grid>
          <Grid container spacing={2}>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                format="dd/MM/yyyy"
                label="Publication Date"
                value={formData.publicationDate ? new Date(formData.publicationDate) : null}
                onChange={handleDateChange('publicationDate')}
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
              label="Journal"
              name="journal"
              value={formData.journal}
              onChange={handleChange}
              size="small"
            />
          </Grid>
          <Grid container spacing={2}>
            <TextField
              fullWidth
              label="DOI"
              name="doi"
              value={formData.doi}
              onChange={handleChange}
              size="small"
            />
          </Grid>
          <Grid container spacing={2}>
            <TextField
              fullWidth
              label="Link"
              name="link"
              value={formData.link}
              onChange={handleChange}
              size="small"
            />
          </Grid>
          <Grid container spacing={2}>
            <TextField
              select
              fullWidth
              label="Status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              size="small"
            >
              <MenuItem value="In Progress">In Progress</MenuItem>
              <MenuItem value="Completed">Completed</MenuItem>
              <MenuItem value="Published">Published</MenuItem>
            </TextField>
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
            {initialData ? "Update" : "Create"} Research
          </Button>
        </Box>
      </form>
    </Paper>
  );
}

function ResearchCard({
  research,
  onEdit,
  onDelete,
}: {
  research: Research;
  onEdit: (r: Research) => void;
  onDelete: (r: Research) => void;
}) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  return (
    <>
      <Card sx={{ mb: 3, borderRadius: 2, boxShadow: 2 }}>
        <CardContent>
          {research.image && (
            <ImageDisplay
              src={research.image}
              alt={research.title}
              // height="300px"
              // maxHeight="250px"
            />
          )}
          <Typography
            variant="h6"
            component="div"
            sx={{
              fontWeight: "bold",
              mb: 1,
              fontSize: isMobile ? "1.2rem" : "1.5rem",
            }}
          >
            {research.title}
          </Typography>
          <Typography
            color="primary"
            gutterBottom
            sx={{
              fontWeight: "medium",
              mb: 2,
              fontSize: isMobile ? "1rem" : "1.2rem",
            }}
          >
            {research.type}
          </Typography>
          <Typography
            variant="body2"
            sx={{
              mb: 2,
              color: "text.secondary",
              fontSize: isMobile ? "0.9rem" : "1rem",
            }}
          >
            {research.publicationDate &&
              new Date(research.publicationDate).toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
              })}{" "}
            • {research.status}
          </Typography>
          <Typography
            variant="body2"
            sx={{ mb: 2, fontSize: isMobile ? "0.9rem" : "1rem" }}
          >
            Authors: {(research.authors || []).join(", ")}
          </Typography>
          {research.description && (
            <Typography
              variant="body2"
              paragraph
              sx={{
                mb: 2,
                fontSize: isMobile ? "0.9rem" : "1rem",
                whiteSpace: "pre-line",
                wordBreak: "break-word",
              }}
            >
              {research.description}
            </Typography>
          )}
          {research.journal && (
            <Typography
              variant="body2"
              sx={{ mb: 1, fontSize: isMobile ? "0.9rem" : "1rem" }}
            >
              Journal: {research.journal}
            </Typography>
          )}
          {research.doi && (
            <Typography
              variant="body2"
              sx={{ mb: 1, fontSize: isMobile ? "0.9rem" : "1rem" }}
            >
              DOI: {research.doi}
            </Typography>
          )}
          {research.link && (
            <Typography
              variant="body2"
              sx={{ mb: 1, fontSize: isMobile ? "0.9rem" : "1rem" }}
            >
              Link:{" "}
              <a
                href={research.link}
                target="_blank"
                style={{
                  wordWrap: "break-word",
                  wordBreak: "break-all",
                  overflowWrap: "break-word",
                }}
                rel="noopener noreferrer"
              >
                {research.link}
              </a>
            </Typography>
          )}
        </CardContent>
        <CardActions sx={{ justifyContent: "flex-end", p: 2 }}>
          <Button
            size="small"
            startIcon={<EditIcon />}
            onClick={() => onEdit(research)}
            sx={{ color: "primary.main" }}
          >
            Edit
          </Button>
          <Button
            onClick={() => onDelete(research)}
            size="small"
            color="error"
            startIcon={<DeleteIcon />}
          >
            Delete
          </Button>
        </CardActions>
      </Card>


    </>
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
  const [researchToDelete, setResearchToDelete] = useState<Research | null>(
    null
  );
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const fetchResearches = async () => {
    setLoading(true);
    try {
      const res = await fetch("https://protfolio-product-backend.vercel.app/api/research");
      if (!res.ok) {
        throw new Error(
          `Failed to fetch research: ${res.status} ${res.statusText}`
        );
      }
      const data = await res.json();
      console.log("Fetched research data:", data);
      if (data.length > 0) {
        console.log("First research authors:", data[0].authors);
        console.log("Authors type:", typeof data[0].authors);
      }
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
      const res = await fetch(
        `https://protfolio-product-backend.vercel.app/api/research/${researchToDelete._id}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }
      );
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

  useEffect(() => {
    fetchResearches();
  }, []);

  return (
    <Container maxWidth="md" sx={{ py: 0 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 4,
          flexDirection: isMobile ? "column" : "row",
        }}
      >
        <Typography
          variant="h4"
          component="h1"
          sx={{
            fontWeight: "bold",
            color: "primary.main",
            textAlign: isMobile ? "center" : "left",
          }}
        >
          Research
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
          Add New Research
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
        <DialogTitle
          sx={{
            fontWeight: "bold",
            borderBottom: "1px solid",
            borderColor: "divider",
            py: 2,
          }}
        >
          {selected ? "Edit Research" : "Add New Research"}
        </DialogTitle>
        <DialogContent sx={{ py: 0 }}>
          <ResearchForm
            initialData={selected}
            onSuccess={() => {
              fetchResearches();
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
        <DialogTitle
          sx={{
            fontWeight: "bold",
            borderBottom: "1px solid",
            borderColor: "divider",
            py: 2,
          }}
        >
          Confirm Delete
        </DialogTitle>
        <DialogContent sx={{ py: 3 }}>
          <Typography variant="body1" sx={{ mb: 2 }}>
            Are you sure you want to delete the research &apos;
            {researchToDelete?.title}&apos;?
          </Typography>
          <Typography variant="body2" color="text.secondary">
            This action cannot be undone.
          </Typography>
        </DialogContent>
        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            gap: 2,
            p: 3,
            pt: 0,
          }}
        >
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
            startIcon={
              loading ? <CircularProgress size={20} /> : <DeleteIcon />
            }
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
        <Paper
          elevation={0}
          sx={{ p: 0, textAlign: "center", borderRadius: 2 }}
        >
          <Typography variant="h6" sx={{ mb: 2 }}>
            No research found
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Add your first research to get started!
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
            Add Research
          </Button>
        </Paper>
      ) : (
        <Box sx={{ "& > *": { mb: 3 } }}>
          {researches.map((research) => (
            <ResearchCard
              key={research._id}
              research={research}
              onEdit={(research) => {
                setSelected(research);
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
