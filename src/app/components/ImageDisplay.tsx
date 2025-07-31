"use client";
import React, { useState } from "react";
import { Box } from "@mui/material";
import ImageModal from "./ImageModal";

interface ImageDisplayProps {
  src: string;
  alt: string;
  title?: string;
  height?: string;
  maxHeight?: string;
  width?: string;
  objectFit?: "cover" | "contain";
  borderRadius?: string;
  backgroundColor?: string;
  showModal?: boolean;
}

const ImageDisplay: React.FC<ImageDisplayProps> = ({
  src,
  alt,
  title = "Click to view full image",
  height = "300px",
  maxHeight = "250px",
  width = "100%",
  objectFit = "cover",
  borderRadius = "8px",
  backgroundColor = "grey.100",
  showModal = true,
}) => {
  const [imageModalOpen, setImageModalOpen] = useState(false);

  return (
    <>
      <Box
        sx={{
          mb: 2,
          textAlign: "center",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height,
          width,
          objectFit,
          backgroundColor,
        }}
      >
        <img
          src={src}
          alt={alt}
          title={title}
          style={{
            maxWidth: "100%",
            maxHeight,
            objectFit,
            borderRadius,
            cursor: showModal ? "pointer" : "default",
            transition: "transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out",
          }}
          onMouseEnter={(e) => {
            if (showModal) {
              e.currentTarget.style.transform = "scale(1.1)";
              e.currentTarget.style.boxShadow = "0 8px 25px rgba(0,0,0,0.3)";
            }
          }}
          onMouseLeave={(e) => {
            if (showModal) {
              e.currentTarget.style.transform = "scale(1)";
              e.currentTarget.style.boxShadow = "none";
            }
          }}
          onClick={() => {
            if (showModal) {
              setImageModalOpen(true);
            }
          }}
        />
      </Box>

      {showModal && (
        <ImageModal
          open={imageModalOpen}
          onClose={() => setImageModalOpen(false)}
          imageUrl={src}
          imageAlt={alt}
        />
      )}
    </>
  );
};

export default ImageDisplay; 