import React from "react";
import { Dialog, DialogContent, Box, IconButton } from "@mui/material";
import { Cancel as CancelIcon } from "@mui/icons-material";

interface ImageModalProps {
  open: boolean;
  onClose: () => void;
  imageUrl: string;
  imageAlt: string;
}

export default function ImageModal({ open, onClose, imageUrl, imageAlt }: ImageModalProps) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="lg"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          backgroundColor: "transparent",
          boxShadow: "none",
        },
      }}
    >
      <DialogContent sx={{ p: 0, textAlign: "center" }}>
        <Box
          sx={{
            position: "relative",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "400px",
          }}
        >
          <img
            src={imageUrl}
            alt={imageAlt}
            style={{
              maxWidth: "100%",
              maxHeight: "80vh",
              objectFit: "contain",
              borderRadius: "8px",
            }}
          />
          <IconButton
            onClick={onClose}
            sx={{
              position: "absolute",
              top: 8,
              right: 8,
              backgroundColor: "rgba(0, 0, 0, 0.5)",
              color: "white",
              "&:hover": {
                backgroundColor: "rgba(0, 0, 0, 0.7)",
              },
            }}
          >
            <CancelIcon />
          </IconButton>
        </Box>
      </DialogContent>
    </Dialog>
  );
} 